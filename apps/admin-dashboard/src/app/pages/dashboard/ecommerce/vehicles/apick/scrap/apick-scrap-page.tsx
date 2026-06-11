import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useApick } from '@starcoex-frontend/vehicles';
import { toast } from 'sonner';
import { Wrench } from 'lucide-react';
import {
  APICK_CHECK_TYPE_OPTIONS,
  APICK_RESULT_CONFIG,
  ApickCheckTypeValue,
} from '@/app/pages/dashboard/ecommerce/vehicles/data/apick-data';

export default function ApickScrapPage() {
  const {
    scrapHistory,
    isLoading,
    error,
    fetchScrapHistory,
    checkScrapStatus,
  } = useApick();
  const [searchType, setSearchType] =
    useState<ApickCheckTypeValue>('CAR_NUMBER');
  const [searchValue, setSearchValue] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    fetchScrapHistory();
  }, [fetchScrapHistory]);

  const handleCheck = async () => {
    if (!searchValue.trim()) {
      toast.error('조회할 값을 입력하세요.');
      return;
    }
    setIsChecking(true);
    try {
      const res = await checkScrapStatus({
        searchType,
        searchValue: searchValue.trim(),
      });
      if (res.success && res.data) {
        const result = res.data.data?.result ?? -1;
        if (result === 0) toast.success('폐차사고처리 이력이 없는 차량입니다.');
        else if (result === 1)
          toast.error('폐차사고처리 이력이 있는 차량입니다!');
        fetchScrapHistory();
      } else {
        toast.error(res.error?.message ?? '조회에 실패했습니다.');
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <PageHead
        title={`폐차사고처리 조회 - ${COMPANY_INFO.name}`}
        description="폐차사고처리 여부를 조회하고 이력을 확인하세요."
        keywords={['폐차사고처리 조회', 'Apick', COMPANY_INFO.name]}
        og={{
          title: `폐차사고처리 조회 - ${COMPANY_INFO.name}`,
          description: '폐차사고처리 조회 이력',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4" />
              폐차사고처리 조회
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="space-y-1.5">
                <Label>검색 타입</Label>
                <Select
                  value={searchType}
                  onValueChange={(v) => setSearchType(v as ApickCheckTypeValue)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APICK_CHECK_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-1.5">
                <Label>
                  {searchType === 'CAR_NUMBER' ? '차량번호' : '차대번호'}
                </Label>
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    searchType === 'CAR_NUMBER'
                      ? '예: 12가3456'
                      : '차대번호 입력'
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                />
              </div>
              <Button
                onClick={handleCheck}
                disabled={isChecking || !searchValue.trim()}
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    조회 중...
                  </>
                ) : (
                  '조회하기'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>로딩 실패</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchScrapHistory()}
                className="ml-4"
              >
                다시 시도
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              총 {scrapHistory?.totalCount ?? 0}건
            </p>
            {(scrapHistory?.items ?? []).map((item) => (
              <Card key={item.requestId}>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {APICK_CHECK_TYPE_OPTIONS.find(
                        (o) => o.value === item.searchType
                      )?.label ?? item.searchType}
                    </Badge>
                    <span className="font-mono text-sm font-medium">
                      {item.searchValue}
                    </span>
                    {item.data && (
                      <Badge
                        variant={
                          APICK_RESULT_CONFIG[item.data.result]?.variant as any
                        }
                        className="text-xs"
                      >
                        {APICK_RESULT_CONFIG[item.data.result]?.label ?? '-'}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>비용: {item.api?.apiCost ?? '-'}원</p>
                    <p>응답: {item.api?.responseTime ?? '-'}ms</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(scrapHistory?.items ?? []).length === 0 && !isLoading && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                조회 이력이 없습니다.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
