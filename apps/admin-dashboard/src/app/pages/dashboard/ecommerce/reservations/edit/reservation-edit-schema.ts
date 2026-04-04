import { z } from 'zod';

export const ReservationEditSchema = z.object({
  reservedDate: z.string().min(1, '날짜를 선택하세요.'),
  reservedStartTime: z.string().min(1, '시작 시간을 선택하세요.'),
  reservedEndTime: z.string().min(1, '종료 시간을 선택하세요.'),
  timeSlotId: z.number().optional(),
  resourceId: z.number().optional(),

  customerName: z.string().min(1, '고객명을 입력하세요.'),
  customerPhone: z.string().min(1, '연락처를 입력하세요.'),
  guestEmail: z
    .string()
    .email('올바른 이메일을 입력하세요.')
    .optional()
    .or(z.literal('')),
  partySize: z.number().min(1),
  specialRequests: z.string().optional(),
  vehicleId: z.number().optional(),

  status: z.enum([
    'PAYMENT_PENDING',
    'PAYMENT_FAILED',
    'PAYMENT_EXPIRED',
    'PENDING_APPROVAL',
    'CONFIRMED',
    'CHECKED_IN',
    'IN_PROGRESS',
    'COMPLETED',
    'NO_SHOW',
    'CANCELLED',
    'REFUND_REQUESTED',
    'REFUND_PROCESSING',
    'REFUNDED',
    'PARTIAL_REFUNDED',
  ]),
  confirmationType: z.enum(['AUTO', 'MANUAL']),
  notes: z.string().optional(),
  reason: z.string().optional(),
});

export type ReservationEditFormValues = z.infer<typeof ReservationEditSchema>;
