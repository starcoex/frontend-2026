import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { usePromotions } from '@starcoex-frontend/promotions';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import type { Promotion } from '@starcoex-frontend/promotions';
import {
  PROMOTION_TOTAL_STEPS,
  PromotionCreateStepIndicator,
} from '@/app/pages/dashboard/ecommerce/promotions/create/components/promotion-create-step-indicator';
import { PromotionCreateStep1 } from '@/app/pages/dashboard/ecommerce/promotions/create/components/promotion-create-step1';
import { PromotionCreateStep2 } from '@/app/pages/dashboard/ecommerce/promotions/create/components/promotion-create-step2';
import { PromotionCreateStep3 } from '@/app/pages/dashboard/ecommerce/promotions/create/components/promotion-create-step3';
import { PromotionCreateStep4 } from '@/app/pages/dashboard/ecommerce/promotions/create/components/promotion-create-step4';
import {
  promotionFormSchema,
  PromotionFormValues,
} from '@/app/pages/dashboard/ecommerce/promotions/create/components/promotion-form-schema';

// ── Step별 유효성 검사 필드 ───────────────────────────────────────────────────
const STEP_FIELDS: Record<number, (keyof PromotionFormValues)[]> = {
  1: ['name'],
  2: ['type', 'discountType', 'discountValue'],
  3: ['startDate', 'endDate', 'perUserLimit', 'targetCustomers'],
  4: ['status', 'priority'],
};

const toDatetimeLocal = (iso: string) => iso.slice(0, 16);

// ── Props ────────────────────────────────────────────────────────────────────
interface PromotionFormProps {
  promotion?: Promotion;
  usedPriorities?: number[];
  onSuccess: (id: number) => void;
  onCancel: () => void;
}

export function PromotionForm({
  promotion,
  usedPriorities = [],
  onSuccess,
  onCancel,
}: PromotionFormProps) {
  const { createPromotion, updatePromotion, isLoading } = usePromotions();
  const { uploadMedia } = useMedia();
  const { currentUser } = useAuth();
  const isEdit = !!promotion;

  const [currentStep, setCurrentStep] = useState(1);

  // ── 이미지 상태 (Step2에서 관리, 여기서 ref로 보관) ─────────────────────
  const imageFileRef = useRef<File | null>(null);
  const bannerFileRef = useRef<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
    promotion?.imageUrl ?? null
  );
  const [existingBannerUrl, setExistingBannerUrl] = useState<string | null>(
    promotion?.bannerImageUrl ?? null
  );

  const handleImageChange = (
    type: 'image' | 'banner',
    file: File | null,
    existingUrl: string | null
  ) => {
    if (type === 'image') {
      imageFileRef.current = file;
      setExistingImageUrl(existingUrl);
    } else {
      bannerFileRef.current = file;
      setExistingBannerUrl(existingUrl);
    }
  };

  // 우선순위 계산
  const usedPrioritySet = new Set(usedPriorities);
  const nextPriority = (() => {
    let n = 0;
    while (usedPrioritySet.has(n)) n++;
    return n;
  })();

  // ── 폼 초기화 ────────────────────────────────────────────────────────────
  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      name: promotion?.name ?? '',
      code: promotion?.code ?? '',
      description: promotion?.description ?? '',
      type: promotion?.type ?? 'DISCOUNT',
      discountType: promotion?.discountType ?? 'FIXED',
      discountValue: promotion?.discountValue ?? 0,
      maxDiscount: promotion?.maxDiscount ?? undefined,
      minOrderAmount: promotion?.minOrderAmount ?? undefined,
      targetCustomers: promotion?.targetCustomers ?? 'ALL',
      startDate: promotion?.startDate
        ? toDatetimeLocal(promotion.startDate)
        : '',
      endDate: promotion?.endDate ? toDatetimeLocal(promotion.endDate) : '',
      totalLimit: promotion?.totalLimit ?? undefined,
      perUserLimit: promotion?.perUserLimit ?? 1,
      dailyLimit: promotion?.dailyLimit ?? undefined,
      stackable: promotion?.stackable ?? false,
      priority: promotion?.priority ?? nextPriority,
      autoApply: promotion?.autoApply ?? false,
      status: promotion?.status ?? 'DRAFT',
      isActive: promotion?.isActive ?? false,
      isVisible: promotion?.isVisible ?? true,
      marketingMessage: promotion?.marketingMessage ?? '',
      appliesToAllStores: promotion?.appliesToAllStores ?? true,
      appliesToAllProducts: promotion?.appliesToAllProducts ?? true,
      appliesToAllCategories: promotion?.appliesToAllCategories ?? true,
    },
  });

  // ── Step 네비게이션 ──────────────────────────────────────────────────────
  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const isValid = await form.trigger(fields);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  // ── 이미지 업로드 헬퍼 ──────────────────────────────────────────────────
  const uploadSingleImage = async (file: File): Promise<string | null> => {
    if (!currentUser?.id) return null;
    const res = await uploadMedia([file], currentUser.id);
    if (!res.success || !res.data) return null;
    const data = res.data;
    return data.files?.[0]?.fileUrl ?? data.fileUrl ?? null;
  };

  // ── 제출 ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data: PromotionFormValues) => {
    // 우선순위 중복 검사 (자신 제외)
    const otherPriorities = isEdit
      ? new Set(usedPriorities.filter((p) => p !== promotion.priority))
      : usedPrioritySet;
    if (otherPriorities.has(data.priority)) {
      form.setError('priority', { message: '이미 사용 중인 우선순위입니다.' });
      setCurrentStep(4);
      return;
    }

    // 코드 처리
    const trimmedCode = data.code?.trim();
    let resolvedCode: string | null | undefined;
    if (trimmedCode) resolvedCode = trimmedCode;
    else if (data.autoApply) resolvedCode = null;
    else resolvedCode = undefined;

    // 이미지 업로드
    let imageUrl: string | null | undefined = existingImageUrl;
    let bannerImageUrl: string | null | undefined = existingBannerUrl;

    if (imageFileRef.current) {
      const uploaded = await uploadSingleImage(imageFileRef.current);
      if (!uploaded) {
        toast.error('프로모션 이미지 업로드에 실패했습니다.');
        return;
      }
      imageUrl = uploaded;
    }
    if (bannerFileRef.current) {
      const uploaded = await uploadSingleImage(bannerFileRef.current);
      if (!uploaded) {
        toast.error('배너 이미지 업로드에 실패했습니다.');
        return;
      }
      bannerImageUrl = uploaded;
    }

    const payload = {
      ...data,
      code: resolvedCode,
      description: data.description || undefined,
      marketingMessage: data.marketingMessage || undefined,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      imageUrl: imageUrl ?? undefined,
      bannerImageUrl: bannerImageUrl ?? undefined,
    };

    if (isEdit && promotion) {
      const res = await updatePromotion({ ...payload, id: promotion.id });
      if (res.success && res.data) {
        toast.success('프로모션이 수정되었습니다.');
        onSuccess(res.data.id);
      } else {
        toast.error((res as any).error?.message ?? '수정에 실패했습니다.');
      }
    } else {
      const res = await createPromotion(payload as any);
      if (res.success && res.data) {
        toast.success('프로모션이 생성되었습니다.');
        onSuccess(res.data.id);
      } else {
        toast.error((res as any).error?.message ?? '생성에 실패했습니다.');
      }
    }
  };

  const isLastStep = currentStep === PROMOTION_TOTAL_STEPS;
  const isSubmitting = form.formState.isSubmitting || isLoading;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? `수정: ${promotion.name}` : '프로모션 생성'}
        </h1>
      </div>

      {/* Step 인디케이터 */}
      <PromotionCreateStepIndicator currentStep={currentStep} />

      {/* 폼 */}
      <Form {...form}>
        <div>
          {currentStep === 1 && <PromotionCreateStep1 form={form} />}
          {currentStep === 2 && (
            <PromotionCreateStep2
              form={form}
              onImageChange={handleImageChange}
              existingImageUrl={existingImageUrl}
              existingBannerUrl={existingBannerUrl}
            />
          )}
          {currentStep === 3 && <PromotionCreateStep3 form={form} />}
          {currentStep === 4 && (
            <PromotionCreateStep4
              form={form}
              usedPriorities={usedPriorities}
              isEdit={isEdit}
            />
          )}

          {/* 네비게이션 */}
          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? onCancel : handlePrev}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {currentStep === 1 ? '취소' : '이전'}
            </Button>

            {isLastStep ? (
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : isEdit ? (
                  '저장하기'
                ) : (
                  '프로모션 생성'
                )}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                다음
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}
