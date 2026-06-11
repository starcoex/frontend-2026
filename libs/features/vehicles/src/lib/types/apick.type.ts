import type { ApiResponse } from '../types';

// ============================================================================
// Enum 타입
// ============================================================================

export type ApickCheckType = 'VIN' | 'CAR_NUMBER';

// ============================================================================
// 공통 타입
// ============================================================================

export interface FloodDamageData {
  result: number;
  message: string;
  success: boolean;
}

export interface FloodDamageApiInfo {
  apiCost: number;
  responseTime: number;
  apiLogId: number;
}

export interface FloodDamageError {
  code: string;
  message: string;
  details?: string | null;
}

export interface FloodDamageCheckResult {
  success?: boolean | null;
  error?: FloodDamageError | null;
  requestId: string;
  searchType: ApickCheckType;
  searchValue: string;
  data?: FloodDamageData | null;
  api?: FloodDamageApiInfo | null;
  errorMessage?: string | null;
}

export interface ScrapStatusData {
  result: number;
  message: string;
  success: boolean;
}

export interface ScrapStatusApiInfo {
  apiCost: number;
  responseTime: number;
  apiLogId: number;
}

export interface ScrapStatusError {
  code: string;
  message: string;
  details?: string | null;
}

export interface ScrapStatusCheckResult {
  success?: boolean | null;
  error?: ScrapStatusError | null;
  ok: boolean;
  requestId: string;
  searchType: ApickCheckType;
  searchValue: string;
  data?: ScrapStatusData | null;
  api?: ScrapStatusApiInfo | null;
  errorMessage?: string | null;
}

export interface SaleStatusData {
  result?: Record<string, unknown> | null;
  message?: Record<string, unknown> | null;
  success: boolean;
}

export interface SaleStatusApiInfo {
  apiCost: number;
  responseTime: number;
  apiLogId: number;
}

export interface SaleStatusError {
  code: string;
  message: string;
  details?: string | null;
}

export interface SaleStatusCheckResult {
  success?: boolean | null;
  error?: SaleStatusError | null;
  ok: boolean;
  requestId: string;
  searchType?: ApickCheckType | null;
  searchValue: string;
  data?: SaleStatusData | null;
  api?: SaleStatusApiInfo | null;
  errorMessage?: string | null;
}

export interface ApickStatsSummary {
  date: string;
  totalChecks: number;
  successChecks: number;
  failedChecks: number;
  successRate: number;
  avgResponseTime: number;
  totalCost: number;
  floodedVehicles: number;
  scrapVehicles: number;
  saleVehicles: number;
}

export interface ApickSearchResults {
  flood: FloodDamageCheckResult[];
  scrap: ScrapStatusCheckResult[];
  sale: SaleStatusCheckResult[];
}

export interface ApickSearchSummary {
  searchValue: string;
  searchType?: ApickCheckType | null;
  services: string[];
  total: number;
  successful: number;
  failed: number;
  avgResponseTime: number;
}

export interface ApickSearchResult {
  summary: ApickSearchSummary;
  results: ApickSearchResults;
  searchedAt: string;
}

export interface ApickAccountData {
  email: string;
  name: string;
  phone: string;
  point: number;
  usedPoint: number;
  lastLogin: string;
  pointLimit: number;
  pointLimitNotice?: string | null;
  company?: string | null;
  billingPoint?: number | null;
  isActive: boolean;
  success: boolean;
}

export interface ApickAccountInfo {
  data: ApickAccountData;
  api: {
    success: boolean;
    cost: number;
    ms: number;
    plId: number;
  };
}

// ============================================================================
// Output 타입 (페이징)
// ============================================================================

export interface ApickErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

export interface GetApickFloodHistoryOutput {
  success?: boolean | null;
  error?: ApickErrorInfo | null;
  items: FloodDamageCheckResult[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

export interface GetApickScrapHistoryOutput {
  success?: boolean | null;
  error?: ApickErrorInfo | null;
  items: ScrapStatusCheckResult[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

export interface GetApickSaleHistoryOutput {
  success?: boolean | null;
  error?: ApickErrorInfo | null;
  items: SaleStatusCheckResult[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

export interface GetApickStatsOutput {
  success?: boolean | null;
  error?: ApickErrorInfo | null;
  stats?: ApickStatsSummary | null;
}

export interface SearchApickHistoryOutput {
  success?: boolean | null;
  error?: ApickErrorInfo | null;
  result?: ApickSearchResult | null;
}

export interface DeleteApickHistoryOutput {
  success?: boolean | null;
  error?: ApickErrorInfo | null;
  deletedCount: number;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface CheckFloodDamageInput {
  searchType: ApickCheckType;
  searchValue: string;
}

export interface CheckScrapStatusInput {
  searchType: ApickCheckType;
  searchValue: string;
}

export interface CheckSaleStatusInput {
  searchValue: string;
  searchType?: ApickCheckType;
}

export interface GetApickFloodHistoryInput {
  page?: number;
  limit?: number;
  searchType?: ApickCheckType;
  searchValue?: string;
  successOnly?: boolean;
  floodedOnly?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface GetApickScrapHistoryInput {
  page?: number;
  limit?: number;
  searchType?: ApickCheckType;
  searchValue?: string;
  successOnly?: boolean;
  scrappedOnly?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface GetApickSaleHistoryInput {
  page?: number;
  limit?: number;
  searchValue?: string;
  successOnly?: boolean;
  saleOnly?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface SearchApickHistoryInput {
  searchValue: string;
  searchType?: ApickCheckType;
  services?: string[];
}

export interface GetApickStatsInput {
  date?: string;
}

export interface DeleteApickHistoryInput {
  ids: number[];
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IApickService {
  // Queries
  adminFloodHistory(
    input?: GetApickFloodHistoryInput
  ): Promise<ApiResponse<GetApickFloodHistoryOutput>>;
  adminFloodHistoryById(
    id: number
  ): Promise<ApiResponse<FloodDamageCheckResult>>;
  adminScrapHistory(
    input?: GetApickScrapHistoryInput
  ): Promise<ApiResponse<GetApickScrapHistoryOutput>>;
  adminScrapHistoryById(
    id: number
  ): Promise<ApiResponse<ScrapStatusCheckResult>>;
  adminSaleHistory(
    input?: GetApickSaleHistoryInput
  ): Promise<ApiResponse<GetApickSaleHistoryOutput>>;
  adminSaleHistoryById(id: number): Promise<ApiResponse<SaleStatusCheckResult>>;
  searchApickHistory(
    input: SearchApickHistoryInput
  ): Promise<ApiResponse<SearchApickHistoryOutput>>;
  apickComprehensiveStats(
    input?: GetApickStatsInput
  ): Promise<ApiResponse<GetApickStatsOutput>>;
  apickHealthCheck(): Promise<ApiResponse<string>>;
  apickAccountInfo(): Promise<ApiResponse<ApickAccountInfo>>;
  // Mutations
  checkFloodDamage(
    input: CheckFloodDamageInput
  ): Promise<ApiResponse<FloodDamageCheckResult>>;
  checkScrapStatus(
    input: CheckScrapStatusInput
  ): Promise<ApiResponse<ScrapStatusCheckResult>>;
  checkSaleStatus(
    input: CheckSaleStatusInput
  ): Promise<ApiResponse<SaleStatusCheckResult>>;
  adminDeleteFloodHistory(id: number): Promise<ApiResponse<boolean>>;
  adminDeleteFloodHistoryBulk(
    input: DeleteApickHistoryInput
  ): Promise<ApiResponse<DeleteApickHistoryOutput>>;
  adminDeleteScrapHistory(id: number): Promise<ApiResponse<boolean>>;
  adminDeleteScrapHistoryBulk(
    input: DeleteApickHistoryInput
  ): Promise<ApiResponse<DeleteApickHistoryOutput>>;
  adminDeleteSaleHistory(id: number): Promise<ApiResponse<boolean>>;
  adminDeleteSaleHistoryBulk(
    input: DeleteApickHistoryInput
  ): Promise<ApiResponse<DeleteApickHistoryOutput>>;
  updateApickDailyStats(
    input?: GetApickStatsInput
  ): Promise<ApiResponse<GetApickStatsOutput>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface ApickState {
  floodHistory: GetApickFloodHistoryOutput | null;
  scrapHistory: GetApickScrapHistoryOutput | null;
  saleHistory: GetApickSaleHistoryOutput | null;
  searchResult: ApickSearchResult | null;
  stats: ApickStatsSummary | null;
  accountInfo: ApickAccountInfo | null;
  isLoading: boolean;
  error: string | null;
}

export interface ApickContextActions {
  setFloodHistory: (data: GetApickFloodHistoryOutput | null) => void;
  setScrapHistory: (data: GetApickScrapHistoryOutput | null) => void;
  setSaleHistory: (data: GetApickSaleHistoryOutput | null) => void;
  setSearchResult: (result: ApickSearchResult | null) => void;
  setStats: (stats: ApickStatsSummary | null) => void;
  setAccountInfo: (info: ApickAccountInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type ApickContextValue = ApickState & ApickContextActions;
