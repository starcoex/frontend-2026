import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InventoryItem {
  storeId: number;
  stock: number;
  minStock: number;
  maxStock: number;
  storePrice?: number;
  isAvailable: boolean;
}

interface Store {
  id: number;
  name: string;
}

interface InitialInventoryManagerProps {
  stores: Store[];
  value: InventoryItem[];
  onChange: (items: InventoryItem[]) => void;
}

export function InitialInventoryManager({
  stores,
  value,
  onChange,
}: InitialInventoryManagerProps) {
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [maxStock, setMaxStock] = useState(1000);
  const [storePrice, setStorePrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  const usedStoreIds = value.map((v) => v.storeId);
  const availableStores = stores.filter((s) => !usedStoreIds.includes(s.id));

  const handleAdd = () => {
    const storeIdNum = parseInt(selectedStoreId, 10);
    if (!storeIdNum || isNaN(storeIdNum)) return;

    const newItem: InventoryItem = {
      storeId: storeIdNum,
      stock,
      minStock,
      maxStock,
      storePrice: storePrice !== '' ? parseFloat(storePrice) : undefined,
      isAvailable,
    };

    onChange([...value, newItem]);

    // 입력값 초기화
    setSelectedStoreId('');
    setStock(0);
    setMinStock(0);
    setMaxStock(1000);
    setStorePrice('');
    setIsAvailable(true);
  };

  const handleRemove = (storeId: number) => {
    onChange(value.filter((v) => v.storeId !== storeId));
  };

  const getStoreName = (storeId: number) =>
    stores.find((s) => s.id === storeId)?.name ?? `매장 #${storeId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>초기 재고 설정</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 등록된 재고 목록 */}
        {value.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            매장별 초기 재고를 설정할 수 있습니다. (선택사항)
          </p>
        ) : (
          <div className="space-y-2">
            {value.map((inv) => (
              <div
                key={inv.storeId}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span className="font-medium">{getStoreName(inv.storeId)}</span>
                <div className="text-muted-foreground flex gap-3 text-xs">
                  <span>재고: {inv.stock}</span>
                  <span>최소: {inv.minStock}</span>
                  <span>최대: {inv.maxStock}</span>
                  {inv.storePrice !== undefined && (
                    <span>매장가: {inv.storePrice}</span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => handleRemove(inv.storeId)}
                >
                  <XIcon className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* 추가 입력 폼 */}
        {availableStores.length > 0 && (
          <div className="space-y-2 rounded-md border p-3">
            <p className="text-xs font-medium">재고 추가</p>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="w-full rounded-md border px-2 py-1 text-sm"
            >
              <option value="">매장 선택</option>
              {availableStores.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">
                  재고 수량
                </label>
                <Input
                  type="number"
                  min={0}
                  value={stock === 0 ? '' : stock}
                  onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  최소 재고
                </label>
                <Input
                  type="number"
                  min={0}
                  value={minStock === 0 ? '' : minStock}
                  onChange={(e) =>
                    setMinStock(parseInt(e.target.value, 10) || 0)
                  }
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  최대 재고
                </label>
                <Input
                  type="number"
                  min={0}
                  value={maxStock}
                  onChange={(e) =>
                    setMaxStock(parseInt(e.target.value, 10) || 1000)
                  }
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <div>
                <label className="text-xs text-muted-foreground">
                  매장 전용가 (선택)
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={storePrice}
                  onChange={(e) => setStorePrice(e.target.value)}
                  placeholder="기본가 사용"
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <input
                  id="inv-isAvailable"
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="size-4"
                />
                <label
                  htmlFor="inv-isAvailable"
                  className="text-sm cursor-pointer"
                >
                  판매 가능
                </label>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              disabled={!selectedStoreId}
              onClick={handleAdd}
              className="w-full"
            >
              재고 추가
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
