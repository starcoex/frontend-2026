import { useNavigate } from 'react-router-dom';
import {
  FileBarChart2,
  ShoppingCart,
  Truck,
  CalendarCheck,
  Star,
  Tag,
  Building2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ─── 리포트 항목 정의 ─────────────────────────────────────────────────────────
const REPORT_ITEMS = [
  {
    icon: FileBarChart2,
    color: 'text-blue-500',
    title: '매출 현황 리포트',
    desc: '결제·주문 기반 매출 분석 데이터',
    path: '/admin/sales',
    exportFileName: 'sales-report',
  },
  {
    icon: ShoppingCart,
    color: 'text-violet-500',
    title: '주문 현황 리포트',
    desc: '상태별 주문 집계 및 상세 목록',
    path: '/admin/orders',
    exportFileName: 'orders-report',
  },
  {
    icon: CalendarCheck,
    color: 'text-orange-500',
    title: '예약 현황 리포트',
    desc: '예약·워크인 현황 및 통계',
    path: '/admin/reservations',
    exportFileName: 'reservations-report',
  },
  {
    icon: Truck,
    color: 'text-emerald-500',
    title: '배송 현황 리포트',
    desc: '배송 상태별 집계 및 기사 현황',
    path: '/admin/delivery',
    exportFileName: 'delivery-report',
  },
  {
    icon: Building2,
    color: 'text-blue-400',
    title: '매장 현황 리포트',
    desc: '매장별 운영 현황 및 통계',
    path: '/admin/stores',
    exportFileName: 'stores-report',
  },
  {
    icon: Star,
    color: 'text-yellow-500',
    title: '리뷰 현황 리포트',
    desc: '리뷰 집계 및 신고·숨김 현황',
    path: '/admin/reviews',
    exportFileName: 'reviews-report',
  },
  {
    icon: Tag,
    color: 'text-orange-400',
    title: '프로모션 현황 리포트',
    desc: '프로모션 실적 및 할인액 분석',
    path: '/admin/promotions',
    exportFileName: 'promotions-report',
  },
] as const;

// ─── 시스템 분석 바로가기 ─────────────────────────────────────────────────────
const ANALYTICS_SHORTCUTS = [
  { label: '개요 분석', path: '/admin/analytics/overview' },
  { label: '실시간 분석', path: '/admin/analytics/realtime' },
  { label: '랭킹', path: '/admin/analytics/ranking' },
  { label: '서비스 분석', path: '/admin/analytics/service' },
  { label: '어드민 분석', path: '/admin/analytics/admin' },
] as const;

export function DashboardReportsTab() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart2 className="h-4 w-4" />
            통합 리포트
          </CardTitle>
          <CardDescription>
            각 영역의 전용 페이지에서 데이터를 조회하고 Excel·PDF로 내보낼 수
            있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {REPORT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="hover:bg-muted/50 flex cursor-pointer flex-col gap-2 rounded-md border p-4 transition-colors"
                  onClick={() => navigate(item.path)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-auto h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(item.path);
                    }}
                  >
                    페이지로 이동 →
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 시스템 분석 바로가기 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            시스템 분석 바로가기
          </CardTitle>
          <CardDescription>상세 분석 페이지로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ANALYTICS_SHORTCUTS.map((item) => (
              <Button
                key={item.label}
                variant="outline"
                size="sm"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <Separator className="my-3" />
          <p className="text-muted-foreground text-xs">
            각 분석 페이지에서 데이터를 조회하고 Excel·PDF로 내보낼 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
