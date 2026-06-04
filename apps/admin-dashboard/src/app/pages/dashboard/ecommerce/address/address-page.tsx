import { useEffect, useState } from 'react';
import { PageHead } from '@starcoex-frontend/common';
import { LoadingSpinner, ErrorAlert } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useAddress } from '@starcoex-frontend/address';
import { AddressTable } from './components/address-table';
import { AddressStats } from './components/address-stats';
import { AddressSearchDialog } from './components/address-search-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type {
  FilterAddressInput,
  AddressStatsResult,
} from '@starcoex-frontend/address';

const DEFAULT_FILTER: FilterAddressInput = {
  page: 1,
  limit: 20,
};

export default function AddressPage() {
  const {
    savedAddresses,
    isLoading,
    error,
    getUserAddresses,
    getUserAddressStats,
    removeAddress,
    bulkRemoveAddresses,
  } = useAddress();

  const [filter, setFilter] = useState<FilterAddressInput>(DEFAULT_FILTER);
  const [searchValue, setSearchValue] = useState('');
  const [statsData, setStatsData] = useState<AddressStatsResult | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const fetchAddresses = async (f = filter) => {
    await getUserAddresses(f);
  };

  const fetchStats = async () => {
    const res = await getUserAddressStats();
    if (res.success && res.data) setStatsData(res.data);
  };

  useEffect(() => {
    fetchAddresses();
    fetchStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 서버사이드 keyword 검색 실행
  const handleSearchSubmit = () => {
    const next: FilterAddressInput = {
      ...filter,
      searchTerm: searchValue.trim() || undefined,
      page: 1,
    };
    setFilter(next);
    fetchAddresses(next);
  };

  const handleBulkDelete = async (ids: number[]) => {
    return bulkRemoveAddresses({ ids });
  };

  const handleSingleDelete = async (id: number) => {
    await removeAddress(id);
    fetchAddresses();
  };

  if (isLoading && savedAddresses.length === 0) {
    return <LoadingSpinner message="주소 데이터를 불러오는 중..." />;
  }

  return (
    <>
      <PageHead
        title={`주소 관리 - ${COMPANY_INFO.name}`}
        description="저장된 주소 목록을 조회하고 관리하세요."
        keywords={['주소 관리', '주소 목록', COMPANY_INFO.name]}
        og={{
          title: `주소 관리 - ${COMPANY_INFO.name}`,
          description: '주소 목록 조회 및 관리',
          image: '/images/og-address.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* 통계 카드 */}
        <AddressStats addresses={savedAddresses} statsData={statsData} />

        {/* 주소 검색 버튼 */}
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setSearchDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            주소 검색 · 저장
          </Button>
        </div>

        {error && (
          <ErrorAlert error={error} onRetry={() => fetchAddresses(filter)} />
        )}

        {!error && (
          <AddressTable
            data={savedAddresses}
            total={savedAddresses.length}
            isLoading={isLoading}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearchSubmit={handleSearchSubmit}
            onBulkDelete={handleBulkDelete}
            onDeleteSuccess={() => fetchAddresses()}
            onSingleDelete={handleSingleDelete}
          />
        )}
      </div>

      <AddressSearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onSaved={() => fetchAddresses()}
      />
    </>
  );
}
