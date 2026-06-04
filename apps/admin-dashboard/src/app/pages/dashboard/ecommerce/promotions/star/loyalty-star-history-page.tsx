import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHead } from '@starcoex-frontend/common';
// ✅ libs/feature/common 에서 임포트
import {
  CustomerSearch,
  type SelectedCustomer,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { generateAvatarFallback } from '@/app/utils/generateAvatarFallback';
import type { AdminStarHistoryOutput } from '@starcoex-frontend/loyalty';
import type { StarHistory } from '@starcoex-frontend/graphql';

const PAGE_SIZE = 20;

const REASON_LABELS: Record<string, string> = {
  ORDER_GAS: '주유 주문',
  ORDER_OIL: '난방유 주문',
  ORDER_CAR_CARE: '카케어 주문',
  COUPON_EXCHANGE: '쿠폰 교환',
  MANUAL_ADJUST: '관리자 조정',
  WELCOME: '웰컴 지급',
  EXPIRY: '별 소멸',
};

const CATEGORY_LABELS: Record<string, string> = {
  GAS: '주유',
  OIL: '난방유',
  CAR_CARE: '카케어',
};

export default function LoyaltyStarHistoryPage() {
  const { adminGetUserStarHistory, isLoading } = useLoyalty();

  // ✅ CustomerSearch 선택 상태
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);
  const [result, setResult] = useState<AdminStarHistoryOutput | null>(null);
  const [offset, setOffset] = useState(0);

  const load = async (customer: SelectedCustomer, currentOffset: number) => {
    const res = await adminGetUserStarHistory({
      userId: customer.userId,
      limit: PAGE_SIZE,
      offset: currentOffset,
    });
    if (res.success && res.data) {
      setResult(res.data);
      setOffset(currentOffset);
    }
  };

  const handleSelect = (customer: SelectedCustomer) => {
    setSelectedCustomer(customer);
    setResult(null);
    setOffset(0);
    load(customer, 0);
  };

  const handleClear = () => {
    setSelectedCustomer(null);
    setResult(null);
    setOffset(0);
  };

  const totalEarned =
    result?.histories
      .filter((h: StarHistory) => h.amount > 0)
      .reduce((sum: number, h: StarHistory) => sum + h.amount, 0) ?? 0;

  const totalUsed =
    result?.histories
      .filter((h: StarHistory) => h.amount < 0)
      .reduce((sum: number, h: StarHistory) => sum + Math.abs(h.amount), 0) ??
    0;

  return (
    <>
      <PageHead
        title={`별 히스토리 - ${COMPANY_INFO.name}`}
        description="회원 별 적립/사용/소멸 내역을 조회합니다."
        keywords={['별 히스토리', '로열티', COMPANY_INFO.name]}
        og={{ title: `별 히스토리 - ${COMPANY_INFO.name}`, type: 'website' }}
      />

      <div className="space-y-6">
        {/* ✅ 회원 검색 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">회원 별 히스토리 조회</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerSearch
              selected={selectedCustomer}
              onSelect={handleSelect}
              onClear={handleClear}
              enableCreate={false}
            />
            {isLoading && (
              <p className="text-muted-foreground mt-3 text-sm">조회 중...</p>
            )}
          </CardContent>
        </Card>

        {/* 결과 */}
        {result && selectedCustomer && (
          <>
            {/* 요약 카드 */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-muted-foreground text-sm font-normal">
                    전체 내역
                  </CardTitle>
                  <p className="text-2xl font-bold">
                    {result.totalCount.toLocaleString()}건
                  </p>
                </CardHeader>
              </Card>
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-sm font-normal text-green-600 dark:text-green-400">
                    페이지 내 총 적립
                  </CardTitle>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    +{totalEarned.toLocaleString()}별
                  </p>
                </CardHeader>
              </Card>
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-sm font-normal text-red-600 dark:text-red-400">
                    페이지 내 총 사용/소멸
                  </CardTitle>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    -{totalUsed.toLocaleString()}별
                  </p>
                </CardHeader>
              </Card>
            </div>

            {/* 히스토리 목록 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback>
                      {generateAvatarFallback(selectedCustomer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {selectedCustomer.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-xs">
                      {selectedCustomer.phone}
                      {selectedCustomer.email && ` · ${selectedCustomer.email}`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {result.histories.length === 0 ? (
                  <div className="text-muted-foreground flex h-24 items-center justify-center text-sm">
                    내역이 없습니다.
                  </div>
                ) : (
                  <div className="divide-y">
                    {result.histories.map((history: StarHistory) => {
                      const isPositive = history.amount > 0;
                      const reasonLabel =
                        REASON_LABELS[history.reason] ?? history.reason;
                      const categoryLabel = history.category
                        ? CATEGORY_LABELS[history.category] ?? history.category
                        : null;

                      return (
                        <div
                          key={history.id}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-9 items-center justify-center rounded-full ${
                                isPositive
                                  ? 'bg-green-100 dark:bg-green-900'
                                  : 'bg-red-100 dark:bg-red-900'
                              }`}
                            >
                              {isPositive ? (
                                <TrendingUp className="size-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <TrendingDown className="size-4 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">
                                  {reasonLabel}
                                </p>
                                {categoryLabel && (
                                  <Badge variant="outline" className="text-xs">
                                    {categoryLabel}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                <span>
                                  {new Date(history.createdAt).toLocaleString(
                                    'ko-KR'
                                  )}
                                </span>
                                {history.referenceId && (
                                  <span className="font-mono">
                                    ref: {history.referenceId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-sm font-semibold ${
                                isPositive
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {history.amount.toLocaleString()}별
                            </p>
                            {history.expiresAt && isPositive && (
                              <p className="text-muted-foreground text-xs">
                                ~
                                {new Date(history.expiresAt).toLocaleDateString(
                                  'ko-KR'
                                )}{' '}
                                만료
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 페이지네이션 */}
                {result.totalCount > PAGE_SIZE && (
                  <div className="mt-4 flex items-center justify-center gap-3 border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={offset === 0}
                      onClick={() =>
                        selectedCustomer &&
                        load(selectedCustomer, Math.max(0, offset - PAGE_SIZE))
                      }
                    >
                      이전
                    </Button>
                    <span className="text-muted-foreground text-sm">
                      {Math.floor(offset / PAGE_SIZE) + 1} /{' '}
                      {Math.ceil(result.totalCount / PAGE_SIZE)} 페이지
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!result.hasMore}
                      onClick={() =>
                        selectedCustomer &&
                        load(selectedCustomer, offset + PAGE_SIZE)
                      }
                    >
                      다음
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
