
export const EMAIL_CONSTANTS = {
  RECIPIENTS: {
    GENERAL: 'contact@starcoex.com',
    SUPPORT: 'support@starcoex.com',
    SALES: 'sales@starcoex.com',
    BUSINESS: 'business@starcoex.com',
  },
  MESSAGES: {
    SUCCESS: '문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.',
    ERROR: '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    VALIDATION_ERROR: '입력 정보를 확인해주세요.',
  },
  TEMPLATES: {
    CONTACT_SUBJECT: '[스타코엑스] 새로운 문의가 접수되었습니다',
    CONTACT_REPLY_SUBJECT: '[스타코엑스] 문의해 주셔서 감사합니다',
  },
  VALIDATION: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 50,
    MAX_MESSAGE_LENGTH: 1000,
    MIN_MESSAGE_LENGTH: 10,
  },
} as const;
