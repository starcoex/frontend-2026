import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableRecentFiles } from '../components/table-recent-files';
import { ArrowLeft, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function StorageAnalysisPage() {
  // ✅ isLoading 추가
  const { loadUserFiles, files, initialized, isLoading } = useMedia();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !initialized) {
      loadUserFiles({ userId: currentUser.id, limit: 100 });
    }
  }, [currentUser, loadUserFiles, initialized]);

  // 용량 큰 순서로 정렬 (Top 20)
  const largeFiles = useMemo(() => {
    return [...files]
      .sort((a, b) => (b.fileSize ?? 0) - (a.fileSize ?? 0))
      .slice(0, 20);
  }, [files]);

  const totalSize = useMemo(
    () => files.reduce((acc, curr) => acc + (curr.fileSize ?? 0), 0),
    [files]
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Storage Analysis
          </h1>
          <p className="text-muted-foreground">
            Identify files taking up the most space.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Used Space
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatSize(totalSize)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{files.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Largest File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {largeFiles.length > 0
                ? formatSize(largeFiles[0].fileSize ?? 0)
                : '0 B'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Top Space Consumers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ 계산된 largeFiles와 로딩 상태를 전달 */}
          <TableRecentFiles
            limit={20}
            showViewAll={false}
            files={largeFiles}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
