import { useState } from 'react';
import { Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// 패스워드 확인 다이얼로그 Props
interface PasswordConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title: string;
  description: string;
  isSubmitting: boolean;
}

/**
 * 패스워드 확인 다이얼로그 컴포넌트
 */
export const PasswordConfirmDialog: React.FC<PasswordConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isSubmitting,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!password.trim()) {
      setError('현재 비밀번호를 입력해주세요.');
      return;
    }
    setError('');
    onConfirm(password.trim());
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="current-password">현재 비밀번호</Label>
            <Input
              id="current-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요"
              disabled={isSubmitting}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                처리 중...
              </>
            ) : (
              '확인'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
