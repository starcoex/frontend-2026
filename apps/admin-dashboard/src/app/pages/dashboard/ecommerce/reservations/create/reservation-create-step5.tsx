import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useReservations } from '@starcoex-frontend/reservations';
import { useAuth } from '@starcoex-frontend/auth';
import {
  ReservationCreateSchema,
  type ReservationCreateFormValues,
} from './reservation-create-schema';
import {
  ReservationCreateStepIndicator,
  TOTAL_STEPS,
} from './reservation-create-step-indicator';
import { ReservationCreateStep1 } from './reservation-create-step1';
import { ReservationCreateStep2 } from './reservation-create-step2';
import { ReservationCreateStep3 } from './reservation-create-step3';
import { ReservationCreateStep4 } from './reservation-create-step4';

// Step별 유효성 검사 필드
const STEP_FIELDS: Record<number, (keyof ReservationCreateFormValues)[]> = {
  1: ['storeId', 'serviceIds'], // ← serviceId → serviceIds
  2: ['reservedDate', 'reservedStartTime', 'reservedEndTime'],
  3: ['customerName', 'customerPhone', 'partySize'],
  4: ['paymentType', 'serviceAmount', 'totalAmount', 'confirmationType'],
};

export default function ReservationCreatePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createReservation } = useReservations();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<ReservationCreateFormValues>({
    resolver: zodResolver(ReservationCreateSchema),
    defaultValues: {
      storeId: 0,
      serviceIds: [], // ← serviceId: 0 → serviceIds: []
      reservedDate: '',
      reservedStartTime: '',
      reservedEndTime: '',
      userId: 0, // ← 추가
      customerName: '',
      customerPhone: '',
      guestEmail: '',
      partySize: 1,
      specialRequests: '',
      paymentType: 'POSTPAID',
      serviceAmount: 0,
      depositAmount: 0,
      totalAmount: 0,
      confirmationType: 'AUTO',
      notes: '',
    },
  });

  // 다음 Step으로 이동 전 현재 Step 유효성 검사
  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const isValid = await form.trigger(fields);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const onSubmit = async (data: ReservationCreateFormValues) => {
    try {
      const res = await createReservation({
        storeId: data.storeId,
        serviceIds: data.serviceIds, // ← 배열 전달
        serviceId: data.serviceIds[0], // ← DB 저장용 (백엔드 트랜잭션에서 첫 번째 값 사용)
        timeSlotId: data.timeSlotId,
        resourceId: data.resourceId,
        reservedDate: data.reservedDate,
        reservedStartTime: data.reservedStartTime,
        reservedEndTime: data.reservedEndTime,
        userId: data.userId, // ← 추가
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
        totalAmount: data.totalAmount,
        notes: data.notes || undefined,
        createdById: currentUser?.id,
      });

      if (res.success) {
        toast.success('예약이 성공적으로 등록되었습니다!');
        navigate('/admin/reservations');
      } else {
        toast.error(res.error?.message ?? '예약 등록에 실패했습니다.');
      }
    } catch {
      toast.error('예약 등록 중 오류가 발생했습니다.');
    }
  };

  const isLastStep = currentStep === TOTAL_STEPS;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <PageHead
        title={`예약 추가 - ${COMPANY_INFO.name}`}
        description="새로운 예약을 등록하세요."
        keywords={['예약 추가', '예약 등록', COMPANY_INFO.name]}
        og={{
          title: `예약 추가 - ${COMPANY_INFO.name}`,
          description: '새로운 예약을 등록하세요.',
          image: '/images/og-reservations.jpg',
          type: 'website',
        }}
      />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/reservations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">예약 추가</h1>
        </div>

        {/* Step 인디케이터 */}
        <ReservationCreateStepIndicator currentStep={currentStep} />

        {/* 폼 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 1 && <ReservationCreateStep1 form={form} />}
            {currentStep === 2 && <ReservationCreateStep2 form={form} />}
            {currentStep === 3 && <ReservationCreateStep3 form={form} />}
            {currentStep === 4 && <ReservationCreateStep4 form={form} />}

            {/* 네비게이션 버튼 */}
            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? () => navigate(-1) : handlePrev}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                {currentStep === 1 ? '취소' : '이전'}
              </Button>

              {isLastStep ? (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      등록 중...
                    </>
                  ) : (
                    '예약 등록'
                  )}
                </Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  다음
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
