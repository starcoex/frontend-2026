import { useEffect, useState } from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useAddress } from '@starcoex-frontend/address';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { SearchAddressLogInput } from '@starcoex-frontend/address';

const DEFAULT_FILTER: SearchAddressLogInput = { page: 1, limit: 20 };

export default function AddressLogsPage() {
  const { isLoading, error, getUserSearchLogs } = useAddress();
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<SearchAddressLogInput>(DEFAULT_FILTER);
  const [keyword, setKeyword] = useState('');

  const fetchLogs = async (f = filter) => {
    const res = await getUserSearchLogs(f);
    if (res.success && res.data) setLogs(res.data.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    const next = { ...filter, keyword: keyword || undefined, page: 1 };
    setFilter(next);
    fetchLogs(next);
  };

  const handleReset = () => {
    setKeyword('');
    setFilter(DEFAULT_FILTER);
    fetchLogs(DEFAULT_FILTER);
  };

  if (isLoading && logs.length === 0) {
    return <LoadingSpinner message="검색 로그를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`검색 로그 - ${COMPANY_INFO.name}`}
        description="주소 검색 로그를 확인하세요."
        keywords={['검색 로그', '주소 관리', COMPANY_INFO.name]}
        og={{
          title: `검색 로그 - ${COMPANY_INFO.name}`,
          description: '주소 검색 로그 조회',
          image: '/images/og-address.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 필터 */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex min-w-[200px] flex-1 items-center gap-2">
                <Input
                  placeholder="키워드로 검색..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-8"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  <Search className="size-3.5" />
                </Button>
              </div>
              <Input
                type="date"
                className="h-8 w-[150px]"
                onChange={(e) =>
                  setFilter((f) => ({
                    ...f,
                    startDate: e.target.value || undefined,
                  }))
                }
                disabled={isLoading}
              />
              <Input
                type="date"
                className="h-8 w-[150px]"
                onChange={(e) =>
                  setFilter((f) => ({
                    ...f,
                    endDate: e.target.value || undefined,
                  }))
                }
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={handleReset}
              >
                <RotateCcw className="mr-1 size-3.5" />
                초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && <ErrorAlert error={error} onRetry={() => fetchLogs()} />}

        {/* 로그 테이블 */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>키워드</TableHead>
                <TableHead>검색 타입</TableHead>
                <TableHead>결과 수</TableHead>
                <TableHead>실행 시간</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>검색일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.keyword}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {log.searchType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {log.resultCount}건
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {log.executionTime}ms
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.userIp ?? '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {format(new Date(log.createdAt), 'yyyy.MM.dd HH:mm', {
                        locale: ko,
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground h-24 text-center"
                  >
                    {isLoading ? '불러오는 중...' : '검색 로그가 없습니다.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
