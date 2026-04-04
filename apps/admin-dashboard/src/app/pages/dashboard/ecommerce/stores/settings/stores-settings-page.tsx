import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, ArrowDownIcon } from 'lucide-react';
import { useStores } from '@starcoex-frontend/stores';
import { BusinessTypeManager } from '@/app/pages/dashboard/ecommerce/stores/components/business-type-manager';
import { ServiceTypeManager } from '@/app/pages/dashboard/ecommerce/stores/components/service-type-manager';

export default function StoresSettingsPage() {
  const { serviceTypes } = useStores();

  return (
    <>
      <PageHead
        title={`매장 설정 - ${COMPANY_INFO.name}`}
        description="비즈니스 타입 및 서비스 타입을 관리합니다."
        keywords={['매장 설정', '비즈니스 타입', '서비스 타입']}
      />
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">마스터 데이터 관리</h2>
          <p className="text-muted-foreground text-sm">
            슈퍼 어드민 전용 — 서비스 타입을 먼저 등록한 후 비즈니스 타입에서
            연결하세요.
          </p>
        </div>

        {/* 연관 관계 안내 */}
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>등록 순서 및 연관 관계</strong>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium">
                서비스 타입
              </span>
              <span className="text-xs">주유, 세차, 난방유 등 개별 서비스</span>
            </div>
            <div className="mt-1 ml-3 flex items-center gap-1 text-muted-foreground">
              <ArrowDownIcon className="h-3 w-3" />
              <span className="text-xs">허용 서비스로 연결</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
              <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium">
                비즈니스 타입
              </span>
              <span className="text-xs">
                별표주유소, 제라게 카케어 등 사업 유형
              </span>
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                1
              </span>
              <p className="text-sm font-medium">서비스 타입 등록</p>
            </div>
            <ServiceTypeManager />
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold
                  ${
                    serviceTypes.length > 0
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
              >
                2
              </span>
              <p
                className={`text-sm font-medium ${
                  serviceTypes.length === 0 ? 'text-muted-foreground' : ''
                }`}
              >
                비즈니스 타입 등록
                {serviceTypes.length === 0 && (
                  <span className="text-muted-foreground ml-1.5 text-xs font-normal">
                    (서비스 타입 먼저 등록)
                  </span>
                )}
              </p>
            </div>
            {serviceTypes.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  서비스 타입을 먼저 등록해주세요.
                </p>
              </div>
            ) : (
              <BusinessTypeManager />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
