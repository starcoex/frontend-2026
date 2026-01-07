import {
  MoreHorizontal,
  File,
  FileText,
  Film,
  Music,
  Archive,
  Trash2,
  Download,
  Share2,
  ChevronRight,
  ImageIcon,
  Edit,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { formatSize } from '@/app/utils/file-utils'; // 유틸 사용
import { toast } from 'sonner';
import { useMedia } from '@starcoex-frontend/media';
import { FileWithUrl } from '@starcoex-frontend/graphql';
import { useState } from 'react';
import { FileEditDialog } from '@/app/pages/dashboard/board/file-manager/components/file-edit-dialog'; // 토스트 알림

function getFileIcon(mimeType: string) {
  if (!mimeType) return <File className="size-4" />;
  if (mimeType.includes('image')) return <ImageIcon className="size-4" />;
  if (mimeType.includes('video')) return <Film className="size-4" />;
  if (mimeType.includes('audio')) return <Music className="size-4" />;
  if (mimeType.includes('pdf') || mimeType.includes('document'))
    return <FileText className="size-4" />;
  if (mimeType.includes('zip') || mimeType.includes('compressed'))
    return <Archive className="size-4" />;
  return <File className="size-4" />;
}

interface TableRecentFilesProps {
  limit?: number;
  showViewAll?: boolean;
  // ✅ [수정] files와 isLoading을 optional prop으로 추가
  files?: FileWithUrl[];
  isLoading?: boolean;
  filterType?: string | null; // ✅ 필터 타입 prop 확인
}

export function TableRecentFiles({
  limit,
  showViewAll = true,
  // ✅ [수정] props 구조 분해 할당 및 기본값 설정
  files: propFiles,
  isLoading: propIsLoading,
  filterType = null, // ✅
}: TableRecentFilesProps) {
  // useLoyalty 훅 사용 (deleteFile 등 액션은 항상 필요하므로 호출)
  const {
    files: contextFiles,
    deleteFile,
    isLoading: contextIsLoading,
  } = useMedia();
  const navigate = useNavigate();
  const [editingFile, setEditingFile] = useState<FileWithUrl | null>(null);

  // ✅ [수정] Props가 있으면 그것을 사용하고, 없으면 Context 데이터 사용
  const filesToDisplay = propFiles || contextFiles;
  const isDataLoading =
    propIsLoading !== undefined ? propIsLoading : contextIsLoading;

  // ✅ [추가] 강제 다운로드 핸들러
  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      toast.info('다운로드를 시작합니다...');

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName; // 여기서 파일명 지정

      document.body.appendChild(a);
      a.click();

      // 정리
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('다운로드가 완료되었습니다.');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('파일 다운로드에 실패했습니다.');
      // 실패 시 새 탭으로 열기 (Fallback)
      window.open(fileUrl, '_blank');
    }
  };

  // 파일 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 파일을 삭제하시겠습니까?')) {
      const res = await deleteFile({ fileId: id });
      if (res.success) {
        toast.success('파일이 삭제되었습니다.');
      } else {
        toast.error(res.error?.message || '삭제 실패');
      }
    }
  };

  // 파일 공유 핸들러 (클립보드 복사)
  const handleShare = async (fileUrl: string) => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      toast.success('파일 링크가 클립보드에 복사되었습니다.');
    } catch (err) {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  // ✅ View All 클릭 핸들러
  const handleViewAll = () => {
    const baseUrl = '/admin/media/recent';
    // filterType이 있으면 쿼리 파라미터 추가
    const url = filterType ? `${baseUrl}?type=${filterType}` : baseUrl;
    navigate(url);
  };

  // ✅ [수정] displayFiles 계산 시 filesToDisplay 사용
  const displayFiles = limit ? filesToDisplay.slice(0, limit) : filesToDisplay;

  // ✅ [수정] 로딩 체크 시 isDataLoading 사용
  if (isDataLoading && filesToDisplay.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Loading files...
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="relative">
          <CardTitle>Uploaded Files</CardTitle>
          {showViewAll && (
            <CardAction className="relative">
              <div className="absolute end-0 top-0">
                <Button
                  variant="outline"
                  onClick={handleViewAll} // ✅ 핸들러 연결
                >
                  <span className="hidden lg:inline">View All</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="lg:w-[300px]">Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No files found.
                  </TableCell>
                </TableRow>
              ) : (
                displayFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={file.fileUrl ?? '#'}
                        target="_blank"
                        className="text-muted-foreground hover:text-primary flex items-center space-x-2 hover:underline"
                      >
                        {getFileIcon(
                          file.mimeType ?? 'application/octet-stream'
                        )}
                        <span
                          className="truncate max-w-[200px]"
                          title={file.originalName ?? 'Unknown File'}
                        >
                          {file.originalName}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>{formatSize(file.fileSize ?? 0)}</TableCell>
                    <TableCell>
                      {format(new Date(file.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Download Action */}
                          {/* ✅ Download Action 수정 */}
                          <DropdownMenuItem
                            onClick={() =>
                              handleDownload(
                                file.fileUrl ?? '#',
                                file.originalName ?? 'Unknown File'
                              )
                            }
                          >
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>

                          {/* ✅ Edit Action 추가 */}
                          <DropdownMenuItem
                            onClick={() => setEditingFile(file)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Info</span>
                          </DropdownMenuItem>

                          {/* Share Action */}
                          <DropdownMenuItem
                            onClick={() =>
                              handleShare(file.fileUrl ?? 'Unknown File')
                            }
                          >
                            <Share2 className="mr-2 h-4 w-4" />
                            <span>Copy Link</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {/* Delete Action */}
                          <DropdownMenuItem
                            onClick={() => handleDelete(file.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* ✅ 다이얼로그 렌더링 */}
      <FileEditDialog
        file={editingFile}
        open={!!editingFile}
        onOpenChange={(open) => !open && setEditingFile(null)}
      />
    </>
  );
}
