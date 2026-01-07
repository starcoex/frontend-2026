import * as React from 'react';
import {
  FileIcon,
  FileVideo,
  Loader2,
  PlusCircle,
  Upload,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import { toast } from 'sonner';

export function FileUploadDialog() {
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragActive, setDragActive] = React.useState(false);

  // ✅ 두 훅을 모두 사용
  const { uploadMedia, isLoading } = useMedia();
  const { currentUser } = useAuth();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   if (e.target.files) {
  //     handleFiles(e.target.files);
  //   }
  // };

  // ✅ [수정] onChange 핸들러 개선
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.preventDefault() 제거 (필요 없음)
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // 같은 파일을 다시 선택할 수 있도록 값 초기화
    e.target.value = '';
  };

  const handleFiles = (fileList: FileList) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(fileList)]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    // 예외 처리: 로그인되지 않았을 경우
    if (!currentUser) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    // ✅ currentUser.id를 인자로 전달
    const result = await uploadMedia(files, currentUser?.id);

    if (result.success) {
      toast.success('파일 업로드가 완료되었습니다.');
      setOpen(false);
      setFiles([]);
    } else {
      toast.error(result.error?.message || '업로드에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" /> Upload Files
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Supports both images, documents, and videos.
          </DialogDescription>
        </DialogHeader>
        <div
          className={`mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <Upload
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <div className="mt-4 flex text-sm leading-none text-gray-600 justify-center">
              <Label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>Upload files</span>
                <Input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleChange}
                  multiple
                />
              </Label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600 mt-2">
              Images, Videos, Documents up to 500MB
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 max-h-[200px] overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-900 sticky top-0 bg-white py-1">
              Selected Files ({files.length}):
            </h4>
            <ul className="mt-2 divide-y divide-gray-100 rounded-md border border-gray-200">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2 pr-2 pl-4 text-sm"
                >
                  <div className="flex w-0 flex-1 items-center">
                    {file.type.startsWith('video/') ? (
                      <FileVideo className="h-4 w-4 text-blue-500 mr-2 shrink-0" />
                    ) : (
                      <FileIcon className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                    )}
                    <div className="flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">{file.name}</span>
                      <span className="shrink-0 text-gray-400 text-xs self-center">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
