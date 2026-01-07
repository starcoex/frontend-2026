import React from 'react';
import { QrCode, Gift, Car } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const CouponsTab: React.FC = () => {
  // TODO: 실제 쿠폰 데이터 연동
  const coupons = [
    {
      id: '1',
      name: '프리미엄 세차 쿠폰',
      description: '프리미엄 자동세차 1회 이용권',
      expiresAt: '2025.12.31',
      isUsable: true,
      isUsed: false,
    },
    {
      id: '2',
      name: '프리미엄 세차 쿠폰',
      description: '프리미엄 자동세차 1회 이용권',
      expiresAt: '2025.12.31',
      isUsable: true,
      isUsed: false,
    },
    {
      id: '3',
      name: '주유 할인 쿠폰',
      description: '리터당 50원 할인',
      expiresAt: '2025.12.15',
      isUsable: true,
      isUsed: false,
    },
  ];

  const usedCoupons = [
    {
      id: '4',
      name: '프리미엄 세차 쿠폰',
      description: '프리미엄 자동세차 1회 이용권',
      expiresAt: '2025.12.01',
      isUsable: false,
      isUsed: true,
      usedAt: '2025.11.28',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 쿠폰 액션 버튼 */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">
          쿠폰 등록
        </Button>
        <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
          쿠폰 구매
        </Button>
      </div>

      {/* 사용 가능한 쿠폰 */}
      <div>
        <h3 className="font-semibold mb-3">
          사용 가능한 쿠폰 ({coupons.length}장)
        </h3>
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  {/* 왼쪽 아이콘 영역 */}
                  <div className="w-20 bg-orange-50 flex items-center justify-center">
                    <Car className="h-8 w-8 text-orange-500" />
                  </div>

                  {/* 쿠폰 정보 */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{coupon.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {coupon.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {coupon.expiresAt}까지
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        사용가능
                      </Badge>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-1" />
                        QR 보기
                      </Button>
                      <Button variant="outline" size="sm">
                        <Gift className="h-4 w-4 mr-1" />
                        선물하기
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 사용 완료된 쿠폰 */}
      {usedCoupons.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-muted-foreground">
            사용 완료 ({usedCoupons.length}장)
          </h3>
          <div className="space-y-3">
            {usedCoupons.map((coupon) => (
              <Card key={coupon.id} className="overflow-hidden opacity-60">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-20 bg-gray-100 flex items-center justify-center">
                      <Car className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{coupon.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {coupon.usedAt} 사용
                          </p>
                        </div>
                        <Badge variant="secondary">사용완료</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
