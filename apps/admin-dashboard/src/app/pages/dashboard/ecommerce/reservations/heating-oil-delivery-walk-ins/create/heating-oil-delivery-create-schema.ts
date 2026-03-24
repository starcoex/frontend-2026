import { z } from 'zod';

export const HeatingOilDeliveryCreateSchema = z.object({
  storeId: z.number().min(1, '매장을 선택하세요.'),
  userId: z.number().min(1, '고객을 선택하세요.'),
  customerName: z.string().min(1, '고객명을 입력하세요.'),
  customerPhone: z.string().min(1, '연락처를 입력하세요.'),
  guestEmail: z.string().email().optional().or(z.literal('')),
  deliveryAddress: z.string().min(1, '배달 주소를 입력하세요.'),
  deliveryAddressDetail: z.string().optional(),
  fuelType: z.enum(['KEROSENE']),
  orderType: z.enum(['STANDARD', 'URGENT']),
  requestedLiters: z.number().min(1, '수량을 입력하세요.'),
  tankCapacity: z.number().optional(),
  tankCurrentLevel: z.number().optional(),
  serviceAmount: z.number().min(0),
  deliveryFee: z.number().min(0),
  urgentFee: z.number().min(0),
  totalAmount: z.number().min(0),
  paymentType: z.enum(['PREPAID', 'DEPOSIT', 'POSTPAID', 'FREE']),
  scheduledDate: z.string().min(1, '배달 날짜를 선택하세요.'),
  scheduledTimeSlot: z.string().min(1, '배달 시간대를 선택하세요.'),
  isUrgent: z.boolean(),
  urgentReason: z.string().optional(),
  notes: z.string().optional(),
});

export type HeatingOilDeliveryCreateFormValues = z.infer<
  typeof HeatingOilDeliveryCreateSchema
>;
