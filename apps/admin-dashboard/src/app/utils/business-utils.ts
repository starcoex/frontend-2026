/**
 * 사업자등록번호 포맷팅
 */
export function formatBusinessNumber(value: string): string {
  // 숫자만 추출
  const numbers = value.replace(/\D/g, '');

  // XXX-XX-XXXXX 형식으로 포맷팅
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(
      5,
      10
    )}`;
  }
}

/**
 * 전화번호 형식으로 포맷팅
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  return phoneNumber;
}
