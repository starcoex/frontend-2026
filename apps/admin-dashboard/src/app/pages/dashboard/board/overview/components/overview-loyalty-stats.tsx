import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { useEffect, useState } from 'react';
import type { MembershipTier } from '@starcoex-frontend/loyalty';

interface Props {
  isLoading: boolean;
}

const TIERS: MembershipTier[] = ['WELCOME', 'SHINE', 'STAR'];

const TIER_LABELS: Record<MembershipTier, string> = {
  WELCOME: '웰컴',
  SHINE: '샤인',
  STAR: '스타',
};

const TIER_COLORS: Record<MembershipTier, string> = {
  WELCOME: 'text-gray-500',
  SHINE: 'text-blue-500',
  STAR: 'text-yellow-500',
};

export function OverviewLoyaltyStats({ isLoading }: Props) {
  const { adminGetMembershipList } = useLoyalty();
  const [tierCounts, setTierCounts] = useState<Record<MembershipTier, number>>({
    WELCOME: 0,
    SHINE: 0,
    STAR: 0,
  });

  useEffect(() => {
    const fetchTiers = async () => {
      const counts = { WELCOME: 0, SHINE: 0, STAR: 0 } as Record<
        MembershipTier,
        number
      >;
      await Promise.all(
        TIERS.map(async (tier) => {
          const res = await adminGetMembershipList({
            limit: 1,
            offset: 0,
            tier,
          });
          if (res.success && res.data) {
            counts[tier] = (res.data as any).totalCount ?? 0;
          }
        })
      );
      setTierCounts(counts);
    };
    fetchTiers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>멤버십 현황</CardTitle>
        <CardDescription>등급별 회원 분포</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {TIERS.map((tier) => (
            <div
              key={tier}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <span className={`text-sm font-medium ${TIER_COLORS[tier]}`}>
                {TIER_LABELS[tier]}
              </span>
              {isLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <span className="font-bold">
                  {tierCounts[tier].toLocaleString()}명
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
