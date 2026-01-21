import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import CalendarDateRangePicker from '@/app/pages/dashboard/components/custom-date-range-picker';
import {
  BalanceCard,
  BestSellingProducts,
  ExpenseCard,
  IncomeCard,
  RevenueChart,
  TableOrderStatus,
  TaxCard,
} from '@/app/pages/sales/components';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';

export default function SalesPage() {
  return (
    <>
      <PageHead
        title={`매출 현황 - ${COMPANY_INFO.name} 관리자 대시보드`}
        description="실시간 매출 데이터 분석 및 관리. 수익, 지출, 세금, 주문 현황을 한눈에 확인하고 효율적으로 관리하세요."
        keywords={[
          '매출 대시보드',
          '매출 관리',
          '매출 분석',
          '판매 현황',
          '수익 관리',
          '지출 관리',
          '세금 관리',
          '주문 현황',
          COMPANY_INFO.name,
          '관리자 대시보드',
        ]}
        og={{
          title: `매출 현황 대시보드 - ${COMPANY_INFO.name}`,
          description:
            '실시간 매출 데이터 분석 및 관리. 수익, 지출, 세금, 주문 현황을 한눈에 확인하세요.',
          image: '/images/og-sales-dashboard.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            Sales Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <div className="grow">
              <CalendarDateRangePicker />
            </div>
            <Button>
              <Download />
              <span className="hidden lg:inline">Download</span>
            </Button>
          </div>
        </div>
        <div className="gap-4 space-y-4 md:grid md:grid-cols-2 lg:space-y-0 xl:grid-cols-8">
          <div className="md:col-span-4">
            <RevenueChart />
          </div>
          <div className="md:col-span-4">
            <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
              <BalanceCard />
              <IncomeCard />
              <ExpenseCard />
              <TaxCard />
            </div>
          </div>
        </div>
        <div className="gap-4 space-y-4 lg:space-y-0 xl:grid xl:grid-cols-3">
          <div className="xl:col-span-1">
            <BestSellingProducts />
          </div>
          <div className="xl:col-span-2">
            <TableOrderStatus />
          </div>
        </div>
      </div>
    </>
  );
}
