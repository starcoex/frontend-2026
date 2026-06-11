import { useEffect } from 'react';
import { Loader2, RefreshCw, User, CreditCard, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useApick } from '@starcoex-frontend/vehicles';

export default function ApickAccountPage() {
  const { accountInfo, isLoading, fetchApickAccountInfo, checkApickHealth } =
    useApick();

  useEffect(() => {
    fetchApickAccountInfo();
  }, [fetchApickAccountInfo]);

  if (isLoading && !accountInfo) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const data = accountInfo?.data;
  const api = accountInfo?.api;

  return (
    <>
      <PageHead
        title={`Apick 계정 정보 - ${COMPANY_INFO.name}`}
        description="Apick API 계정 정보와 포인트를 확인하세요."
        keywords={['Apick 계정', COMPANY_INFO.name]}
        og={{
          title: `Apick 계정 정보 - ${COMPANY_INFO.name}`,
          description: 'Apick 계정 정보',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => checkApickHealth()}
          >
            <Activity className="mr-1.5 h-3.5 w-3.5" />
            헬스체크
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchApickAccountInfo()}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            새로고침
          </Button>
        </div>

        {data && (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* 계정 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  계정 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">이메일</TableCell>
                      <TableCell>{data.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">회사명</TableCell>
                      <TableCell>{data.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">전화번호</TableCell>
                      <TableCell>{data.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">회사 정보</TableCell>
                      <TableCell>{data.company ?? '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        마지막 로그인
                      </TableCell>
                      <TableCell className="text-sm">
                        {data.lastLogin}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">상태</TableCell>
                      <TableCell>
                        <Badge
                          variant={data.isActive ? 'default' : 'secondary'}
                        >
                          {data.isActive ? '활성' : '비활성'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 포인트 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4" />
                  포인트 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">
                        보유 포인트
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        {data.point.toLocaleString()}P
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        사용 포인트
                      </TableCell>
                      <TableCell>{data.usedPoint.toLocaleString()}P</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        포인트 한도
                      </TableCell>
                      <TableCell>{data.pointLimit.toLocaleString()}P</TableCell>
                    </TableRow>
                    {data.billingPoint != null && (
                      <TableRow>
                        <TableCell className="font-semibold">
                          청구 포인트
                        </TableCell>
                        <TableCell>
                          {data.billingPoint.toLocaleString()}P
                        </TableCell>
                      </TableRow>
                    )}
                    {data.pointLimitNotice && (
                      <TableRow>
                        <TableCell className="font-semibold">
                          한도 공지
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {data.pointLimitNotice}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* 포인트 사용률 */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>포인트 사용률</span>
                    <span>
                      {data.pointLimit > 0
                        ? `${((data.usedPoint / data.pointLimit) * 100).toFixed(
                            1
                          )}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${
                          data.pointLimit > 0
                            ? Math.min(
                                (data.usedPoint / data.pointLimit) * 100,
                                100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* API 호출 정보 */}
        {api && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4" />
                마지막 API 호출 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">성공 여부: </span>
                  <Badge
                    variant={api.success ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {api.success ? '성공' : '실패'}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">비용: </span>
                  <span className="font-medium">{api.cost}원</span>
                </div>
                <div>
                  <span className="text-muted-foreground">응답시간: </span>
                  <span className="font-medium">{api.ms}ms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
