import type { ApiResponse } from '../types';

// ============================================================================
// Enum 타입
// ============================================================================

export type NoticeStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
export type NoticeType =
  | 'GENERAL'
  | 'IMPORTANT'
  | 'MAINTENANCE'
  | 'EVENT'
  | 'URGENT';
export type BusinessType =
  | 'ZERAGAE_CARCARE'
  | 'SINHAN_NETWORKS'
  | 'STAR_GAS_STATION'
  | 'SHADE_CANOPY'
  | 'COMMON';
export type ManualStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// ============================================================================
// 엔티티 타입
// ============================================================================

export interface Notice {
  id: number;
  title: string;
  content: string;
  status: NoticeStatus;
  type: NoticeType;
  isPinned: boolean;
  isPopup: boolean;
  targetApps: string[];
  targetRoles: string[];
  visibleFrom?: string | null;
  visibleUntil?: string | null;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  archivedAt?: string | null;
  createdBy: number;
  updatedBy?: number | null;
  publishedBy?: number | null;
  archivedBy?: number | null;
  sourceSuggestionId?: number | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ManualHistory {
  id: number;
  manualId: number;
  version: string;
  title: string;
  content: string;
  updatedBy: number;
  changeLog?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ManualCategory {
  id: number;
  name: string;
  description?: string | null;
  slug: string;
  targetBusiness: BusinessType;
  targetApp: string;
  order: number;
  isVisible: boolean;
  iconMediaId?: string | null;
  createdBy: number;
  updatedBy?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  manuals?: Manual[];
}

export interface Manual {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  status: ManualStatus;
  version: string;
  targetBusiness: BusinessType;
  targetApp: string;
  tags: string[];
  summary?: string | null;
  order: number;
  imageMediaIds: string[];
  videoMediaIds: string[];
  createdBy: number;
  updatedBy?: number | null;
  publishedBy?: number | null;
  archivedBy?: number | null;
  relatedManualIds: number[];
  metadata?: Record<string, any> | null;
  publishedAt?: string | null;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  category?: ManualCategory | null;
  histories?: ManualHistory[];
  relatedManuals?: Manual[];
}

// ============================================================================
// ErrorInfo
// ============================================================================

export interface ErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface CreateNoticeOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  notice?: Notice | null;
  message?: string | null;
}

export interface UpdateNoticeOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  notice?: Notice | null;
  updateMessage?: string | null;
  notificationSent?: boolean | null;
}

export interface GetNoticesOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  notices: Notice[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ManualCategoryCommandResult {
  success?: boolean | null;
  error?: ErrorInfo | null;
  category?: ManualCategory | null;
  message?: string | null;
}

export interface CreateManualOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  manual?: Manual | null;
  message?: string | null;
}

export interface UpdateManualOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  manual?: Manual | null;
  updateMessage?: string | null;
}

export interface GetManualsOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  manuals: Manual[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface GetNoticesInput {
  page?: number;
  limit?: number;
  status?: NoticeStatus;
  type?: NoticeType;
  isPinned?: boolean;
  targetApp?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateNoticeInput {
  title: string;
  content: string;
  type?: NoticeType;
  isPinned?: boolean;
  isPopup?: boolean;
  targetApps?: string[];
  targetRoles?: string[];
  visibleFrom?: string;
  visibleUntil?: string;
  scheduledAt?: string;
  sourceSuggestionId?: number;
}

export interface UpdateNoticeInput {
  id: number;
  title?: string;
  content?: string;
  type?: NoticeType;
  isPinned?: boolean;
  isPopup?: boolean;
  targetApps?: string[];
  targetRoles?: string[];
  visibleFrom?: string;
  visibleUntil?: string;
  scheduledAt?: string;
  sourceSuggestionId?: number;
}

export interface PublishNoticeInput {
  id: number;
  publishedAt?: string;
}

export interface ArchiveNoticeInput {
  id: number;
  reason?: string;
}

export interface GetManualsInput {
  page?: number;
  limit?: number;
  categoryId?: number;
  status?: ManualStatus;
  targetBusiness?: BusinessType;
  targetApp?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateManualCategoryInput {
  name: string;
  slug: string;
  targetBusiness: BusinessType;
  targetApp: string;
  description?: string;
  order?: number;
  isVisible?: boolean;
  iconMediaId?: string;
}

export interface UpdateManualCategoryInput {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
  targetBusiness?: BusinessType;
  targetApp?: string;
  order?: number;
  isVisible?: boolean;
  iconMediaId?: string;
}

export interface CreateManualInput {
  title: string;
  content: string;
  categoryId: number;
  targetBusiness: BusinessType;
  targetApp: string;
  tags?: string[];
  summary?: string;
  order?: number;
  imageMediaIds?: string[];
  videoMediaIds?: string[];
  relatedManualIds?: number[];
  version?: string;
  changeLog?: string;
}

export interface UpdateManualInput {
  id: number;
  title?: string;
  content?: string;
  categoryId?: number;
  targetBusiness?: BusinessType;
  targetApp?: string;
  tags?: string[];
  summary?: string;
  order?: number;
  imageMediaIds?: string[];
  videoMediaIds?: string[];
  relatedManualIds?: number[];
  version?: string;
  changeLog?: string;
}

export interface PublishManualInput {
  id: number;
}

export interface ArchiveManualInput {
  id: number;
  reason?: string;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface INoticesService {
  // Notice Queries
  getNotices(input: GetNoticesInput): Promise<ApiResponse<GetNoticesOutput>>;
  getNoticeById(id: number): Promise<ApiResponse<Notice>>;
  getPublishedNotices(targetApp?: string): Promise<ApiResponse<Notice[]>>;
  // Notice Mutations
  createNotice(
    input: CreateNoticeInput
  ): Promise<ApiResponse<CreateNoticeOutput>>;
  updateNotice(
    input: UpdateNoticeInput
  ): Promise<ApiResponse<UpdateNoticeOutput>>;
  publishNotice(
    input: PublishNoticeInput
  ): Promise<ApiResponse<UpdateNoticeOutput>>;
  archiveNotice(
    input: ArchiveNoticeInput
  ): Promise<ApiResponse<UpdateNoticeOutput>>;
  deleteNotice(id: number): Promise<ApiResponse<boolean>>;
  deleteNotices(ids: number[]): Promise<ApiResponse<boolean>>;
  createNoticeFromSuggestion(
    suggestionId: number,
    suggestionTitle: string,
    suggestionContent: string
  ): Promise<ApiResponse<CreateNoticeOutput>>;
  // Manual Category
  getManualCategories(
    targetBusiness?: BusinessType,
    targetApp?: string
  ): Promise<ApiResponse<ManualCategory[]>>;
  createManualCategory(
    input: CreateManualCategoryInput
  ): Promise<ApiResponse<ManualCategoryCommandResult>>;
  updateManualCategory(
    input: UpdateManualCategoryInput
  ): Promise<ApiResponse<ManualCategoryCommandResult>>;
  deleteManualCategory(id: number): Promise<ApiResponse<boolean>>;
  // Manual
  getManuals(input: GetManualsInput): Promise<ApiResponse<GetManualsOutput>>;
  getManualById(id: number): Promise<ApiResponse<Manual>>;
  getPublishedManuals(
    targetBusiness: BusinessType,
    targetApp: string,
    categoryId?: number
  ): Promise<ApiResponse<Manual[]>>;
  getManualHistories(manualId: number): Promise<ApiResponse<ManualHistory[]>>;
  createManual(
    input: CreateManualInput
  ): Promise<ApiResponse<CreateManualOutput>>;
  updateManual(
    input: UpdateManualInput
  ): Promise<ApiResponse<UpdateManualOutput>>;
  publishManual(
    input: PublishManualInput
  ): Promise<ApiResponse<UpdateManualOutput>>;
  archiveManual(
    input: ArchiveManualInput
  ): Promise<ApiResponse<UpdateManualOutput>>;
  deleteManual(id: number): Promise<ApiResponse<boolean>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface NoticeFilters {
  search?: string;
  status?: NoticeStatus;
  type?: NoticeType;
  isPinned?: boolean;
  targetApp?: string;
}

export interface ManualFilters {
  search?: string;
  categoryId?: number;
  status?: ManualStatus;
  targetBusiness?: BusinessType;
  targetApp?: string;
}

export interface NoticesState {
  notices: Notice[];
  currentNotice: Notice | null;
  noticeFilters: NoticeFilters;
  manuals: Manual[];
  currentManual: Manual | null;
  manualCategories: ManualCategory[];
  manualFilters: ManualFilters;
  isLoading: boolean;
  error: string | null;
}

export interface NoticesContextActions {
  setNotices: (notices: Notice[]) => void;
  addNotice: (notice: Notice) => void;
  updateNoticeInContext: (id: number, updates: Partial<Notice>) => void;
  removeNotice: (id: number) => void;
  setCurrentNotice: (notice: Notice | null) => void;
  setNoticeFilters: (filters: Partial<NoticeFilters>) => void;
  setManuals: (manuals: Manual[]) => void;
  addManual: (manual: Manual) => void;
  updateManualInContext: (id: number, updates: Partial<Manual>) => void;
  removeManual: (id: number) => void;
  setCurrentManual: (manual: Manual | null) => void;
  setManualCategories: (categories: ManualCategory[]) => void;
  setManualFilters: (filters: Partial<ManualFilters>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type NoticesContextValue = NoticesState & NoticesContextActions;
