import { MoreHorizontal, Eye, Copy, AlertTriangle, Pencil } from 'lucide-react';
import { toast } from 'sonner';
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
import type { StoreInventory } from '@starcoex-frontend/inventory';
import { INVENTORY_ROUTES } from '@/app/constants/inventory-routes';

interface InventoryRowActionsProps {
  inventory: StoreInventory;
}

export function InventoryRowActions({ inventory }: InventoryRowActionsProps) {
  const navigate = useNavigate();

  const handleCopyId = () => {
    navigator.clipboard.writeText(String(inventory.id));
    toast.success('재고 ID가 복사되었습니다.');
  };

  return (
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
          onSelect={() =>
            navigate(
              INVENTORY_ROUTES.DETAIL.replace(':id', String(inventory.id))
            )
          }
        >
          <Eye className="mr-2 h-4 w-4" />
          상세 보기
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() =>
            navigate(INVENTORY_ROUTES.EDIT.replace(':id', String(inventory.id)))
          }
        >
          <Pencil className="mr-2 h-4 w-4" />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleCopyId}>
          <Copy className="mr-2 h-4 w-4" />
          ID 복사
        </DropdownMenuItem>
        {inventory.needsReorder && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-warning focus:text-warning"
              onSelect={() =>
                toast.info(
                  `재고 #${inventory.id} 재주문 요청이 접수되었습니다.`,
                  {
                    description: `상품 #${inventory.productId} · 현재 재고: ${inventory.currentStock}`,
                  }
                )
              }
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              재주문 요청
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
