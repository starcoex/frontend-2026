import { format, eachDayOfInterval, parseISO } from 'date-fns';
import type { Address, AddressSearchLog } from '@starcoex-frontend/address';
import { ADDRESS_STATUS_CONFIG } from '@/app/pages/dashboard/ecommerce/address/data/address-data';

// ============================================================================
// 요약 통계
// ============================================================================

export interface AddressSummaryStats {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  deletedCount: number;
  apartmentCount: number;
  singleHouseCount: number;
  activeRate: string;
}

export const buildAddressSummaryStats = (
  addresses: Address[]
): AddressSummaryStats => {
  const total = addresses.length;
  const active = addresses.filter((a) => a.status === 'ACTIVE').length;
  const inactive = addresses.filter((a) => a.status === 'INACTIVE').length;
  const deleted = addresses.filter((a) => a.status === 'DELETED').length;
  const apartment = addresses.filter(
    (a) => a.buildingType === 'APARTMENT'
  ).length;
  const singleHouse = addresses.filter(
    (a) => a.buildingType === 'SINGLE_HOUSE'
  ).length;

  return {
    totalCount: total,
    activeCount: active,
    inactiveCount: inactive,
    deletedCount: deleted,
    apartmentCount: apartment,
    singleHouseCount: singleHouse,
    activeRate: total > 0 ? ((active / total) * 100).toFixed(1) : '0.0',
  };
};

// ============================================================================
// 일별 등록 추이
// ============================================================================

export interface DailyAddressData {
  date: string;
  registered: number;
  active: number;
}

export const buildDailyAddressData = (
  addresses: Address[],
  startDate: string,
  endDate: string
): DailyAddressData[] => {
  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });

  return days.map((day) => {
    const dateStr = format(day, 'MM.dd');
    const dayKey = format(day, 'yyyy-MM-dd');

    const dayAddresses = addresses.filter((a) =>
      a.createdAt.startsWith(dayKey)
    );

    return {
      date: dateStr,
      registered: dayAddresses.length,
      active: dayAddresses.filter((a) => a.status === 'ACTIVE').length,
    };
  });
};

// ============================================================================
// 상태별 분포 (Pie Chart)
// ============================================================================

export interface AddressStatusChartData {
  name: string;
  value: number;
  color: string;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#22c55e',
  INACTIVE: '#94a3b8',
  PENDING: '#f59e0b',
  DELETED: '#ef4444',
};

export const buildAddressStatusChartData = (
  addresses: Address[]
): AddressStatusChartData[] => {
  const counts: Record<string, number> = {};

  for (const address of addresses) {
    counts[address.status] = (counts[address.status] ?? 0) + 1;
  }

  return Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([status, value]) => ({
      name:
        ADDRESS_STATUS_CONFIG[status as keyof typeof ADDRESS_STATUS_CONFIG]
          ?.label ?? status,
      value,
      color: STATUS_COLORS[status] ?? '#6366f1',
    }));
};

// ============================================================================
// 지역별 분포 (Bar Chart)
// ============================================================================

export interface RegionChartData {
  region: string;
  count: number;
}

export const buildRegionChartData = (
  addresses: Address[],
  topN = 10
): RegionChartData[] => {
  const counts: Record<string, number> = {};

  for (const address of addresses) {
    const region = [address.siNm, address.sggNm].filter(Boolean).join(' ');
    if (region) counts[region] = (counts[region] ?? 0) + 1;
  }

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([region, count]) => ({ region, count }));
};

// ============================================================================
// 검색 키워드 분포
// ============================================================================

export interface KeywordChartData {
  keyword: string;
  count: number;
}

export const buildTopKeywordsData = (
  logs: AddressSearchLog[],
  topN = 10
): KeywordChartData[] => {
  const counts: Record<string, number> = {};

  for (const log of logs) {
    const kw = log.keyword.trim();
    if (kw) counts[kw] = (counts[kw] ?? 0) + 1;
  }

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([keyword, count]) => ({ keyword, count }));
};
