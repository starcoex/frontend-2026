import ContentSection from '../components/content-section';
import BillingForm from './billing-form';

export default function SettingsBillingPage() {
  return (
    <ContentSection
      title="결제 설정"
      desc="결제 수단 및 구독 정보를 관리합니다."
    >
      <BillingForm />
    </ContentSection>
  );
}
