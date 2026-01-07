export type UserType = 'INDIVIDUAL' | 'BUSINESS';
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'DELIVERY';
export type BusinessStatusCode = 'CONTINUE' | 'SUSPENDED' | 'CLOSED';
export type TelecomOperator =
  | 'SKT'
  | 'KT'
  | 'LGU'
  | 'SKT_MVNO'
  | 'KT_MVNO'
  | 'LGU_MVNO'
  | 'UNKNOWN';

// --- Business Model ---
export interface BusinessData {
  id: number;
  businessNumber: string; // 사업자등록번호 (Unique)
  representativeName?: string | null; // 대표자명
  businessName?: string | null; // 상호명
  establishmentDate?: string | null; // 개업일자 (String 형태)
  businessAddress?: string | null;
  businessType?: string | null; // 업태
  businessItem?: string | null; // 종목
  businessStatusCode?: BusinessStatusCode | null;
  isValidated: boolean;
}

// --- User Model (Aggregate) ---
export interface UserProfileData {
  id: number;
  email: string;
  name?: string | null; // 닉네임 또는 표시 이름
  phoneNumber?: string | null;

  userType: UserType;
  role: UserRole;

  isActive: boolean;
  isSocialUser: boolean;

  // Avatar Relation
  avatarUrl?: string | null; // Avatar 모델의 url만 추출해서 사용한다고 가정

  // Identity Verification (본인인증 실명 정보)
  realName?: string | null;
  realBirthDate?: string | null; // "YYYY-MM-DD" 형태의 문자열
  realGender?: string | null;
  realPhoneNumber?: string | null;
  telecomOperator?: TelecomOperator | null;

  // Business Relation (Optional)
  business?: BusinessData | null;

  // [주의] Schema.prisma에 Delivery 관련 필드(vehicleType, licenseNumber)가 없습니다.
  // 필요하다면 DB 마이그레이션 후 추가해야 합니다. 현재는 제외합니다.

  // Admin View Fields (DB에는 없지만 관리자 UI용)
  adminMemo?: string;
}
