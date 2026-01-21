import { useCallback, useRef } from 'react';
import {
  GetUserFilesInput,
  GetFileInput,
  DeleteFileInput,
  FileWithUrl,
  UpdateFileInput,
} from '@starcoex-frontend/graphql';
import type { ApiResponse, UploadMetadata, UploadResponse } from '../types';
import { useMediaContext } from '../context';
import { getMediaService } from '../services';

export const useMedia = () => {
  const context = useMediaContext();

  const {
    setLoading,
    clearError,
    setError,
    setFiles,
    removeFile: contextRemoveFile,
    updateFileInList, // ✅ 가져오기
    setPagination,
    isLoading: contextIsLoading,
  } = context;

  // isLoading 상태를 ref로 관리 (useEffect 의존성 제거용 - useAddress 참조)
  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  // 공통 로딩 래퍼 (useAddress 참조)
  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) {
          setLoading(true);
        }
        clearError();

        const res = await operation();

        if (!res.success) {
          const msg =
            res.error?.message ??
            res.graphQLErrors?.[0]?.message ??
            defaultErrorMessage;
          setError(msg);
        }

        return res;
      } catch (e) {
        console.error(e);
        setError(defaultErrorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // 사용자 파일 목록 조회
  const loadUserFiles = useCallback(
    async (input: GetUserFilesInput) =>
      withLoading(async () => {
        const service = getMediaService();
        const res = await service.getUserFiles(input);

        if (res.success && res.data?.getUserFiles) {
          const { fileWithUrl, totalCount, hasNext } = res.data.getUserFiles;
          if (fileWithUrl) {
            setFiles(fileWithUrl as FileWithUrl[]);
            setPagination({
              totalCount: totalCount ?? 0,
              hasNext: hasNext ?? false,
              limit: input.limit ?? 20,
              offset: input.offset ?? 0,
            });
          }
        }
        return res;
      }, '파일 목록을 불러오는데 실패했습니다.'),
    [withLoading, setFiles, setPagination]
  );

  // 단일 파일 조회
  const getFile = useCallback(
    async (input: GetFileInput) =>
      withLoading(
        () => getMediaService().getFile(input),
        '파일 정보를 불러오는데 실패했습니다.'
      ),
    [withLoading]
  );

  // 파일 삭제
  const deleteFile = useCallback(
    async (input: DeleteFileInput) =>
      withLoading(async () => {
        const service = getMediaService();
        const res = await service.deleteFile(input);

        if (res.success && res.data?.deleteFile?.success) {
          // 삭제 성공 시 Context 상태 업데이트 (Optimistic UI 처럼 동작)
          contextRemoveFile(input.fileId);
        }
        return res;
      }, '파일 삭제에 실패했습니다.'),
    [withLoading, contextRemoveFile]
  );

  // 파일 정보 수정
  const updateFile = useCallback(
    async (input: UpdateFileInput) =>
      withLoading(async () => {
        const service = getMediaService();
        const res = await service.updateFile(input); // MediaService에도 updateFile 추가 필요

        if (res.success && res.data?.updateFile?.file) {
          // ✅ [수정] updateFileInList 사용
          // res.data.updateFile.file은 GraphQL 응답 타입이므로 FileWithUrl 타입과 호환되는지 확인 필요
          // 여기서는 Partial<FileWithUrl>로 취급하여 업데이트
          updateFileInList(
            input.fileId,
            res.data.updateFile.file as Partial<FileWithUrl>
          );
        }
        return res;
      }, '파일 정보 수정에 실패했습니다.'),
    [withLoading, updateFileInList]
  );

  // 파일 검색 (결과를 상태에 반영하도록 수정)
  const searchFiles = useCallback(
    async (
      fileName?: string,
      fileType?: string,
      usageType?: string,
      limit?: number,
      offset?: number
    ) =>
      withLoading(async () => {
        const service = getMediaService();
        const res = await service.searchFiles(
          fileName,
          fileType,
          usageType,
          limit,
          offset
        );

        // ✅ [수정] 검색 성공 시, 현재 파일 목록 상태(files)를 검색 결과로 교체
        if (res.success && res.data?.searchFiles) {
          // 백엔드가 JSON String으로 주는지, 객체로 주는지 확인 필요
          // media-queries.ts를 보면 String으로 반환한다고 되어 있음. 파싱 필요.
          try {
            const parsed =
              typeof res.data.searchFiles === 'string'
                ? JSON.parse(res.data.searchFiles)
                : res.data.searchFiles;

            // parsed 구조: { files: [...], total: number, ... }
            if (parsed.files) {
              // ✅ [보정] 사용자가 입력한 검색어(fileName)가 있다면,
              // originalName에 그 검색어가 포함된 파일만 필터링하여 보여줌
              let resultFiles = parsed.files;
              if (fileName) {
                resultFiles = resultFiles.filter((f: any) =>
                  f.originalName.toLowerCase().includes(fileName.toLowerCase())
                );
              }
              setFiles(resultFiles);
              // 페이지네이션 정보도 업데이트하면 좋음
              setPagination({
                totalCount: parsed.total,
                hasNext: parsed.hasMore,
                limit: limit || 20,
                offset: offset || 0,
              });
            }
          } catch (e) {
            console.error('Failed to parse search results', e);
          }
        }
        return res;
      }, '파일 검색에 실패했습니다.'),
    [withLoading, setFiles, setPagination]
  );

  // 파일 통계
  const getFileStats = useCallback(
    async () =>
      withLoading(
        () => getMediaService().getFileStats(),
        '통계 정보를 불러오는데 실패했습니다.'
      ),
    [withLoading]
  );

  // ✅ [NEW] 스마트 업로드 함수 추가
  const uploadMedia = useCallback(
    async (
      files: File[],
      userId: number, // 👈 추가됨
      usageType = 'OTHER'
    ): Promise<ApiResponse<UploadResponse>> => {
      return withLoading(async () => {
        if (!userId) throw new Error('사용자 ID가 필요합니다.'); // 체크 로직 변경

        const service = getMediaService();
        const meta: UploadMetadata = {
          uploadedBy: String(userId), // 👈 인자로 받은 값 사용
          usageType,
          generateThumbnail: true,
        };

        const videos = files.filter((f) => f.type.startsWith('video/'));
        const others = files.filter((f) => !f.type.startsWith('video/'));

        let finalResponse: ApiResponse<UploadResponse> = {
          success: true,
          data: { success: true },
        };

        if (videos.length > 0) {
          const res =
            videos.length === 1
              ? await service.uploadVideo(videos[0], meta)
              : await service.uploadMultipleVideos(videos, meta);

          if (!res.success) finalResponse = res;
        }

        if (others.length > 0) {
          const res =
            others.length === 1
              ? await service.uploadFile(others[0], meta)
              : await service.uploadMultipleFiles(others, meta);

          if (!res.success) finalResponse = res;
        }

        if (finalResponse.success) {
          // 목록 갱신 시에도 userId 사용
          await loadUserFiles({
            userId,
            limit: context.pagination.limit,
            offset: 0,
          });
        }

        return finalResponse;
      }, '파일 업로드 중 오류가 발생했습니다.');
    },
    [withLoading, loadUserFiles, context.pagination.limit] // currentUser 의존성 제거
  );

  return {
    ...context, // Context 상태 그대로 노출
    loadUserFiles,
    getFile,
    deleteFile,
    updateFile,
    searchFiles,
    getFileStats,
    uploadMedia,
  };
};
