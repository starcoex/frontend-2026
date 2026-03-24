import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PageHead } from '@starcoex-frontend/common';
import { LoadingSpinner } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useReservations } from '@starcoex-frontend/reservations';
import { ReservationEditSectionCustomer } from './reservation-edit-section-customer';
import { ReservationEditSectionPayment } from './reservation-edit-section-payment';
import { RESERVATION_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/reservations/data/reservation-data';
import {
  ReservationEditFormValues,
  ReservationEditSchema,
} from '@/app/pages/dashboard/ecommerce/reservations/edit/reservation-edit-schema';
import { ReservationEditSectionSchedule } from '@/app/pages/dashboard/ecommerce/reservations/edit/reservation-edit-section-schedule';

export default function ReservationEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentReservation,
    error,
    fetchReservationById,
    updateReservationStatus,
  } = useReservations();
  const [isPageLoading, setIsPageLoading] = useState(true); // ← 로컬 상태 추가

  useEffect(() => {
    if (id) {
      setIsPageLoading(true);
      fetchReservationById(parseInt(id)).finally(() => {
        setIsPageLoading(false);
      });
    }
  }, [id, fetchReservationById]);

  const customerInfo = currentReservation?.customerInfo as Record<
    string,
    string
  > | null;

  const form = useForm<ReservationEditFormValues>({
    resolver: zodResolver(ReservationEditSchema),
    values: currentReservation
      ? {
          reservedDate: currentReservation.reservedDate,
          reservedStartTime: currentReservation.reservedStartTime,
          reservedEndTime: currentReservation.reservedEndTime,
          timeSlotId: currentReservation.timeSlotId ?? undefined,
          resourceId: currentReservation.resourceId ?? undefined,
          customerName: customerInfo?.name ?? customerInfo?.customerName ?? '',
          customerPhone:
            customerInfo?.phone ?? customerInfo?.customerPhone ?? '',
          guestEmail: currentReservation.guestEmail ?? '',
          partySize: currentReservation.partySize,
          specialRequests: currentReservation.specialRequests ?? '',
          vehicleId: currentReservation.vehicleId ?? undefined,
          paymentType: currentReservation.paymentType,
          serviceAmount: currentReservation.serviceAmount,
          depositAmount: currentReservation.depositAmount,
          additionalAmount: currentReservation.additionalAmount,
          totalAmount: currentReservation.totalAmount,
          status: currentReservation.status,
          confirmationType: currentReservation.confirmationType,
          notes: currentReservation.notes ?? '',
          reason: '',
        }
      : undefined,
  });

  if (isPageLoading) {
    // ← isLoading → isPageLoading
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

  const statusConfig = RESERVATION_STATUS_CONFIG[currentReservation.status];

  const onSubmit = async (data: ReservationEditFormValues) => {
    try {
      const res = await updateReservationStatus({
        reservationId: currentReservation.id,
        reservedDate: data.reservedDate,
        reservedStartTime: data.reservedStartTime,
        reservedEndTime: data.reservedEndTime,
        timeSlotId: data.timeSlotId,
        resourceId: data.resourceId,
        customerInfo: {
          name: data.customerName,
          phone: data.customerPhone,
          email: data.guestEmail,
        },
        guestEmail: data.guestEmail || undefined,
        partySize: data.partySize,
        specialRequests: data.specialRequests || undefined,
        vehicleId: data.vehicleId,
        paymentType: data.paymentType,
        serviceAmount: data.serviceAmount,
        depositAmount: data.depositAmount || 0,
        additionalAmount: data.additionalAmount || 0,
        totalAmount: data.totalAmount,
        status: data.status,
        notes: data.notes || undefined,
        reason: data.reason || undefined,
      });

      if (res.success) {
        toast.success('예약이 성공적으로 수정되었습니다!');
        navigate(`/admin/reservations/${currentReservation.id}`);
      } else {
        toast.error(res.error?.message ?? '예약 수정에 실패했습니다.');
      }
    } catch {
      toast.error('예약 수정 중 오류가 발생했습니다.');
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <PageHead
        title={`예약 수정 - ${currentReservation.reservationNumber} - ${COMPANY_INFO.name}`}
        description="예약 정보를 수정하세요."
        keywords={[
          '예약 수정',
          currentReservation.reservationNumber,
          COMPANY_INFO.name,
        ]}
        og={{
          title: `예약 수정 - ${COMPANY_INFO.name}`,
          description: '예약 정보를 수정하세요.',
          image: '/images/og-reservations.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link to={`/admin/reservations/${currentReservation.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
                  예약 수정
                </h1>
                <span className="text-muted-foreground font-mono text-sm">
                  {currentReservation.reservationNumber}
                </span>
                {statusConfig && (
                  <Badge variant={statusConfig.variant}>
                    {statusConfig.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/admin/reservations/${currentReservation.id}`)
              }
            >
              취소
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                '저장하기'
              )}
            </Button>
          </div>
        </div>

        {/* 탭 기반 수정 폼 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="schedule">
              <TabsList className="w-full">
                <TabsTrigger value="schedule" className="flex-1">
                  일정
                </TabsTrigger>
                <TabsTrigger value="customer" className="flex-1">
                  고객 정보
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex-1">
                  결제 / 상태
                </TabsTrigger>
              </TabsList>

              <TabsContent value="schedule" className="mt-4">
                <ReservationEditSectionSchedule
                  form={form}
                  serviceId={currentReservation.serviceId}
                />
              </TabsContent>

              <TabsContent value="customer" className="mt-4">
                <ReservationEditSectionCustomer form={form} />
              </TabsContent>

              <TabsContent value="payment" className="mt-4">
                <ReservationEditSectionPayment form={form} />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </>
  );
}
