import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PageHead, LoadingSpinner } from '@starcoex-frontend/common';
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
  ArrowLeft,
  CreditCard,
  CircleDollarSign,
  XCircle,
  FileText,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { usePayments } from '@starcoex-frontend/payments';
import {
  PAYMENT_STATUS_CONFIG,
  CANCELLATION_STATUS_CONFIG,
  formatAmount,
} from '../data/payment-data';
import { CancelPaymentDialog } from '../components/cancel-payment-dialog';

export default function PaymentDetailPage() {
  const { portOneId } = useParams<{ portOneId: string }>();
  const navigate = useNavigate();
  const [cancelOpen, setCancelOpen] = useState(false);

  const {
    selectedPayment,
    isLoading,
    isSubmitting,
    error,
    fetchPaymentById,
    setSelectedPayment,
  } = usePayments();

  useEffect(() => {
    if (portOneId) {
      fetchPaymentById({ portOneId });
    }
    return () => {
      setSelectedPayment(null);
    };
  }, [portOneId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefetch = () => {
    if (portOneId) fetchPaymentById({ portOneId });
  };

  if (isLoading) {
    return <LoadingSpinner message="결제 정보를 불러오는 중..." />;
  }

  if (error || !selectedPayment) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '결제 정보를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/payments')}>
          결제 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const payment = selectedPayment;
  const statusConfig = PAYMENT_STATUS_CONFIG[payment.status];
  const canCancel = ['PAID', 'PARTIAL_CANCELLED'].includes(payment.status);

  return (
    <>
      <PageHead
        title={`결제 ${payment.portOneId} - ${COMPANY_INFO.name}`}
        description="결제 상세 정보"
        keywords={['결제 상세', payment.portOneId, COMPANY_INFO.name]}
        og={{
          title: `결제 ${payment.portOneId} - ${COMPANY_INFO.name}`,
          description: '결제 상세 정보',
          image: '/images/og-payments.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* ── 헤더 ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/payments">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight lg:text-2xl">
                  {payment.orderName}
                </h1>
                {statusConfig && (
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.label}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1 font-mono text-sm">
                {payment.portOneId}
              </p>
              <p className="text-muted-foreground mt-0.5 text-sm">
                등록일:{' '}
                {format(new Date(payment.createdAt), 'yyyy.MM.dd HH:mm', {
                  locale: ko,
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setCancelOpen(true)}
                disabled={isSubmitting}
              >
                <XCircle className="mr-1 h-4 w-4" />
                결제 취소
              </Button>
            )}
          </div>
        </div>

        {/* ── 스탯 카드 ── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CircleDollarSign,
              label: '결제 금액',
              value: formatAmount(payment.amount, payment.currency),
            },
            {
              icon: CreditCard,
              label: '통화',
              value: payment.currency,
            },
            {
              icon: User,
              label: '사용자',
              value: payment.userId
                ? `#${payment.userId}`
                : payment.guestEmail ?? '비회원',
            },
            {
              icon: FileText,
              label: '예약 ID',
              value: payment.reservationId ? `#${payment.reservationId}` : '-',
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
            <TabsTrigger value="cancellations" className="flex-1">
              취소 내역
              {payment.cancellations.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {payment.cancellations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="raw" className="flex-1">
              원본 데이터
            </TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="size-4 opacity-60" />
                    결제 정보
                  </CardTitle>
                  <CardAction>
                    {statusConfig && (
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    )}
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">포트원 ID</TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {payment.portOneId}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">주문명</TableCell>
                        <TableCell className="text-right">
                          {payment.orderName}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">결제 금액</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatAmount(payment.amount, payment.currency)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">통화</TableCell>
                        <TableCell className="text-right">
                          {payment.currency}
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
                      <TableRow>
                        <TableCell className="font-medium">등록일</TableCell>
                        <TableCell className="text-right text-sm">
                          {format(
                            new Date(payment.createdAt),
                            'yyyy.MM.dd HH:mm',
                            { locale: ko }
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="size-4 opacity-60" />
                    연결 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {payment.userId && (
                        <TableRow>
                          <TableCell className="font-medium">
                            사용자 ID
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            #{payment.userId}
                          </TableCell>
                        </TableRow>
                      )}
                      {payment.guestEmail && (
                        <TableRow>
                          <TableCell className="font-medium">
                            비회원 이메일
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {payment.guestEmail}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-medium">주문 ID</TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          #{payment.orderId}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">예약 ID</TableCell>
                        <TableCell className="text-right">
                          {payment.reservationId ? (
                            <Link
                              to={`/admin/reservations/${payment.reservationId}`}
                              className="text-primary font-mono text-sm hover:underline"
                            >
                              #{payment.reservationId}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 취소 내역 탭 */}
          <TabsContent value="cancellations" className="mt-4">
            {payment.cancellations.length === 0 ? (
              <Card>
                <CardContent className="flex h-32 items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    취소 내역이 없습니다.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {payment.cancellations.map((c) => {
                  const cancelConfig = CANCELLATION_STATUS_CONFIG[c.status];
                  return (
                    <Card key={c.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <XCircle className="size-4 opacity-60" />
                          취소 #{c.cancellationId}
                        </CardTitle>
                        <CardAction>
                          {cancelConfig && (
                            <Badge variant={cancelConfig.variant}>
                              {cancelConfig.label}
                            </Badge>
                          )}
                        </CardAction>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">
                                취소 금액
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatAmount(
                                  c.cancelledAmount,
                                  payment.currency
                                )}
                              </TableCell>
                            </TableRow>
                            {c.reason && (
                              <TableRow>
                                <TableCell className="font-medium">
                                  취소 사유
                                </TableCell>
                                <TableCell className="text-right text-sm">
                                  {c.reason}
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell className="font-medium">
                                요청 시간
                              </TableCell>
                              <TableCell className="text-right text-sm">
                                {format(
                                  new Date(c.requestedAt),
                                  'yyyy.MM.dd HH:mm',
                                  { locale: ko }
                                )}
                              </TableCell>
                            </TableRow>
                            {c.completedAt && (
                              <TableRow>
                                <TableCell className="font-medium">
                                  완료 시간
                                </TableCell>
                                <TableCell className="text-right text-sm">
                                  {format(
                                    new Date(c.completedAt),
                                    'yyyy.MM.dd HH:mm',
                                    { locale: ko }
                                  )}
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

          {/* 원본 데이터 탭 */}
          <TabsContent value="raw" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">포트원 응답 원본</CardTitle>
              </CardHeader>
              <CardContent>
                {payment.portoneData ? (
                  <pre className="bg-muted overflow-auto rounded-md p-4 text-xs">
                    {JSON.stringify(payment.portoneData, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    원본 데이터가 없습니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <CancelPaymentDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        payment={payment}
        onSuccess={() => {
          setCancelOpen(false);
          handleRefetch();
        }}
      />
    </>
  );
}
