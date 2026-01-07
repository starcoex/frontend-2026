import { EMAIL_CONSTANTS } from './email-constants.js';

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export interface EmailValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface EmailSendResult {
  success: boolean;
  message: string;
}

/**
 * 연락처 폼 데이터 유효성 검사
 */
export function validateContactForm(
  data: ContactFormData
): EmailValidationResult {
  const errors: string[] = [];

  // 이름 검사
  if (!data.fullName?.trim()) {
    errors.push('이름을 입력해주세요.');
  } else if (
    data.fullName.trim().length < EMAIL_CONSTANTS.VALIDATION.MIN_NAME_LENGTH
  ) {
    errors.push(
      `이름은 최소 ${EMAIL_CONSTANTS.VALIDATION.MIN_NAME_LENGTH}글자 이상이어야 합니다.`
    );
  } else if (
    data.fullName.trim().length > EMAIL_CONSTANTS.VALIDATION.MAX_NAME_LENGTH
  ) {
    errors.push(
      `이름은 최대 ${EMAIL_CONSTANTS.VALIDATION.MAX_NAME_LENGTH}글자까지 입력 가능합니다.`
    );
  }

  // 이메일 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email?.trim()) {
    errors.push('이메일을 입력해주세요.');
  } else if (!emailRegex.test(data.email.trim())) {
    errors.push('올바른 이메일 형식을 입력해주세요.');
  }

  // 전화번호 검사 (선택사항)
  if (data.phone?.trim()) {
    const phoneRegex = /^[0-9-+\s()]+$/;
    if (!phoneRegex.test(data.phone.trim())) {
      errors.push('올바른 전화번호 형식을 입력해주세요.');
    }
  }

  // 메시지 검사
  if (!data.message?.trim()) {
    errors.push('메시지를 입력해주세요.');
  } else if (
    data.message.trim().length < EMAIL_CONSTANTS.VALIDATION.MIN_MESSAGE_LENGTH
  ) {
    errors.push(
      `메시지는 최소 ${EMAIL_CONSTANTS.VALIDATION.MIN_MESSAGE_LENGTH}글자 이상이어야 합니다.`
    );
  } else if (
    data.message.trim().length > EMAIL_CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH
  ) {
    errors.push(
      `메시지는 최대 ${EMAIL_CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH}글자까지 입력 가능합니다.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 이메일 미리보기 생성 (개발용)
 */
export function generateEmailPreview(data: ContactFormData): string {
  return `
=== 이메일 미리보기 ===
받는이: ${EMAIL_CONSTANTS.RECIPIENTS.GENERAL}
제목: ${EMAIL_CONSTANTS.TEMPLATES.CONTACT_SUBJECT}

발신자 정보:
- 이름: ${data.fullName}
- 이메일: ${data.email}
- 전화번호: ${data.phone || '미제공'}
- 회사명: ${data.company || '미제공'}

메시지:
${data.message}

전송 시간: ${new Date().toLocaleString('ko-KR')}
========================
  `.trim();
}

/**
 * 연락처 이메일 전송
 * 실제 프로덕션에서는 이메일 서비스(예: SendGrid, AWS SES)와 연동
 */
export async function sendContactEmail(
  data: ContactFormData,
  recipient: string
): Promise<EmailSendResult> {
  try {
    // 유효성 검사
    const validation = validateContactForm(data);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.errors.join(', '),
      };
    }

    // 개발 환경에서는 콘솔 로그로 시뮬레이션
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 이메일 전송 시뮬레이션:');
      console.log(generateEmailPreview(data));

      // 개발환경에서는 항상 성공으로 처리
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연

      return {
        success: true,
        message: EMAIL_CONSTANTS.MESSAGES.SUCCESS,
      };
    }

    // 프로덕션 환경에서는 실제 이메일 전송 로직 구현
    // TODO: 실제 이메일 서비스 API 호출
    const emailPayload = {
      to: recipient,
      subject: EMAIL_CONSTANTS.TEMPLATES.CONTACT_SUBJECT,
      html: generateEmailTemplate(data),
      text: generateEmailText(data),
    };

    // 실제 이메일 전송 로직은 여기에 구현
    console.log('Production email sending:', emailPayload);

    return {
      success: true,
      message: EMAIL_CONSTANTS.MESSAGES.SUCCESS,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      message: EMAIL_CONSTANTS.MESSAGES.ERROR,
    };
  }
}

/**
 * HTML 이메일 템플릿 생성
 */
function generateEmailTemplate(data: ContactFormData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">새로운 문의가 접수되었습니다</h2>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">발신자 정보</h3>
        <p><strong>이름:</strong> ${data.fullName}</p>
        <p><strong>이메일:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>전화번호:</strong> ${data.phone}</p>` : ''}
        ${data.company ? `<p><strong>회사명:</strong> ${data.company}</p>` : ''}
      </div>

      <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h3 style="margin-top: 0;">메시지</h3>
        <p style="white-space: pre-line;">${data.message}</p>
      </div>

      <div style="margin-top: 20px; padding: 10px; background-color: #e8f4fd; border-radius: 5px;">
        <p style="margin: 0; font-size: 12px; color: #666;">
          전송 시간: ${new Date().toLocaleString('ko-KR')}
        </p>
      </div>
    </div>
  `;
}

/**
 * 텍스트 이메일 생성
 */
function generateEmailText(data: ContactFormData): string {
  return `
새로운 문의가 접수되었습니다

발신자 정보:
- 이름: ${data.fullName}
- 이메일: ${data.email}
- 전화번호: ${data.phone || '미제공'}
- 회사명: ${data.company || '미제공'}

메시지:
${data.message}

전송 시간: ${new Date().toLocaleString('ko-KR')}
  `.trim();
}

/**
 * 이메일 주소 유효성 검사
 */
export function validateEmailAddress(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}
