import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const OrdersTab: React.FC = () => {
  // TODO: 실제 주문 데이터 연동
  const orders = [
    {
      id: '1',
      date: '2025.12.08',
      name: '세차 쿠폰 5+1 패키지',
      amount: 50000,
      status: 'completed',
      statusLabel: '결제완료',
    },
    {
      id: '2',
      date: '2025.12.05',
      name: '경유 30L',
      amount: 45000,
      status: 'completed',
      statusLabel: '주유완료',
    },
    {
      id: '3',
      date: '2025.12.01',
      name: '프리미엄 세차',
      amount: 15000,
      status: 'completed',
      statusLabel: '완료',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground mb-4">주문 내역이 없습니다.</p>
        <Button onClick={() => (window.location.href = '/fuel')}>
          주유/세차 서비스 보기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground">
                    {order.date}
                  </span>
                  <Badge
                    variant="outline"
                    className={getStatusColor(order.status)}
                  >
                    {order.statusLabel}
                  </Badge>
                </div>
                <p className="font-medium">{order.name}</p>
                <p className="text-lg font-bold mt-1">
                  {order.amount.toLocaleString()}원
                </p>
              </div>

              <Button variant="ghost" size="sm">
                상세보기
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
