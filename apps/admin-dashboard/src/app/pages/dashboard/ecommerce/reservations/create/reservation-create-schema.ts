import { z } from 'zod';

export const ReservationCreateSchema = z.object({
  storeId: z.number().min(1, '매장을 선택하세요.'),
  serviceIds: z.array(z.number()).min(1, '서비스를 1개 이상 선택하세요.'),
  reservedDate: z.string().min(1, '날짜를 선택하세요.'),
  reservedStartTime: z.string().min(1, '시작 시간을 선택하세요.'),
  reservedEndTime: z.string().min(1, '종료 시간을 선택하세요.'),
  timeSlotId: z.number().optional(),
  resourceId: z.number().optional(),

  userId: z.number().min(1, '고객을 선택하세요.'), // ← 추가
  customerName: z.string().min(1, '고객명을 입력하세요.'),
  customerPhone: z.string().min(1, '연락처를 입력하세요.'),
  guestEmail: z
    .string()
    .email('올바른 이메일을 입력하세요.')
    .optional()
    .or(z.literal('')),
  partySize: z.number().min(1, '인원을 입력하세요.'),
  specialRequests: z.string().optional(),
  vehicleId: z.number().optional(),

  paymentType: z.enum(['PREPAID', 'DEPOSIT', 'POSTPAID', 'FREE']),
  serviceAmount: z.number().min(0, '금액을 입력하세요.'),
  depositAmount: z.number().min(0).optional(),
  totalAmount: z.number().min(0),
  notes: z.string().optional(),
  confirmationType: z.enum(['AUTO', 'MANUAL']),
});

export type ReservationCreateFormValues = z.infer<
  typeof ReservationCreateSchema
>;
