import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageHead, LoadingSpinner } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useLoyalty } from '@starcoex-frontend/loyalty';

const settingsSchema = z.object({
  welcomeStars: z.number().int().min(0, '0 이상이어야 합니다.'),
  welcomeCouponDays: z.number().int().min(1, '1 이상이어야 합니다.'),
  couponCost: z.number().int().min(1, '1 이상이어야 합니다.'),
  starExpiryYears: z.number().int().min(1, '1 이상이어야 합니다.'),
  tierThresholdShine: z.number().int().min(1, '1 이상이어야 합니다.'),
  tierThresholdStar: z.number().int().min(1, '1 이상이어야 합니다.'),
  earningRateGas: z.number().int().min(0, '0 이상이어야 합니다.'),
  earningRateOil: z.number().int().min(0, '0 이상이어야 합니다.'),
  earningRateCarCare: z.number().int().min(0, '0 이상이어야 합니다.'),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function LoyaltySettingsPage() {
  const { adminGetMembershipConfig, adminUpdateMembershipConfig, isLoading } =
    useLoyalty();

  const [pageLoading, setPageLoading] = useState(true);

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      welcomeStars: 0,
      welcomeCouponDays: 30,
      couponCost: 100,
      starExpiryYears: 1,
      tierThresholdShine: 0,
      tierThresholdStar: 0,
      earningRateGas: 0,
      earningRateOil: 0,
      earningRateCarCare: 0,
    },
  });

  // ✅ adminGetMembershipConfig (flat DB 엔티티)로 초기 데이터 로드
  useEffect(() => {
    const loadConfig = async () => {
      setPageLoading(true);
      try {
        const res = await adminGetMembershipConfig();
        if (res.success && res.data) {
          const c = res.data;
          form.reset({
            welcomeStars: c.welcomeStars,
            welcomeCouponDays: c.welcomeCouponDays,
            couponCost: c.couponCost,
            starExpiryYears: c.starExpiryYears,
            tierThresholdShine: c.tierThresholdShine,
            tierThresholdStar: c.tierThresholdStar,
            earningRateGas: c.earningRateGas,
            earningRateOil: c.earningRateOil,
            earningRateCarCare: c.earningRateCarCare,
          });
        } else {
          toast.error('멤버십 설정을 불러오는데 실패했습니다.');
        }
      } catch {
        toast.error('멤버십 설정을 불러오는데 실패했습니다.');
      } finally {
        setPageLoading(false);
      }
    };

    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 실제 저장 연동
  const onSubmit = async (data: SettingsForm) => {
    const res = await adminUpdateMembershipConfig({
      welcomeStars: data.welcomeStars,
      welcomeCouponDays: data.welcomeCouponDays,
      couponCost: data.couponCost,
      starExpiryYears: data.starExpiryYears,
      tierThresholdShine: data.tierThresholdShine,
      tierThresholdStar: data.tierThresholdStar,
      earningRateGas: data.earningRateGas,
      earningRateOil: data.earningRateOil,
      earningRateCarCare: data.earningRateCarCare,
    });

    if (res.success) {
      toast.success('멤버십 설정이 저장되었습니다.', {
        description: res.data?.message ?? '설정이 성공적으로 적용되었습니다.',
      });
      // 저장된 config로 폼 재동기화
      if (res.data?.config) {
        const c = res.data.config;
        form.reset({
          welcomeStars: c.welcomeStars,
          welcomeCouponDays: c.welcomeCouponDays,
          couponCost: c.couponCost,
          starExpiryYears: c.starExpiryYears,
          tierThresholdShine: c.tierThresholdShine,
          tierThresholdStar: c.tierThresholdStar,
          earningRateGas: c.earningRateGas,
          earningRateOil: c.earningRateOil,
          earningRateCarCare: c.earningRateCarCare,
        });
      }
    } else {
      toast.error('설정 저장에 실패했습니다.', {
        description:
          (res as any).error?.message ?? '잠시 후 다시 시도해주세요.',
      });
    }
  };

  if (pageLoading) {
    return <LoadingSpinner message="멤버십 설정을 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`멤버십 설정 - ${COMPANY_INFO.name}`}
        description="멤버십 등급 기준과 별 적립률을 설정합니다."
        keywords={['멤버십 설정', '등급 기준', '별 적립률', COMPANY_INFO.name]}
        og={{ title: `멤버십 설정 - ${COMPANY_INFO.name}`, type: 'website' }}
      />

      <div className="mx-auto max-w-2xl space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 웰컴 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>웰컴 혜택</CardTitle>
                <CardDescription>
                  신규 회원 가입 시 제공되는 초기 혜택을 설정합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="welcomeStars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>웰컴 별 개수</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        가입 시 지급되는 별 수량
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="welcomeCouponDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>웰컴 쿠폰 유효기간 (일)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        웰컴 쿠폰의 유효기간 (단위: 일)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 쿠폰·별 기본 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>쿠폰 · 별 기본 설정</CardTitle>
                <CardDescription>
                  쿠폰 교환 비용과 별 유효기간을 설정합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="couponCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>쿠폰 교환 비용 (별)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        쿠폰 1개 교환에 필요한 별 수량
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="starExpiryYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>별 유효기간 (년)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        적립된 별의 유효기간 (단위: 년)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 등급 기준 */}
            <Card>
              <CardHeader>
                <CardTitle>등급 승급 기준</CardTitle>
                <CardDescription>
                  각 등급으로 승급하기 위해 필요한 최소 별 수량입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="tierThresholdShine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SHINE 등급 기준 (별)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tierThresholdStar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>STAR 등급 기준 (별)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 별 적립률 */}
            <Card>
              <CardHeader>
                <CardTitle>서비스별 별 적립률</CardTitle>
                <CardDescription>
                  만원(10,000원) 결제 시 적립되는 별 수량입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="earningRateGas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주유 (별/만원)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="earningRateOil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>난방유 (별/만원)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="earningRateCarCare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카케어 (별/만원)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isLoading}
              >
                {form.formState.isSubmitting || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  '설정 저장'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
