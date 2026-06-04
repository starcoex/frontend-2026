import { z } from 'zod';

export const DeliveryFeePolicySchema = z.object({
  name: z.string().min(1, '정책명을 입력하세요.'),
  description: z.string().optional(),
  baseFee: z
    .number({ message: '기본 배달비를 입력하세요.' })
    .min(0, '0 이상 입력하세요.'),
  driverRatio: z
    .number({ message: '기사 수령 비율을 입력하세요.' })
    .min(0)
    .max(100, '0~100 사이 값을 입력하세요.'),
  platformFee: z.number().min(0),
  perKmFee: z.number().min(0).optional(),
  freeKm: z.number().min(0).optional(),
  highPriorityRate: z.number().min(0).optional(),
  urgentPriorityRate: z.number().min(0).optional(),
  isDefault: z.boolean(),
});

export type DeliveryFeePolicyFormValues = z.infer<
  typeof DeliveryFeePolicySchema
>;

export const CalcFeeSchema = z.object({
  distanceKm: z.number().min(0).optional(),
  priority: z.string().optional(),
  policyId: z.number().optional(),
});

export type CalcFeeFormValues = z.infer<typeof CalcFeeSchema>;
