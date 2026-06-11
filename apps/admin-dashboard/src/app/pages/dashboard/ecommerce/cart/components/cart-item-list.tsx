import { useState } from 'react';
import type { CartItem } from '@starcoex-frontend/cart';
import { useCart } from '@starcoex-frontend/cart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  Minus,
  Plus,
  Trash2,
  Check,
  X,
  PlusCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { BulkDeleteDialog, useBulkDelete } from '@starcoex-frontend/common';
import { AddCartItemDialog } from './add-cart-item-dialog';

interface CartItemListProps {
  items: CartItem[];
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
}

interface EditingState {
  productId: number;
  storeId: number;
  quantity: number;
}

export const CartItemList = ({ items }: CartItemListProps) => {
  const { updateCartItem, removeFromCart, isLoading } = useCart();

  const [editing, setEditing] = useState<EditingState | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const itemMap = new Map(items.map((item) => [item.id, item]));
  const selectedRows = items.filter((item) => selectedIds.has(item.id));

  // ─── 단일 삭제 ───────────────────────────────────────────────────────────────
  const [singleDeleteTarget, setSingleDeleteTarget] = useState<CartItem | null>(
    null
  );

  const singleDelete = useBulkDelete(
    singleDeleteTarget ? [singleDeleteTarget] : [],
    {
      onDelete: async () => {
        if (!singleDeleteTarget) return { success: false };
        return await removeFromCart({
          productId: singleDeleteTarget.productId,
          storeId: singleDeleteTarget.storeId,
        });
      },
      onSuccess: () => setSingleDeleteTarget(null),
      itemLabel: '장바구니 상품',
    }
  );

  // ─── 일괄 삭제 ───────────────────────────────────────────────────────────────
  const bulkDelete = useBulkDelete(selectedRows, {
    onDelete: async (ids) => {
      let lastError: string | undefined;
      for (const id of ids) {
        const item = itemMap.get(id);
        if (!item) continue;
        const res = await removeFromCart({
          productId: item.productId,
          storeId: item.storeId,
        });
        if (!res.success) lastError = res.error?.message;
      }
      if (lastError) return { success: false, error: { message: lastError } };
      return { success: true };
    },
    onSuccess: () => setSelectedIds(new Set()),
    itemLabel: '장바구니 상품',
  });

  // ─── 수량 수정 ───────────────────────────────────────────────────────────────
  const isEditingItem = (item: CartItem) =>
    editing?.productId === item.productId && editing?.storeId === item.storeId;

  const handleEditStart = (item: CartItem) =>
    setEditing({
      productId: item.productId,
      storeId: item.storeId,
      quantity: item.quantity,
    });

  const handleEditCancel = () => setEditing(null);

  const handleEditConfirm = async () => {
    if (!editing) return;
    const res = await updateCartItem({
      productId: editing.productId,
      storeId: editing.storeId,
      quantity: editing.quantity,
    });
    if (res.success) {
      toast.success('수량이 수정되었습니다.');
    } else {
      toast.error(res.error?.message ?? '수량 수정에 실패했습니다.');
    }
    setEditing(null);
  };

  // ─── 체크박스 ────────────────────────────────────────────────────────────────
  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelectedIds(
      selectedIds.size === items.length
        ? new Set()
        : new Set(items.map((i) => i.id))
    );

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  return (
    <>
      {/* ─── 툴바 ───────────────────────────────────────────────────────────── */}
      <div className="mb-2 flex items-center justify-between gap-2">
        {/* 좌측: 일괄 삭제 */}
        <div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {selectedIds.size}개 선택됨
              </span>
              <Button
                variant="destructive"
                size="sm"
                className="h-8"
                onClick={bulkDelete.openDialog}
                disabled={isLoading}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                선택 삭제 ({selectedIds.size})
              </Button>
            </div>
          )}
        </div>

        {/* 우측: 상품 추가 */}
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setAddDialogOpen(true)}
          disabled={isLoading}
        >
          <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
          상품 추가
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  className="cursor-pointer accent-primary"
                  aria-label="전체 선택"
                />
              </TableHead>
              <TableHead>상품 ID</TableHead>
              <TableHead>스토어 ID</TableHead>
              <TableHead className="text-center">수량</TableHead>
              <TableHead className="text-right">현재 단가</TableHead>
              <TableHead className="text-right">소계</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className={!item.isAvailable ? 'opacity-60' : ''}
                data-state={selectedIds.has(item.id) ? 'selected' : undefined}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="cursor-pointer accent-primary"
                    aria-label={`상품 #${item.productId} 선택`}
                  />
                </TableCell>
                <TableCell className="font-medium">#{item.productId}</TableCell>
                <TableCell className="text-muted-foreground">
                  #{item.storeId}
                </TableCell>
                <TableCell className="text-center">
                  {item.isDirectCheckout ? (
                    <Badge variant="secondary" className="text-[10px]">
                      즉시 결제
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {isEditingItem(item) ? (
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() =>
                          setEditing((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  quantity: Math.max(1, prev.quantity - 1),
                                }
                              : null
                          )
                        }
                        disabled={editing!.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        value={editing!.quantity}
                        onChange={(e) =>
                          setEditing((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  quantity: Math.max(
                                    1,
                                    parseInt(e.target.value) || 1
                                  ),
                                }
                              : null
                          )
                        }
                        className="h-7 w-14 text-center text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() =>
                          setEditing((prev) =>
                            prev
                              ? { ...prev, quantity: prev.quantity + 1 }
                              : null
                          )
                        }
                        disabled={
                          item.availableStock != null &&
                          editing!.quantity >= item.availableStock
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <span
                      className="cursor-pointer rounded px-2 py-1 text-sm hover:bg-muted"
                      onClick={() => handleEditStart(item)}
                      title="클릭하여 수량 수정"
                    >
                      {item.quantity}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm">
                      {item.currentPrice != null
                        ? formatMoney(item.currentPrice)
                        : '-'}
                    </span>
                    {item.isPriceChanged && (
                      <Badge
                        variant="destructive"
                        className="px-1 py-0 text-[10px]"
                      >
                        <AlertTriangle className="mr-0.5 h-2.5 w-2.5" />
                        가격 변동
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {typeof item.subtotal === 'number'
                    ? formatMoney(item.subtotal)
                    : '-'}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant={item.isAvailable ? 'default' : 'secondary'}>
                      {item.isAvailable ? '구매 가능' : '품절'}
                    </Badge>
                    {item.availableStock != null && (
                      <span className="text-muted-foreground text-xs">
                        재고 {item.availableStock}개
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {isEditingItem(item) ? (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={handleEditConfirm}
                        disabled={isLoading}
                        title="저장"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={handleEditCancel}
                        title="취소"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        setSingleDeleteTarget(item);
                        singleDelete.openDialog();
                      }}
                      disabled={isLoading}
                      title="장바구니에서 제거"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ─── 단일 삭제 다이얼로그 ────────────────────────────────────────────── */}
      <BulkDeleteDialog
        open={singleDelete.isDialogOpen}
        onOpenChange={(open) => {
          singleDelete.closeDialog();
          if (!open) setSingleDeleteTarget(null);
        }}
        onConfirm={singleDelete.handleConfirm}
        isDeleting={singleDelete.isDeleting}
        count={1}
        itemLabel="장바구니 상품"
        description={`상품 #${singleDeleteTarget?.productId}을(를) 장바구니에서 제거합니다. 이 작업은 되돌릴 수 없습니다.`}
      />

      {/* ─── 일괄 삭제 다이얼로그 ────────────────────────────────────────────── */}
      <BulkDeleteDialog
        open={bulkDelete.isDialogOpen}
        onOpenChange={bulkDelete.closeDialog}
        onConfirm={bulkDelete.handleConfirm}
        isDeleting={bulkDelete.isDeleting}
        count={selectedIds.size}
        itemLabel="장바구니 상품"
      />

      {/* ─── 상품 추가 다이얼로그 ────────────────────────────────────────────── */}
      <AddCartItemDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </>
  );
};
