import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Info,
  Star,
  Truck,
  Wallet,
  CheckCircle,
  Fuel,
} from 'lucide-react';
import type {
  FuelType,
  PaymentInfo,
  QuantityMode,
} from '@/app/pages/purchase/purchase-page';

type PaymentMethod = 'online' | 'onsite';

interface PaymentCardProps {
  selectedFuel: FuelType | null;
  quantityMode: QuantityMode;
  paymentInfo: PaymentInfo;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  selectedFuel,
  quantityMode,
  paymentInfo,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');

  return (
    <Card className="sticky top-8 border-primary/20 shadow-lg">
      <div className="bg-primary/5 p-6 border-b border-primary/10">
        <h3 className="font-bold flex items-center gap-2">
          <CreditCard className="w-5 h-5" /> 결제 정보
        </h3>
      </div>
      <CardContent className="p-6 space-y-6">
        {/* 결제 방식 선택 */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">결제 방식</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={paymentMethod === 'online' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('online')}
              className="h-auto py-3 flex flex-col items-center gap-1"
            >
              <Wallet className="w-4 h-4" />
              <span className="text-xs">온라인 결제</span>
            </Button>
            <Button
              variant={paymentMethod === 'onsite' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('onsite')}
              className="h-auto py-3 flex flex-col items-center gap-1"
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-xs">현장 결제</span>
            </Button>
          </div>
          {paymentMethod === 'onsite' && (
            <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
              {paymentInfo.isKerosene
                ? '배달 시 현장에서 카드/현금 결제가 가능합니다.'
                : '주유소 방문 시 현장에서 결제해주세요.'}
            </p>
          )}
        </div>

        {/* 주문 정보 */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">연료</span>
            <span className="font-medium">
              {selectedFuel?.name || '선택해주세요'}
            </span>
          </div>

          {/* 주유량/배달량 */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {paymentInfo.isKerosene ? '배달량' : '주유량'}
            </span>
            <span className="font-medium">
              {paymentInfo.isFullTank ? (
                <span className="text-orange-500">
                  가득 (약 {paymentInfo.estimatedLiter}L)
                </span>
              ) : (
                `약 ${paymentInfo.estimatedLiter}L`
              )}
            </span>
          </div>

          {/* 결제 기준 표시 */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">결제 기준</span>
            <span className="font-medium">
              {quantityMode === 'amount' ? '금액 기준' : '리터 기준'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">연료 금액</span>
            <span className="font-medium">
              {paymentInfo.basePrice.toLocaleString()}원
            </span>
          </div>

          {/* 배달료 (등유인 경우) */}
          {paymentInfo.isKerosene && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Truck className="w-3 h-3" />
                배달료
              </span>
              <span
                className={`font-medium ${
                  paymentInfo.deliveryFee > 0
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                {paymentInfo.deliveryFee > 0
                  ? `+${paymentInfo.deliveryFee.toLocaleString()}원`
                  : '무료'}
              </span>
            </div>
          )}

          <div className="h-px bg-border my-2" />

          {/* 총 결제금액 */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">총 결제금액</span>
            <span className="text-2xl font-bold text-primary">
              {paymentInfo.totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 가득 결제 안내 */}
        {paymentInfo.isFullTank && (
          <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-900">
            <div className="flex items-start gap-2">
              <Fuel className="w-4 h-4 text-orange-500 mt-0.5" />
              <div className="text-xs text-orange-700 dark:text-orange-400">
                <strong>가득 결제 안내</strong>
                <br />
                실제 {paymentInfo.isKerosene ? '배달량' : '주유량'}에 따라
                정산됩니다.
                <br />
                부족 시 추가결제 / 남으면 부분취소
              </div>
            </div>
          </div>
        )}

        {/* 별 적립 안내 */}
        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-900">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">적립 예정</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {paymentInfo.starReward}
            </span>
            <span className="text-sm text-yellow-600 dark:text-yellow-400">
              별
            </span>
          </div>
        </div>

        {/* 결제 버튼 */}
        <Button
          size="lg"
          className="w-full text-lg h-14 font-bold"
          disabled={!selectedFuel}
        >
          {paymentMethod === 'online'
            ? `${paymentInfo.totalPrice.toLocaleString()}원 결제하기`
            : '주문 예약하기'}
        </Button>

        {/* 안내 사항 */}
        <div className="space-y-2 text-xs text-muted-foreground bg-muted p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-3 h-3 shrink-0 mt-0.5 text-green-500" />
            <span>5,000원당 별 1개 적립</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-3 h-3 shrink-0 mt-0.5 text-green-500" />
            <span>결제 시 회원 등급에 실적 반영</span>
          </div>
          {paymentInfo.isKerosene && (
            <div className="flex items-start gap-2">
              <Info className="w-3 h-3 shrink-0 mt-0.5 text-blue-500" />
              <span>배달 일정은 주문 후 개별 연락드립니다</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
