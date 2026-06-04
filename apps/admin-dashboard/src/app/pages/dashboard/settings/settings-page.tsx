import ContentSection from './components/content-section';
import GeneralForm from './components/general-form';
import { PwaSettingsSection } from '@starcoex-frontend/pwa';

export default function SettingsGeneralPage() {
  return (
    <>
      <ContentSection
        title="일반 설정"
        desc="애플리케이션에 대한 설정 및 옵션입니다."
        className="w-full lg:max-w-full"
      >
        <GeneralForm />
      </ContentSection>

      <ContentSection
        title="PWA 설정"
        desc="앱 설치, 오프라인 지원, 푸시 알림 및 캐시를 관리합니다."
        className="w-full lg:max-w-full"
      >
        <PwaSettingsSection />
      </ContentSection>
    </>
  );
}
