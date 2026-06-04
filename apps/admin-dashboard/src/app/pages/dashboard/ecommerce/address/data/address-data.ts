import type {
  AddressStatus,
  AddressDataSource,
  AddressBuildingType,
} from '@starcoex-frontend/address';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning';

// ============================================================================
// Status
// ============================================================================

export const ADDRESS_STATUS_CONFIG: Record<
  AddressStatus,
  { label: string; variant: BadgeVariant }
> = {
  ACTIVE: { label: '활성', variant: 'success' },
  INACTIVE: { label: '비활성', variant: 'secondary' },
  PENDING: { label: '대기', variant: 'warning' },
  DELETED: { label: '삭제', variant: 'destructive' },
};

export const ADDRESS_STATUS_OPTIONS = (
  Object.entries(ADDRESS_STATUS_CONFIG) as [
    AddressStatus,
    { label: string; variant: BadgeVariant }
  ][]
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// DataSource
// ============================================================================

export const ADDRESS_DATA_SOURCE_CONFIG: Record<
  AddressDataSource,
  { label: string; variant: BadgeVariant }
> = {
  JUSO_API: { label: '도로명 API', variant: 'default' },
  MANUAL_INPUT: { label: '직접 입력', variant: 'outline' },
  IMPORT_EXCEL: { label: 'Excel 가져오기', variant: 'secondary' },
  EXTERNAL_API: { label: '외부 API', variant: 'outline' },
};

// ============================================================================
// BuildingType
// ============================================================================

export const ADDRESS_BUILDING_TYPE_CONFIG: Record<
  AddressBuildingType,
  { label: string }
> = {
  APARTMENT: { label: '공동주택' },
  SINGLE_HOUSE: { label: '단독주택' },
};

// ============================================================================
// Faceted Filter 옵션 (DataTableFacetedFilter 용)
// ============================================================================

export const ADDRESS_STATUS_FILTER_OPTIONS = ADDRESS_STATUS_OPTIONS.map(
  ({ value, label }) => ({ value, label })
);

export const ADDRESS_BUILDING_TYPE_FILTER_OPTIONS: {
  value: AddressBuildingType;
  label: string;
}[] = [
  { value: 'APARTMENT', label: '공동주택' },
  { value: 'SINGLE_HOUSE', label: '단독주택' },
];

export const ADDRESS_DATA_SOURCE_FILTER_OPTIONS = (
  Object.entries(ADDRESS_DATA_SOURCE_CONFIG) as [
    AddressDataSource,
    { label: string; variant: BadgeVariant }
  ][]
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// SearchType
// ============================================================================

export const ADDRESS_SEARCH_TYPE_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'ROAD', label: '도로명' },
  { value: 'JIBUN', label: '지번' },
] as const;
