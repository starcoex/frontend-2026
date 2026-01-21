import { useState, useCallback } from 'react';
import {
  ApiError,
  ApiErrorCode,
  apiErrorFromHttp,
  apiErrorFromUnknown,
} from '../errors/api-error';
import { useAuth } from './useAuth';
import { avatarService } from '../services';

interface UseAvatarOptions {
  port?: number;
}
interface UploadAvatarResponse {
  message?: string;
  avatarUrl?: string;
}

export const useAvatar = (options?: UseAvatarOptions) => {
  const {
    getCurrentUser,
    deleteAvatar: authDeleteAvatar, // useAuth의 삭제 함수 가져오기 (별칭 사용)
  } = useAuth();

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // 로컬 로딩 상태
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 📤 아바타 업로드 (REST API) - 기존 로직 유지
  const uploadAvatar = useCallback(
    async (file: File, uploadOptions: { replaceExisting?: boolean } = {}) => {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        // 1. 파일 검증
        avatarService.validateFile(file);

        const formData = new FormData();
        formData.append('file', file);
        formData.append(
          'replaceExisting',
          String(uploadOptions.replaceExisting ?? true)
        );

        // 진행률 시뮬레이션
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => (prev >= 90 ? prev : prev + 10));
        }, 200);

        // ✅ [수정] port 옵션이 있으면 전체 URL 생성, 없으면 상대 경로 사용
        const baseUrl = options?.port ? `http://localhost:${options.port}` : '';
        const endpoint = `${baseUrl}/api/users/avatar/upload`;

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          credentials: 'include', // 쿠키 기반 인증
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw apiErrorFromHttp(response, errorBody);
        }

        const result = (await response.json()) as UploadAvatarResponse;
        await getCurrentUser(); // 사용자 정보 갱신

        return result.avatarUrl;
      } catch (err) {
        const apiError = apiErrorFromUnknown(err);
        setError(apiError.message);
        throw apiError;
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [getCurrentUser]
  );

  // 🗑️ 아바타 삭제 (useAddress 함수 재사용)
  const deleteAvatar = useCallback(
    async (avatarId?: number) => {
      setIsDeleting(true); // 로딩 시작
      setError(null);

      try {
        // useAuth의 deleteAvatar 호출
        // input 객체 구조에 맞춰 전달 ({ userId: avatarId })
        const result = await authDeleteAvatar({
          userId: avatarId,
        });

        if (!result.success) {
          // ApiResponse의 error 객체나 message를 사용하여 에러 throw
          throw new ApiError(
            result.message || '아바타 삭제에 실패했습니다.',
            ApiErrorCode.BAD_REQUEST
          );
        }

        // 성공 시 useAddress 내부에서 이미 캐시 업데이트 등을 처리했을 수 있지만,
        // 확실하게 UI 갱신을 위해 한 번 더 호출 (선택 사항)
        await getCurrentUser();

        return true;
      } catch (err) {
        const apiError = apiErrorFromUnknown(err);
        setError(apiError.message);
        throw apiError;
      } finally {
        setIsDeleting(false); // 로딩 종료
      }
    },
    [authDeleteAvatar, getCurrentUser]
  );

  // 에러 클리어
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUploading,
    isDeleting,
    uploadProgress,
    error,
    uploadAvatar,
    deleteAvatar,
    clearError,
  };
};
