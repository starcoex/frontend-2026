import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Ticket, ArrowRight, Sparkles } from 'lucide-react';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Progress,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '../../ui';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const EXCHANGE_OPTIONS = [
  {
    id: 'premium_wash',
    type: 'PREMIUM_WASH',
    name: '프리미엄 세차권',
    description: '고급 왁스 + 실내 청소 포함',
    starsRequired: 12,
    icon: '🚗',
    popular: true,
  },
  {
    id: 'basic_wash',
    type: 'BASIC_WASH',
    name: '기본 세차권',
    description: '외부 세차 + 기본 건조',
    starsRequired: 8,
    icon: '🧽',
    popular: false,
  },
  {
    id: 'fuel_discount',
    type: 'FUEL_DISCOUNT',
    name: '주유 할인권',
    description: '리터당 100원 할인 (최대 50L)',
    starsRequired: 10,
    icon: '⛽',
    popular: false,
  },
];

interface CouponExchangeProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export const CouponExchange: React.FC<CouponExchangeProps> = ({
  onBack,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { membership, exchangeCoupon, isLoading } = useLoyalty();
  const [selectedOption, setSelectedOption] = useState<
    (typeof EXCHANGE_OPTIONS)[0] | null
  >(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const availableStars = membership?.availableStars || 0;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/coupons');
    }
  };

  const handleSelectOption = (option: (typeof EXCHANGE_OPTIONS)[0]) => {
    if (availableStars >= option.starsRequired) {
      setSelectedOption(option);
      setShowConfirmDialog(true);
    }
  };

  const handleExchange = async () => {
    if (!selectedOption) return;

    try {
      const res = await exchangeCoupon({
        type: selectedOption.type,
      });

      if (res.success) {
        // 성공 애니메이션
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        toast.success(`${selectedOption.name}으로 교환되었습니다! 🎉`);

        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/coupons');
        }
      }
    } catch (error) {
      toast.error('쿠폰 교환에 실패했습니다');
    } finally {
      setShowConfirmDialog(false);
      setSelectedOption(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">쿠폰 교환</h1>
      </div>

      {/* 보유 별 카드 */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">보유 별</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-8 w-8 text-amber-500 fill-amber-500" />
                <span className="text-4xl font-bold">{availableStars}</span>
                <span className="text-muted-foreground">개</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">현재 등급</p>
              <Badge variant="outline" className="mt-1">
                {membership?.currentTier || 'WELCOME'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 교환 옵션 */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          교환 가능한 쿠폰
        </h2>

        {EXCHANGE_OPTIONS.map((option) => {
          const canExchange = availableStars >= option.starsRequired;
          const progress = Math.min(
            (availableStars / option.starsRequired) * 100,
            100
          );

          return (
            <Card
              key={option.id}
              className={`relative overflow-hidden transition-all cursor-pointer ${
                canExchange
                  ? 'hover:shadow-lg hover:border-primary/50'
                  : 'opacity-60'
              }`}
              onClick={() => handleSelectOption(option)}
            >
              {option.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-bl-lg">
                  인기
                </div>
              )}

              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{option.icon}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{option.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {option.description}
                    </p>

                    {/* 진행 바 */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {availableStars} / {option.starsRequired} 별
                        </span>
                        {canExchange && (
                          <span className="text-primary font-medium">
                            교환 가능!
                          </span>
                        )}
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>

                  <div className="flex items-center">
                    {canExchange ? (
                      <div className="flex items-center gap-1 text-primary">
                        <Sparkles className="h-4 w-4" />
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {option.starsRequired - availableStars}별 부족
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 안내 */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">💡 별 적립 방법</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>• 주유 10,000원 = 1별 적립</p>
          <p>• 세차 서비스 이용 시 2배 적립</p>
          <p>• 적립된 별은 다양한 쿠폰으로 교환 가능</p>
        </CardContent>
      </Card>

      {/* 확인 다이얼로그 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>쿠폰으로 교환하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                {selectedOption?.name}
              </span>
              으로 교환하면{' '}
              <span className="font-medium text-amber-600">
                {selectedOption?.starsRequired}별
              </span>
              이 차감됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleExchange} disabled={isLoading}>
              {isLoading ? '교환 중...' : '교환하기'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
