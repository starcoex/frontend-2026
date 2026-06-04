import { useEffect, useState, useCallback } from 'react';
import {
  ErrorAlert,
  LoadingSpinner,
  PageHead,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { useAuth } from '@starcoex-frontend/auth';
import { LoyaltyTable } from '@/app/pages/dashboard/ecommerce/loyalty/components/loyalty-table';
import { LoyaltyCouponManager } from '@/app/pages/dashboard/ecommerce/loyalty/components/loyalty-coupon-manager';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  MembershipTier,
  User,
  UserMembership,
} from '@starcoex-frontend/graphql';

const TIER_OPTIONS: { value: MembershipTier | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체 등급' },
  { value: 'WELCOME', label: 'WELCOME' },
  { value: 'SHINE', label: 'SHINE' },
  { value: 'STAR', label: 'STAR' },
];

const PAGE_SIZE = 50;

export default function LoyaltyPage() {
  const { adminGetMembershipList } = useLoyalty();
  const { getAllUsers } = useAuth();

  const [tableData, setTableData] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [tierFilter, setTierFilter] = useState<MembershipTier | 'ALL'>('ALL');
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [couponManagerOpen, setCouponManagerOpen] = useState(false);

  const load = useCallback(
    async (tier: MembershipTier | 'ALL', currentOffset: number) => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. adminGetMembershipList로 등급 필터링된 userId 목록 가져오기
        const membershipRes = await adminGetMembershipList({
          tier: tier === 'ALL' ? undefined : tier,
          limit: PAGE_SIZE,
          offset: currentOffset,
        });

        if (!membershipRes.success || !membershipRes.data) {
          setError('멤버십 목록을 불러오지 못했습니다.');
          return;
        }

        const memberships = membershipRes.data.memberships;
        setTotalCount(membershipRes.data.totalCount);
        setHasMore(membershipRes.data.hasMore);

        if (memberships.length === 0) {
          setTableData([]);
          return;
        }

        // 2. getAllUsers로 이름/이메일 포함 전체 유저 정보 가져오기
        const userIds = memberships.map((m: UserMembership) => m.userId);

        const usersRes = await getAllUsers({
          page: 1,
          limit: PAGE_SIZE,
          // 검색 없이 전체 조회 — userId 목록으로 필터링은 클라이언트에서
        });

        // 3. userId로 membership 정보 merge
        const membershipMap = new Map(
          memberships.map((m: UserMembership) => [m.userId, m])
        );

        let mergedUsers: User[];

        if (usersRes.success && usersRes.data?.getAllUsers?.users) {
          const allUsers: User[] = usersRes.data.getAllUsers.users;

          // 멤버십 목록에 있는 userId만 필터링하고 membership 주입
          mergedUsers = userIds
            .map((userId: number) => {
              const user = allUsers.find((u) => u.id === userId);
              const membership = membershipMap.get(userId);
              if (!membership) return null;

              if (user) {
                // 유저 정보가 있으면 membership 주입
                return { ...user, membership } as User;
              } else {
                // 유저 정보가 없으면 최소 형태로 생성
                return {
                  id: userId,
                  email: `사용자 #${userId}`,
                  name: null,
                  avatarUrl: null,
                  membership,
                  // User 타입 필수 필드 최소값
                  userType: 'INDIVIDUAL',
                  role: null,
                  isActive: true,
                  emailVerified: false,
                  termsAccepted: false,
                  isSocialUser: false,
                  identityVerified: false,
                } as unknown as User;
              }
            })
            .filter(Boolean) as User[];
        } else {
          // getAllUsers 실패 시 membership만으로 최소 형태 생성
          mergedUsers = memberships.map((m: UserMembership) => ({
            id: m.userId,
            email: `사용자 #${m.userId}`,
            name: null,
            avatarUrl: null,
            membership: m,
            userType: 'INDIVIDUAL',
            role: null,
            isActive: true,
            emailVerified: false,
            termsAccepted: false,
            isSocialUser: false,
            identityVerified: false,
          })) as unknown as User[];
        }

        setTableData(mergedUsers);
      } catch (e) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [adminGetMembershipList, getAllUsers]
  );

  useEffect(() => {
    load(tierFilter, offset);
  }, [tierFilter, offset, load]);

  const handleTierChange = (value: string) => {
    setOffset(0);
    setTierFilter(value as MembershipTier | 'ALL');
  };

  if (isLoading && tableData.length === 0) {
    return <LoadingSpinner message="회원 등급 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`회원 등급 관리 - ${COMPANY_INFO.name}`}
        description="회원 멤버십 등급을 관리하세요."
        keywords={['회원 등급', '멤버십', '로열티', COMPANY_INFO.name]}
        og={{
          title: `회원 등급 관리 - ${COMPANY_INFO.name}`,
          description: '회원 멤버십 등급 조회 및 관리',
          type: 'website',
        }}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Select value={tierFilter} onValueChange={handleTierChange}>
            <SelectTrigger className="h-9 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {totalCount > 0 && (
            <span className="text-muted-foreground text-sm">
              총 {totalCount.toLocaleString()}명
            </span>
          )}
        </div>

        <Button onClick={() => setCouponManagerOpen(true)}>
          <Ticket className="mr-2 h-4 w-4" />
          쿠폰 일괄 발급
        </Button>
      </div>

      {error && (
        <ErrorAlert error={error} onRetry={() => load(tierFilter, offset)} />
      )}

      {!error && (
        <>
          <LoyaltyTable data={tableData} />

          {totalCount > PAGE_SIZE && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                이전
              </Button>
              <span className="text-muted-foreground text-sm">
                {Math.floor(offset / PAGE_SIZE) + 1} /{' '}
                {Math.ceil(totalCount / PAGE_SIZE)} 페이지
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasMore}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}

      <LoyaltyCouponManager
        open={couponManagerOpen}
        onOpenChange={setCouponManagerOpen}
      />
    </>
  );
}
