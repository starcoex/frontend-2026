import { MediaProvider } from '@starcoex-frontend/media';
import { FileManagerLayout } from '@/app/pages/dashboard/board/file-manager/file-manager-layout';

export const FileManagerWithProvider = () => {
  return (
    <MediaProvider>
      <FileManagerLayout />
    </MediaProvider>
  );
};
