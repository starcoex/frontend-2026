import { useEffect, useState } from 'react';
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
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';
import { RESERVATION_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';
import {
  formatReservationDate,
  formatReservationTime,
} from '@/app/utils/reservation-utils';
import { usePayments, type Payment } from '@starcoex-frontend/payments';
import {
  formatAmount,
  PAYMENT_STATUS_CONFIG,
} from '@/app/pages/dashboard/ecommerce/payments/data/payment-data';

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

  // ── 결제 정보 조회 ────────────────────────────────────────────────────────
  const { fetchPayments } = usePayments();
  const [reservationPayments, setReservationPayments] = useState<Payment[]>([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);

  useEffect(() => {
    if (id) fetchReservationById(parseInt(id));
  }, [id, fetchReservationById]);

  useEffect(() => {
    if (!id) return;
    setIsPaymentsLoading(true);
    fetchPayments({ reservationId: parseInt(id) })
      .then((res) => {
        if (res.success && res.data?.data?.payments) {
          setReservationPayments(res.data.data.payments);
        }
      })
      .finally(() => setIsPaymentsLoading(false));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 로딩 / 에러 ───────────────────────────────────────────────────────────
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

  // ── 액션 핸들러 ───────────────────────────────────────────────────────────
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
        {/* ── 헤더 ── */}
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

        {/* ── 스탯 카드 ── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CalendarDays,
              label: '예약일',
              value: formatReservationDate(r.reservedDate),
            },
            {
              icon: Clock,
              label: '예약 시간',
              value: `${formatReservationTime(
                r.reservedStartTime
              )} ~ ${formatReservationTime(r.reservedEndTime)}`,
            },
            {
              icon: CircleDollarSign,
              label: '결제 확인',
              value: r.paymentConfirmed ? '완료' : '미완료',
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

        {/* ── 탭 ── */}
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              개요
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex-1">
              결제
              {reservationPayments.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {reservationPayments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1">
              타임라인
            </TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
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
                        <TableCell className="font-medium">결제 확인</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={r.paymentConfirmed ? 'default' : 'outline'}
                          >
                            {r.paymentConfirmed ? '완료' : '미완료'}
                          </Badge>
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

          {/* ── 결제 탭 ── */}
          <TabsContent value="payment" className="mt-4">
            {isPaymentsLoading ? (
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  결제 정보를 불러오는 중...
                </span>
              </div>
            ) : reservationPayments.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CircleDollarSign className="size-4 opacity-60" />
                    결제 정보
                  </CardTitle>
                  <CardAction>
                    <Badge variant={r.paymentConfirmed ? 'success' : 'warning'}>
                      {r.paymentConfirmed ? '결제 완료' : '결제 미완료'}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    연결된 결제 내역이 없습니다.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {reservationPayments.map((payment) => {
                  const paymentStatusConfig =
                    PAYMENT_STATUS_CONFIG[payment.status];
                  return (
                    <Card key={payment.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <CircleDollarSign className="size-4 opacity-60" />
                          {payment.orderName}
                        </CardTitle>
                        <CardAction>
                          <div className="flex items-center gap-2">
                            {paymentStatusConfig && (
                              <Badge variant={paymentStatusConfig.variant}>
                                {paymentStatusConfig.label}
                              </Badge>
                            )}
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/admin/payments/${payment.portOneId}`}>
                                <ExternalLink className="mr-1 h-3 w-3" />
                                상세 보기
                              </Link>
                            </Button>
                          </div>
                        </CardAction>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">
                                결제 금액
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatAmount(payment.amount, payment.currency)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">
                                포트원 ID
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                {payment.portOneId}
                              </TableCell>
                            </TableRow>
                            {payment.paidAt && (
                              <TableRow>
                                <TableCell className="font-medium">
                                  결제 완료일
                                </TableCell>
                                <TableCell className="text-right text-sm">
                                  {format(
                                    new Date(payment.paidAt),
                                    'yyyy.MM.dd HH:mm',
                                    { locale: ko }
                                  )}
                                </TableCell>
                              </TableRow>
                            )}
                            {payment.cancellations.length > 0 && (
                              <TableRow>
                                <TableCell className="font-medium">
                                  취소 내역
                                </TableCell>
                                <TableCell className="text-right text-sm">
                                  {payment.cancellations.length}건 취소됨
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
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
                    { label: '예약 확정', time: r.confirmedAt },
                    { label: '체크인', time: r.checkedInAt },
                    { label: '서비스 시작', time: r.serviceStartedAt },
                    { label: '완료', time: r.completedAt },
                    { label: '취소', time: r.cancelledAt },
                  ]
                    .filter((item) => !!item.time)
                    .map((item, index, arr) => (
                      <div key={item.label} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="bg-primary mt-1 size-2.5 rounded-full" />
                          {index < arr.length - 1 && (
                            <div className="bg-border my-1 w-px flex-1" />
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
                  {[
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
