import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceManagementTab } from './components/service-management-tab';
import { RefundPolicyTab } from './components/refund-policy-tab';
import { BlockedDatesTab } from '@/app/pages/dashboard/ecommerce/reservations/components/blocked-dates-tab';

export default function ReservationServicesPage() {
  return (
    <Tabs defaultValue="services">
      <TabsList>
        <TabsTrigger value="services">서비스 관리</TabsTrigger>
        <TabsTrigger value="blocked-dates">휴무일 관리</TabsTrigger>
        <TabsTrigger value="refund-policies">환불 정책</TabsTrigger>
      </TabsList>
      <TabsContent value="services" className="mt-4">
        <ServiceManagementTab />
      </TabsContent>
      <TabsContent value="blocked-dates" className="mt-4">
        <BlockedDatesTab />
      </TabsContent>
      <TabsContent value="refund-policies" className="mt-4">
        <RefundPolicyTab />
      </TabsContent>
    </Tabs>
  );
}
