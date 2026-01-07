import { Folder } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
import { useMedia } from '@starcoex-frontend/media';
import { cn } from '@/lib/utils';

interface FolderListCardsProps {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export function FolderListCards({
  activeFilter,
  onFilterChange,
}: FolderListCardsProps) {
  const { files } = useMedia();

  const folders = useMemo(() => {
    // Audio 제거, Others에 포함하거나 아예 집계에서 제외
    const groups = {
      Documents: 0,
      Images: 0,
      Videos: 0,
      Others: 0, // Audio는 Others로 통합
    };

    files.forEach((f) => {
      const mime = f.mimeType || '';
      if (mime.includes('image')) groups.Images++;
      else if (mime.includes('video')) groups.Videos++;
      else if (
        mime.includes('pdf') ||
        mime.includes('document') ||
        mime.includes('text')
      )
        groups.Documents++;
      else groups.Others++;
    });

    return Object.entries(groups).map(([name, count], idx) => ({
      id: name, // id를 이름으로 사용
      name,
      items: count,
    }));
  }, [files]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {folders.map((folder) => (
        <Card
          key={folder.id}
          className={cn(
            'hover:bg-accent/50 transition-colors cursor-pointer border-2',
            activeFilter === folder.name
              ? 'border-primary bg-accent/20'
              : 'border-transparent'
          )}
          onClick={() =>
            onFilterChange(activeFilter === folder.name ? null : folder.name)
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex gap-2 items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder
                  className={cn(
                    'size-4',
                    activeFilter === folder.name
                      ? 'text-primary fill-primary/20'
                      : 'text-yellow-500'
                  )}
                />
                <h3 className="leading-none font-semibold tracking-tight text-base">
                  {folder.name}
                </h3>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {folder.items} items
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
