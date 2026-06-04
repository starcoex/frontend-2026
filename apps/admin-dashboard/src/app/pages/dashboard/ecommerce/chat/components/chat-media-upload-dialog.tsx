import React, { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, FileIcon, VideoIcon, Loader2, Trash2 } from 'lucide-react';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// ── 파일 미리보기 타입 ─────────────────────────────────────────────────────────

interface PreviewFile {
  file: File;
  previewUrl: string | null;
  type: 'image' | 'video' | 'file';
}

function getFileType(file: File): PreviewFile['type'] {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return 'file';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface ChatMediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 업로드 완료 후 URL을 반환 — 메시지 전송에 사용 */
  onUploaded?: (urls: string[]) => void;
}

// ── 컴포넌트 ───────────────────────────────────────────────────────────────────

export function ChatMediaUploadDialog({
  open,
  onOpenChange,
  onUploaded,
}: ChatMediaUploadDialogProps) {
  const { uploadMedia, isLoading } = useMedia();
  const { currentUser } = useAuth();

  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    if (isLoading) return;
    setPreviews([]);
    setUploadProgress(0);
    onOpenChange(false);
  };

  // 파일 추가
  const addFiles = useCallback((files: File[]) => {
    const MAX_SIZE_MB = 50;
    const ALLOWED_TYPES = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
      'application/zip',
    ];

    const valid = files.filter((f) => {
      if (!ALLOWED_TYPES.includes(f.type)) {
        toast.warning(`${f.name}: 지원하지 않는 파일 형식입니다.`);
        return false;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.warning(
          `${f.name}: 파일 크기는 ${MAX_SIZE_MB}MB 이하여야 합니다.`
        );
        return false;
      }
      return true;
    });

    const newPreviews: PreviewFile[] = valid.map((file) => {
      const type = getFileType(file);
      const previewUrl = type === 'image' ? URL.createObjectURL(file) : null;
      return { file, previewUrl, type };
    });

    setPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  // 파일 제거
  const removeFile = useCallback((index: number) => {
    setPreviews((prev) => {
      const target = prev[index];
      if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  // 드래그 앤 드롭
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    },
    [addFiles]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // 업로드
  const handleUpload = async () => {
    if (previews.length === 0 || !currentUser?.id) return;

    // 진행률 시뮬레이션 (실제 progress 이벤트가 없는 경우)
    let progress = 0;
    const timer = setInterval(() => {
      progress = Math.min(progress + 10, 85);
      setUploadProgress(progress);
    }, 200);

    try {
      const files = previews.map((p) => p.file);
      const res = await uploadMedia(files, currentUser?.id as number, 'CHAT');

      clearInterval(timer);
      setUploadProgress(100);

      if (res.success) {
        toast.success(`${files.length}개 파일이 업로드되었습니다.`);

        // 업로드된 파일 URL 추출 (서비스 응답 구조에 따라 조정)
        const uploadedUrls: string[] = [];
        if (res.data) {
          const data = res.data as any;
          if (Array.isArray(data.files)) {
            // ✅ products와 동일한 구조: f.fileUrl 사용
            data.files.forEach((f: any) => {
              if (f.fileUrl) uploadedUrls.push(f.fileUrl);
            });
          } else if (data.fileUrl) {
            // ✅ 단일 파일 응답
            uploadedUrls.push(data.fileUrl);
          }
        }

        onUploaded?.(uploadedUrls);
        handleClose();
      } else {
        toast.error(res.error?.message ?? '업로드에 실패했습니다.');
        setUploadProgress(0);
      }
    } catch {
      clearInterval(timer);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>미디어 업로드</DialogTitle>
        </DialogHeader>

        {/* 드래그 앤 드롭 영역 */}
        <div
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="text-muted-foreground mb-2 size-8" />
          <p className="text-sm font-medium">클릭하거나 파일을 드래그하세요</p>
          <p className="text-muted-foreground mt-1 text-xs">
            이미지, 동영상, PDF, ZIP (최대 50MB)
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.zip"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              addFiles(files);
              e.target.value = '';
            }}
          />
        </div>

        {/* 선택된 파일 목록 */}
        {previews.length > 0 && (
          <ScrollArea className="max-h-52">
            <div className="space-y-2 pr-2">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-md border p-2"
                >
                  {/* 썸네일 */}
                  <div className="size-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {preview.type === 'image' && preview.previewUrl ? (
                      <img
                        src={preview.previewUrl}
                        alt={preview.file.name}
                        className="size-full object-cover"
                      />
                    ) : preview.type === 'video' ? (
                      <div className="flex size-full items-center justify-center">
                        <VideoIcon className="size-5 text-blue-500" />
                      </div>
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <FileIcon className="size-5 text-orange-500" />
                      </div>
                    )}
                  </div>

                  {/* 파일 정보 */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {preview.file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {formatFileSize(preview.file.size)}
                      </span>
                      <Badge variant="outline" className="h-4 text-xs">
                        {preview.type === 'image'
                          ? '이미지'
                          : preview.type === 'video'
                          ? '동영상'
                          : '파일'}
                      </Badge>
                    </div>
                  </div>

                  {/* 제거 버튼 */}
                  <Button
                    aria-label="파일 제거"
                    size="icon"
                    variant="ghost"
                    className="size-7 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    disabled={isLoading}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* 업로드 진행률 */}
        {isLoading && uploadProgress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">업로드 중...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-1.5" />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            취소
          </Button>
          <Button
            onClick={handleUpload}
            disabled={previews.length === 0 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="mr-2 size-4" />
                업로드 ({previews.length}개)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
