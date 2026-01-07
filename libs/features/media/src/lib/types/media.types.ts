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

export interface IMediaService {
  getFile(input: GetFileInput): Promise<ApiResponse<GetFileQuery>>;
  getUserFiles(
    input: GetUserFilesInput
  ): Promise<ApiResponse<GetUserFilesQuery>>;
  getFileStats(): Promise<ApiResponse<GetFileStatsQuery>>;
  searchFiles(
    fileName?: string,
    fileType?: string,
    usageType?: string,
    limit?: number,
    offset?: number
  ): Promise<ApiResponse<SearchFilesQuery>>;
  deleteFile(input: DeleteFileInput): Promise<ApiResponse<DeleteFileMutation>>;
  updateFile(input: UpdateFileInput): Promise<ApiResponse<UpdateFileMutation>>;
}
