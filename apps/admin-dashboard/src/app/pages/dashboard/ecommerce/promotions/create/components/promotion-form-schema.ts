import { z } from 'zod';

// ── 스키마 ───────────────────────────────────────────────────────────────────
export const promotionFormSchema = z.object({
  name: z.string().min(2, '프로모션명은 최소 2자 이상이어야 합니다.'),
  code: z.string().optional(),
  description: z.string().optional(),
  type: z.enum([
    'COUPON',
    'DISCOUNT',
    'BOGO',
    'FREE_SHIPPING',
    'POINT_MULTIPLIER',
    'BUNDLE',
    'TIME_BASED',
    'MEMBERSHIP',
  ]),
  discountType: z.enum(['FIXED', 'PERCENTAGE', 'FREE_ITEM', 'UPGRADE']),
  discountValue: z.number().min(0, '0 이상이어야 합니다.'),
  maxDiscount: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  targetCustomers: z.enum([
    'ALL',
    'NEW_CUSTOMERS',
    'EXISTING_CUSTOMERS',
    'VIP',
    'SPECIFIC_SEGMENT',
  ]),
  startDate: z.string().min(1, '시작 날짜를 입력하세요.'),
  endDate: z.string().min(1, '종료 날짜를 입력하세요.'),
  totalLimit: z.number().int().min(1).optional(),
  perUserLimit: z.number().int().min(1, '1 이상이어야 합니다.'),
  dailyLimit: z.number().int().min(1).optional(),
  stackable: z.boolean(),
  priority: z.number().int().min(0, '0 이상이어야 합니다.'),
  autoApply: z.boolean(),
  status: z.enum([
    'DRAFT',
    'PENDING_APPROVAL',
    'APPROVED',
    'ACTIVE',
    'PAUSED',
    'ENDED',
    'CANCELLED',
  ]),
  isActive: z.boolean(),
  isVisible: z.boolean(),
  marketingMessage: z.string().optional(),
  appliesToAllStores: z.boolean(),
  appliesToAllProducts: z.boolean(),
  appliesToAllCategories: z.boolean(),
});

export type PromotionFormValues = z.infer<typeof promotionFormSchema>;
