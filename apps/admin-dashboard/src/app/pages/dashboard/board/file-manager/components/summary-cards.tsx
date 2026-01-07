import { FileText, Video, File, ImageIcon } from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import React, { useMemo } from 'react';
import CountAnimation from '@/components/count-animation';
import { useMedia } from '@starcoex-frontend/media';
import { formatSize, getPercent } from '@/app/utils/file-utils';

interface SummaryItem {
  type: string;
  icon: React.ReactNode;
  count: number;
  size: number;
  color: string;
  indicatorColor: string;
}

export function SummaryCards() {
  const { files } = useMedia();

  // 파일 데이터 집계
  const stats = useMemo(() => {
    const initial = {
      images: { count: 0, size: 0 },
      videos: { count: 0, size: 0 },
      docs: { count: 0, size: 0 },
      others: { count: 0, size: 0 },
      totalSize: 0,
    };

    return files.reduce((acc, file) => {
      const size = file.fileSize ?? 0; // 기본값 0
      const mime = file.mimeType ?? ''; // 기본값 빈 문자열

      acc.totalSize += size;

      if (mime.includes('image')) {
        acc.images.count++;
        acc.images.size += size;
      } else if (mime.includes('video')) {
        acc.videos.count++;
        acc.videos.size += size;
      } else if (mime.includes('pdf') || mime.includes('document')) {
        acc.docs.count++;
        acc.docs.size += size;
      } else {
        acc.others.count++;
        acc.others.size += size;
      }
      return acc;
    }, initial);
  }, [files]);

  const data: SummaryItem[] = [
    {
      type: 'Documents',
      icon: <FileText className="size-6" />,
      count: stats.docs.count,
      size: stats.docs.size,
      color: 'text-blue-500',
      indicatorColor: 'bg-blue-500',
    },
    {
      type: 'Images',
      icon: <ImageIcon className="size-6" />,
      count: stats.images.count,
      size: stats.images.size,
      color: 'text-green-500',
      indicatorColor: 'bg-green-500',
    },
    {
      type: 'Videos',
      icon: <Video className="size-6" />,
      count: stats.videos.count,
      size: stats.videos.size,
      color: 'text-red-500',
      indicatorColor: 'bg-red-500',
    },
    {
      type: 'Others',
      icon: <File className="size-6" />,
      count: stats.others.count,
      size: stats.others.size,
      color: 'text-yellow-500',
      indicatorColor: 'bg-yellow-500',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item, key) => {
        const usagePercentage = getPercent(item.size);
        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{item.type}</CardTitle>
              <CardAction>
                <span className={item.color}>{item.icon}</span>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-semibold lg:text-3xl">
                <CountAnimation number={item.count} />
              </div>
              <div className="space-y-2">
                <div className="text-muted-foreground text-sm">
                  {formatSize(item.size)} used
                </div>
                <Progress
                  value={usagePercentage}
                  indicatorColor={item.indicatorColor}
                />
                <div className="text-muted-foreground text-sm">
                  {usagePercentage.toFixed(1)}% of limit
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
