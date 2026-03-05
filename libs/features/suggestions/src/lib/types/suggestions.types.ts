import type { ApiResponse } from '../types';

// ============================================================================
// GraphQL 스키마 기반 타입 (codegen 없이 직접 정의)
// ============================================================================

export type SuggestionCategory =
  | 'FEATURE_REQUEST'
  | 'BUG_REPORT'
  | 'IMPROVEMENT'
  | 'COMPLAINT'
  | 'UI_UX'
  | 'OTHER';

export type SuggestionStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Suggestion {
  id: number;
  title: string;
  description: string;
  category: SuggestionCategory;
  status: SuggestionStatus;
  priority: Priority;
  userId: number;
  userEmail?: string | null;
  targetApp?: string | null;
  tags: string[];
  metadata?: Record<string, any> | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  user?: { id: number } | null;
}

export interface GetSuggestionsOutput {
  success: boolean;
  error?: { code?: string; message: string; details?: string } | null;
  suggestions: Suggestion[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CreateSuggestionOutput {
  success: boolean;
  error?: { code?: string; message: string; details?: string } | null;
  suggestion?: Suggestion | null;
  creationMessage?: string | null;
  notificationMessage?: string | null;
}

export interface UpdateSuggestionOutput {
  success: boolean;
  error?: { code?: string; message: string; details?: string } | null;
  suggestion?: Suggestion | null;
  updateMessage?: string | null;
  notificationSent?: boolean | null;
}

export interface GetSuggestionsInput {
  page?: number;
  limit?: number;
  status?: SuggestionStatus;
  category?: SuggestionCategory;
  priority?: Priority;
  targetApp?: string;
  search?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateSuggestionInput {
  title: string;
  description: string;
  category: SuggestionCategory;
  targetApp?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  attachments?: string[];
  pageUrl?: string;
  errorMessage?: string;
  reproductionSteps?: string[];
}

export interface UpdateSuggestionInput {
  id: number;
  title?: string;
  description?: string;
  category?: SuggestionCategory;
  targetApp?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  attachments?: string[];
  pageUrl?: string;
  errorMessage?: string;
  reproductionSteps?: string[];
  priority?: Priority;
}

export interface UpdateSuggestionStatusInput {
  id: number;
  status: SuggestionStatus;
  priority?: Priority;
  adminResponse?: string;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface ISuggestionsService {
  getSuggestion(id: number): Promise<ApiResponse<Suggestion>>;
  getSuggestions(
    input?: GetSuggestionsInput
  ): Promise<ApiResponse<GetSuggestionsOutput>>;
  getMySuggestions(
    input?: GetSuggestionsInput
  ): Promise<ApiResponse<GetSuggestionsOutput>>;
  getSuggestionStats(): Promise<ApiResponse<string>>;
  createSuggestion(
    input: CreateSuggestionInput
  ): Promise<ApiResponse<CreateSuggestionOutput>>;
  updateSuggestion(
    input: UpdateSuggestionInput
  ): Promise<ApiResponse<UpdateSuggestionOutput>>;
  updateSuggestionStatus(
    input: UpdateSuggestionStatusInput
  ): Promise<ApiResponse<UpdateSuggestionOutput>>;
  deleteSuggestion(id: number): Promise<ApiResponse<boolean>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface SuggestionsState {
  suggestions: Suggestion[];
  currentSuggestion: Suggestion | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  filters: GetSuggestionsInput;
  isLoading: boolean;
  error: string | null;
}

export interface SuggestionsContextActions {
  setSuggestions: (
    suggestions: Suggestion[],
    pagination?: Partial<
      Pick<
        SuggestionsState,
        'totalCount' | 'currentPage' | 'totalPages' | 'hasNext' | 'hasPrev'
      >
    >
  ) => void;
  addSuggestion: (suggestion: Suggestion) => void;
  updateSuggestionInContext: (id: number, updates: Partial<Suggestion>) => void;
  removeSuggestion: (id: number) => void;
  setCurrentSuggestion: (suggestion: Suggestion | null) => void;
  setFilters: (filters: Partial<GetSuggestionsInput>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type SuggestionsContextValue = SuggestionsState &
  SuggestionsContextActions;
