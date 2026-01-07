import { ApiError, ApiErrorCode } from '../errors/api-error';

export interface AvatarServiceConfig {
  maxFileSize: number;
  allowedTypes: string[];
}

export class AvatarService {
  private static instance: AvatarService;
  private config: AvatarServiceConfig;

  private constructor() {
    this.config = {
      maxFileSize: 5 * 1024 * 1024, // 5MB (백엔드와 동일)
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
      ],
    };
  }

  public static getInstance(): AvatarService {
    if (!AvatarService.instance) {
      AvatarService.instance = new AvatarService();
    }
    return AvatarService.instance;
  }

  /**
   * 파일 유효성 검사
   * 실패 시 즉시 ApiError를 던짐
   */
  validateFile(file: File): void {
    if (!file) {
      throw new ApiError(
        '파일이 선택되지 않았습니다.',
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    if (!file.type.startsWith('image/')) {
      throw new ApiError(
        '이미지 파일만 업로드할 수 있습니다.',
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    if (!this.config.allowedTypes.includes(file.type)) {
      throw new ApiError(
        `지원하지 않는 형식입니다. (${this.config.allowedTypes.join(', ')})`,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    if (file.size > this.config.maxFileSize) {
      throw new ApiError(
        `파일 크기는 ${this.formatFileSize(
          this.config.maxFileSize
        )}를 초과할 수 없습니다.`,
        ApiErrorCode.VALIDATION_ERROR
      );
    }
  }
  /**
   * 파일 크기 포맷팅
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// 앱 내부에서 관리하는 Utils
export class AvatarUtils {
  static getAvatarUrl(
    avatarPath: string | null | undefined
  ): string | undefined {
    if (!avatarPath?.trim()) return undefined;
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    const fileServiceUrl = '/api';
    return `${fileServiceUrl}${avatarPath}`;
  }
}

export const avatarService = AvatarService.getInstance();
