import type { ApiResponse } from '../types';

// ============================================================================
// GraphQL 스키마 기반 타입
// ============================================================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  metadata?: Record<string, any> | null;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  parentId?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  parent?: Category | null;
  children: Category[];
}

export interface ErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

export interface CreateCategoryOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  category?: Category | null;
  creationMessage?: string | null;
  notificationMessage?: string | null;
  hierarchyMessage?: string | null;
}

export interface UpdateCategoryOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  category?: Category | null;
  updateMessage?: string | null;
  notificationSent?: boolean | null;
  hierarchyUpdateMessage?: string | null;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  parentId?: number;
  metadata?: Record<string, any>;
  tags?: string[];
  targetApp?: string;
  expectedProductCount?: number;
  colorTheme?: string;
}

export interface UpdateCategoryInput {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  parentId?: number;
  metadata?: Record<string, any>;
  tags?: string[];
  targetApp?: string;
  expectedProductCount?: number;
  colorTheme?: string;
  newParentId?: number;
  updateReason?: string;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface ICategoriesService {
  getCategoryById(id: number): Promise<ApiResponse<Category>>;
  getCategoryBySlug(slug: string): Promise<ApiResponse<Category | null>>;
  listCategories(parentId?: number): Promise<ApiResponse<Category[]>>;
  getCategoryTree(
    rootId?: number,
    maxDepth?: number
  ): Promise<ApiResponse<Category[]>>;
  createCategory(
    input: CreateCategoryInput
  ): Promise<ApiResponse<CreateCategoryOutput>>;
  updateCategory(
    input: UpdateCategoryInput
  ): Promise<ApiResponse<UpdateCategoryOutput>>;
  deleteCategory(id: number): Promise<ApiResponse<boolean>>;
  moveCategory(
    id: number,
    newParentId?: number
  ): Promise<ApiResponse<UpdateCategoryOutput>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface CategoriesState {
  categories: Category[];
  categoryTree: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

export interface CategoriesContextActions {
  setCategories: (categories: Category[]) => void;
  setCategoryTree: (tree: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategoryInContext: (id: number, updates: Partial<Category>) => void;
  removeCategory: (id: number) => void;
  setCurrentCategory: (category: Category | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type CategoriesContextValue = CategoriesState & CategoriesContextActions;
