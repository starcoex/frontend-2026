// 백엔드 응답 타입 정의
export interface UploadResponse {
  success: boolean;
  fileId?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  message?: string;
  files?: Array<{ fileId: string; fileUrl: string; originalName: string }>;
  results?: Array<{
    success: boolean;
    fileId?: string;
    fileUrl?: string;
    error?: string;
  }>; // 비디오 다중 업로드 응답
  successCount?: number;
  errorCount?: number;
  errors?: Array<{ fileName: string; error: string }>;
}

export interface UploadMetadata {
  uploadedBy: string;
  usageType?: string;
  entityId?: string;
  generateThumbnail?: boolean; // 비디오용
}
