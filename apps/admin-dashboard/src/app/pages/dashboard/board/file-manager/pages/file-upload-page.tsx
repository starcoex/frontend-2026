import { Upload, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileUploadDialog } from '@/app/pages/dashboard/board/file-manager/components/file-upload-dialog';

export default function FileUploadPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            파일 업로드
          </CardTitle>
          <CardDescription>
            이미지, 동영상, 문서 파일을 업로드하세요. 최대 500MB까지 지원합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadDialog defaultOpen />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-blue-500" />
            업로드 안내
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground space-y-1.5 text-sm">
            <li>• 동영상 파일은 자동으로 썸네일이 생성됩니다.</li>
            <li>
              • 여러 파일을 동시에 선택하거나 드래그 앤 드롭으로 업로드할 수
              있습니다.
            </li>
            <li>
              • 지원 형식: 이미지(JPG, PNG, WEBP), 동영상(MP4, MOV), 문서(PDF)
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
