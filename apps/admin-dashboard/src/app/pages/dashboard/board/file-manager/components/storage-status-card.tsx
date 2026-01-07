import { ChevronRight } from 'lucide-react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useMedia } from '@starcoex-frontend/media';
import { useMemo } from 'react';
import { formatSize, getPercent } from '@/app/utils/file-utils';
import { TOTAL_LIMIT } from '@/app/constants/storage';

export function StorageStatusCard() {
  const { files } = useMedia();

  // 현재 사용량 계산
  const usedSize = useMemo(() => {
    return files.reduce((acc, file) => acc + (file.fileSize ?? 0), 0);
  }, [files]);

  // 전체 용량 대비 사용 퍼센트 (TOTAL_LIMIT 기준)
  const usedPercentage = getPercent(usedSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Space Used</CardTitle>
        <CardDescription>See your remaining file storage</CardDescription>
        <CardAction>
          <Button size="icon" variant="outline">
            <ChevronRight />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-muted-foreground flex justify-between text-sm">
            <span>{formatSize(usedSize)} used</span>
            <span>{formatSize(TOTAL_LIMIT)} total</span>
          </div>
          <Progress value={usedPercentage} className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
