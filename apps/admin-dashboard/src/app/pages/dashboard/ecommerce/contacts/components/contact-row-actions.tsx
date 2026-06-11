import { useState } from 'react';
import { MoreHorizontal, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Contact } from '@starcoex-frontend/contact';
import { ContactStatusUpdateDialog } from './contact-status-update-dialog';
import {
  NEXT_CONTACT_STATUS_MAP,
  type ContactStatusValue,
} from '../data/contact-data';

export function ContactRowActions({
  contact,
  onRefresh,
}: {
  contact: Contact;
  onRefresh?: () => void;
}) {
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState(false);

  const canChangeStatus =
    (NEXT_CONTACT_STATUS_MAP[contact.status as ContactStatusValue] ?? [])
      .length > 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>액션</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => navigate(`/admin/contacts/${contact.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          {canChangeStatus && (
            <DropdownMenuItem onSelect={() => setStatusOpen(true)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              상태 변경
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ContactStatusUpdateDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        contact={contact}
        onSuccess={onRefresh}
      />
    </>
  );
}
