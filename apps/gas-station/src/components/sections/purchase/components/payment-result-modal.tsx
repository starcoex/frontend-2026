import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  XCircle,
  CalendarCheck,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentResultModalProps {
  result: {
    status: 'IDLE' | 'SUCCESS' | 'FAILED' | 'RESERVED';
    message?: string;
    orderId?: number;
    isDuplicate?: boolean;
  };
  onClose: () => void;
}

export const PaymentResultModal: React.FC<PaymentResultModalProps> = ({
  result,
  onClose,
}) => {
  const navigate = useNavigate();
  const isOpen = result.status !== 'IDLE';

  const handleViewOrders = () => {
    onClose();
    navigate('/orders');
  };

  const handleViewOrderDetail = () => {
    onClose();
    if (result.orderId) navigate(`/orders/${result.orderId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {/* 결제 성공 */}
        {result.status === 'SUCCESS' && (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <DialogTitle className="text-center text-xl">
                결제가 완료되었습니다!
              </DialogTitle>
              <DialogDescription className="text-center space-y-1">
                {result.orderId && (
                  <span className="block font-semibold text-foreground text-base">
                    주문번호: #{result.orderId}
                  </span>
                )}
                <span className="block">
                  주유소 방문 시 주문번호를 알려주세요.
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleViewOrders}
              >
                주문 내역
              </Button>
              <Button className="flex-1" onClick={handleViewOrderDetail}>
                주문 상세
              </Button>
            </div>
          </>
        )}

        {/* 현장 결제 예약 - 신규 */}
        {result.status === 'RESERVED' && !result.isDuplicate && (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <CalendarCheck className="w-16 h-16 text-blue-500" />
              </div>
              <DialogTitle className="text-center text-xl">
                주문이 예약되었습니다!
              </DialogTitle>
              <DialogDescription className="text-center space-y-2">
                {result.orderId && (
                  <span className="block font-semibold text-foreground text-base">
                    주문번호: #{result.orderId}
                  </span>
                )}
                <span className="block">
                  주유소 방문 후 현장에서 결제해주세요.
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleViewOrders}
              >
                주문 내역
              </Button>
              <Button className="flex-1" onClick={handleViewOrderDetail}>
                주문 상세
              </Button>
            </div>
          </>
        )}

        {/* 현장 결제 예약 - 중복 */}
        {result.status === 'RESERVED' && result.isDuplicate && (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-16 h-16 text-yellow-500" />
              </div>
              <DialogTitle className="text-center text-xl">
                이미 예약된 주문이 있습니다
              </DialogTitle>
              <DialogDescription className="text-center space-y-2">
                {result.orderId && (
                  <span className="block font-semibold text-foreground text-base">
                    기존 주문번호: #{result.orderId}
                  </span>
                )}
                <span className="block">
                  오늘 동일한 연료 주문이 이미 존재합니다.
                </span>
                {/* ✅ 수정/취소 안내 추가 */}
                <span className="block text-xs bg-muted p-2 rounded text-left space-y-1">
                  <span className="block">✅ 기존 주문으로 현장 결제 가능</span>
                  <span className="block">
                    ✏️ 주문 상세에서 취소 후 재주문 가능
                  </span>
                </span>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                닫기
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  onClose();
                  if (result.orderId) navigate(`/orders/${result.orderId}`);
                }}
              >
                주문 상세 보기
              </Button>
            </div>
          </>
        )}

        {/* 결제 실패 */}
        {result.status === 'FAILED' && (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <DialogTitle className="text-center text-xl">
                결제에 실패했습니다
              </DialogTitle>
              <DialogDescription className="text-center">
                {result.message ?? '잠시 후 다시 시도해주세요.'}
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full mt-4" onClick={onClose}>
              다시 시도
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
