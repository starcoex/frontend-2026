export type TermsType = 'service' | 'privacy' | 'location' | 'sms' | 'security'; // ★ security 추가

export interface CompanyInfo {
  name: string;
  legalName: string;
  ceo: string;
  bizNumber: string;
  corpRegNumber: string;
  address: string;
  phone: string;
  email: string;
}

export interface TermsContent {
  type: TermsType;
  title: string;
  required: boolean;
  version: string;
  updatedAt: string;
  content: string;
}

export interface SiteTermsConfig {
  siteKey: 'MAIN' | 'STAROIL' | 'DELIVERY' | 'ZERAGAE' | 'ADMIN'; // ★ ADMIN 추가
  company: CompanyInfo;
  terms: TermsContent[];
}

// ─── 사업자 정보 (사업자등록증 기반) ───────────────────────────────────────────

export const COMPANY_STARCOEX: CompanyInfo = {
  name: '스타코엑스',
  legalName: '주식회사 스타코엑스',
  ceo: '김현진',
  bizNumber: '864-86-01329',
  corpRegNumber: '220111-0195024',
  address: '제주특별자치도 제주시 연미길 10(오라삼동)',
  phone: '064-713-2002',
  email: 'starcoex@naver.com',
};

export const COMPANY_STAROIL: CompanyInfo = {
  name: '별표주유소',
  legalName: '(주)스타코엑스 별표주유소점',
  ceo: '김현진',
  bizNumber: '872-85-01245',
  corpRegNumber: '220111-0195024',
  address: '제주특별자치도 제주시 연삼로 79(오라삼동)',
  phone: '064-713-2002',
  email: 'staroil@starcoex.com',
};

export const COMPANY_ZERAGAE: CompanyInfo = {
  name: '제라게카케어',
  legalName: '제라게카케어',
  ceo: '고정훈', // ★ 별개 개인사업자
  bizNumber: '781-08-00046',
  corpRegNumber: '', // 개인사업자이므로 법인등록번호 없음
  address: '제주특별자치도 제주시 일주서로 7697(도두일동)',
  phone: '064-713-2002',
  email: 'zeragae@starcoex.com',
};

function makeSecurityPledgeTerms(): TermsContent {
  // ★ 추가
  return {
    type: 'security', // ★ 'service' → 'security'
    title: '개인정보보호 서약',
    required: true,
    version: 'v1.0',
    updatedAt: '2025년 11월 01일',
    content: `개인정보보호 서약서

본인은 주식회사 스타코엑스(이하 "회사") 관리자 시스템 접근 권한을 부여받음에 있어, 아래 사항을 숙지하고 이를 성실히 준수할 것을 서약합니다.

제1조 (개인정보 보호 의무)
① 본인은 업무 수행 중 알게 된 고객의 개인정보(성명, 연락처, 주소, 주문정보 등)를 업무 목적 이외의 용도로 사용하지 않겠습니다.
② 본인은 고객의 개인정보를 제3자에게 제공하거나 누설하지 않겠습니다.
③ 본인은 개인정보가 포함된 자료를 무단으로 복사·출력·반출하지 않겠습니다.

제2조 (시스템 보안 의무)
① 본인은 관리자 계정 및 비밀번호를 타인에게 공유하지 않겠습니다.
② 본인은 업무 종료 후 반드시 로그아웃하고, 화면이 노출되지 않도록 조치하겠습니다.
③ 본인은 보안이 확인되지 않은 외부 네트워크에서의 관리자 시스템 접근을 자제하겠습니다.

제3조 (위반 시 책임)
① 본 서약을 위반할 경우 「개인정보 보호법」 제71조 및 제73조에 따라 형사처벌(5년 이하의 징역 또는 5천만원 이하의 벌금)을 받을 수 있습니다.
② 위반으로 인한 민사상 손해배상 책임도 부담할 수 있습니다.
③ 회사 내부 징계 규정에 따른 처분을 받을 수 있습니다.

제4조 (퇴직 후 의무)
본인은 퇴직 또는 계약 종료 후에도 업무상 알게 된 개인정보를 보호할 의무가 있음을 인지합니다.

관련 법령: 개인정보 보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률`,
  };
}

// ─── 약관 내용 생성 헬퍼 ───────────────────────────────────────────────────────

function makeServiceTerms(company: CompanyInfo): TermsContent {
  return {
    type: 'service',
    title: '서비스 이용약관',
    required: true,
    version: 'v1.0',
    updatedAt: '2025년 11월 01일',
    content: `제1조 (목적)
본 약관은 ${company.legalName}(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 회사가 운영하는 웹사이트 및 모바일 애플리케이션을 통해 제공하는 모든 서비스를 말합니다.
② "이용자"란 본 약관에 따라 회사의 서비스를 이용하는 자를 말합니다.
③ "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.

제3조 (약관의 효력 및 변경)
① 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.
② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있습니다.
③ 약관이 변경되는 경우 회사는 변경 내용을 최소 7일 전에 공지합니다.

제4조 (이용계약의 체결)
① 이용계약은 이용자가 본 약관의 내용에 동의한 후 서비스 이용을 신청하면 회사가 이를 승낙함으로써 체결됩니다.

제5조 (서비스의 제공 및 변경)
① 회사는 다음과 같은 서비스를 제공합니다.
  - 주유·에너지 관련 정보 제공 서비스
  - 기타 회사가 추가 개발하거나 제휴를 통해 제공하는 서비스
② 회사는 서비스의 내용을 변경할 수 있으며, 이 경우 변경된 서비스의 내용 및 제공일자를 명시하여 공지합니다.

제6조 (이용자의 의무)
① 이용자는 관계 법령, 본 약관, 이용안내 및 서비스와 관련하여 공지한 주의사항을 준수해야 합니다.
② 이용자는 회사의 서비스를 이용하여 다음과 같은 행위를 하여서는 아니 됩니다.
  1. 타인의 정보 도용
  2. 회사의 지적재산권 침해
  3. 기타 불법적이거나 부당한 행위

제7조 (면책조항)
① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.

제8조 (분쟁해결)
① 서비스 이용과 관련하여 회사와 이용자 간에 분쟁이 발생한 경우, 회사는 분쟁 해결을 위해 성실히 협의합니다.
② 협의가 이루어지지 않을 경우 관할 법원은 민사소송법상의 관할 법원으로 합니다.

사업자 정보
- 상호/법인명: ${company.legalName}
- 대표자: ${company.ceo}
- 사업자등록번호: ${company.bizNumber}
- 주소: ${company.address}`,
  };
}

function makePrivacyTerms(company: CompanyInfo): TermsContent {
  return {
    type: 'privacy',
    title: '개인정보 처리방침',
    required: true,
    version: 'v1.0',
    updatedAt: '2025년 11월 01일',
    content: `${company.legalName}(이하 "회사")는 정보주체의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.

제1조 (개인정보의 처리 목적)
회사는 다음 목적을 위하여 개인정보를 처리합니다.
① 서비스 회원 가입 및 관리
② 서비스 제공 및 운영
③ 고객상담 및 불만처리
④ 마케팅 및 광고에의 활용 (동의 시)

제2조 (처리하는 개인정보의 항목)
필수항목: 이름, 휴대전화번호, 이메일 주소
선택항목: 주소, 마케팅 수신 동의 여부

제3조 (개인정보의 처리 및 보유 기간)
① 법령에 따른 보유 기간 또는 정보주체로부터 동의 받은 보유 기간 내에서 처리·보유합니다.
② 회원 탈퇴 시 즉시 파기합니다. 단, 관계 법령에 따라 일정 기간 보관이 필요한 경우는 예외로 합니다.
  - 소비자 불만 또는 분쟁처리: 3년 (전자상거래법)
  - 전자금융 거래 기록: 5년 (전자금융거래법)

제4조 (개인정보의 제3자 제공)
회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 이용자의 동의가 있거나 법령에 근거가 있는 경우는 예외로 합니다.

제5조 (개인정보 처리의 위탁)
회사는 원활한 서비스 제공을 위해 개인정보 처리를 위탁할 수 있으며, 위탁 시 별도 고지합니다.

제6조 (정보주체의 권리·의무)
이용자는 언제든지 자신의 개인정보를 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.
  - 개인정보보호 담당자: ${company.ceo}
  - 연락처: ${company.email}

제7조 (개인정보의 파기)
회사는 보유 기간이 경과하거나 처리 목적이 달성된 경우 개인정보를 지체 없이 파기합니다.

개인정보처리방침 시행일: 2025년 11월 01일
개인정보 처리 책임자: ${company.ceo} (${company.email})
사업자 주소: ${company.address}`,
  };
}

function makeSmsTerms(): TermsContent {
  return {
    type: 'sms',
    title: 'SMS 마케팅 수신 동의',
    required: false,
    version: 'v1.0',
    updatedAt: '2025년 11월 01일',
    content: `마케팅 목적 SMS/이메일 수신 동의 (선택)

수집 항목: 휴대전화번호, 이메일
이용 목적: 서비스 관련 이벤트, 프로모션, 할인 혜택 안내 등 마케팅 정보 발송
보유 기간: 수신 거부 시 즉시 파기

귀하는 위 수신 동의를 거부할 수 있으며, 거부 시에도 기본 서비스 이용에는 불이익이 없습니다.
수신 동의 이후에도 언제든지 앱 설정 또는 고객센터를 통해 수신을 거부할 수 있습니다.`,
  };
}

function makeLocationTerms(company: CompanyInfo): TermsContent {
  return {
    type: 'location',
    title: '개인위치정보 처리방침',
    required: true,
    version: 'v1.0',
    updatedAt: '2025년 11월 01일',
    content: `${company.legalName}(이하 "회사")는 「위치정보의 보호 및 이용 등에 관한 법률」에 따라 아래와 같이 위치기반서비스를 제공합니다.

제1조 (목적)
본 약관은 회사가 제공하는 위치기반서비스의 이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (위치기반서비스의 내용)
① 이용자의 현재 위치를 기반으로 가까운 배달 가능 지점 확인
② 배달 주소지 자동 입력 및 최적 경로 안내
③ 위치 기반 배달 가능 여부 실시간 판단

제3조 (개인위치정보의 보유 및 이용기간)
① 개인위치정보는 서비스 제공 목적 달성 즉시 파기합니다.
② 단, 이용자의 동의를 받은 경우 아래 목적을 위해 보관할 수 있습니다.
  - 배달 이력 관리: 1년

제4조 (개인위치정보의 제3자 제공)
회사는 이용자의 동의 없이 개인위치정보를 제3자에게 제공하지 않습니다.

제5조 (위치정보 이용·제공사실 확인자료 보관)
회사는 위치정보 이용·제공사실 확인자료를 6개월간 보관합니다.

제6조 (개인위치정보 이용·제공에 대한 동의 철회)
이용자는 언제든지 개인위치정보 이용·제공에 대한 동의를 전부 또는 일부 철회할 수 있습니다.

제7조 (법정대리인의 권리)
만 14세 미만 아동의 경우, 법정대리인의 동의를 받아야 합니다.

위치기반서비스 사업자 정보
- 상호: ${company.legalName}
- 대표자: ${company.ceo}
- 사업자등록번호: ${company.bizNumber}
- 주소: ${company.address}
- 위치정보 관리책임자: ${company.ceo}`,
  };
}

// ─── 사이트별 약관 설정 ────────────────────────────────────────────────────────

export const SITE_TERMS_CONFIG: Record<string, SiteTermsConfig> = {
  ADMIN: {
    // ★ 추가
    siteKey: 'ADMIN',
    company: COMPANY_STARCOEX,
    terms: [
      makeServiceTerms(COMPANY_STARCOEX),
      makePrivacyTerms(COMPANY_STARCOEX),
      makeSecurityPledgeTerms(),
    ],
  },
  MAIN: {
    siteKey: 'MAIN',
    company: COMPANY_STARCOEX,
    terms: [
      makeServiceTerms(COMPANY_STARCOEX),
      makePrivacyTerms(COMPANY_STARCOEX),
      makeSmsTerms(),
    ],
  },
  STAROIL: {
    siteKey: 'STAROIL',
    company: COMPANY_STAROIL,
    terms: [
      makeServiceTerms(COMPANY_STAROIL),
      makePrivacyTerms(COMPANY_STAROIL),
      makeSmsTerms(),
    ],
  },
  DELIVERY: {
    siteKey: 'DELIVERY',
    company: COMPANY_STARCOEX, // delivery는 본점(주식회사 스타코엑스) 소속
    terms: [
      makeServiceTerms(COMPANY_STARCOEX),
      makePrivacyTerms(COMPANY_STARCOEX),
      makeLocationTerms(COMPANY_STARCOEX), // ★ 위치정보 약관 추가
      makeSmsTerms(),
    ],
  },
  ZERAGAE: {
    siteKey: 'ZERAGAE',
    company: COMPANY_ZERAGAE, // ★ 별개 개인사업자 고정훈
    terms: [
      makeServiceTerms(COMPANY_ZERAGAE),
      makePrivacyTerms(COMPANY_ZERAGAE),
      makeSmsTerms(),
    ],
  },
};
