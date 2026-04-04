import { z } from 'zod';

export const DeliveryFormSchema = z
  .object({
    sourceType: z.enum(['order', 'reservation', 'manual']),
    orderId: z.number().min(1).optional(),
    reservationId: z.number().min(1).optional(),

    storeId: z.string().min(1, { message: '매장을 선택해주세요.' }),

    itemCount: z
      .number({ message: '아이템 수를 입력해주세요.' })
      .min(1, { message: '아이템은 1개 이상이어야 합니다.' }),
    totalQuantity: z.number().min(0).optional(),

    specialInstructions: z.string().optional(),
    customerNotes: z.string().optional(),

    pickupRoadAddress: z
      .string()
      .min(2, { message: '픽업 주소를 입력해주세요.' }),
    pickupAddressDetail: z.string().optional(),
    pickupZipCode: z.string().optional(),
    // ✅ .default() 제거 → 명시적 boolean으로 타입 충돌 해결
    sameAsDelivery: z.boolean(),

    deliveryRoadAddress: z
      .string()
      .min(2, { message: '배송 주소를 입력해주세요.' }),
    deliveryAddressDetail: z.string().optional(),
    deliveryZipCode: z.string().optional(),

    deliveryFee: z.number({ message: '배송비를 입력해주세요.' }).min(0),
    driverFee: z.number({ message: '기사 수령액을 입력해주세요.' }).min(0),
    platformFee: z.number().min(0).optional(),

    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
  })
  .superRefine((data, ctx) => {
    if (data.sourceType === 'order' && !data.orderId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '주문을 선택해주세요.',
        path: ['orderId'],
      });
    }
    if (data.sourceType === 'reservation' && !data.reservationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '예약을 선택해주세요.',
        path: ['reservationId'],
      });
    }
  });

export type DeliveryFormValues = z.infer<typeof DeliveryFormSchema>;

export interface DeliverySourceData {
  storeId?: number;
  itemCount?: number;
  totalWeight?: number;
  customerNotes?: string;
  deliveryRoadAddress?: string;
  deliveryAddressDetail?: string;
  deliveryZipCode?: string;
}
