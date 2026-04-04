import PortOne, { PaymentRequest } from '@portone/browser-sdk/v2';

export interface PortOneRequestParams {
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency?: string;
  customData?: Record<string, unknown>;
  customer?: {
    customerId?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
}

export interface PortOneResult {
  success: boolean;
  paymentId?: string;
  code?: string;
  message?: string;
}

export function generatePaymentId(): string {
  return [...crypto.getRandomValues(new Uint32Array(2))]
    .map((word) => word.toString(16).padStart(8, '0'))
    .join('');
}

export function usePortOnePayment() {
  const storeId = import.meta.env.VITE_PORTONE_STORE_ID as string;
  const channelKey = import.meta.env.VITE_PORTONE_CHANNEL_KEY as string;

  const requestPayment = async (
    params: PortOneRequestParams
  ): Promise<PortOneResult> => {
    try {
      // ✅ PaymentRequest 타입을 명시적으로 사용하여 타입 안전성 확보
      const request: PaymentRequest = {
        storeId,
        channelKey,
        paymentId: params.paymentId,
        orderName: params.orderName,
        totalAmount: params.totalAmount,
        currency: 'KRW',
        payMethod: 'CARD', // ✅ 필수 필드 - PaymentPayMethod 타입
        customer: params.customer
          ? {
              customerId: params.customer.customerId,
              fullName: params.customer.fullName,
              phoneNumber: params.customer.phoneNumber,
              email: params.customer.email,
            }
          : undefined,
        customData: params.customData,
        windowType: {
          pc: 'IFRAME',
          mobile: 'REDIRECTION',
        },
      };

      const payment = await PortOne.requestPayment(request);

      if (payment?.code !== undefined) {
        return {
          success: false,
          code: payment.code,
          message: payment.message,
        };
      }

      return {
        success: true,
        paymentId: payment?.paymentId,
      };
    } catch (error: any) {
      return {
        success: false,
        code: 'SDK_ERROR',
        message: error?.message ?? '결제 요청 중 오류가 발생했습니다.',
      };
    }
  };

  return { requestPayment };
}
