import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_FILE,
  GET_USER_FILES,
  GET_FILE_STATS,
  SEARCH_FILES,
  DELETE_FILE,
  UpdateFileInput,
  UpdateFileMutation,
  UpdateFileMutationVariables,
} from '@starcoex-frontend/graphql';
import {
  // 생성된 타입들이라고 가정합니다.
  GetFileQuery,
  GetFileQueryVariables,
  GetUserFilesQuery,
  GetUserFilesQueryVariables,
  GetFileStatsQuery,
  SearchFilesQuery,
  SearchFilesQueryVariables,
  DeleteFileMutation,
  DeleteFileMutationVariables,
  GetFileInput,
  GetUserFilesInput,
  DeleteFileInput,
} from '@starcoex-frontend/graphql'; // 실제 타입 경로로 수정 필요
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors'; // Auth와 동일한 에러 유틸 사용 가정
import {
  ApiResponse,
  IMediaService,
  UploadMetadata,
  UploadResponse,
} from '../types';

export class MediaService implements IMediaService {
  // Vite Proxy 설정에 따라 '/api' 프리픽스 사용
  private readonly apiBaseUrl = '/api';

  constructor(private client: ApolloClient) {}

  // 공통 mutation helper (AddressService 참조)
  private async mutate<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(mutation: any, variables: TVars): Promise<ApiResponse<TData>> {
    try {
      const { data, error, extensions } = await this.client.mutate<
        TData,
        TVars
      >({
        mutation,
        variables,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: (extensions ?? {}) as Record<string, unknown>,
        };
        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // 공통 query helper (AddressService 참조)
  private async query<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(query: any, variables?: TVars): Promise<ApiResponse<TData>> {
    try {
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      } as any);

      const { data, error, extensions } = result as {
        data?: TData;
        error?: { message?: string };
        extensions?: Record<string, unknown>;
      };

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: extensions ?? {},
        };
        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  async getFile(input: GetFileInput): Promise<ApiResponse<GetFileQuery>> {
    return this.query<GetFileQuery, GetFileQueryVariables>(GET_FILE, { input });
  }

  async getUserFiles(
    input: GetUserFilesInput
  ): Promise<ApiResponse<GetUserFilesQuery>> {
    return this.query<GetUserFilesQuery, GetUserFilesQueryVariables>(
      GET_USER_FILES,
      { input }
    );
  }

  async getFileStats(): Promise<ApiResponse<GetFileStatsQuery>> {
    return this.query<GetFileStatsQuery>(GET_FILE_STATS);
  }

  async searchFiles(
    fileName?: string,
    fileType?: string,
    usageType?: string,
    limit?: number,
    offset?: number
  ): Promise<ApiResponse<SearchFilesQuery>> {
    return this.query<SearchFilesQuery, SearchFilesQueryVariables>(
      SEARCH_FILES,
      {
        fileName,
        fileType,
        usageType,
        limit,
        offset,
      }
    );
  }

  async deleteFile(
    input: DeleteFileInput
  ): Promise<ApiResponse<DeleteFileMutation>> {
    return this.mutate<DeleteFileMutation, DeleteFileMutationVariables>(
      DELETE_FILE,
      { input }
    );
  }

  async updateFile(
    input: UpdateFileInput
  ): Promise<ApiResponse<UpdateFileMutation>> {
    return this.mutate<UpdateFileMutation, UpdateFileMutationVariables>(
      DELETE_FILE,
      { input }
    );
  }

  // 🚀 [REST] 공통 Fetch 래퍼 (HttpOnly 쿠키 지원)
  private async uploadFetch(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<UploadResponse>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        credentials: 'include', // ✅ HttpOnly 쿠키 자동 전송
        body: formData, // Content-Type 자동 설정
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(
          errorData.message || `Upload failed: ${response.status}`
        );
      }

      const result = (await response.json()) as UploadResponse;
      return {
        success: result.success,
        data: result,
        message: result.message,
      };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<UploadResponse>(apiError);
    }
  }

  /**
   * 1. 일반 단일 파일 업로드
   * POST /minio/upload
   */
  async uploadFile(
    file: File,
    meta: UploadMetadata
  ): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    this.appendMetadata(formData, meta);
    return this.uploadFetch('/minio/upload', formData);
  }

  /**
   * 2. 일반 다중 파일 업로드
   * POST /minio/uploads
   */
  async uploadMultipleFiles(
    files: File[],
    meta: UploadMetadata
  ): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    this.appendMetadata(formData, meta);
    return this.uploadFetch('/minio/uploads', formData);
  }

  /**
   * 3. 동영상 단일 업로드
   * POST /minio/video/upload
   */
  async uploadVideo(
    file: File,
    meta: UploadMetadata
  ): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    this.appendMetadata(formData, meta);
    return this.uploadFetch('/minio/video/upload', formData);
  }

  /**
   * 4. 동영상 다중 업로드
   * POST /minio/video/uploads
   */
  async uploadMultipleVideos(
    files: File[],
    meta: UploadMetadata
  ): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    this.appendMetadata(formData, meta);
    return this.uploadFetch('/minio/video/uploads', formData);
  }

  // 메타데이터 추가 헬퍼
  private appendMetadata(formData: FormData, meta: UploadMetadata) {
    if (meta.uploadedBy) formData.append('uploadedBy', meta.uploadedBy);
    if (meta.usageType) formData.append('usageType', meta.usageType || 'OTHER');
    if (meta.entityId) formData.append('entityId', meta.entityId);
    if (meta.generateThumbnail !== undefined) {
      formData.append('generateThumbnail', String(meta.generateThumbnail));
    }
  }
}
