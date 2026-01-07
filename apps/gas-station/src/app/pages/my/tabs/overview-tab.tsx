import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  Crown,
  Ticket,
  Coins,
  ChevronRight,
  Edit,
} from 'lucide-react';
import type { User as UserType } from '@starcoex-frontend/graphql';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLoyalty } from '@starcoex-frontend/loyalty';

interface OverviewTabProps {
  user: UserType | null;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ user }) => {
  const navigate = useNavigate();
  const { coupons, fetchMyCoupons, isLoading } = useLoyalty();

  React.useEffect(() => {
    if (!user) return;
    void fetchMyCoupons();
  }, [user, fetchMyCoupons]);

  if (!user) return null;

  // 아바타 URL 처리
  const avatarUrl = user.avatar?.url || user.avatarUrl;
  const userInitial = user.name?.charAt(0)?.toUpperCase() || 'U';

  // 멤버십 정보 (실데이터)
  const membershipGrade =
    user.membership?.currentTierDisplayName ??
    user.membership?.currentTier ??
    'WELCOME';

  const rawTierProgress = user.membership?.tierProgress ?? 0;
  const membershipProgress = Math.max(0, Math.min(100, rawTierProgress));

  // 통계 데이터 (실데이터)
  const stats = {
    coupons: coupons.length,
    points: user.membership?.availableStars ?? 0,
  };

  // 최근 주문 (TODO: 실제 데이터 연동 - 백엔드 아직 없음)
  const recentOrders = [
    {
      id: '1',
      date: '2025.12.08',
      name: '세차 쿠폰 5+1 패키지',
      amount: 50000,
      status: '결제완료',
    },
    {
      id: '2',
      date: '2025.12.05',
      name: '경유 30L',
      amount: 45000,
      status: '주유완료',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 프로필 요약 카드 */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* 프로필 정보 */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage
                  src={avatarUrl || undefined}
                  alt={user.name || 'User'}
                />
                <AvatarFallback className="text-xl sm:text-2xl bg-orange-100 text-orange-600">
                  {userInitial}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {user.name || '사용자'}님
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{user.email}</span>
                </div>

                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 멤버십 & 편집 버튼 */}
            <div className="flex flex-col items-start sm:items-end gap-3">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-orange-500" />
                <Badge
                  variant="outline"
                  className="text-sm font-semibold px-3 py-1 border-orange-200 text-orange-700 bg-orange-50"
                >
                  {membershipGrade} 회원
                </Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/profile')}
              >
                <Edit className="h-4 w-4 mr-1" />
                프로필 편집
              </Button>
            </div>
          </div>

          {/* 멤버십 진행률 */}
          {membershipProgress < 100 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">다음 등급까지</span>
                <span className="font-medium">30,000원 남음</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${membershipProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* 멤버십 등급 */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/my?tab=membership')}
        >
          <CardContent className="p-4 text-center">
            <Crown className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{membershipGrade}</p>
            <p className="text-sm text-muted-foreground">멤버십</p>
          </CardContent>
        </Card>

        {/* 쿠폰 */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/my?tab=coupons')}
        >
          <CardContent className="p-4 text-center">
            <Ticket className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">
              {isLoading ? '-' : `${stats.coupons}장`}
            </p>
            <p className="text-sm text-muted-foreground">쿠폰</p>
          </CardContent>
        </Card>

        {/* 포인트(=availableStars) */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow col-span-2 sm:col-span-1"
          onClick={() => navigate('/my?tab=membership')}
        >
          <CardContent className="p-4 text-center">
            <Coins className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">
              {stats.points.toLocaleString()}P
            </p>
            <p className="text-sm text-muted-foreground">포인트</p>
          </CardContent>
        </Card>
      </div>

      {/* 최근 주문 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">최근 주문</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/my?tab=orders')}
            >
              전체 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{order.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {order.amount.toLocaleString()}원
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              주문 내역이 없습니다.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
