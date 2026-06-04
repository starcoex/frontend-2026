import { useCallback, useEffect, useState } from 'react';
import {
  LoadingSpinner,
  PageHead,
  ErrorAlert,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useDelivery } from '@starcoex-frontend/delivery';
import type {
  DeliveryFeePolicy,
  CreateDeliveryFeePolicyInput,
  UpdateDeliveryFeePolicyInput,
} from '@starcoex-frontend/delivery';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DeliveryFeePolicySchema,
  type DeliveryFeePolicyFormValues,
  CalcFeeSchema,
  type CalcFeeFormValues,
} from './delivery-pricing-form.schema';
import { IconPlus, IconCalculator } from '@tabler/icons-react';
import { DeliveryPricingTable } from '@/app/pages/dashboard/ecommerce/delivery/pricing/components/delivery-pricing-table';

export default function DeliveryPricingPage() {
  const {
    fetchDeliveryFeePolicies,
    createDeliveryFeePolicy,
    updateDeliveryFeePolicy,
    calculateDeliveryFee,
    isLoading,
    error,
  } = useDelivery();

  const [policies, setPolicies] = useState<DeliveryFeePolicy[]>([]);
  const [editTarget, setEditTarget] = useState<DeliveryFeePolicy | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcResult, setCalcResult] = useState<{
    deliveryFee: number;
    driverFee: number;
    platformFee: number;
  } | null>(null);

  const form = useForm<DeliveryFeePolicyFormValues>({
    resolver: zodResolver(DeliveryFeePolicySchema),
    defaultValues: {
      name: '',
      description: '',
      baseFee: 0,
      driverRatio: 80,
      platformFee: 0,
      isDefault: false,
    },
  });

  const calcForm = useForm<CalcFeeFormValues>({
    resolver: zodResolver(CalcFeeSchema),
    defaultValues: { distanceKm: 0, priority: 'NORMAL' },
  });

  const loadPolicies = useCallback(async () => {
    const res = await fetchDeliveryFeePolicies();
    if (res.success && res.data?.policies) {
      setPolicies(res.data.policies);
    }
  }, [fetchDeliveryFeePolicies]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  const openCreate = () => {
    setEditTarget(null);
    form.reset({
      name: '',
      description: '',
      baseFee: 0,
      driverRatio: 80,
      platformFee: 0,
      isDefault: false,
    });
    setIsFormOpen(true);
  };

  const openEdit = (policy: DeliveryFeePolicy) => {
    setEditTarget(policy);
    form.reset({
      name: policy.name,
      description: policy.description ?? '',
      baseFee: policy.baseFee,
      driverRatio: policy.driverRatio,
      platformFee: policy.platformFee,
      perKmFee: policy.perKmFee ?? undefined,
      freeKm: policy.freeKm ?? undefined,
      highPriorityRate: policy.highPriorityRate ?? undefined,
      urgentPriorityRate: policy.urgentPriorityRate ?? undefined,
      isDefault: policy.isDefault,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (values: DeliveryFeePolicyFormValues) => {
    if (editTarget) {
      const input: UpdateDeliveryFeePolicyInput = {
        id: editTarget.id,
        ...values,
      };
      const res = await updateDeliveryFeePolicy(input);
      if (res.success && res.data?.policy) {
        setPolicies((prev) =>
          prev.map((p) => (p.id === editTarget.id ? res.data!.policy! : p))
        );
        setIsFormOpen(false);
      }
    } else {
      const input: CreateDeliveryFeePolicyInput = values;
      const res = await createDeliveryFeePolicy(input);
      if (res.success && res.data?.policy) {
        setPolicies((prev) => [...prev, res.data!.policy!]);
        setIsFormOpen(false);
      }
    }
  };

  const handleCalc = async (values: CalcFeeFormValues) => {
    const res = await calculateDeliveryFee(values);
    if (res.success && res.data) setCalcResult(res.data);
  };

  if (isLoading && policies.length === 0) {
    return <LoadingSpinner message="배달비 정책을 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`배달비 정책 - ${COMPANY_INFO.name}`}
        description="배달비 정책을 관리하고 배달비를 계산하세요."
        keywords={['배달비', '정책', '수수료', COMPANY_INFO.name]}
        og={{
          title: `배달비 정책 - ${COMPANY_INFO.name}`,
          description: '배달비 정책 관리',
          image: '/images/og-delivery.jpg',
          type: 'website',
        }}
      />

      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          총 {policies.length}개 정책
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCalcOpen(true)}
          >
            <IconCalculator className="mr-1.5 h-4 w-4" />
            배달비 계산기
          </Button>
          <Button size="sm" onClick={openCreate}>
            <IconPlus className="mr-1.5 h-4 w-4" />
            정책 등록
          </Button>
        </div>
      </div>

      {error && <ErrorAlert error={error} onRetry={loadPolicies} />}

      {!error && (
        <DeliveryPricingTable
          data={policies}
          onEdit={openEdit}
          onDeleted={(id) =>
            setPolicies((prev) => prev.filter((p) => p.id !== id))
          }
          onDeleteSuccess={loadPolicies}
        />
      )}

      {/* ── 정책 등록/수정 다이얼로그 ── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editTarget ? '배달비 정책 수정' : '배달비 정책 등록'}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>정책명 *</Label>
                <Input
                  {...form.register('name')}
                  placeholder="예: 기본 배달비 정책"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-xs">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label>설명</Label>
                <Input
                  {...form.register('description')}
                  placeholder="정책 설명 (선택)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>기본 배달비 (₩) *</Label>
                <Input
                  type="number"
                  step="100"
                  {...form.register('baseFee', { valueAsNumber: true })}
                />
                {form.formState.errors.baseFee && (
                  <p className="text-destructive text-xs">
                    {form.formState.errors.baseFee.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label>기사 수령 비율 (%) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...form.register('driverRatio', { valueAsNumber: true })}
                />
                {form.formState.errors.driverRatio && (
                  <p className="text-destructive text-xs">
                    {form.formState.errors.driverRatio.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label>플랫폼 수수료 (₩)</Label>
                <Input
                  type="number"
                  step="100"
                  {...form.register('platformFee', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1">
                <Label>km당 추가 요금 (₩)</Label>
                <Input
                  type="number"
                  step="100"
                  {...form.register('perKmFee', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1">
                <Label>무료 기본 거리 (km)</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...form.register('freeKm', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>HIGH 할증률 (%)</Label>
                <Input
                  type="number"
                  step="1"
                  {...form.register('highPriorityRate', {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="space-y-1">
                <Label>URGENT 할증률 (%)</Label>
                <Input
                  type="number"
                  step="1"
                  {...form.register('urgentPriorityRate', {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.watch('isDefault')}
                onCheckedChange={(v) => form.setValue('isDefault', v)}
              />
              <Label>기본 정책으로 설정</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '처리 중...' : editTarget ? '수정 완료' : '등록'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── 배달비 계산기 다이얼로그 ── */}
      <Dialog
        open={isCalcOpen}
        onOpenChange={(v) => {
          setIsCalcOpen(v);
          if (!v) setCalcResult(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>배달비 계산기</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={calcForm.handleSubmit(handleCalc)}
            className="space-y-4"
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>배송 거리 (km)</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...calcForm.register('distanceKm', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1">
                <Label>우선순위</Label>
                <select
                  {...calcForm.register('priority')}
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>정책 ID (미입력 시 기본 정책)</Label>
                <Input
                  type="number"
                  placeholder="선택 사항"
                  {...calcForm.register('policyId', { valueAsNumber: true })}
                />
              </div>
            </div>

            {calcResult && (
              <div className="space-y-1 rounded-md bg-muted/50 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">고객 배달비</span>
                  <span className="font-medium">
                    ₩{calcResult.deliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">기사 수령액</span>
                  <span className="font-medium text-green-600">
                    ₩{calcResult.driverFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">플랫폼 수수료</span>
                  <span className="font-medium">
                    ₩{calcResult.platformFee.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                <IconCalculator className="mr-1.5 h-4 w-4" />
                계산하기
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
