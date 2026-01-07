import { toast } from 'sonner';
import { User } from '@starcoex-frontend/graphql';

// 기본 토스트 타입 정의
export interface ToastOptions {
  duration?: number;
  name?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 데이터 표시를 위한 컴포넌트
const DataDisplay = ({ data }: { data: any }) => (
  <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-auto">
    <code className="text-white text-xs">{JSON.stringify(data, null, 2)}</code>
  </pre>
);

// 기본 토스트 컴포넌트
const ToastContent = ({
  title,
  description,
  data,
}: {
  title: string;
  description?: string;
  data?: any;
}) => (
  <div className="space-y-2">
    <div className="font-semibold">{title}</div>
    {description && (
      <div className="text-sm text-muted-foreground">{description}</div>
    )}
    {data && <DataDisplay data={data} />}
  </div>
);

// 사용자 관련 토스트
export const userToasts = {
  // 계정 비활성화
  deactivate: (user: User, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="계정이 비활성화되었습니다"
        description={`${
          user.name || user.email
        }님의 계정이 비활성화되었습니다.`}
        data={user}
      />,
      { duration: 4000, ...options }
    );
  },

  // 계정 활성화
  activate: (user: User, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="계정이 활성화되었습니다"
        description={`${user.name || user.email}님의 계정이 활성화되었습니다.`}
        data={user}
      />,
      { duration: 4000, ...options }
    );
  },

  // 비밀번호 재설정 이메일 전송
  passwordResetSent: (user: User, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="비밀번호 재설정 이메일 전송 완료"
        description={`${user.email}로 비밀번호 재설정 이메일을 전송했습니다.`}
        data={user}
      />,
      { duration: 5000, ...options }
    );
  },

  // 사용자 삭제
  delete: (user: User, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="사용자가 삭제되었습니다"
        description={`${
          user.name || user.email
        }님이 시스템에서 제거되었습니다.`}
        data={user}
      />,
      {
        duration: 6000,
        action: {
          label: '실행 취소',
          onClick: () => console.log('삭제 실행 취소:', user.id),
        },
        ...options,
      }
    );
  },

  // ✅ 사용자 초대 함수 추가
  invite: (inviteData: any, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="사용자 초대 이메일이 전송되었습니다"
        description={`${inviteData.email}로 초대 이메일을 보냈습니다.`}
        data={inviteData}
      />,
      { duration: 5000, ...options }
    );
  },

  // ✅ 여러 사용자 동시 초대
  inviteMultiple: (inviteList: any[], options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title={`${inviteList.length}명의 사용자에게 초대 이메일 전송`}
        description="모든 초대 이메일이 성공적으로 전송되었습니다."
        data={inviteList}
      />,
      { duration: 5000, ...options }
    );
  },

  // 사용자 생성
  create: (
    user: Pick<User, 'email' | 'name' | 'role'>,
    options?: ToastOptions
  ) => {
    toast.success(
      <ToastContent
        title="새 사용자가 생성되었습니다"
        description={`${user.name || user.email}님이 시스템에 추가되었습니다.`}
        data={user}
      />,
      { duration: 4000, ...options }
    );
  },

  // 사용자 정보 업데이트
  update: (user: User, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="사용자 정보가 업데이트되었습니다"
        description={`${
          user.name || user.email
        }님의 정보가 성공적으로 저장되었습니다.`}
        data={user}
      />,
      { duration: 4000, ...options }
    );
  },
};

// 폼 관련 토스트
export const formToasts = {
  // 폼 제출 성공
  submitSuccess: (formData: any, formType = '폼', options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title={`${formType} 제출 완료`}
        description="입력하신 정보가 성공적으로 저장되었습니다."
        data={formData}
      />,
      { duration: 4000, ...options }
    );
  },

  // 폼 저장 (임시저장)
  save: (formData: any, formType = '폼', options?: ToastOptions) => {
    toast.info(
      <ToastContent
        title={`${formType} 저장 완료`}
        description="변경사항이 저장되었습니다."
        data={formData}
      />,
      { duration: 3000, ...options }
    );
  },

  // 폼 유효성 검사 실패
  validationError: (errors: any, options?: ToastOptions) => {
    toast.error(
      <ToastContent
        title="입력 정보를 확인해주세요"
        description="필수 항목이 누락되었거나 올바르지 않습니다."
        data={errors}
      />,
      { duration: 5000, ...options }
    );
  },
};

// 건의사항 관련 토스트
export const suggestionToasts = {
  // 건의사항 제출
  submit: (suggestionData: any, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="건의사항이 제출되었습니다"
        description="관리자가 검토 후 처리 결과를 알려드리겠습니다."
        data={suggestionData}
      />,
      {
        duration: 5000,
        action: {
          label: '목록 보기',
          onClick: () => (window.location.href = '/suggestions'),
        },
        ...options,
      }
    );
  },

  // 건의사항 승인
  approve: (suggestion: any, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="건의사항이 승인되었습니다"
        description={`"${suggestion.title}" 건의사항이 승인되어 처리 단계로 넘어갔습니다.`}
        data={suggestion}
      />,
      { duration: 4000, ...options }
    );
  },

  // 건의사항 완료
  complete: (suggestion: any, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="건의사항 처리가 완료되었습니다"
        description={`"${suggestion.title}" 건의사항이 성공적으로 처리되었습니다.`}
        data={suggestion}
      />,
      { duration: 4000, ...options }
    );
  },
};

// 일반적인 액션 토스트
export const actionToasts = {
  // 성공
  success: (
    title: string,
    description?: string,
    data?: any,
    options?: ToastOptions
  ) => {
    toast.success(
      <ToastContent title={title} description={description} data={data} />,
      { duration: 4000, ...options }
    );
  },

  // 에러
  error: (
    title: string,
    description?: string,
    data?: any,
    options?: ToastOptions
  ) => {
    toast.error(
      <ToastContent title={title} description={description} data={data} />,
      { duration: 5000, ...options }
    );
  },

  // 정보
  info: (
    title: string,
    description?: string,
    data?: any,
    options?: ToastOptions
  ) => {
    toast.info(
      <ToastContent title={title} description={description} data={data} />,
      { duration: 4000, ...options }
    );
  },

  // 경고
  warning: (
    title: string,
    description?: string,
    data?: any,
    options?: ToastOptions
  ) => {
    toast.warning(
      <ToastContent title={title} description={description} data={data} />,
      { duration: 5000, ...options }
    );
  },
};

// 개발/디버그 관련 토스트
export const debugToasts = {
  // 데이터 확인용
  showData: (data: any, title = '디버그 데이터') => {
    if (process.env.NODE_ENV === 'development') {
      toast.info(<ToastContent title={title} data={data} />, {
        duration: 8000,
      });
    }
  },

  // API 응답 확인용
  apiResponse: (response: any, endpoint: string) => {
    if (process.env.NODE_ENV === 'development') {
      toast.info(
        <ToastContent title={`API 응답: ${endpoint}`} data={response} />,
        { duration: 10000 }
      );
    }
  },

  // ✅ 제출된 값 확인용 (개발/테스트용)
  submittedValues: (
    values: any,
    title = 'You submitted the following values:',
    options?: ToastOptions
  ) => {
    toast.info(<ToastContent title={title} data={values} />, {
      duration: 6000,
      ...options,
    });
  },
};

// ✅ 설정 관련 토스트 추가
export const settingsToasts = {
  // 설정 저장
  save: (settingsData: any, settingType = '설정', options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title={`${settingType} 저장 완료`}
        description="설정이 성공적으로 저장되었습니다."
        data={settingsData}
      />,
      { duration: 4000, ...options }
    );
  },

  // 설정 업데이트
  update: (settingsData: any, settingType = '설정', options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title={`${settingType} 업데이트 완료`}
        description="변경사항이 성공적으로 적용되었습니다."
        data={settingsData}
      />,
      { duration: 4000, ...options }
    );
  },

  // 설정 초기화
  reset: (settingType = '설정', options?: ToastOptions) => {
    toast.info(
      <ToastContent
        title={`${settingType} 초기화 완료`}
        description="설정이 기본값으로 초기화되었습니다."
      />,
      { duration: 4000, ...options }
    );
  },

  // 제출된 값 표시 (설정 전용)
  submitValues: (values: any, settingType = '설정', options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title={`${settingType} 제출 완료`}
        description="입력하신 설정 정보입니다."
        data={values}
      />,
      { duration: 5000, ...options }
    );
  },
};

// ✅ 범용 알림 토스트 추가
export const notificationToasts = {
  // 제출된 값 표시 (범용)
  notifySubmittedValues: (
    values: any,
    title?: string,
    options?: ToastOptions
  ) => {
    toast.info(
      <ToastContent
        title={title || 'You submitted the following values:'}
        data={values}
      />,
      { duration: 6000, ...options }
    );
  },

  // 데이터 확인 알림 (프로덕션에서도 사용 가능)
  notifyData: (
    data: any,
    title = 'Data Information',
    description?: string,
    options?: ToastOptions
  ) => {
    toast.info(
      <ToastContent title={title} description={description} data={data} />,
      { duration: 5000, ...options }
    );
  },
};

// 파일 관련 토스트
export const fileToasts = {
  // 파일 임포트
  import: (fileDetails: any, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="파일이 성공적으로 임포트되었습니다"
        description={`${fileDetails.name} (${(fileDetails.size / 1024).toFixed(
          1
        )}KB)`}
        data={fileDetails}
      />,
      {
        duration: 5000,
        action: {
          label: '처리 시작',
          onClick: () => console.log('파일 처리 시작:', fileDetails.name),
        },
        ...options,
      }
    );
  },

  // 파일 업로드
  upload: (fileDetails: any, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="파일 업로드 완료"
        description={`${fileDetails.name}이(가) 성공적으로 업로드되었습니다.`}
        data={fileDetails}
      />,
      { duration: 4000, ...options }
    );
  },

  // 파일 처리 완료
  processComplete: (result: any, options?: ToastOptions) => {
    toast.success(
      <ToastContent
        title="파일 처리 완료"
        description="파일이 성공적으로 처리되었습니다."
        data={result}
      />,
      { duration: 4000, ...options }
    );
  },

  // 파일 오류
  error: (error: any, fileName?: string, options?: ToastOptions) => {
    toast.error(
      <ToastContent
        title="파일 처리 중 오류 발생"
        description={
          fileName
            ? `${fileName} 처리 중 문제가 발생했습니다.`
            : '파일 처리 중 문제가 발생했습니다.'
        }
        data={error}
      />,
      { duration: 6000, ...options }
    );
  },
};

// 편의를 위한 통합 내보내기
export const toasts = {
  user: userToasts,
  form: formToasts,
  action: actionToasts,
  debug: debugToasts,
  suggestion: suggestionToasts, // ✅ 추가
  file: fileToasts, // ✅ 추가
  settings: settingsToasts, // ✅ 추가
  notification: notificationToasts, // ✅ 추가
  // ✅ 루트 레벨 메서드 추가 (객체 파라미터 지원)
  success: (
    {
      title,
      description,
      data,
    }: { title: string; description?: string; data?: any },
    options?: ToastOptions
  ) => {
    toast.success(
      <ToastContent title={title} description={description} data={data} />,
      { duration: 4000, ...options }
    );
  },
  error: (
    {
      title,
      description,
      data,
    }: { title: string; description?: string; data?: any },
    options?: ToastOptions
  ) => {
    toast.error(
      <ToastContent title={title} description={description} data={data} />,
      { duration: 5000, ...options }
    );
  },
  info: (
    {
      title,
      description,
      data,
    }: { title: string; description?: string; data?: any },
    options?: ToastOptions
  ) => {
    toast.info(
      <ToastContent title={title} description={description} data={data} />,
      { duration: 4000, ...options }
    );
  },
  warning: (
    {
      title,
      description,
      data,
    }: { title: string; description?: string; data?: any },
    options?: ToastOptions
  ) => {
    toast.warning(
      <ToastContent title={title} description={description} data={data} />,
      { duration: 5000, ...options }
    );
  },
};

// ✅ 편의 함수들 (독립적으로도 사용 가능)
export const notifySubmittedValues = (
  values: any,
  title?: string,
  options?: ToastOptions
) => {
  return notificationToasts.notifySubmittedValues(values, title, options);
};

export const notifyData = (
  data: any,
  title?: string,
  description?: string,
  options?: ToastOptions
) => {
  return notificationToasts.notifyData(data, title, description, options);
};
