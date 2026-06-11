import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useApick } from '@starcoex-frontend/vehicles';
import { toast } from 'sonner';
import {
  APICK_CHECK_TYPE_OPTIONS,
  APICK_RESULT_CONFIG,
  APICK_SERVICE_OPTIONS,
  ApickCheckTypeValue,
} from '@/app/pages/dashboard/ecommerce/vehicles/data/apick-data';

export default function ApickSearchPage() {
  const { searchResult, isLoading, searchApickHistory } = useApick();
  const [searchType, setSearchType] =
    useState<ApickCheckTypeValue>('CAR_NUMBER');
  const [searchValue, setSearchValue] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'flood',
    'scrap',
    'sale',
  ]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error('조회할 값을 입력하세요.');
      return;
    }
    if (selectedServices.length === 0) {
      toast.error('조회할 서비스를 선택하세요.');
      return;
    }
    const res = await searchApickHistory({
      searchValue: searchValue.trim(),
      searchType,
      services: selectedServices,
    });
    if (!res.success) {
      toast.error(res.error?.message ?? '통합 검색에 실패했습니다.');
    }
  };

  return (
    <>
      <PageHead
        title={`Apick 통합 조회 - ${COMPANY_INFO.name}`}
        description="차량의 침수/폐차/매매 이력을 한번에 조회하세요."
        keywords={['Apick 통합 조회', COMPANY_INFO.name]}
        og={{
          title: `Apick 통합 조회 - ${COMPANY_INFO.name}`,
          description: 'Apick 통합 차량 조회',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4" />
              통합 조회
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading || !searchValue.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    조회 중...
                  </>
                ) : (
                  '통합 조회'
                )}
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Label className="text-sm font-medium">조회 서비스:</Label>
              {APICK_SERVICE_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    id={opt.value}
                    checked={selectedServices.includes(opt.value)}
                    onCheckedChange={() => toggleService(opt.value)}
                  />
                  <label htmlFor={opt.value} className="text-sm cursor-pointer">
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {searchResult && (
          <div className="space-y-3">
            {/* 요약 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  조회 결과:{' '}
                  <span className="font-mono">
                    {searchResult.summary.searchValue}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3 text-sm">
                <span>전체: {searchResult.summary.total}건</span>
                <span className="text-green-600">
                  성공: {searchResult.summary.successful}건
                </span>
                <span className="text-destructive">
                  실패: {searchResult.summary.failed}건
                </span>
                <span className="text-muted-foreground">
                  평균 응답: {searchResult.summary.avgResponseTime}ms
                </span>
              </CardContent>
            </Card>

            {/* 침수차 결과 */}
            {searchResult.results.flood.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">🌊 침수차 조회</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {searchResult.results.flood.map((item) => (
                    <div
                      key={item.requestId}
                      className="flex items-center gap-2"
                    >
                      <Badge
                        variant={item.success ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {item.success ? '성공' : '실패'}
                      </Badge>
                      {item.data && (
                        <Badge
                          variant={
                            APICK_RESULT_CONFIG[item.data.result]
                              ?.variant as any
                          }
                          className="text-xs"
                        >
                          {APICK_RESULT_CONFIG[item.data.result]?.label}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {item.data?.message}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* 폐차 결과 */}
            {searchResult.results.scrap.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    🔧 폐차사고처리 조회
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {searchResult.results.scrap.map((item) => (
                    <div
                      key={item.requestId}
                      className="flex items-center gap-2"
                    >
                      <Badge
                        variant={item.ok ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {item.ok ? '성공' : '실패'}
                      </Badge>
                      {item.data && (
                        <Badge
                          variant={
                            APICK_RESULT_CONFIG[item.data.result]
                              ?.variant as any
                          }
                          className="text-xs"
                        >
                          {APICK_RESULT_CONFIG[item.data.result]?.label}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {item.data?.message}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* 매매 결과 */}
            {searchResult.results.sale.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">🏷️ 매매용 차량 조회</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {searchResult.results.sale.map((item) => (
                    <div
                      key={item.requestId}
                      className="flex items-center gap-2"
                    >
                      <Badge
                        variant={item.ok ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {item.ok ? '성공' : '실패'}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
}
