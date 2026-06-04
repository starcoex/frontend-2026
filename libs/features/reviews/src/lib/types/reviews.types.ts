import type { ApiResponse } from '../types';

// ============================================================================
// Enums
// ============================================================================

export type CommentStatus = 'ACTIVE' | 'HIDDEN' | 'DELETED';

export type VoteType = 'HELPFUL' | 'NOT_HELPFUL';

export type ReviewType = 'PRODUCT' | 'SERVICE' | 'DELIVERY' | 'GENERAL';

export type ReviewStatus = 'ACTIVE' | 'HIDDEN' | 'DELETED' | 'REPORTED';

export type ReviewTargetType =
  | 'PRODUCT'
  | 'STORE'
  | 'ORDER'
  | 'DELIVERY'
  | 'RESERVATION'
  | 'GENERAL';

// ============================================================================
// 엔티티 타입
// ============================================================================

export interface ReviewComment {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  content: string;
  status: CommentStatus;
  reviewId: number;
  userId: number;
  parentId?: number | null;
  replies?: ReviewComment[];
}

export interface ReviewVote {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  reviewId: number;
  userId: number;
  type: VoteType;
}

export interface Review {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  rating: number;
  type: ReviewType;
  status: ReviewStatus;
  targetId: number;
  targetType: ReviewTargetType;
  userId: number;
  imageUrls: string[];
  helpfulCount: number;
  notHelpfulCount: number;
  comments?: ReviewComment[];
  votes?: ReviewVote[];
}

export interface GeneralReviewScope {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  slug: string;
  name: string;
  description?: string | null;
  metadata?: Record<string, any> | null;
  isActive: boolean;
}

export interface GeneralScopeListResult {
  items: GeneralReviewScope[];
  total: number;
}

export interface GetGeneralScopesInput {
  isActive?: boolean;
}

// ============================================================================
// 통계 타입
// ============================================================================

export interface ReviewSummaryStats {
  total: number;
  active: number;
  hidden: number;
  deleted: number;
  reported: number;
}

export interface ReviewListResult {
  items: Review[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface GetReviewsInput {
  page?: number;
  limit?: number;
  targetId?: string;
  targetType?: ReviewTargetType;
  status?: ReviewStatus;
  search?: string;
}

export interface CreateReviewInput {
  title: string;
  content: string;
  rating: number;
  type: ReviewType;
  targetId: number;
  targetType: ReviewTargetType;
  imageUrls?: string[];
  metadata?: string;
  platform?: string;
  tags?: string[];
}

export interface VoteReviewInput {
  reviewId: number;
  type: VoteType;
  reason?: string;
  platform?: string;
}

export interface CreateCommentInput {
  content: string;
  reviewId: number;
  parentId?: number;
  mentionedUserIds?: number[];
  enableNotifications?: boolean;
  platform?: string;
}

export interface ChangeReviewStatusInput {
  id: number;
  status: ReviewStatus;
  reason?: string;
}

export interface DeleteReviewInput {
  id: number;
  hardDelete?: boolean;
  reason?: string;
}

export interface BulkDeleteReviewsInput {
  ids: number[];
  hardDelete?: boolean;
  reason?: string;
}

export interface ChangeCommentStatusInput {
  id: number;
  status: CommentStatus;
  reason?: string;
}

export interface CreateGeneralReviewScopeInput {
  slug: string;
  name: string;
  description?: string;
  metadata?: Record<string, any>;
  isActive?: boolean;
}

export interface UpdateGeneralReviewScopeInput {
  id: number;
  name?: string;
  description?: string;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface ErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

export interface CreateReviewOutput {
  success?: boolean | null;
  creationMessage?: string | null;
  userAverageRating?: number | null;
  error?: ErrorInfo | null;
  review?: Review | null;
}

export interface VoteReviewOutput {
  success?: boolean | null;
  voteMessage?: string | null;
  helpfulCount: number;
  notHelpfulCount: number;
  wasChanged: boolean;
  error?: ErrorInfo | null;
  vote?: ReviewVote | null;
}

export interface CreateCommentOutput {
  success?: boolean | null;
  creationMessage?: string | null;
  totalCommentCount?: number | null;
  notifiedUserIds?: number[] | null;
  error?: ErrorInfo | null;
  comment?: ReviewComment | null;
}

export interface ChangeReviewStatusOutput {
  success: boolean;
  message: string;
  review: Review;
}

export interface DeleteReviewOutput {
  success: boolean;
  message: string;
  deletedId: number;
}

export interface BulkDeleteReviewsOutput {
  success: boolean;
  message: string;
  successCount: number;
  failCount: number;
  deletedIds: number[];
  failedIds: number[];
}

export interface ChangeCommentStatusOutput {
  success: boolean;
  message: string;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface ReviewFilters {
  status?: ReviewStatus;
  targetType?: ReviewTargetType;
  search?: string;
}

export interface ReviewsState {
  reviews: Review[];
  currentReview: Review | null;
  summaryStats: ReviewSummaryStats | null;
  generalReviewScopes: GeneralReviewScope[];
  filters: ReviewFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface ReviewsContextActions {
  setReviews: (reviews: Review[]) => void;
  addReview: (review: Review) => void;
  updateReviewInContext: (id: number, updates: Partial<Review>) => void;
  removeReview: (id: number) => void;
  setCurrentReview: (review: Review | null) => void;
  setSummaryStats: (stats: ReviewSummaryStats | null) => void;
  setGeneralReviewScopes: (scopes: GeneralReviewScope[]) => void;
  addGeneralReviewScope: (scope: GeneralReviewScope) => void;
  updateGeneralReviewScopeInContext: (
    id: number,
    updates: Partial<GeneralReviewScope>
  ) => void;
  removeGeneralReviewScope: (id: number) => void;
  setFilters: (filters: Partial<ReviewFilters>) => void;
  clearFilters: () => void;
  setPagination: (pagination: Partial<ReviewsState['pagination']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type ReviewsContextValue = ReviewsState & ReviewsContextActions;

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IReviewsService {
  // Queries
  getReviewById(id: number): Promise<ApiResponse<Review>>;
  getReviews(input: GetReviewsInput): Promise<ApiResponse<ReviewListResult>>;
  getReviewSummaryStats(): Promise<ApiResponse<ReviewSummaryStats>>;
  reviewsByTarget(
    targetType: ReviewTargetType,
    targetId: number
  ): Promise<ApiResponse<Review[]>>;
  myReviews(limit?: number): Promise<ApiResponse<Review[]>>;
  getGeneralReviewScopeById(
    id: number
  ): Promise<ApiResponse<GeneralReviewScope>>;
  getGeneralReviewScopes(
    isActive?: boolean
  ): Promise<ApiResponse<GeneralReviewScope[]>>;
  // ✅ 신규
  getGeneralScopes(
    input?: GetGeneralScopesInput
  ): Promise<ApiResponse<GeneralScopeListResult>>;
  getGeneralScope(id: number): Promise<ApiResponse<GeneralReviewScope>>;

  // Mutations
  createReview(
    input: CreateReviewInput
  ): Promise<ApiResponse<CreateReviewOutput>>;
  voteReview(input: VoteReviewInput): Promise<ApiResponse<VoteReviewOutput>>;
  createReviewComment(
    input: CreateCommentInput
  ): Promise<ApiResponse<CreateCommentOutput>>;
  changeReviewStatus(
    input: ChangeReviewStatusInput
  ): Promise<ApiResponse<ChangeReviewStatusOutput>>;
  deleteReview(
    input: DeleteReviewInput
  ): Promise<ApiResponse<DeleteReviewOutput>>;
  bulkDeleteReviews(
    input: BulkDeleteReviewsInput
  ): Promise<ApiResponse<BulkDeleteReviewsOutput>>;
  changeCommentStatus(
    input: ChangeCommentStatusInput
  ): Promise<ApiResponse<ChangeCommentStatusOutput>>;
  createGeneralReviewScope(
    input: CreateGeneralReviewScopeInput
  ): Promise<ApiResponse<GeneralReviewScope>>;
  updateGeneralReviewScope(
    input: UpdateGeneralReviewScopeInput
  ): Promise<ApiResponse<GeneralReviewScope>>;
  deleteGeneralReviewScope(
    id: number
  ): Promise<ApiResponse<GeneralReviewScope>>;
}
