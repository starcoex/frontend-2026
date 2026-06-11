import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Waves } from 'lucide-react';
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
import {
  APICK_CHECK_TYPES,
  APICK_RESULT_LABELS,
  APICK_RESULT_VARIANTS,
  ApickCheckType,
  useApick,
} from '@starcoex-frontend/vehicles';
import { toast } from 'sonner';


export default function ApickFloodPage() {
  const {
    floodHistory,
    isLoading,
    error,
    fetchFloodHistory,
    checkFloodDamage,
  } = useApick();

  const [searchType, setSearchType] = useState<ApickCheckType>('CAR_NUMBER');
  const [searchValue, setSearchValue] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    fetchFloodHistory();
  }, [fetchFloodHistory]);

  const handleCheck = async () => {
    if (!searchValue.trim()) {
      toast.error('조회할 값을 입력하세요.');
      return;
    }
    setIsChecking(true);
    try {
      const res = await checkFloodDamage({
        searchType,
        searchValue: searchValue.trim(),
      });
      if (res.success && res.data) {
        const result = res.data.data?.result ?? -1;
        if (result === 0) {
          toast.success('침수 이력이 없는 차량입니다.');
        } else if (result === 1) {
          toast.error('침수 이력이 있는 차량입니다!');
        }
        fetchFloodHistory();
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
        title={`침수차 조회 - ${COMPANY_INFO.name}`}
        description="침수차 여부를 조회하고 이력을 확인하세요."
        keywords={['침수차 조회', 'Apick', COMPANY_INFO.name]}
        og={{
          title: `침수차 조회 - ${COMPANY_INFO.name}`,
          description: '침수차 조회 이력',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        {/* 조회 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Waves className="h-4 w-4" />
              침수차 조회
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="space-y-1.5">
                <Label>검색 타입</Label>
                <Select
                  value={searchType}
                  onValueChange={(v) => setSearchType(v as ApickCheckType)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(APICK_CHECK_TYPES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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

        {/* 에러 */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>로딩 실패</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchFloodHistory()}
                className="ml-4"
              >
                다시 시도
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* 이력 목록 */}
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                총 {floodHistory?.totalCount ?? 0}건
              </p>
            </div>
            {(floodHistory?.items ?? []).map((item) => (
              <Card key={item.requestId}>
                <CardContent className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {APICK_CHECK_TYPES[item.searchType]}
                    </Badge>
                    <span className="font-mono text-sm font-medium">
                      {item.searchValue}
                    </span>
                    {item.data && (
                      <Badge
                        variant={APICK_RESULT_VARIANTS[item.data.result] as any}
                        className="text-xs"
                      >
                        {APICK_RESULT_LABELS[item.data.result] ?? '-'}
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
            {(floodHistory?.items ?? []).length === 0 && !isLoading && (
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
