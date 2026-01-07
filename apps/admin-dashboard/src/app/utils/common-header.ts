// 사용자 이름에서 이니셜 생성
export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// 역할별 배지 색상
export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'text-purple-600';
    case 'ADMIN':
      return 'text-blue-600';
    case 'USER':
      return 'text-green-600';
    case 'DELIVERY':
      return 'text-orange-600';
    default:
      return 'text-gray-600';
  }
};

// 역할별 표시 텍스트
export const getRoleDisplayText = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return '최고 관리자';
    case 'ADMIN':
      return '관리자';
    case 'USER':
      return '사용자';
    case 'DELIVERY':
      return '배달원';
    default:
      return role;
  }
};
