import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useContacts } from '@starcoex-frontend/contact';
import type { Contact } from '@starcoex-frontend/contact';
import {
  NEXT_CONTACT_STATUS_MAP,
  CONTACT_STATUS_OPTIONS,
  type ContactStatusValue,
} from '../data/contact-data';
import { CONTACT_STATUS_MAP } from './contact-status-badge';

interface ContactStatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact;
  onSuccess?: () => void;
}

export function ContactStatusUpdateDialog({
  open,
  onOpenChange,
  contact,
  onSuccess,
}: ContactStatusUpdateDialogProps) {
  const { updateContactStatus } = useContacts();
  const [selectedStatus, setSelectedStatus] = useState<ContactStatusValue | ''>(
    ''
  );
  const [adminNote, setAdminNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const availableStatuses =
    NEXT_CONTACT_STATUS_MAP[contact.status as ContactStatusValue] ?? [];

  const handleClose = () => {
    onOpenChange(false);
    setSelectedStatus('');
    setAdminNote('');
  };

  const handleSubmit = async () => {
    if (!selectedStatus) return;
    setIsLoading(true);
    try {
      const res = await updateContactStatus({
        contactId: String(contact.id),
        status: selectedStatus as any,
        adminNote: adminNote || undefined,
      });
      if (res.success) {
        toast.success(res.data?.message ?? '문의 상태가 변경되었습니다.');
        onSuccess?.();
        handleClose();
      } else {
        toast.error(res.error?.message ?? '상태 변경에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>문의 상태 변경</DialogTitle>
          <DialogDescription>
            문의 ID:{' '}
            <span className="font-mono font-medium">#{contact.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>현재 상태</Label>
            <p className="text-muted-foreground text-sm">
              {CONTACT_STATUS_MAP[contact.status as ContactStatusValue]
                ?.label ?? contact.status}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>변경할 상태 *</Label>
            {availableStatuses.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                더 이상 변경 가능한 상태가 없습니다.
              </p>
            ) : (
              <Select
                value={selectedStatus}
                onValueChange={(v) =>
                  setSelectedStatus(v as ContactStatusValue)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => {
                    const option = CONTACT_STATUS_OPTIONS.find(
                      (o) => o.value === status
                    );
                    return (
                      <SelectItem key={status} value={status}>
                        {option?.label ?? status}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>관리자 메모 (선택)</Label>
            <Textarea
              placeholder="처리 내용 또는 메모를 입력하세요"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedStatus || isLoading || availableStatuses.length === 0
            }
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            변경하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
