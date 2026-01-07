import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import ContentSection from '../components/content-section';
import {
  UserProfileData,
  UserRole,
  UserType,
} from '@/app/types/user-profile.type';
import { BusinessProfileForm } from '@/app/pages/dashboard/settings/profile/components/business-profile-form';
import { IndividualProfileForm } from '@/app/pages/dashboard/settings/profile/components/individual-profile-form';

export default function SettingsProfilePage() {
  const { currentUser: authUser, isLoading } = useAuth();

  // DB 데이터를 프론트엔드 타입으로 안전하게 변환
  const userData = useMemo<UserProfileData | null>(() => {
    if (!authUser) return null;

    return {
      id: authUser.id, // number
      email: authUser.email,
      name: authUser.name,
      phoneNumber: authUser.phoneNumber,
      userType: (authUser.userType as UserType) || 'INDIVIDUAL',
      role: (authUser.role as UserRole) || 'USER',
      isActive: authUser.isActive ?? true,
      isSocialUser: authUser.isSocialUser ?? false,

      // Avatar
      avatarUrl: authUser.avatar?.url,

      // 본인인증 정보
      realName: authUser.realName,
      realBirthDate: authUser.realBirthDate, // String "YYYY-MM-DD"
      realGender: authUser.realGender,
      realPhoneNumber: authUser.realPhoneNumber,
      telecomOperator: authUser.telecomOperator,

      // Business 정보 (관계형 데이터 매핑)
      business: authUser.business
        ? {
            id: authUser.business.id,
            businessNumber: authUser.business.businessNumber,
            businessName: authUser.business.businessName,
            representativeName: authUser.business.representativeName,
            establishmentDate: authUser.business.establishmentDate,
            businessAddress: authUser.business.businessAddress,
            businessType: authUser.business.businessType,
            businessItem: authUser.business.businessItem,
            isValidated: authUser.business.isValidated,
          }
        : null,
    };
  }, [authUser]);

  if (isLoading) return <div>Loading...</div>;
  if (!userData) return <Navigate to="/auth/login" replace />;

  const isAdmin = userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN';

  return (
    <ContentSection title="Profile" desc="계정 상세 정보를 관리합니다.">
      {userData.userType === 'BUSINESS' ? (
        <BusinessProfileForm initialData={userData} isAdminView={isAdmin} />
      ) : (
        <IndividualProfileForm initialData={userData} isAdminView={isAdmin} />
      )}
    </ContentSection>
  );
}
