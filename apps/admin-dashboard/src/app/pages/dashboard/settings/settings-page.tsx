import ContentSection from './components/content-section';
import GeneralForm from './components/general-form';

export default function SettingsGeneralPage() {
  return (
    <ContentSection
      title="일반 설정"
      desc="애플리케이션에 대한 설정 및 옵션입니다."
      className="w-full lg:max-w-full"
    >
      <GeneralForm />
    </ContentSection>
  );
}
