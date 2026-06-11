import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import {
  useVehicleManagement,
  VEHICLE_BODY_TYPES,
  VEHICLE_SIZE_GRADES,
} from '@starcoex-frontend/vehicles';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const VEHICLE_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning';
  }
> = {
  ACTIVE: { label: '정상', variant: 'success' as any },
  PENDING_VERIFICATION: { label: '등급 결정 대기', variant: 'warning' as any },
  MANUAL_REVIEW: { label: '관리자 검토 필요', variant: 'warning' as any },
  API_ERROR: { label: 'API 오류', variant: 'destructive' },
  INACTIVE: { label: '비활성', variant: 'secondary' },
};

const GRADE_CONFIDENCE_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  HIGH: { label: '높음 (차명 매칭)', variant: 'success' },
  MEDIUM: { label: '보통 (치수 산출)', variant: 'warning' },
  LOW: { label: '낮음 (폴백)', variant: 'secondary' },
  NONE: { label: '수동 검토 필요', variant: 'destructive' },
};

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentVehicle, isLoading, error, fetchVehicleById } =
    useVehicleManagement();

  useEffect(() => {
    if (id) fetchVehicleById(parseInt(id));
  }, [id, fetchVehicleById]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            차량 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !currentVehicle) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '차량을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/vehicles')}>
          차량 목록으로
        </Button>
      </div>
    );
  }

  const statusConfig = VEHICLE_STATUS_CONFIG[currentVehicle.status];
  const confidenceConfig = currentVehicle.gradeConfidence
    ? GRADE_CONFIDENCE_CONFIG[currentVehicle.gradeConfidence]
    : null;

  return (
    <>
      <PageHead
        title={`차량 ${currentVehicle.carNo} - ${COMPANY_INFO.name}`}
        description="차량 상세 정보"
        keywords={['차량 상세', currentVehicle.carNo, COMPANY_INFO.name]}
        og={{
          title: `차량 ${currentVehicle.carNo} - ${COMPANY_INFO.name}`,
          description: '차량 상세 정보',
          image: '/images/og-vehicles.jpg',
          type: 'website',
        }}
      />
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/admin/vehicles')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
                {currentVehicle.carNo}
              </h1>
              <p className="text-muted-foreground text-sm">
                {currentVehicle.ownerName} · {currentVehicle.apiCarName ?? '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusConfig?.variant as any}>
              {statusConfig?.label ?? currentVehicle.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchVehicleById(parseInt(id!))}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              새로고침
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">기본 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">차량번호</TableCell>
                    <TableCell className="font-mono">
                      {currentVehicle.carNo}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">소유자</TableCell>
                    <TableCell>{currentVehicle.ownerName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">표시명</TableCell>
                    <TableCell>{currentVehicle.displayName ?? '-'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">데이터 소스</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {currentVehicle.dataSource}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">등록일</TableCell>
                    <TableCell className="text-sm">
                      {format(
                        new Date(currentVehicle.createdAt),
                        'yyyy년 MM월 dd일',
                        { locale: ko }
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 등급 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">등급 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">사이즈 등급</TableCell>
                    <TableCell>
                      {currentVehicle.resolvedGrade ? (
                        <Badge variant="default">
                          {VEHICLE_SIZE_GRADES[currentVehicle.resolvedGrade]}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          미결정
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">차체 유형</TableCell>
                    <TableCell>
                      {currentVehicle.resolvedBody
                        ? VEHICLE_BODY_TYPES[currentVehicle.resolvedBody]
                        : '-'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">등급 출처</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {currentVehicle.gradeSource ?? '-'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">신뢰도</TableCell>
                    <TableCell>
                      {confidenceConfig ? (
                        <Badge
                          variant={confidenceConfig.variant as any}
                          className="text-xs"
                        >
                          {confidenceConfig.label}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* API 차량 정보 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">API 차량 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8 sm:grid-cols-3 lg:grid-cols-4">
                {[
                  { label: '차명', value: currentVehicle.apiCarName },
                  { label: '차종명', value: currentVehicle.apiCarTypeName },
                  {
                    label: '차종분류명',
                    value: currentVehicle.apiCarClassName,
                  },
                  { label: '연료', value: currentVehicle.apiFuelType },
                  { label: '색상', value: currentVehicle.apiColor },
                  { label: '모델연도', value: currentVehicle.apiModelYear },
                  {
                    label: '최초등록일',
                    value: currentVehicle.apiFirstRegDate,
                  },
                  {
                    label: '배기량',
                    value: currentVehicle.apiDisplacement
                      ? `${currentVehicle.apiDisplacement}cc`
                      : null,
                  },
                  {
                    label: '승차정원',
                    value: currentVehicle.apiSeatingCap
                      ? `${currentVehicle.apiSeatingCap}인`
                      : null,
                  },
                  {
                    label: '차체길이',
                    value: currentVehicle.apiBodyLength
                      ? `${currentVehicle.apiBodyLength}mm`
                      : null,
                  },
                  {
                    label: '차체너비',
                    value: currentVehicle.apiBodyWidth
                      ? `${currentVehicle.apiBodyWidth}mm`
                      : null,
                  },
                  {
                    label: '차체높이',
                    value: currentVehicle.apiBodyHeight
                      ? `${currentVehicle.apiBodyHeight}mm`
                      : null,
                  },
                ].map((item) => (
                  <div key={item.label} className="py-2">
                    <p className="text-muted-foreground text-xs">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium">{item.value ?? '-'}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 수정 이력 */}
          {currentVehicle.adminEdits.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">관리자 수정 이력</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentVehicle.adminEdits.map((edit) => (
                  <div
                    key={edit.id}
                    className="rounded-lg border px-4 py-3 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {edit.editType}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(edit.createdAt), 'MM/dd HH:mm', {
                          locale: ko,
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{edit.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
