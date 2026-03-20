import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_CATEGORY,
  GET_CATEGORY_BY_SLUG,
  LIST_CATEGORIES,
  GET_CATEGORY_TREE,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  MOVE_CATEGORY,
  DELETE_CATEGORIES,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type { ApiResponse } from '../types';
import type {
  ICategoriesService,
  Category,
  CreateCategoryInput,
  CreateCategoryOutput,
  UpdateCategoryInput,
  UpdateCategoryOutput,
} from '../types';

export class CategoriesService implements ICategoriesService {
  constructor(private client: ApolloClient) {}

  // ============================================================================
  // 공통 헬퍼
  // ============================================================================

  private async query<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(query: any, variables?: TVars): Promise<ApiResponse<TData>> {
    try {
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      const { data, error, extensions } = result as {
        data?: TData;
        error?: { message?: string };
        extensions?: Record<string, unknown>;
      };

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: extensions ?? {},
        };
        return createErrorResponse<TData>(
          apiErrorFromGraphQLErrors([gqlError])
        );
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  private async mutate<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(mutation: any, variables: TVars): Promise<ApiResponse<TData>> {
    try {
      const { data, error, extensions } = await this.client.mutate<
        TData,
        TVars
      >({
        mutation,
        variables,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: (extensions ?? {}) as Record<string, unknown>,
        };
        return createErrorResponse<TData>(
          apiErrorFromGraphQLErrors([gqlError])
        );
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // ============================================================================
  // Queries
  // ============================================================================

  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    const res = await this.query<{ getCategoryById: Category }>(GET_CATEGORY, {
      id,
    });
    if (res.success && res.data?.getCategoryById) {
      return { success: true, data: res.data.getCategoryById };
    }
    return res as unknown as ApiResponse<Category>;
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category | null>> {
    const res = await this.query<{ findCategoryBySlug: Category | null }>(
      GET_CATEGORY_BY_SLUG,
      { slug }
    );
    if (res.success) {
      return { success: true, data: res.data?.findCategoryBySlug ?? null };
    }
    return res as unknown as ApiResponse<Category | null>;
  }

  async listCategories(parentId?: number): Promise<ApiResponse<Category[]>> {
    const res = await this.query<{ listCategories: Category[] }>(
      LIST_CATEGORIES,
      { parentId }
    );
    if (res.success && res.data?.listCategories) {
      return { success: true, data: res.data.listCategories };
    }
    return res as unknown as ApiResponse<Category[]>;
  }

  async getCategoryTree(
    rootId?: number,
    maxDepth?: number
  ): Promise<ApiResponse<Category[]>> {
    const res = await this.query<{ findCategoryTree: Category[] }>(
      GET_CATEGORY_TREE,
      { rootId, maxDepth }
    );
    if (res.success && res.data?.findCategoryTree) {
      return { success: true, data: res.data.findCategoryTree };
    }
    return res as unknown as ApiResponse<Category[]>;
  }

  // ============================================================================
  // Mutations
  // ============================================================================

  async createCategory(
    input: CreateCategoryInput
  ): Promise<ApiResponse<CreateCategoryOutput>> {
    const res = await this.mutate<{ createCategoryNew: CreateCategoryOutput }>(
      CREATE_CATEGORY,
      { input }
    );
    if (res.success && res.data?.createCategoryNew) {
      return { success: true, data: res.data.createCategoryNew };
    }
    return res as unknown as ApiResponse<CreateCategoryOutput>;
  }

  async updateCategory(
    input: UpdateCategoryInput
  ): Promise<ApiResponse<UpdateCategoryOutput>> {
    const res = await this.mutate<{ updateCategoryNew: UpdateCategoryOutput }>(
      UPDATE_CATEGORY,
      { input }
    );
    if (res.success && res.data?.updateCategoryNew) {
      return { success: true, data: res.data.updateCategoryNew };
    }
    return res as unknown as ApiResponse<UpdateCategoryOutput>;
  }

  async deleteCategory(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteCategory: boolean }>(
      DELETE_CATEGORY,
      {
        id,
      }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteCategory };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async deleteCategories(ids: number[]): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteCategoriesNew: boolean }>(
      DELETE_CATEGORIES,
      { ids }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteCategoriesNew };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async moveCategory(
    id: number,
    newParentId?: number
  ): Promise<ApiResponse<UpdateCategoryOutput>> {
    const res = await this.mutate<{ moveCategoryNew: UpdateCategoryOutput }>(
      MOVE_CATEGORY,
      { id, newParentId }
    );
    if (res.success && res.data?.moveCategoryNew) {
      return { success: true, data: res.data.moveCategoryNew };
    }
    return res as unknown as ApiResponse<UpdateCategoryOutput>;
  }
}
