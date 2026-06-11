import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Tag } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useApick } from '@starcoex-frontend/vehicles';
import { toast } from 'sonner';

export default function ApickSalePage() {
  const { saleHistory, isLoading, error, fetchSaleHistory, checkSaleStatus } =
    useApick();
  const [searchValue, setSearchValue] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    fetchSaleHistory();
  }, [fetchSaleHistory]);

  const handleCheck = async () => {
    if (!searchValue.trim()) {
      toast.error('차량번호를 입력하세요.');
      return;
    }
    setIsChecking(true);
    try {
      const res = await checkSaleStatus({
        searchValue: searchValue.trim(),
        searchType: 'CAR_NUMBER',
      });
      if (res.success) {
        toast.success('매매용 차량 조회가 완료되었습니다.');
        fetchSaleHistory();
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
        title={`매매용 차량 조회 - ${COMPANY_INFO.name}`}
        description="매매용 차량 여부를 조회하고 이력을 확인하세요."
        keywords={['매매용 차량 조회', 'Apick', COMPANY_INFO.name]}
        og={{
          title: `매매용 차량 조회 - ${COMPANY_INFO.name}`,
          description: '매매용 차량 조회 이력',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Tag className="h-4 w-4" />
              매매용 차량 조회 (차량번호만 지원)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-1.5">
                <Label>차량번호</Label>
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="예: 12가3456"
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
                onClick={() => fetchSaleHistory()}
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
              총 {saleHistory?.totalCount ?? 0}건
            </p>
            {(saleHistory?.items ?? []).map((item) => (
              <Card key={item.requestId}>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      차량번호
                    </Badge>
                    <span className="font-mono text-sm font-medium">
                      {item.searchValue}
                    </span>
                    {item.data && (
                      <Badge
                        variant={item.data.success ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {item.data.success ? '조회 성공' : '조회 실패'}
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
            {(saleHistory?.items ?? []).length === 0 && !isLoading && (
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
