import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { Button, Input, Badge } from '../ui';

interface CartPromoInputProps {
  appliedPromo: { code: string; percentOff: number } | null;
  onApply: (code: string) => boolean;
  onRemove: () => void;
}

export const CartPromoInput: React.FC<CartPromoInputProps> = ({
  appliedPromo,
  onApply,
  onRemove,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApply = () => {
    setPromoError(null);
    if (!promoCode.trim()) {
      setPromoError('프로모 코드를 입력해주세요.');
      return;
    }
    const success = onApply(promoCode.trim().toUpperCase());
    if (success) {
      setPromoCode('');
    } else {
      setPromoError('유효하지 않은 프로모 코드입니다.');
    }
  };

  if (appliedPromo) {
    return (
      <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2 dark:bg-green-950">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="gap-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          >
            <Tag className="w-3 h-3" />
            {appliedPromo.code}
          </Badge>
          <span className="text-sm text-green-700 dark:text-green-300">
            {appliedPromo.percentOff}% 할인
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 text-muted-foreground hover:text-foreground"
          onClick={onRemove}
        >
          제거
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="프로모 코드"
          value={promoCode}
          onChange={(e) => {
            setPromoCode(e.target.value);
            setPromoError(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="flex-1"
        />
        <Button variant="outline" onClick={handleApply}>
          적용
        </Button>
      </div>
      {promoError && <p className="text-sm text-destructive">{promoError}</p>}
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Badge variant="outline" className="font-mono text-xs">
          SAVE10
        </Badge>
        을 입력하면 10% 할인
      </p>
    </div>
  );
};
