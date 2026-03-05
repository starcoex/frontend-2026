import { useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Search, Settings } from 'lucide-react';
import type { SuggestionStatus } from '@starcoex-frontend/suggestions';
import { suggestionStatuses } from '../../data/suggestion-data';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// ============================================================================
// 상태 전환 정의
// ============================================================================
export const STATUS_TRANSITIONS: Record<SuggestionStatus, SuggestionStatus[]> =
  {
    PENDING: ['REVIEWING', 'REJECTED'],
    REVIEWING: ['IN_PROGRESS', 'REJECTED'],
    IN_PROGRESS: ['COMPLETED', 'REJECTED'],
    COMPLETED: [],
    REJECTED: [],
  };

export const STATUS_BUTTON_LABELS: Record<SuggestionStatus, string> = {
  PENDING: '대기중',
  REVIEWING: '검토 시작',
  IN_PROGRESS: '진행 시작',
  COMPLETED: '완료 처리',
  REJECTED: '거부',
};

export const STATUS_BUTTON_VARIANTS: Partial<
  Record<SuggestionStatus, 'default' | 'destructive' | 'outline'>
> = {
  REVIEWING: 'outline',
  IN_PROGRESS: 'outline',
  COMPLETED: 'default',
  REJECTED: 'destructive',
};

// ============================================================================
// 상태별 다이얼로그 설정
// ============================================================================
const STATUS_DIALOG_CONFIG: Record<
  SuggestionStatus,
  {
    title: string;
    description: string;
    placeholder: string;
    required: boolean;
    icon: React.ReactNode;
    color: string;
  }
> = {
  PENDING: {
    title: '대기중',
    description: '',
    placeholder: '',
    required: false,
    icon: null,
    color: '',
  },
  REVIEWING: {
    title: '🔍 검토 시작',
    description:
      '이 건의사항을 검토 단계로 이동합니다. 검토 내용이나 담당자 메모를 남길 수 있습니다.',
    placeholder: '검토 시작 이유나 담당 내용을 입력하세요... (선택)',
    required: false,
    icon: <Search className="h-5 w-5 text-yellow-500" />,
    color: 'border-yellow-200 bg-yellow-50',
  },
  IN_PROGRESS: {
    title: '⚙️ 진행 시작',
    description:
      '이 건의사항을 실제 진행 단계로 이동합니다. 어떤 작업이 진행될 예정인지 메모를 남길 수 있습니다.',
    placeholder: '진행 예정 작업이나 일정을 입력하세요... (선택)',
    required: false,
    icon: <Settings className="h-5 w-5 text-blue-500" />,
    color: 'border-blue-200 bg-blue-50',
  },
  COMPLETED: {
    title: '✅ 완료 처리',
    description:
      '이 건의사항을 완료 처리합니다. 완료된 내용이나 결과를 작성해주세요.',
    placeholder: '완료된 내용이나 처리 결과를 입력하세요... (선택)',
    required: false,
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    color: 'border-green-200 bg-green-50',
  },
  REJECTED: {
    title: '❌ 거부 처리',
    description:
      '이 건의사항을 거부합니다. 작성자가 이유를 알 수 있도록 거부 사유를 반드시 입력해주세요.',
    placeholder: '거부 사유를 상세히 입력해주세요. (필수)',
    required: true,
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    color: 'border-red-200 bg-red-50',
  },
};

// ============================================================================
// 상태 단계 표시 컴포넌트
// ============================================================================
const StatusProgressBar = ({
  currentStatus,
}: {
  currentStatus: SuggestionStatus;
}) => {
  const steps: SuggestionStatus[] = [
    'PENDING',
    'REVIEWING',
    'IN_PROGRESS',
    'COMPLETED',
  ];
  const currentIndex = steps.indexOf(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  const stepLabels: Record<SuggestionStatus, string> = {
    PENDING: '대기',
    REVIEWING: '검토',
    IN_PROGRESS: '진행',
    COMPLETED: '완료',
    REJECTED: '거부',
  };

  const stepColors: Record<string, string> = {
    done: 'bg-primary text-primary-foreground',
    current:
      'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2',
    future: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="flex items-center gap-1 mb-4">
      {steps.map((step, i) => {
        const state = isRejected
          ? 'future'
          : i < currentIndex
          ? 'done'
          : i === currentIndex
          ? 'current'
          : 'future';

        return (
          <div key={step} className="flex items-center gap-1 flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${stepColors[state]}`}
              >
                {i < currentIndex && !isRejected ? '✓' : i + 1}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1">
                {stepLabels[step]}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mb-4 ${
                  i < currentIndex && !isRejected ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// 메인 다이얼로그
// ============================================================================
interface Props {
  open: boolean;
  targetStatus: SuggestionStatus | null;
  currentStatus: SuggestionStatus; // ← 현재 상태 추가
  onConfirm: (adminResponse: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function StatusChangeDialog({
  open,
  targetStatus,
  currentStatus,
  onConfirm,
  onCancel,
  isLoading,
}: Props) {
  const [adminResponse, setAdminResponse] = useState('');

  if (!targetStatus) return null;

  const config = STATUS_DIALOG_CONFIG[targetStatus];
  const isRequired = config.required;
  const canConfirm = !isRequired || adminResponse.trim().length > 0;

  const currentLabel = suggestionStatuses.find(
    (s) => s.value === currentStatus
  )?.label;
  const targetLabel = suggestionStatuses.find(
    (s) => s.value === targetStatus
  )?.label;

  const handleConfirm = () => {
    onConfirm(adminResponse);
    setAdminResponse('');
  };

  const handleCancel = () => {
    setAdminResponse('');
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {config.icon}
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 상태 진행 표시 */}
          {targetStatus !== 'REJECTED' && (
            <StatusProgressBar currentStatus={targetStatus} />
          )}

          {/* 현재 → 변경될 상태 표시 */}
          <div
            className={`flex items-center gap-3 rounded-lg border p-3 text-sm ${config.color}`}
          >
            <Badge variant="outline">{currentLabel}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge
              variant="outline"
              className={
                targetStatus === 'REJECTED'
                  ? 'border-red-300 bg-red-100 text-red-700'
                  : targetStatus === 'COMPLETED'
                  ? 'border-green-300 bg-green-100 text-green-700'
                  : 'border-blue-300 bg-blue-100 text-blue-700'
              }
            >
              {targetLabel}
            </Badge>
          </div>

          {/* 메모 입력 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {targetStatus === 'REJECTED' ? (
                <span>
                  거부 사유 <span className="text-destructive">*필수</span>
                </span>
              ) : (
                <span>
                  관리자 메모{' '}
                  <span className="text-muted-foreground">(선택)</span>
                </span>
              )}
            </Label>
            <Textarea
              placeholder={config.placeholder}
              className="min-h-[120px] resize-none"
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
            />
            {isRequired && !adminResponse.trim() && (
              <p className="text-xs text-destructive">
                거부 사유를 입력해야 합니다.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !canConfirm}
            variant={targetStatus === 'REJECTED' ? 'destructive' : 'default'}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {STATUS_BUTTON_LABELS[targetStatus]} 확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
