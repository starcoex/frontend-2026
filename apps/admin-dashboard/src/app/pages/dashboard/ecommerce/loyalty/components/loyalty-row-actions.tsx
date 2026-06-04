import { useState } from 'react';
import { MoreHorizontal, Eye, Settings2, Ticket } from 'lucide-react';
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
import type { User } from '@starcoex-frontend/graphql';
import { LoyaltyTierManager } from './loyalty-tier-manager';
import { LoyaltyCouponManager } from './loyalty-coupon-manager';

interface LoyaltyRowActionsProps {
  user: User;
}

export function LoyaltyRowActions({ user }: LoyaltyRowActionsProps) {
  const navigate = useNavigate();
  const [tierManagerOpen, setTierManagerOpen] = useState(false);
  const [couponManagerOpen, setCouponManagerOpen] = useState(false);

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
            onSelect={() => navigate(`/admin/loyalty/${user.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setTierManagerOpen(true)}>
            <Settings2 className="mr-2 h-4 w-4" />
            등급 / 별 관리
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setCouponManagerOpen(true)}>
            <Ticket className="mr-2 h-4 w-4" />
            쿠폰 발급
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LoyaltyTierManager
        user={user}
        open={tierManagerOpen}
        onOpenChange={setTierManagerOpen}
      />

      <LoyaltyCouponManager
        open={couponManagerOpen}
        onOpenChange={setCouponManagerOpen}
        defaultUserId={user.id}
      />
    </>
  );
}
