import { Badge } from '@/components/ui/badge';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';
import type { InventoryTransaction } from '@starcoex-frontend/inventory';
import {
  INVENTORY_REASON_OPTIONS,
  INVENTORY_TRANSACTION_TYPE_OPTIONS,
  InventoryTransactionTypeValue,
} from '@/app/pages/dashboard/ecommerce/inventory/data/inventory-data';

const TYPE_CONFIG: Record<
  InventoryTransactionTypeValue,
  {
    variant: 'success' | 'destructive' | 'secondary' | 'outline';
    isInbound: boolean;
  }
> = {
  IN: { variant: 'success', isInbound: true },
  OUT: { variant: 'destructive', isInbound: false },
  RESERVE: { variant: 'outline', isInbound: false },
  RELEASE: { variant: 'outline', isInbound: true },
  ADJUSTMENT: { variant: 'secondary', isInbound: true },
  TRANSFER: { variant: 'secondary', isInbound: true },
  RETURN: { variant: 'success', isInbound: true },
  DAMAGE: { variant: 'destructive', isInbound: false },
  EXPIRE: { variant: 'destructive', isInbound: false },
};

const getTypeLabel = (type: string) =>
  INVENTORY_TRANSACTION_TYPE_OPTIONS.find((o) => o.value === type)?.label ??
  type;

const getReasonLabel = (reason: string) =>
  INVENTORY_REASON_OPTIONS.find((o) => o.value === reason)?.label ?? reason;

interface InventoryTransactionListProps {
  transactions: InventoryTransaction[];
}

export function InventoryTransactionList({
  transactions,
}: InventoryTransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground text-sm">
          아직 입출고 이력이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => {
        // 백엔드 computed field 우선 사용, 없으면 TYPE_CONFIG fallback
        const isInbound =
          tx.isInbound ??
          TYPE_CONFIG[tx.type as InventoryTransactionTypeValue]?.isInbound ??
          true;
        const isAdjustment = tx.isAdjustment ?? tx.type === 'ADJUSTMENT';
        const config =
          TYPE_CONFIG[tx.type as InventoryTransactionTypeValue] ??
          TYPE_CONFIG['ADJUSTMENT'];

        return (
          <div
            key={tx.id}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex size-8 items-center justify-center rounded-full ${
                  isAdjustment
                    ? 'bg-secondary/30 text-secondary-foreground'
                    : isInbound
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {isAdjustment ? (
                  <MinusIcon className="size-4" />
                ) : isInbound ? (
                  <ArrowDownIcon className="size-4" />
                ) : (
                  <ArrowUpIcon className="size-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={config.variant} className="text-xs">
                    {getTypeLabel(tx.type)}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {getReasonLabel(tx.reason)}
                  </span>
                  {/* 배치/로트 번호 표시 */}
                  {tx.hasBatch && tx.batchNumber && (
                    <Badge variant="outline" className="text-xs">
                      LOT: {tx.batchNumber}
                    </Badge>
                  )}
                  {/* 유통기한 임박 경고 */}
                  {tx.isExpiringSoon && (
                    <Badge variant="warning" className="text-xs">
                      유통기한 임박
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {tx.previousStock} → {tx.newStock}
                  {tx.notes && ` · ${tx.notes}`}
                </p>
                {/* 비용 정보 */}
                {tx.hasCosting && tx.unitCost != null && (
                  <p className="text-muted-foreground text-xs">
                    단가: ₩{tx.unitCost.toLocaleString()}
                    {tx.totalCost != null &&
                      ` / 합계: ₩${tx.totalCost.toLocaleString()}`}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${
                  isAdjustment
                    ? 'text-foreground'
                    : isInbound
                    ? 'text-success'
                    : 'text-destructive'
                }`}
              >
                {isAdjustment ? '±' : isInbound ? '+' : '-'}
                {Math.abs(tx.quantity).toLocaleString()}
              </p>
              <p className="text-muted-foreground text-xs">
                {new Date(tx.createdAt).toLocaleDateString('ko-KR')}
              </p>
              {/* 처리 시간 */}
              {tx.isProcessed && tx.processingTime != null && (
                <p className="text-muted-foreground text-xs">
                  {tx.processingTime.toFixed(1)}ms
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
