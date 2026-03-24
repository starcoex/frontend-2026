import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useReservations } from '@starcoex-frontend/reservations';
import { PageHead } from '@starcoex-frontend/common';
import { LoadingSpinner } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  CalendarDays,
  Clock,
  CircleDollarSign,
  User,
  Store,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Pencil,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';
import { RESERVATION_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentReservation,
    isLoading,
    error,
    fetchReservationById,
    cancelReservation,
    checkInReservation,
    checkOutReservation,
    updateReservationStatus,
  } = useReservations();

  useEffect(() => {
    if (id) fetchReservationById(parseInt(id));
  }, [id, fetchReservationById]);

  if (isLoading) {
    return <LoadingSpinner message="예약 정보를 불러오는 중..." />;
  }

  if (error || !currentReservation) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '예약을 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/reservations')}>
          예약 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const r = currentReservation;
  const statusConfig = RESERVATION_STATUS_CONFIG[r.status];
  const customerInfo = r.customerInfo as Record<string, string> | null;
  const customerName = customerInfo?.name ?? customerInfo?.customerName ?? '-';
  const customerPhone =
    customerInfo?.phone ?? customerInfo?.customerPhone ?? '-';

  // ── 액션 핸들러 ────────────────────────────────────────────────────────────

  const handleCheckIn = async () => {
    const res = await checkInReservation({ reservationId: r.id });
    if (res.success) toast.success('체크인 처리되었습니다.');
    else toast.error(res.error?.message ?? '체크인 실패');
  };

  const handleCheckOut = async () => {
    const res = await checkOutReservation({ reservationId: r.id });
    if (res.success) toast.success('체크아웃 처리되었습니다.');
    else toast.error(res.error?.message ?? '체크아웃 실패');
  };

  const handleConfirm = async () => {
    const res = await updateReservationStatus({
      reservationId: r.id,
      status: 'CONFIRMED',
    });
    if (res.success) toast.success('예약이 확정되었습니다.');
    else toast.error(res.error?.message ?? '확정 실패');
  };

  const handleCancel = async () => {
    const res = await cancelReservation({
      reservationId: r.id,
      cancellationReason: '관리자 취소',
    });
    if (res.success) toast.success('예약이 취소되었습니다.');
    else toast.error(res.error?.message ?? '취소 실패');
  };

  // ── 액션 버튼 표시 조건 ────────────────────────────────────────────────────
  const canConfirm = ['PAYMENT_PENDING', 'PENDING_APPROVAL'].includes(r.status);
  const canCheckIn = r.status === 'CONFIRMED';
  const canCheckOut = ['CHECKED_IN', 'IN_PROGRESS'].includes(r.status);
  const canCancel = !['CANCELLED', 'COMPLETED', 'REFUNDED'].includes(r.status);

  return (
    <>
      <PageHead
        title={`예약 ${r.reservationNumber} - ${COMPANY_INFO.name}`}
        description="예약 상세 정보"
        keywords={['예약 상세', r.reservationNumber, COMPANY_INFO.name]}
        og={{
          title: `예약 ${r.reservationNumber} - ${COMPANY_INFO.name}`,
          description: '예약 상세 정보',
          image: '/images/og-reservations.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* ── 헤더 ────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/reservations">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight lg:text-2xl">
                  {r.reservationNumber}
                </h1>
                {statusConfig && (
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.label}
                  </Badge>
                )}
                {r.isWalkIn && <Badge variant="secondary">워크인</Badge>}
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                등록일:{' '}
                {format(new Date(r.createdAt), 'yyyy.MM.dd HH:mm', {
                  locale: ko,
                })}
              </p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/reservations/${r.id}/edit`)}
            >
              <Pencil className="mr-1 h-4 w-4" />
              수정
            </Button>
            {canConfirm && (
              <Button onClick={handleConfirm} size="sm">
                <CheckCircle className="mr-1 h-4 w-4" />
                확정
              </Button>
            )}
            {canCheckIn && (
              <Button onClick={handleCheckIn} size="sm" variant="outline">
                <LogIn className="mr-1 h-4 w-4" />
                체크인
              </Button>
            )}
            {canCheckOut && (
              <Button onClick={handleCheckOut} size="sm" variant="outline">
                <LogOut className="mr-1 h-4 w-4" />
                체크아웃
              </Button>
            )}
            {canCancel && (
              <Button onClick={handleCancel} size="sm" variant="destructive">
                <XCircle className="mr-1 h-4 w-4" />
                취소
              </Button>
            )}
          </div>
        </div>

        {/* ── 스탯 카드 ────────────────────────────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CalendarDays,
              label: '예약일',
              value: format(new Date(r.reservedDate), 'yyyy.MM.dd (EEE)', {
                locale: ko,
              }),
            },
            {
              icon: Clock,
              label: '예약 시간',
              value: `${r.reservedStartTime} ~ ${r.reservedEndTime}`,
            },
            {
              icon: CircleDollarSign,
              label: '총 금액',
              value: `₩${r.totalAmount.toLocaleString()}`,
            },
            {
              icon: User,
              label: '고객',
              value: customerName,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="hover:border-primary/30 bg-muted grid auto-cols-max grid-flow-col gap-4 rounded-lg border p-4"
            >
              <item.icon className="size-6 opacity-40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">
                  {item.label}
                </span>
                <span className="text-lg font-semibold">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── 탭 ──────────────────────────────────────────────────────────── */}
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              개요
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex-1">
              결제
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">
              타임라인
            </TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* 고객 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="size-4 opacity-60" />
                    고객 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">이름</TableCell>
                        <TableCell className="text-right">
                          {customerName}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">연락처</TableCell>
                        <TableCell className="text-right">
                          {customerPhone}
                        </TableCell>
                      </TableRow>
                      {r.guestEmail && (
                        <TableRow>
                          <TableCell className="font-medium">이메일</TableCell>
                          <TableCell className="text-right">
                            {r.guestEmail}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-medium">인원</TableCell>
                        <TableCell className="text-right">
                          {r.partySize}명
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 예약 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Store className="size-4 opacity-60" />
                    예약 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">매장 ID</TableCell>
                        <TableCell className="text-right">
                          #{r.storeId}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">서비스 ID</TableCell>
                        <TableCell className="text-right">
                          #{r.serviceId}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">확정 방식</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">
                            {r.confirmationType === 'AUTO' ? '자동' : '수동'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">결제 방식</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{r.paymentType}</Badge>
                        </TableCell>
                      </TableRow>
                      {r.specialRequests && (
                        <TableRow>
                          <TableCell className="font-medium">
                            특이사항
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {r.specialRequests}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 메모 */}
              {r.notes && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="size-4 opacity-60" />
                      메모
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{r.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* 결제 탭 */}
          <TabsContent value="payment" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CircleDollarSign className="size-4 opacity-60" />
                  결제 정보
                </CardTitle>
                <CardAction>
                  <Badge
                    variant={
                      r.paymentStatus === 'FULLY_PAID'
                        ? 'success'
                        : r.paymentStatus === 'PENDING'
                        ? 'warning'
                        : 'outline'
                    }
                  >
                    {r.paymentStatus}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">서비스 금액</TableCell>
                      <TableCell className="text-right">
                        ₩{r.serviceAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    {r.depositAmount > 0 && (
                      <TableRow>
                        <TableCell className="font-medium">보증금</TableCell>
                        <TableCell className="text-right">
                          ₩{r.depositAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    {r.additionalAmount > 0 && (
                      <TableRow>
                        <TableCell className="font-medium">추가 금액</TableCell>
                        <TableCell className="text-right">
                          ₩{r.additionalAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="font-semibold">총액</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₩{r.totalAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-green-600">
                        결제 완료
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        ₩{r.paidAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                    {r.refundAmount > 0 && (
                      <TableRow>
                        <TableCell className="text-destructive font-medium">
                          환불액
                        </TableCell>
                        <TableCell className="text-destructive text-right font-medium">
                          ₩{r.refundAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 타임라인 탭 */}
          <TabsContent value="timeline" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">처리 이력</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: '예약 생성', time: r.createdAt },
                    { label: '결제 완료', time: r.paymentCompletedAt },
                    { label: '예약 확정', time: r.confirmedAt },
                    { label: '체크인', time: r.checkedInAt },
                    { label: '서비스 시작', time: r.serviceStartedAt },
                    { label: '완료', time: r.completedAt },
                    { label: '취소', time: r.cancelledAt },
                    { label: '환불 요청', time: r.refundRequestedAt },
                    { label: '환불 완료', time: r.refundCompletedAt },
                  ]
                    .filter((item) => !!item.time)
                    .map((item, index, arr) => (
                      <div key={item.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="bg-primary size-2.5 rounded-full mt-1" />
                          {index < arr.length - 1 && (
                            <div className="bg-border w-px flex-1 my-1" />
                          )}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-muted-foreground text-xs">
                            {format(new Date(item.time!), 'yyyy.MM.dd HH:mm', {
                              locale: ko,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}

                  {/* 이력이 생성일 하나뿐일 때 */}
                  {[
                    r.paymentCompletedAt,
                    r.confirmedAt,
                    r.checkedInAt,
                    r.completedAt,
                    r.cancelledAt,
                  ].every((t) => !t) && (
                    <p className="text-muted-foreground text-sm">
                      추가 이력이 없습니다.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
