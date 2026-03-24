import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui';
import { Button } from '../ui';

interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorAlert({
  error,
  onRetry,
  title = '데이터 로딩 실패',
}: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4"
          >
            다시 시도
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
