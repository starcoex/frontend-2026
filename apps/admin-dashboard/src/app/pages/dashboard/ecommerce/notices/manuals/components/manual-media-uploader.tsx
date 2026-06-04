import React, { useCallback, useState } from 'react';
import {
  ImageIcon,
  UploadIcon,
  XIcon,
  Film,
  AlertCircleIcon,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

interface ManualMediaUploaderProps {
  label: string;
  accept: string;
  mediaType: 'image' | 'video';
  files: MediaFile[];
  maxCount?: number;
  maxSizeMB?: number;
  isUploading?: boolean;
  onChange: (files: MediaFile[]) => void;
}

export function ManualMediaUploader({
  label,
  accept,
  mediaType,
  files,
  maxCount = 10,
  maxSizeMB = 100,
  isUploading = false,
  onChange,
}: ManualMediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes)
        return `파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`;
      if (mediaType === 'image' && !file.type.startsWith('image/'))
        return '이미지 파일만 업로드 가능합니다.';
      if (mediaType === 'video' && !file.type.startsWith('video/'))
        return '동영상 파일만 업로드 가능합니다.';
      return null;
    },
    [mediaType, maxSizeMB]
  );

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null);
      const arr = Array.from(newFiles);
      if (files.length + arr.length > maxCount) {
        setError(`최대 ${maxCount}개까지 업로드할 수 있습니다.`);
        return;
      }
      const valid: MediaFile[] = [];
      for (const file of arr) {
        const err = validateFile(file);
        if (err) {
          setError(err);
          return;
        }
        valid.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          type: mediaType,
        });
      }
      onChange([...files, ...valid]);
    },
    [files, maxCount, mediaType, validateFile, onChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      const target = files.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      onChange(files.filter((f) => f.id !== id));
    },
    [files, onChange]
  );

  const openDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = true;
    input.onchange = (e) => {
      const t = e.target as HTMLInputElement;
      if (t.files?.length) addFiles(t.files);
    };
    input.click();
  }, [accept, addFiles]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  return (
    <div className="space-y-2">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'border-input relative flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors',
          isDragging && 'bg-accent/50',
          files.length > 0 && 'min-h-fit items-start justify-start'
        )}
      >
        {files.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="bg-background flex size-10 items-center justify-center rounded-full border">
              {mediaType === 'image' ? (
                <ImageIcon className="size-4 opacity-60" />
              ) : (
                <Film className="size-4 opacity-60" />
              )}
            </div>
            <p className="text-sm font-medium">{label}을 여기에 드롭하세요</p>
            <p className="text-muted-foreground text-xs">
              최대 {maxCount}개, {maxSizeMB}MB 이하
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openDialog}
              disabled={isUploading}
            >
              <UploadIcon className="mr-1 size-3.5 opacity-60" />
              {label} 선택
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {label} ({files.length}/{maxCount})
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openDialog}
                disabled={files.length >= maxCount || isUploading}
              >
                <UploadIcon className="mr-1 size-3.5" />더 추가
              </Button>
            </div>

            {mediaType === 'image' ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="bg-accent relative aspect-square rounded-md border"
                  >
                    <img
                      src={f.preview}
                      alt={f.file.name}
                      className="size-full rounded-[inherit] object-cover"
                    />
                    <Button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      size="icon"
                      className="border-background absolute -right-2 -top-2 size-5 rounded-full border-2 shadow-none"
                      disabled={isUploading}
                    >
                      <XIcon className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="bg-muted flex items-center justify-between rounded-md px-3 py-2 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Film className="size-4 shrink-0 opacity-60" />
                      <span className="truncate">{f.file.name}</span>
                      <span className="text-muted-foreground shrink-0 text-xs">
                        ({(f.file.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0"
                      onClick={() => removeFile(f.id)}
                      disabled={isUploading}
                    >
                      <XIcon className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/20">
            <Loader2 className="text-primary size-6 animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <div className="text-destructive flex items-center gap-1 text-xs">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
