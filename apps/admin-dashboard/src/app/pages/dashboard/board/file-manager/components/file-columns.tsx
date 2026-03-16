import { ColumnDef } from '@tanstack/react-table';
import { FileWithUrl } from '@starcoex-frontend/graphql';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { formatSize } from '@/app/utils/file-utils';
import { DataTableColumnHeader } from '@/app/pages/dashboard/ecommerce/orders/components/data-table-column-header';
import { FileRowActions } from './file-row-actions';
import { File, FileText, Film, Music, Archive, ImageIcon } from 'lucide-react';

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

export const fileColumns: ColumnDef<FileWithUrl>[] = [
  {
    accessorKey: 'originalName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="파일명" />
    ),
    cell: ({ row }) => (
      <Link
        to={row.original.fileUrl ?? '#'}
        target="_blank"
        className="text-muted-foreground hover:text-primary flex items-center gap-2 hover:underline"
      >
        {getFileIcon(row.original.mimeType ?? '')}
        <span
          className="max-w-[200px] truncate"
          title={row.original.originalName ?? ''}
        >
          {row.original.originalName}
        </span>
      </Link>
    ),
  },
  {
    accessorKey: 'mimeType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="유형" />
    ),
    cell: ({ row }) => {
      const mime = row.original.mimeType ?? '';
      if (mime.includes('image'))
        return <span className="text-xs">이미지</span>;
      if (mime.includes('video'))
        return <span className="text-xs">동영상</span>;
      if (mime.includes('audio'))
        return <span className="text-xs">오디오</span>;
      if (mime.includes('pdf') || mime.includes('document'))
        return <span className="text-xs">문서</span>;
      return <span className="text-xs">기타</span>;
    },
    filterFn: (row, id, value: string[]) =>
      !value?.length ||
      value.some((v) => (row.getValue(id) as string)?.includes(v)),
  },
  {
    accessorKey: 'fileSize',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="크기" />
    ),
    cell: ({ row }) => formatSize(row.original.fileSize ?? 0),
    sortingFn: 'basic',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="업로드일" />
    ),
    cell: ({ row }) =>
      format(new Date(row.original.createdAt), 'yyyy.MM.dd HH:mm'),
    sortingFn: 'datetime',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <FileRowActions file={row.original} />,
  },
];
