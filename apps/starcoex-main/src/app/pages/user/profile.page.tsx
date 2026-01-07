import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  User,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  Upload,
  Trash2,
  Loader2,
} from 'lucide-react';
import { AvatarUtils, useAuth, useAvatar } from '@starcoex-frontend/auth';
import * as PortOne from '@portone/browser-sdk/v2';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getRoleText, getUserTypeText } from '@starcoex-frontend/common';
import { Input } from '@/components/ui/input';
import { PasswordConfirmDialog } from '@/app/pages/user/components/password-confirm-dialog';
import { Label } from '@/components/ui/label';

// ✅ User 타입에 실제로 존재하는 필드만 사용
interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
}

// 편집 모드 타입 정의
type EditMode = 'none' | 'name' | 'email' | 'phone';

// 메시지 타입 정의
interface Message {
  type: 'success' | 'error' | 'info';
  text: string;
}

/**
 * 👤 프로필 관리 페이지
 */
export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    isLoading,
    checkAuthStatus,
    updateUserName,
    requestEmailChange,
    requestIdentityVerification, // 본인인증 Init
    verifyIdentityVerification, // 본인인증 Complete
  } = useAuth();
  const {
    isUploading,
    isDeleting,
    error: avatarError,
    uploadProgress,
    uploadAvatar,
    deleteAvatar,
    clearError,
  } = useAvatar({
    port: 4102,
  });
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 패스워드 확인 다이얼로그 상태
  const [passwordDialog, setPasswordDialog] = useState({
    isOpen: false,
    type: '' as 'name' | 'email' | 'phone',
    title: '',
    description: '',
  });

  // 아바타 URL 변환 - 캐시 버스터 적용
  const avatarUrl = AvatarUtils.getAvatarUrl(currentUser?.avatar?.url);

  // ✅ 실제 User 타입에 존재하는 필드만 사용
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phoneNumber: '',
  });

  // 파일 입력 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 메시지 자동 제거
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    // 모든 코드 경로에서 값을 반환해야 함
    return undefined;
  }, [message]);

  // 현재 사용자 정보로 폼 초기화
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
      });
    }
  }, [currentUser]);

  // 입력값 변경 처리
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 편집 취소
  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
      });
    }
    setEditMode('none');
    setMessage(null);
  };

  // 이름 저장 준비 (비밀번호 확인 필요)
  const handlePrepareSaveName = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: '이름을 입력해주세요.' });
      return;
    }

    // 소셜 사용자는 비밀번호 확인 없이 바로 저장
    if (currentUser?.isSocialUser) {
      handleSaveNameWithPassword('');
      return;
    }

    // 일반 사용자는 비밀번호 확인 다이얼로그 표시
    setPasswordDialog({
      isOpen: true,
      type: 'name',
      title: '이름 변경 확인',
      description: '보안을 위해 현재 비밀번호를 입력해주세요.',
    });
  };

  // 비밀번호 확인 후 이름 저장
  const handleSaveNameWithPassword = async (password: string) => {
    try {
      setIsSubmitting(true);
      const result = await updateUserName({
        name: formData.name.trim(),
        password: password,
      });
      if (result.success) {
        setMessage({ type: 'success', text: '이름이 변경되었습니다.' });
        setEditMode('none');
        await checkAuthStatus(); // UI 갱신
      } else {
        setMessage({
          type: 'error',
          text: result.error?.message || '이름 변경에 실패했습니다.',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ [Refactored] 본인인증을 통한 전화번호 변경 핸들러
  const handlePhoneChangeIdentity = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      // 1. Init
      const storeId = import.meta.env.VITE_PORTONE_STORE_ID;
      const channelKey = import.meta.env.VITE_PORTONE_CHANNEL_KEY;

      const initResponse = await requestIdentityVerification({
        storeId,
        channelKey,
      });

      if (!initResponse.success || !initResponse.data) {
        throw new Error(initResponse.error?.message || '인증 초기화 실패');
      }

      const { identityVerificationId } =
        initResponse.data.requestIdentityVerification;

      // 2. SDK Call
      const sdkResponse = await PortOne.requestIdentityVerification({
        storeId,
        identityVerificationId: identityVerificationId || '',
        channelKey: channelKey,
        customer: {
          fullName: currentUser?.name || '',
          // 기존 번호가 있다면 미리 채워줌 (편의성)
          phoneNumber: currentUser?.phoneNumber?.replace(/-/g, '') || '',
        },
        bypass: {
          danal: {
            IsCarrier: 'SKT;KT;LGT;KT_MVNO;LGU_MVNO',
            AGELIMIT: 14,
          },
        },
        redirectUrl: window.location.href,
      });

      // 3. Handle SDK Result
      if (sdkResponse?.code != null) {
        setMessage({ type: 'info', text: '본인인증이 취소되었습니다.' });
      } else {
        // 4. Verify & Update (Server)
        // 서버의 verifyIdentityVerification 로직 내부에서
        // 인증된 정보(CI/DI, 전화번호 등)로 사용자 정보를 업데이트하도록 구현되어 있어야 합니다.
        const verifyResponse = await verifyIdentityVerification({
          identityVerificationId: identityVerificationId || '',
        });

        if (verifyResponse.success) {
          setMessage({
            type: 'success',
            text: '본인인증이 완료되어 전화번호가 업데이트되었습니다.',
          });
          setEditMode('none');
          await checkAuthStatus(); // UI 갱신
        } else {
          setMessage({
            type: 'error',
            text:
              verifyResponse.error?.message ||
              '인증 정보를 확인하지 못했습니다.',
          });
        }
      }
    } catch (error: any) {
      console.error('Identity Verification Error:', error);
      setMessage({ type: 'error', text: error.message || '본인인증 오류' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이메일 변경 요청 준비
  const handlePrepareEmailChange = () => {
    // 소셜 사용자 제한 체크
    if (currentUser?.isSocialUser) {
      setMessage({
        type: 'error',
        text: '소셜 로그인 사용자는 이메일 변경이 불가능합니다.',
      });
      return;
    }

    if (!formData.email.trim()) {
      setMessage({
        type: 'error',
        text: '새 이메일을 입력해주세요.',
      });
      return;
    }
    // ... 이메일 검증 로직 ...
    setPasswordDialog({
      isOpen: true,
      type: 'email',
      title: '이메일 변경 확인',
      description: '보안을 위해 현재 비밀번호를 입력해주세요.',
    });
  };

  // 패스워드 확인 후 이메일 변경 요청
  const handlePasswordConfirm = async (password: string) => {
    try {
      setIsSubmitting(true);

      if (passwordDialog.type === 'name') {
        // 이름 변경
        await handleSaveNameWithPassword(password);
      } else if (passwordDialog.type === 'email') {
        // 이메일 변경
        const result = await requestEmailChange({
          currentPassword: password,
          newEmail: formData.email.trim(),
        });
        if (result.success) {
          setMessage({
            type: 'success',
            text: '인증 메일이 발송되었습니다. 메일함을 확인해주세요.',
          });
          setEditMode('none');
        } else {
          setMessage({ type: 'error', text: result.error?.message || '실패' });
        }
      }
      setPasswordDialog({
        isOpen: false,
        type: 'email',
        title: '',
        description: '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: '오류 발생' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 저장 핸들러 통합
  const handleSave = () => {
    switch (editMode) {
      case 'name':
        return handlePrepareSaveName();
      case 'email':
        return handlePrepareEmailChange();
      default:
        return;
    }
  };

  // 🖼️ 단순한 아바타 업로드 핸들러
  const handleAvatarChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        clearError();
        await uploadAvatar(file, { replaceExisting: true });

        setMessage({
          type: 'success',
          text: '아바타가 성공적으로 업데이트되었습니다!',
        });

        // 사용자 정보 새로고침
        await checkAuthStatus();

        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('아바타 업로드 실패:', error);
        setMessage({
          type: 'error',
          text: '아바타 업로드에 실패했습니다.',
        });
      }
    },
    [uploadAvatar, clearError, checkAuthStatus]
  );

  // 🗑️ 아바타 삭제 핸들러 - 올바른 ID로 수정
  const handleAvatarDelete = useCallback(async () => {
    try {
      console.log('삭제 시작 - 현재 사용자:', currentUser);

      const avatarId = currentUser?.avatar?.id;
      console.log('삭제할 아바타 ID:', avatarId);

      if (!avatarId) {
        throw new Error('삭제할 아바타를 찾을 수 없습니다.');
      }

      clearError();

      // ✨ 올바른 아바타 ID (42) 전달
      await deleteAvatar(avatarId);
      console.log('삭제 완료');

      setMessage({
        type: 'success',
        text: '프로필 사진이 삭제되었습니다.',
      });

      // 사용자 정보 새로고침
      await checkAuthStatus();

      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('아바타 삭제 실패:', error);

      // ✨ 타입 안전한 에러 처리
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // 인증 오류 특별 처리
      if (errorMessage.includes('로그인이 필요합니다')) {
        setMessage({
          type: 'error',
          text: '인증에 실패했습니다. 페이지를 새로고침하거나 다시 로그인해주세요.',
        });
      } else {
        setMessage({
          type: 'error',
          text:
            error instanceof Error
              ? error.message
              : '프로필 사진 삭제에 실패했습니다.',
        });
      }
      setIsDeleteDialogOpen(false);
    }
  }, [deleteAvatar, clearError, checkAuthStatus, currentUser]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>프로필 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <CardTitle className="text-3xl font-bold mb-2">프로필 관리</CardTitle>
        <CardDescription>개인 정보를 관리하고 업데이트하세요.</CardDescription>
      </div>

      {/* 알림 메시지 */}
      {(message || avatarError) && (
        <Alert
          className={`mb-6 ${
            message?.type === 'success'
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          <AlertDescription
            className={
              message?.type === 'success' ? 'text-green-800' : 'text-red-800'
            }
          >
            {message?.text || avatarError}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ✨ 단순화된 프로필 카드 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              프로필 사진
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {/* 아바타 이미지 - 단순화 */}
            <div className="relative inline-block">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={avatarUrl}
                  alt={currentUser?.name || 'User'}
                />
                <AvatarFallback className="text-2xl">
                  {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              {/* 업로드 진행률 오버레이 */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="text-white text-sm font-medium">
                    {uploadProgress}%
                  </div>
                </div>
              )}

              {/* 카메라 버튼 */}
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isDeleting}
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </Button>

              {/* 숨겨진 파일 입력 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* 업로드 진행률 바 */}
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">업로드 중...</p>
              </div>
            )}

            {/* 사용자 정보 */}
            <div>
              <CardTitle className="text-xl font-semibold">
                {currentUser?.name || '이름 없음'}
              </CardTitle>
              <CardDescription>{currentUser?.email}</CardDescription>
            </div>

            {/* 아바타 관리 버튼 */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isDeleting}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? '업로드 중...' : '이미지 선택'}
              </Button>

              {/* ✨ avatar 객체가 있을 때 삭제 버튼 표시 */}
              {currentUser?.avatar && (
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUploading || isDeleting}
                    >
                      {isDeleting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>프로필 사진 삭제</DialogTitle>
                      <DialogDescription>
                        프로필 사진을 삭제하시겠습니까? 이 작업은 되돌릴 수
                        없습니다.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                        disabled={isDeleting}
                      >
                        취소
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleAvatarDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? '삭제 중...' : '삭제'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* 파일 형식 안내 */}
            <CardDescription className="text-xs">
              JPG, PNG, GIF, WEBP 파일을 선택하세요 (최대 5MB)
            </CardDescription>

            {/* 사용자 정보 배지 */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">
                {getUserTypeText(currentUser.userType)}
              </Badge>
              {currentUser.role && (
                <Badge variant="secondary">
                  {getRoleText(currentUser.role)}
                </Badge>
              )}
            </div>

            {/* ✅ 사용자 상태 정보 */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">계정 상태</span>
                <Badge
                  variant={currentUser.isActive ? 'outline' : 'destructive'}
                >
                  {currentUser.isActive ? '활성화' : '비활성화'}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">이메일 인증</span>
                <Badge
                  variant={
                    currentUser.emailVerified ? 'outline' : 'destructive'
                  }
                >
                  {currentUser.emailVerified ? '완료' : '미완료'}
                </Badge>
              </div>

              {currentUser.lastLoginAt && (
                <div className="text-xs text-muted-foreground">
                  마지막 로그인:{' '}
                  {new Date(currentUser.lastLoginAt).toLocaleDateString(
                    'ko-KR'
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 프로필 정보 편집 카드 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  개인 정보
                </CardTitle>
                <CardDescription>
                  개인 정보를 수정하고 업데이트하세요.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 이름 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="name">이름</Label>
                {editMode !== 'name' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditMode('name')}
                    disabled={editMode !== 'none' || isSubmitting}
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    편집
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      ) : (
                        <Save className="w-3 h-3 mr-1" />
                      )}
                      저장
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-1">
                {editMode === 'name' ? (
                  <div className="space-y-2">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder="이름을 입력하세요"
                      disabled={isSubmitting}
                    />
                    {!currentUser?.isSocialUser && (
                      <p className="text-xs text-muted-foreground">
                        보안을 위해 이름 변경 시 현재 비밀번호 확인이
                        필요합니다.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{formData.name || '이름이 설정되지 않았습니다'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="email">이메일</Label>
                {editMode !== 'email' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, email: '' }));
                      setEditMode('email');
                    }}
                    disabled={editMode !== 'none' || isSubmitting}
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    변경 요청
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      ) : (
                        <Save className="w-3 h-3 mr-1" />
                      )}
                      요청
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-1">
                {editMode === 'email' ? (
                  <div className="space-y-2">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      placeholder="새 이메일을 입력하세요"
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      새 이메일로 인증 링크가 전송되며, 보안을 위해 현재
                      비밀번호가 필요합니다.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{currentUser.email}</span>
                      {currentUser.emailVerified && (
                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                      )}
                    </div>
                    {currentUser?.isSocialUser && (
                      <p className="text-xs text-amber-600">
                        소셜 로그인 사용자는 이메일 변경이 불가능합니다.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="phoneNumber">휴대전화 번호</Label>
                {/* 전화번호가 있으면 '변경', 없으면 버튼 없음 (아래에서 처리) */}
                {currentUser.phoneNumber && editMode !== 'phone' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditMode('phone')}
                    disabled={isSubmitting}
                  >
                    <Edit3 className="w-3 h-3 mr-1" /> 편집
                  </Button>
                )}
                {editMode === 'phone' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <X className="w-3 h-3" /> 취소
                  </Button>
                )}
              </div>

              <div className="mt-1">
                {/* 1. 수정 모드이거나, 전화번호가 아예 없는 경우 */}
                {editMode === 'phone' || !currentUser.phoneNumber ? (
                  <div className="space-y-3 bg-muted/30 p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-2">
                      {!currentUser.phoneNumber
                        ? '서비스 이용을 위해 본인인증을 통해 전화번호를 등록해주세요.'
                        : '보안을 위해 본인인증을 통해서만 전화번호를 변경할 수 있습니다.'}
                    </p>
                    <Button
                      onClick={handlePhoneChangeIdentity}
                      disabled={isSubmitting}
                      className="w-full"
                      variant={!currentUser.phoneNumber ? 'default' : 'outline'} // 없으면 강조
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Shield className="mr-2 h-4 w-4" />
                      )}
                      {!currentUser.phoneNumber
                        ? '본인인증하고 번호 등록'
                        : '본인인증으로 번호 변경'}
                    </Button>
                  </div>
                ) : (
                  /* 2. 전화번호가 있고 수정 모드가 아닌 경우 */
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{currentUser.phoneNumber}</span>
                    <Badge
                      variant="outline"
                      className="ml-auto text-green-600 border-green-200 bg-green-50"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" /> 인증됨
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ 사용자 타입 정보 표시 (읽기 전용) */}
            <div>
              <Label>사용자 정보</Label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>
                    사용자 타입: {getUserTypeText(currentUser.userType)}
                  </span>
                </div>

                {currentUser.role && (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span>역할: {getRoleText(currentUser.role)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span>
                    가입일:{' '}
                    {new Date(currentUser.createdAt).toLocaleDateString(
                      'ko-KR'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ 마케팅 동의 정보 */}
            {currentUser.marketingConsent !== undefined && (
              <div>
                <Label>마케팅 정보 수신</Label>
                <div className="mt-1">
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {currentUser.marketingConsent ? '수신 동의' : '수신 거부'}
                    </span>
                    {currentUser.marketingConsentDate && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        (
                        {new Date(
                          currentUser.marketingConsentDate
                        ).toLocaleDateString('ko-KR')}
                        )
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 보안 설정 링크 */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="font-medium">보안 설정</CardTitle>
                <CardDescription>
                  비밀번호 변경, 2단계 인증 등 보안 설정을 관리하세요.
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/security')}
            >
              보안 설정
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* 패스워드 확인 다이얼로그 */}
      <PasswordConfirmDialog
        isOpen={passwordDialog.isOpen}
        onClose={() => setPasswordDialog({ ...passwordDialog, isOpen: false })}
        onConfirm={handlePasswordConfirm}
        title={passwordDialog.title}
        description={passwordDialog.description}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
