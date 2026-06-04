import { z } from 'zod';

export const DriverProfileSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  phone: z.string().min(9, '올바른 전화번호를 입력해주세요.'),
  email: z
    .string()
    .email('올바른 이메일을 입력해주세요.')
    .optional()
    .or(z.literal('')),
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'CAR', 'TRUCK']),
  vehicleNumber: z.string().optional(),
  vehicleModel: z.string().optional(),
  // ✅ 신규: 담당 지역 — 자유 입력 string 배열
  workingAreas: z
    .array(z.string().min(1))
    .min(1, '담당 지역을 1개 이상 입력해주세요.'),
});

export type DriverProfileFormValues = z.infer<typeof DriverProfileSchema>;
