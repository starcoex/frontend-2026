import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MembershipStatusTab } from './components/membership-status-tab';
import { StarHistoryTab } from './components/star-history-tab';
import { CouponListTab } from './components/coupon-list-tab';

export const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'status' | 'stars' | 'coupons'>('status');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">멤버십</h1>
      </div>

      {/* 탭 */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="status">등급 현황</TabsTrigger>
          <TabsTrigger value="stars">별 내역</TabsTrigger>
          <TabsTrigger value="coupons">쿠폰</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-4">
          <MembershipStatusTab />
        </TabsContent>

        <TabsContent value="stars" className="mt-4">
          <StarHistoryTab />
        </TabsContent>

        <TabsContent value="coupons" className="mt-4">
          <CouponListTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
