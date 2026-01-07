// ✨ 영어 -> 한글 매핑 객체들
const USER_TYPE_MAP: Record<string, string> = {
  INDIVIDUAL: '개인',
  BUSINESS: '사업자',
  CORPORATE: '법인',
  USER: '일반사용자',
  // 필요한 다른 타입들 추가
};

const ROLE_MAP: Record<string, string> = {
  USER: '일반사용자',
  ADMIN: '관리자',
  SUPER_ADMIN: '최고관리자',
  BUSINESS: '사업자',
  DELIVERY: '배달업체',
  // 필요한 다른 역할들 추가
};

// ✨ 변환 함수들
export const getUserTypeText = (userType: string): string => {
  return USER_TYPE_MAP[userType] || userType;
};

export const getRoleText = (role: string): string => {
  return ROLE_MAP[role] || role;
};
