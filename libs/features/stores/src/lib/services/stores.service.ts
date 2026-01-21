import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  LIST_STORES,
  GET_STORE_BY_ID,
  LIST_BRANDS,
  GET_BRAND_BY_ID,
  CREATE_STORE,
  UPDATE_STORE,
  DELETE_STORE,
  CREATE_BRAND,
  UPDATE_BRAND,
  DELETE_BRAND,
  ListStoresQuery,
  GetStoreByIdQuery,
  GetStoreByIdQueryVariables,
  ListBrandsQuery,
  GetBrandByIdQuery,
  GetBrandByIdQueryVariables,
  CreateStoreMutation,
  CreateStoreMutationVariables,
  UpdateStoreMutation,
  UpdateStoreMutationVariables,
  DeleteStoreMutation,
  DeleteStoreMutationVariables,
  CreateBrandMutation,
  CreateBrandMutationVariables,
  UpdateBrandMutation,
  UpdateBrandMutationVariables,
  DeleteBrandMutation,
  DeleteBrandMutationVariables,
  CreateStoreInput,
  UpdateStoreInput,
  DeleteStoreInput,
  CreateBrandInput,
  UpdateBrandInput,
  DeleteBrandInput,
  Store,
  Brand,
  CreateStoreOutput,
  UpdateStoreOutput,
  DeleteStoreOutput,
  CreateBrandOutput,
  UpdateBrandOutput,
  DeleteBrandOutput,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import { ApiResponse, IStoresService } from '../types';

export class StoresService implements IStoresService {
  constructor(private client: ApolloClient) {}

  // 공통 mutation helper
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
        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // 공통 query helper
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
        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return { success: true, data: data as TData };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // ===== Store Queries =====

  async listStores(): Promise<ApiResponse<Store[]>> {
    const res = await this.query<ListStoresQuery>(LIST_STORES);
    if (res.success && res.data?.listStores) {
      return { success: true, data: res.data.listStores as Store[] };
    }
    return res as unknown as ApiResponse<Store[]>;
  }

  async getStoreById(id: number): Promise<ApiResponse<Store>> {
    const res = await this.query<GetStoreByIdQuery, GetStoreByIdQueryVariables>(
      GET_STORE_BY_ID,
      { id }
    );
    if (res.success && res.data?.getStoreById) {
      return { success: true, data: res.data.getStoreById as Store };
    }
    return res as unknown as ApiResponse<Store>;
  }

  // ===== Brand Queries =====

  async listBrands(): Promise<ApiResponse<Brand[]>> {
    const res = await this.query<ListBrandsQuery>(LIST_BRANDS);
    if (res.success && res.data?.listBrands) {
      return { success: true, data: res.data.listBrands as Brand[] };
    }
    return res as unknown as ApiResponse<Brand[]>;
  }

  async getBrandById(id: number): Promise<ApiResponse<Brand>> {
    const res = await this.query<GetBrandByIdQuery, GetBrandByIdQueryVariables>(
      GET_BRAND_BY_ID,
      { id }
    );
    if (res.success && res.data?.getBrandById) {
      return { success: true, data: res.data.getBrandById as Brand };
    }
    return res as unknown as ApiResponse<Brand>;
  }

  // ===== Store Mutations =====

  async createStore(
    input: CreateStoreInput
  ): Promise<ApiResponse<CreateStoreOutput>> {
    const res = await this.mutate<
      CreateStoreMutation,
      CreateStoreMutationVariables
    >(CREATE_STORE, { input });
    if (res.success && res.data?.createStore) {
      return {
        success: true,
        data: res.data.createStore as CreateStoreOutput,
      };
    }
    return res as ApiResponse<CreateStoreOutput>;
  }

  async updateStore(
    input: UpdateStoreInput
  ): Promise<ApiResponse<UpdateStoreOutput>> {
    const res = await this.mutate<
      UpdateStoreMutation,
      UpdateStoreMutationVariables
    >(UPDATE_STORE, { input });
    if (res.success && res.data?.updateStore) {
      return {
        success: true,
        data: res.data.updateStore as UpdateStoreOutput,
      };
    }
    return res as ApiResponse<UpdateStoreOutput>;
  }

  async deleteStore(
    input: DeleteStoreInput
  ): Promise<ApiResponse<DeleteStoreOutput>> {
    const res = await this.mutate<
      DeleteStoreMutation,
      DeleteStoreMutationVariables
    >(DELETE_STORE, { input });
    if (res.success && res.data?.deleteStore) {
      return {
        success: true,
        data: res.data.deleteStore as DeleteStoreOutput,
      };
    }
    return res as ApiResponse<DeleteStoreOutput>;
  }

  // ===== Brand Mutations =====

  async createBrand(
    input: CreateBrandInput
  ): Promise<ApiResponse<CreateBrandOutput>> {
    const res = await this.mutate<
      CreateBrandMutation,
      CreateBrandMutationVariables
    >(CREATE_BRAND, { input });
    if (res.success && res.data?.createBrand) {
      return {
        success: true,
        data: res.data.createBrand as CreateBrandOutput,
      };
    }
    return res as ApiResponse<CreateBrandOutput>;
  }

  async updateBrand(
    input: UpdateBrandInput
  ): Promise<ApiResponse<UpdateBrandOutput>> {
    const res = await this.mutate<
      UpdateBrandMutation,
      UpdateBrandMutationVariables
    >(UPDATE_BRAND, { input });
    if (res.success && res.data?.updateBrand) {
      return {
        success: true,
        data: res.data.updateBrand as UpdateBrandOutput,
      };
    }
    return res as ApiResponse<UpdateBrandOutput>;
  }

  async deleteBrand(
    input: DeleteBrandInput
  ): Promise<ApiResponse<DeleteBrandOutput>> {
    const res = await this.mutate<
      DeleteBrandMutation,
      DeleteBrandMutationVariables
    >(DELETE_BRAND, { input });
    if (res.success && res.data?.deleteBrand) {
      return {
        success: true,
        data: res.data.deleteBrand as DeleteBrandOutput,
      };
    }
    return res as ApiResponse<DeleteBrandOutput>;
  }
}
