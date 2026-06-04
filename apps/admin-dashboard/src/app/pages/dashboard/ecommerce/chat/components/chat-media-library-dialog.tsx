import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Trash2,
  Download,
  VideoIcon,
  FileIcon,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function getFileTypeLabel(mimeType: string): string {
  if (mimeType?.startsWith('image/')) return '이미지';
  if (mimeType?.startsWith('video/')) return '동영상';
  if (mimeType === 'application/pdf') return 'PDF';
  return '파일';
}

interface ChatMediaLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 파일 선택 시 URL 반환 */
  onSelect?: (url: string, fileName: string) => void;
}

export function ChatMediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
}: ChatMediaLibraryDialogProps) {
  const {
    files,
    isLoading,
    pagination,
    loadUserFiles,
    deleteFile,
    searchFiles,
  } = useMedia();
  const { currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 파일 목록 초기 로드
  useEffect(() => {
    if (open && currentUser?.id) {
      loadUserFiles({ userId: currentUser.id, limit: 20, offset: 0 });
    }
  }, [open, currentUser?.id, loadUserFiles]);

  // 검색
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      if (value.trim()) {
        searchFiles(value.trim(), undefined, 'CHAT', 20, 0);
      } else if (currentUser?.id) {
        loadUserFiles({ userId: currentUser.id, limit: 20, offset: 0 });
      }
    },
    [searchFiles, loadUserFiles, currentUser?.id]
  );

  // 더 불러오기
  const handleLoadMore = useCallback(() => {
    if (!currentUser?.id || !pagination.hasNext) return;
    loadUserFiles({
      userId: currentUser.id,
      limit: pagination.limit,
      offset: pagination.offset + pagination.limit,
    });
  }, [currentUser?.id, pagination, loadUserFiles]);

  // 파일 삭제
  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await deleteFile({ fileId: deleteTargetId });
      if (res.success) {
        toast.success('파일이 삭제되었습니다.');
      } else {
        toast.error(res.error?.message ?? '파일 삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const handleClose = () => {
    setSearch('');
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>미디어 라이브러리</DialogTitle>
          </DialogHeader>

          {/* 검색 */}
          <div className="relative">
            <Search className="text-muted-foreground absolute start-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              aria-label="파일명으로 검색..."
              className="ps-9"
              placeholder="파일명으로 검색..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          {/* 파일 목록 */}
          {isLoading && files.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="text-primary size-6 animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
              파일이 없습니다.
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="grid grid-cols-2 gap-3 pr-2 sm:grid-cols-3">
                {files.map((file: any) => {
                  const isImage = file.mimeType?.startsWith('image/');
                  const isVideo = file.mimeType?.startsWith('video/');
                  const fileUrl = file.url ?? file.fileUrl ?? '';

                  return (
                    <div
                      key={file.id ?? file.fileId}
                      className="group relative overflow-hidden rounded-lg border"
                    >
                      {/* 미리보기 */}
                      <div
                        className={cn(
                          'bg-muted flex aspect-video cursor-pointer items-center justify-center overflow-hidden',
                          onSelect && 'hover:opacity-90 transition-opacity'
                        )}
                        onClick={() => {
                          if (onSelect && fileUrl) {
                            onSelect(
                              fileUrl,
                              file.originalName ?? file.fileName ?? ''
                            );
                            handleClose();
                          }
                        }}
                      >
                        {isImage && fileUrl ? (
                          <img
                            src={fileUrl}
                            alt={file.originalName}
                            className="size-full object-cover"
                          />
                        ) : isVideo ? (
                          <VideoIcon className="size-8 text-blue-400 opacity-60" />
                        ) : (
                          <FileIcon className="size-8 text-orange-400 opacity-60" />
                        )}
                      </div>

                      {/* 파일 정보 */}
                      <div className="p-2">
                        <p className="truncate text-xs font-medium">
                          {file.originalName ?? file.fileName ?? '파일'}
                        </p>
                        <div className="mt-0.5 flex items-center justify-between">
                          <Badge variant="outline" className="h-4 text-xs">
                            {getFileTypeLabel(file.mimeType ?? '')}
                          </Badge>
                          {file.fileSize && (
                            <span className="text-muted-foreground text-xs">
                              {formatFileSize(file.fileSize)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 액션 버튼 (hover) */}
                      <div className="absolute right-1 top-1 hidden gap-1 group-hover:flex">
                        {fileUrl && (
                          <Button
                            aria-label="파일 다운로드"
                            size="icon"
                            variant="secondary"
                            className="size-6"
                            asChild
                          >
                            <a
                              href={fileUrl}
                              download={file.originalName}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download className="size-3" />
                            </a>
                          </Button>
                        )}
                        <Button
                          aria-label="파일 삭제"
                          size="icon"
                          variant="destructive"
                          className="size-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetId(file.id ?? file.fileId);
                          }}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 더 불러오기 */}
              {pagination.hasNext && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    더 보기
                  </Button>
                </div>
              )}
            </ScrollArea>
          )}

          {/* 하단 통계 */}
          {files.length > 0 && (
            <p className="text-muted-foreground text-xs">
              전체 {pagination.totalCount}개 중 {files.length}개 표시
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 */}
      <AlertDialog
        open={!!deleteTargetId}
        onOpenChange={(v) => !v && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>파일 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 파일을 삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
