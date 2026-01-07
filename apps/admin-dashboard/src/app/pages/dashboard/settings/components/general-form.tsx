import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toasts } from '@/components/ui/toast.helpers';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AvatarUtils, useAuth, useAvatar } from '@starcoex-frontend/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Phone, QrCode, Shield, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as PortOne from '@portone/browser-sdk/v2';

// 스키마: 핸드폰 번호와 2FA 설정만 유지
const formSchema = z.object({
  phoneNumber: z.string().min(10, {
    message: '올바른 전화번호를 입력해주세요.',
  }),
});

type GeneralFormData = z.infer<typeof formSchema>;

interface GeneralFormLocationState {
  temp2FAData?: {
    qrCodeImage: string;
    step: 'verify';
  };
}

export default function GeneralForm() {
  const {
    currentUser,
    checkAuthStatus,
    generateTwoFactorQR,
    enableTwoFactor,
    disableTwoFactor,
    deleteAccount,
    requestIdentityVerification,
    verifyIdentityVerification,
  } = useAuth();
  const {
    isUploading,
    isDeleting,
    uploadAvatar,
    deleteAvatar,
    uploadProgress,
  } = useAvatar({
    port: 4102,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as GeneralFormLocationState;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  // ✅ [추가] 아바타 미리보기 팝업용 상태
  const [tempAvatarFile, setTempAvatarFile] = useState<File | null>(null);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // URL 쿼리 파라미터 확인용 훅
  const [searchParams, setSearchParams] = useSearchParams();

  // 2FA 모달 상태 관리
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [twoFAState, setTwoFAState] = useState({
    step: 'setup' as 'setup' | 'verify' | 'disable_confirm',
    qrCode: '',
    verificationCode: '',
    password: '', // 비활성화 시 필요한 비밀번호
  });

  // ✅ [추가] 리다이렉트 복귀 처리 (모바일 등에서 인증 후 돌아왔을 때)
  useEffect(() => {
    const identityVerificationId = searchParams.get('identityVerificationId');

    // URL에 인증 ID가 있다면 검증 시도
    if (identityVerificationId) {
      const verify = async () => {
        setIsLoading(true);
        try {
          // 쿼리 파라미터 제거 (재요청 방지)
          setSearchParams(
            (prev) => {
              const newParams = new URLSearchParams(prev);
              newParams.delete('identityVerificationId');
              return newParams;
            },
            { replace: true }
          );

          const verifyResponse = await verifyIdentityVerification({
            identityVerificationId,
          });

          if (verifyResponse.success) {
            toasts.success({
              title: '인증 성공',
              description: '본인인증이 완료되었습니다.',
            });
            await checkAuthStatus();
          } else {
            // 이미 처리된 건일 수도 있으므로 조용히 넘어가거나 에러 표시
            console.warn('인증 검증 실패:', verifyResponse.error);
            toasts.error({
              title: '검증 실패',
              description:
                verifyResponse.error?.message ||
                '인증 정보를 확인할 수 없습니다.',
            });
          }
        } catch (error) {
          console.error('Redirect Verification Error:', error);
        } finally {
          setIsLoading(false);
        }
      };

      verify();
    }
  }, [
    searchParams,
    verifyIdentityVerification,
    checkAuthStatus,
    setSearchParams,
  ]);

  // ✅ [추가] Router State 감지 및 상태 복구 (재마운트 대응)
  useEffect(() => {
    // 라우터 state에 2FA 데이터가 있다면 (컴포넌트가 재마운트 되어도 유지됨)
    if (locationState?.temp2FAData) {
      const temp2FAData = locationState.temp2FAData;

      setTwoFAState((prev) => ({
        ...prev,
        step: temp2FAData.step,
        qrCode: temp2FAData.qrCodeImage,
      }));
      setIs2FAModalOpen(true);
    }
  }, [locationState]);

  const form = useForm<GeneralFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  // 초기 데이터 로드
  useEffect(() => {
    if (currentUser) {
      form.reset({
        phoneNumber: currentUser.phoneNumber || '',
      });
      const url = AvatarUtils.getAvatarUrl(currentUser?.avatar?.url);
      console.log('avatar', url);
      setAvatarPreview(url);
    }
  }, [currentUser, form]);

  // ✅ [수정] 본인인증 핸들러 (서버 Init -> SDK -> 서버 Verify)
  const handleIdentityVerification = async () => {
    const phoneNumber = form.getValues('phoneNumber');
    // 사용자 이름 (현재 로그인한 유저 이름 사용, 없으면 빈 문자열)
    const userName = currentUser?.name || '';

    if (!phoneNumber) {
      toasts.error({
        title: '전화번호 필요',
        description: '본인인증을 위해 전화번호를 입력해주세요.',
      });
      form.setFocus('phoneNumber');
      return;
    }

    // 환경변수 (없으면 빈 문자열 처리로 에러 방지)
    const storeId = import.meta.env.VITE_PORTONE_STORE_ID;
    const channelKey = import.meta.env.VITE_PORTONE_CHANNEL_KEY;

    setIsLoading(true);
    try {
      // 1. [서버] 인증 요청 데이터 생성 (DB 저장 및 ID 발급)
      // 여기서 customer 정보와 bypass 정보를 서버로 보냅니다.
      // 서버는 이를 저장하고, 포트원 SDK에 넘겨줄 파라미터들을 반환해야 합니다.
      const initResponse = await requestIdentityVerification({
        storeId,
        channelKey,
      });

      if (!initResponse.success || !initResponse.data) {
        throw new Error(initResponse.error?.message || '인증 요청 초기화 실패');
      }

      // 서버에서 생성된 ID와 가공된 파라미터를 받습니다.
      // (서버 응답 구조에 따라 경로는 달라질 수 있습니다. 예: initResponse.data.requestIdentityVerification)
      const { identityVerificationId } =
        initResponse.data.requestIdentityVerification;

      // 2. [클라이언트] 포트원 SDK 호출
      const sdkResponse = await PortOne.requestIdentityVerification({
        storeId,
        channelKey,
        identityVerificationId: identityVerificationId || '', // 서버에서 발급받은 ID 사용
        customer: {
          phoneNumber: phoneNumber.replace(/-/g, ''), // SDK에는 하이픈 제거된 값 전달
          fullName: userName,
        },
        // bypass 정보도 필요하다면 다시 넣어줍니다.
        bypass: {
          danal: {
            IsCarrier: 'SKT;KT;LGT;KT_MVNO;LGU_MVNO',
            AGELIMIT: 14,
          },
        },
        // 리다이렉트 URL 설정 (현재 페이지로 복귀)
        redirectUrl: window.location.href,
      });

      // 3. [SDK 결과 처리]
      if (sdkResponse?.code != null) {
        // 인증 실패/취소
        toasts.error({
          title: '인증 실패',
          description: sdkResponse?.message || '본인인증이 취소되었습니다.',
        });
      } else {
        // 4. [서버] 최종 검증 요청
        const verifyResponse = await verifyIdentityVerification({
          identityVerificationId: identityVerificationId || '',
        });

        if (verifyResponse.success) {
          toasts.success({
            title: '인증 성공',
            description: '본인인증이 완료되었습니다.',
          });
          // 유저 정보 갱신 (전화번호 업데이트 확인 등)
          await checkAuthStatus();
        } else {
          toasts.error({
            title: '검증 실패',
            description:
              verifyResponse.error?.message ||
              '인증 정보를 확인하지 못했습니다.',
          });
        }
      }
    } catch (error: any) {
      console.error('Identity Verification Error:', error);
      toasts.error({
        title: '오류',
        description: error.message || '본인인증 중 문제가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2FA Handlers ---

  // 2FA 스위치 클릭 핸들러
  const handle2FAToggle = (checked: boolean) => {
    if (isLoading) return;

    if (checked) {
      startEnable2FA();
    } else {
      startDisable2FA();
    }
  };

  // 2FA 설정 시작 (QR 코드 생성)
  const startEnable2FA = async () => {
    setIsLoading(true);

    try {
      const result = await generateTwoFactorQR();
      const qrData = result.data?.generate2FAQR;

      if (result.success && qrData?.qrCodeImage) {
        // ✅ [핵심] 상태를 Router History에 저장 (재마운트 방지)
        // navigate를 사용해 현재 URL을 replace하면서 state를 심어줍니다.
        navigate(location.pathname, {
          replace: true,
          state: {
            temp2FAData: {
              qrCodeImage: qrData.qrCodeImage,
              step: 'verify',
            },
          },
        });

        // 상태 업데이트 (UI 즉시 반영용)
        setTwoFAState({
          step: 'verify',
          qrCode: qrData.qrCodeImage,
          verificationCode: '',
          password: '',
        });
        setIs2FAModalOpen(true);
      } else {
        toasts.error({
          title: '설정 실패',
          description: 'QR 코드를 불러오지 못했습니다.',
        });
      }
    } catch (error) {
      console.error('2FA Setup Error:', error);
      toasts.error({ title: '오류', description: '설정 중 오류 발생' });
    } finally {
      setIsLoading(false);
    }
  };

  // 2FA 인증 확인 및 활성화
  const confirmEnable2FA = async () => {
    if (twoFAState.verificationCode.length !== 6) return;

    setIsLoading(true);
    try {
      const result = await enableTwoFactor({
        verificationCode: twoFAState.verificationCode,
      });

      if (result.success) {
        toasts.success({
          title: '2단계 인증 활성화',
          description: '계정 보안이 강화되었습니다.',
        });

        setIs2FAModalOpen(false);

        // ✅ [핵심] 성공 시 Router State 초기화 (데이터 삭제)
        navigate(location.pathname, { replace: true, state: {} });

        // ✅ [문제 해결 1] 유저 정보 강제 갱신
        // await를 사용하여 확실하게 데이터를 받아온 뒤 리렌더링을 유도합니다.
        await checkAuthStatus();
      } else {
        toasts.error({
          title: '인증 실패',
          description:
            result.error?.message || '인증 코드가 올바르지 않습니다.',
        });
      }
    } catch (error) {
      console.error('2FA Verify Error:', error);
      toasts.error({
        title: '오류 발생',
        description: '인증 확인 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 2FA 비활성화 확정
  const startDisable2FA = () => {
    setTwoFAState({
      step: 'disable_confirm',
      qrCode: '',
      verificationCode: '',
      password: '',
    });
    setIs2FAModalOpen(true);
  };

  // 2FA 비활성화 확정
  const confirmDisable2FA = async () => {
    setIsLoading(true);
    try {
      const input = currentUser?.isSocialUser
        ? { currentPassword: '' }
        : { currentPassword: twoFAState.password };

      const result = await disableTwoFactor(input);

      if (result.success) {
        toasts.success({
          title: '2단계 인증 해제',
          description: '2단계 인증이 비활성화되었습니다.',
        });
        setIs2FAModalOpen(false);
        await checkAuthStatus();
      } else {
        toasts.error({
          title: '해제 실패',
          description: result.error?.message || '비밀번호가 올바르지 않습니다.',
        });
      }
    } catch (error) {
      console.error('2FA Disable Error:', error);
      toasts.error({
        title: '오류 발생',
        description: '2단계 인증 해제 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Avatar Handlers ---

  // 아바타 변경 핸들러 (즉시 업로드)
  // ✅ [수정] 아바타 변경 핸들러 (파일 선택 시 팝업 열기)
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. 미리보기 URL 생성
    const objectUrl = URL.createObjectURL(file);

    // 2. 임시 상태 저장 및 모달 열기
    setTempAvatarFile(file);
    setTempAvatarUrl(objectUrl);
    setIsAvatarModalOpen(true);

    // 3. 인풋 초기화 (취소 후 재선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ✅ [추가] 아바타 변경 확정 핸들러 (모달에서 '확인' 클릭 시 실행)
  const handleConfirmAvatarUpload = async () => {
    if (!tempAvatarFile) return;

    try {
      // 실제 업로드 수행
      await uploadAvatar(tempAvatarFile, { replaceExisting: true });

      toasts.success({
        title: '프로필 사진 변경됨',
        description: '프로필 사진이 성공적으로 업데이트되었습니다.',
      });

      // 모달 닫기 및 상태 정리
      setIsAvatarModalOpen(false);
      setTempAvatarFile(null);
      setTempAvatarUrl(null);

      // 사용자 정보 최신화 (메인 화면 이미지 갱신)
      await checkAuthStatus();
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toasts.error({
        title: '업로드 실패',
        description: '프로필 사진 업데이트에 실패했습니다.',
      });
    }
  };

  // ✅ [추가] 아바타 변경 취소 핸들러
  const handleCancelAvatarUpload = () => {
    setIsAvatarModalOpen(false);
    setTempAvatarFile(null);
    setTempAvatarUrl(null);
  };

  // ✅ 아바타 삭제 핸들러 추가
  const handleAvatarDelete = async () => {
    if (!currentUser?.avatar?.id) return;

    if (!window.confirm('정말로 프로필 사진을 삭제하시겠습니까?')) return;

    try {
      await deleteAvatar(currentUser.avatar.id);
      setAvatarPreview(undefined); // 미리보기 제거
      toasts.success({
        title: '삭제 완료',
        description: '프로필 사진이 삭제되었습니다.',
      });
      await checkAuthStatus();
    } catch (error) {
      console.error('Avatar delete failed:', error);
      toasts.error({
        title: '삭제 실패',
        description: '프로필 사진 삭제 중 오류가 발생했습니다.',
      });
    }
  };

  // ✅ [추가] 계정 삭제 핸들러
  const handleDeleteAccount = async () => {
    // 1. 1차 확인 (브라우저 confirm) - 필요하다면 커스텀 Dialog로 교체 가능
    if (
      !window.confirm(
        '정말로 계정을 삭제하시겠습니까?\n삭제된 계정은 복구할 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.'
      )
    ) {
      return;
    }

    // 2. 2차 확인 (안전 장치)
    if (!window.confirm('정말 확실합니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteAccount();

      if (result.success) {
        toasts.success({
          title: '계정 삭제 완료',
          description:
            '계정이 성공적으로 삭제되었습니다. 이용해 주셔서 감사합니다.',
        });
        // useAuth 내부 로직에 의해 자동으로 로그아웃 상태로 전환되고 로그인 페이지로 이동됨
      } else {
        toasts.error({
          title: '삭제 실패',
          description:
            result.error?.message || '계정 삭제 중 오류가 발생했습니다.',
        });
      }
    } catch (error) {
      console.error('Delete Account Error:', error);
      toasts.error({
        title: '오류',
        description: '알 수 없는 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // 실제로는 updatePhoneNumber 등의 API 호출 필요
    console.log('설정 저장:', values);
    toasts.settings.submitValues(values, '보안 설정');
  }

  // 2FA 스위치 모달 취소 핸들러
  const handleModalClose = (open: boolean) => {
    if (!open) {
      // 모달을 닫을 때 Router State도 초기화하여 꼬임을 방지
      navigate(location.pathname, { replace: true, state: {} });
    }
    setIs2FAModalOpen(open);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 1. 아바타 업로드 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle>프로필 이미지</CardTitle>
              <CardDescription>
                프로필 사진을 업데이트하세요. 이 사진은 공개 프로필에
                표시됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-muted">
                    {avatarPreview ? (
                      <AvatarImage
                        src={avatarPreview}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-lg bg-primary/10 text-primary">
                        {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {/* 업로드/삭제 중 오버레이 */}
                  {(isUploading || isDeleting) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-10">
                      {isUploading ? (
                        <div className="text-white text-xs font-medium">
                          {uploadProgress}%
                        </div>
                      ) : (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* 변경 버튼 */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading || isDeleting}
                    >
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="mr-2 h-4 w-4" />
                      )}
                      {isUploading ? '업로드 중...' : '이미지 변경'}
                    </Button>

                    {/* ✅ 삭제 버튼 (아바타가 있을 때만 표시) */}
                    {currentUser?.avatar && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleAvatarDelete}
                        disabled={isUploading || isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        삭제
                      </Button>
                    )}

                    <CardDescription className="text-xs text-muted-foreground md:ml-2">
                      JPG, PNG, WebP 지원. 최대 5MB.
                    </CardDescription>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/webp,image/jpeg,image/png,image/svg+xml"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. 보안 설정 (2FA & 핸드폰 인증) */}
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
              <CardDescription>
                계정 보안 및 연락처 인증을 관리하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 핸드폰 인증 필드 */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>휴대전화 번호</FormLabel>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 max-w-sm">
                        <FormControl>
                          <Input
                            placeholder="010-1234-5678"
                            {...field}
                            className="pl-9"
                            type="tel"
                          />
                        </FormControl>
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                      {/* ✅ 버튼에 핸들러 연결 */}
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleIdentityVerification}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          '인증 요청'
                        )}
                      </Button>
                    </div>
                    <FormDescription>
                      보안 알림 및 계정 복구에 사용됩니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 2FA 스위치 (UI만 렌더링, 로직은 Dialog에서 처리) */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/30">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2 text-base">
                    <Shield className="h-4 w-4 text-primary" />
                    2단계 인증 (2FA)
                  </FormLabel>
                  <FormDescription>
                    로그인 시 추가 인증을 요구하여 계정을 더욱 안전하게
                    보호합니다.
                  </FormDescription>
                </div>
                <Switch
                  checked={currentUser?.activation?.twoFactorActivated}
                  onCheckedChange={handle2FAToggle}
                  disabled={isLoading} // ✅ 로딩 중 클릭 방지
                />
              </div>
            </CardContent>
          </Card>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              변경사항 저장
            </Button>
          </div>
        </form>

        {/* 계정 삭제 영역 */}
        <div className="mt-10 mb-4 flex w-full flex-col items-start justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4 md:flex-row md:items-center">
          <div className="flex flex-col items-start text-sm">
            <CardDescription className="font-bold tracking-wide text-destructive">
              계정 삭제
            </CardDescription>
            <CardDescription className="text-muted-foreground font-medium">
              계정을 영구적으로 삭제합니다.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* ✅ [수정] DeleteActions 컴포넌트 대신 직접 버튼과 핸들러 연결 */}
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading || isUploading || isDeleting}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                '계정 삭제'
              )}
            </Button>
          </div>
        </div>
        {/* 2FA 설정/해제 다이얼로그 */}
        <Dialog open={is2FAModalOpen} onOpenChange={handleModalClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {twoFAState.step === 'disable_confirm'
                  ? '2단계 인증 해제'
                  : '2단계 인증 설정'}
              </DialogTitle>
              <DialogDescription>
                {twoFAState.step === 'verify' &&
                  '인증 앱으로 QR 코드를 스캔하고 인증 번호를 입력하세요.'}
                {twoFAState.step === 'disable_confirm' &&
                  '계정 보호를 위해 2단계 인증 해제 시 비밀번호 확인이 필요합니다.'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center space-y-4 py-4">
              {/* QR 코드 표시 (활성화 단계) */}
              {twoFAState.step === 'verify' && (
                <>
                  <div className="p-4 bg-white border rounded-lg">
                    {twoFAState.qrCode ? (
                      <img
                        src={twoFAState.qrCode}
                        alt="2FA QR Code"
                        className="w-48 h-48"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center bg-gray-100">
                        <QrCode className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <Label htmlFor="verificationCode" className="sr-only">
                      인증 코드
                    </Label>
                    <Input
                      id="verificationCode"
                      placeholder="6자리 인증 코드"
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                      value={twoFAState.verificationCode}
                      onChange={(e) =>
                        setTwoFAState((prev) => ({
                          ...prev,
                          verificationCode: e.target.value.replace(/\D/g, ''),
                        }))
                      }
                    />
                  </div>
                </>
              )}

              {/* 비밀번호 확인 (비활성화 단계) */}
              {twoFAState.step === 'disable_confirm' && (
                <div className="w-full space-y-4">
                  {!currentUser?.isSocialUser ? (
                    <>
                      <Label htmlFor="password">현재 비밀번호</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={twoFAState.password}
                        onChange={(e) =>
                          setTwoFAState((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                      />
                    </>
                  ) : (
                    <CardDescription>
                      소셜 계정은 비밀번호 입력 없이 해제할 수 있습니다.
                    </CardDescription>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="sm:justify-between">
              <Button
                variant="secondary"
                onClick={() => handleModalClose(false)}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                onClick={
                  twoFAState.step === 'verify'
                    ? confirmEnable2FA
                    : confirmDisable2FA
                }
                disabled={
                  isLoading ||
                  (twoFAState.step === 'verify' &&
                    twoFAState.verificationCode.length !== 6) ||
                  (twoFAState.step === 'disable_confirm' &&
                    !currentUser?.isSocialUser &&
                    !twoFAState.password)
                }
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {twoFAState.step === 'verify' ? '인증 및 활성화' : '해제하기'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* ✅ [추가] 아바타 미리보기 및 확인 다이얼로그 */}
        <Dialog
          open={isAvatarModalOpen}
          onOpenChange={(open) => !open && handleCancelAvatarUpload()}
        >
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>프로필 사진 미리보기</DialogTitle>
              <DialogDescription>
                선택한 사진으로 프로필을 변경하시겠습니까?
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center py-6">
              <Avatar className="h-40 w-40 border-4 border-muted shadow-md">
                {tempAvatarUrl && (
                  <AvatarImage src={tempAvatarUrl} className="object-cover" />
                )}
                <AvatarFallback>Preview</AvatarFallback>
              </Avatar>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={handleCancelAvatarUpload}
                disabled={isUploading}
              >
                취소
              </Button>
              <Button
                onClick={handleConfirmAvatarUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    업로드 중...
                  </>
                ) : (
                  '변경하기'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  );
}
