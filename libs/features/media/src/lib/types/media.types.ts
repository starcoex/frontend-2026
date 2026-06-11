import type { ApiResponse } from '../types';
import {
  DeleteFileInput,
  DeleteFileMutation,
  GetFileInput,
  GetFileQuery,
  GetFileStatsQuery,
  GetUserFilesInput,
  GetUserFilesQuery,
  SearchFilesQuery,
  UpdateFileInput,
  UpdateFileMutation,
} from '@starcoex-frontend/graphql';

// ✅ 스키마 기반 검색 파라미터 타입
export interface SearchFilesParams {
  fileName?: string;
  fileType?: string; // IMAGE | VIDEO | AUDIO | DOCUMENT | OTHER
  mimeType?: string;
  extension?: string;
  description?: string;
  usageType?: string;
  entityId?: string;
  storageType?: string;
  status?: string;
  minFileSize?: number; // bytes
  maxFileSize?: number; // bytes
  startDate?: string; // ISO 날짜 문자열
  endDate?: string;
  hasVideoMetadata?: boolean;
  hasThumbnail?: boolean;
  orderBy?: string; // 'createdAt' | 'fileSize' | 'originalName'
  orderDir?: string; // 'asc' | 'desc'
  limit?: number;
  offset?: number;
}

export interface IMediaService {
  getFile(input: GetFileInput): Promise<ApiResponse<GetFileQuery>>;
  getUserFiles(
    input: GetUserFilesInput
  ): Promise<ApiResponse<GetUserFilesQuery>>;
  getFileStats(): Promise<ApiResponse<GetFileStatsQuery>>;
  searchFiles(
    params: SearchFilesParams
  ): Promise<ApiResponse<SearchFilesQuery>>;
  deleteFile(input: DeleteFileInput): Promise<ApiResponse<DeleteFileMutation>>;
  updateFile(input: UpdateFileInput): Promise<ApiResponse<UpdateFileMutation>>;
}
