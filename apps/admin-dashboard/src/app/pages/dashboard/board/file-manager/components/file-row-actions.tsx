import { useState } from 'react';
import { MoreHorizontal, Download, Edit, Share2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileWithUrl } from '@starcoex-frontend/graphql';
import { useMedia } from '@starcoex-frontend/media';
import { FileEditDialog } from './file-edit-dialog';

export function FileRowActions({ file }: { file: FileWithUrl }) {
  const { deleteFile } = useMedia();
  const [editOpen, setEditOpen] = useState(false);

  const handleDownload = async () => {
    try {
      toast.info('다운로드를 시작합니다...');
      const response = await fetch(file.fileUrl ?? '#');
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName ?? 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('다운로드가 완료되었습니다.');
    } catch {
      toast.error('파일 다운로드에 실패했습니다.');
      window.open(file.fileUrl ?? '#', '_blank');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(file.fileUrl ?? '');
      toast.success('파일 링크가 클립보드에 복사되었습니다.');
    } catch {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 파일을 삭제하시겠습니까?')) return;
    const res = await deleteFile({ fileId: file.id });
    if (res.success) {
      toast.success('파일이 삭제되었습니다.');
    } else {
      toast.error(res.error?.message || '삭제 실패');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            다운로드
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            정보 수정
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            링크 복사
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <FileEditDialog file={file} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
