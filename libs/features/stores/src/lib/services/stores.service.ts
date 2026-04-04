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
  DELETE_STORES,
  CREATE_BRAND,
  UPDATE_BRAND,
  DELETE_BRAND,
  DELETE_BRANDS,
  GET_STORE_STATISTICS,
  LIST_BUSINESS_TYPES,
  ADD_STORE_SERVICE,
  REMOVE_STORE_SERVICE,
  ADD_STORE_MANAGER,
  REMOVE_STORE_MANAGER,
  ListStoresQuery,
  GetStoreByIdQuery,
  GetStoreByIdQueryVariables,
  ListBrandsQuery,
  GetBrandByIdQuery,
  GetBrandByIdQueryVariables,
  ListBusinessTypesQuery,
  CreateStoreMutation,
  CreateStoreMutationVariables,
  UpdateStoreMutation,
  UpdateStoreMutationVariables,
  DeleteStoreMutation,
  DeleteStoreMutationVariables,
  AddStoreServiceMutation,
  AddStoreServiceMutationVariables,
  RemoveStoreServiceMutation,
  RemoveStoreServiceMutationVariables,
  AddStoreManagerMutation,
  AddStoreManagerMutationVariables,
  RemoveStoreManagerMutation,
  RemoveStoreManagerMutationVariables,
  CreateBrandMutation,
  CreateBrandMutationVariables,
  UpdateBrandMutation,
  UpdateBrandMutationVariables,
  DeleteBrandMutation,
  DeleteBrandMutationVariables,
  GetStoreStatisticsQuery,
  CreateStoreInput,
  UpdateStoreInput,
  DeleteStoreInput,
  AddStoreServiceInput,
  RemoveStoreServiceInput,
  AddStoreManagerInput,
  RemoveStoreManagerInput,
  CreateBrandInput,
  UpdateBrandInput,
  DeleteBrandInput,
  Store,
  Brand,
  BusinessType,
  CreateStoreOutput,
  UpdateStoreOutput,
  DeleteStoreOutput,
  CreateBrandOutput,
  UpdateBrandOutput,
  DeleteBrandOutput,
  CreateBusinessTypeInput,
  CreateBusinessTypeOutput,
  CreateBusinessTypeMutation,
  CREATE_BUSINESS_TYPE,
  CreateBusinessTypeMutationVariables,
  UpdateBusinessTypeInput,
  UpdateBusinessTypeOutput,
  UpdateBusinessTypeMutation,
  UPDATE_BUSINESS_TYPE,
  UpdateBusinessTypeMutationVariables,
  CreateServiceTypeInput,
  CreateServiceTypeOutput,
  CreateServiceTypeMutation,
  CREATE_SERVICE_TYPE,
  CreateServiceTypeMutationVariables,
  UpdateServiceTypeInput,
  UpdateServiceTypeOutput,
  UpdateServiceTypeMutation,
  UpdateServiceTypeMutationVariables,
  UPDATE_SERVICE_TYPE,
  ServiceType,
  ListServiceTypesQuery,
  LIST_SERVICE_TYPES,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import {
  ApiResponse,
  IStoresService,
  StoreStatsOutput,
  AddStoreServiceOutput,
} from '../types';

export class StoresService implements IStoresService {
  constructor(private client: ApolloClient) {}

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
      return createErrorResponse<TData>(
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e)
      );
    }
  }

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
      return createErrorResponse<TData>(
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e)
      );
    }
  }

  // ===== Store Queries =====

  async listStores(): Promise<ApiResponse<Store[]>> {
    const res = await this.query<ListStoresQuery>(LIST_STORES);
    if (res.success && res.data?.listStores)
      return { success: true, data: res.data.listStores as Store[] };
    return res as unknown as ApiResponse<Store[]>;
  }

  async getStoreById(id: number): Promise<ApiResponse<Store>> {
    const res = await this.query<GetStoreByIdQuery, GetStoreByIdQueryVariables>(
      GET_STORE_BY_ID,
      { id }
    );
    if (res.success && res.data?.getStoreById)
      return { success: true, data: res.data.getStoreById as Store };
    return res as unknown as ApiResponse<Store>;
  }

  async getStoreStatistics(): Promise<ApiResponse<StoreStatsOutput>> {
    const res = await this.query<GetStoreStatisticsQuery>(GET_STORE_STATISTICS);
    if (res.success && res.data?.getStoreStatistics)
      return {
        success: true,
        data: res.data.getStoreStatistics as StoreStatsOutput,
      };
    return res as unknown as ApiResponse<StoreStatsOutput>;
  }

  // ===== Brand Queries =====

  async listBrands(): Promise<ApiResponse<Brand[]>> {
    const res = await this.query<ListBrandsQuery>(LIST_BRANDS);
    if (res.success && res.data?.listBrands)
      return { success: true, data: res.data.listBrands as Brand[] };
    return res as unknown as ApiResponse<Brand[]>;
  }

  async getBrandById(id: number): Promise<ApiResponse<Brand>> {
    const res = await this.query<GetBrandByIdQuery, GetBrandByIdQueryVariables>(
      GET_BRAND_BY_ID,
      { id }
    );
    if (res.success && res.data?.getBrandById)
      return { success: true, data: res.data.getBrandById as Brand };
    return res as unknown as ApiResponse<Brand>;
  }

  // ===== ServiceType Query ✅ 신규 =====

  async listServiceTypes(): Promise<ApiResponse<ServiceType[]>> {
    const res = await this.query<ListServiceTypesQuery>(LIST_SERVICE_TYPES);
    if (res.success && res.data?.listServiceTypes)
      return {
        success: true,
        data: res.data.listServiceTypes as ServiceType[],
      };
    return res as unknown as ApiResponse<ServiceType[]>;
  }

  // ===== BusinessType Queries ✅ 신규 =====

  async listBusinessTypes(): Promise<ApiResponse<BusinessType[]>> {
    const res = await this.query<ListBusinessTypesQuery>(LIST_BUSINESS_TYPES);
    if (res.success && res.data?.listBusinessTypes)
      return {
        success: true,
        data: res.data.listBusinessTypes as BusinessType[],
      };
    return res as unknown as ApiResponse<BusinessType[]>;
  }

  // ===== Store Mutations =====

  async createStore(
    input: CreateStoreInput
  ): Promise<ApiResponse<CreateStoreOutput>> {
    const res = await this.mutate<
      CreateStoreMutation,
      CreateStoreMutationVariables
    >(CREATE_STORE, { input });
    if (res.success && res.data?.createStore)
      return { success: true, data: res.data.createStore as CreateStoreOutput };
    return res as ApiResponse<CreateStoreOutput>;
  }

  async updateStore(
    input: UpdateStoreInput
  ): Promise<ApiResponse<UpdateStoreOutput>> {
    const res = await this.mutate<
      UpdateStoreMutation,
      UpdateStoreMutationVariables
    >(UPDATE_STORE, { input });
    if (res.success && res.data?.updateStore)
      return { success: true, data: res.data.updateStore as UpdateStoreOutput };
    return res as ApiResponse<UpdateStoreOutput>;
  }

  async deleteStore(
    input: DeleteStoreInput
  ): Promise<ApiResponse<DeleteStoreOutput>> {
    const res = await this.mutate<
      DeleteStoreMutation,
      DeleteStoreMutationVariables
    >(DELETE_STORE, { input });
    if (res.success && res.data?.deleteStore)
      return { success: true, data: res.data.deleteStore as DeleteStoreOutput };
    return res as ApiResponse<DeleteStoreOutput>;
  }

  async deleteStores(ids: number[]): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteStores: boolean }, { ids: number[] }>(
      DELETE_STORES,
      { ids }
    );
    if (res.success && res.data !== undefined)
      return { success: true, data: res.data.deleteStores };
    return res as unknown as ApiResponse<boolean>;
  }

  // ===== StoreService Mutations ✅ 신규 =====

  async addStoreService(
    input: AddStoreServiceInput
  ): Promise<ApiResponse<AddStoreServiceOutput>> {
    const res = await this.mutate<
      AddStoreServiceMutation,
      AddStoreServiceMutationVariables
    >(ADD_STORE_SERVICE, { input });
    if (res.success && res.data?.addStoreService)
      return {
        success: true,
        data: res.data.addStoreService as AddStoreServiceOutput,
      };
    return res as ApiResponse<AddStoreServiceOutput>;
  }

  async removeStoreService(
    input: RemoveStoreServiceInput
  ): Promise<ApiResponse<AddStoreServiceOutput>> {
    const res = await this.mutate<
      RemoveStoreServiceMutation,
      RemoveStoreServiceMutationVariables
    >(REMOVE_STORE_SERVICE, { input });
    if (res.success && res.data?.removeStoreService)
      return {
        success: true,
        data: res.data.removeStoreService as AddStoreServiceOutput,
      };
    return res as ApiResponse<AddStoreServiceOutput>;
  }

  // ===== StoreManager Mutations ✅ 신규 =====

  async addStoreManager(
    input: AddStoreManagerInput
  ): Promise<ApiResponse<AddStoreServiceOutput>> {
    const res = await this.mutate<
      AddStoreManagerMutation,
      AddStoreManagerMutationVariables
    >(ADD_STORE_MANAGER, { input });
    if (res.success && res.data?.addStoreManager)
      return {
        success: true,
        data: res.data.addStoreManager as AddStoreServiceOutput,
      };
    return res as ApiResponse<AddStoreServiceOutput>;
  }

  async removeStoreManager(
    input: RemoveStoreManagerInput
  ): Promise<ApiResponse<AddStoreServiceOutput>> {
    const res = await this.mutate<
      RemoveStoreManagerMutation,
      RemoveStoreManagerMutationVariables
    >(REMOVE_STORE_MANAGER, { input });
    if (res.success && res.data?.removeStoreManager)
      return {
        success: true,
        data: res.data.removeStoreManager as AddStoreServiceOutput,
      };
    return res as ApiResponse<AddStoreServiceOutput>;
  }

  // ===== Brand Mutations =====

  async createBrand(
    input: CreateBrandInput
  ): Promise<ApiResponse<CreateBrandOutput>> {
    const res = await this.mutate<
      CreateBrandMutation,
      CreateBrandMutationVariables
    >(CREATE_BRAND, { input });
    if (res.success && res.data?.createBrand)
      return { success: true, data: res.data.createBrand as CreateBrandOutput };
    return res as ApiResponse<CreateBrandOutput>;
  }

  async updateBrand(
    input: UpdateBrandInput
  ): Promise<ApiResponse<UpdateBrandOutput>> {
    const res = await this.mutate<
      UpdateBrandMutation,
      UpdateBrandMutationVariables
    >(UPDATE_BRAND, { input });
    if (res.success && res.data?.updateBrand)
      return { success: true, data: res.data.updateBrand as UpdateBrandOutput };
    return res as ApiResponse<UpdateBrandOutput>;
  }

  async deleteBrand(
    input: DeleteBrandInput
  ): Promise<ApiResponse<DeleteBrandOutput>> {
    const res = await this.mutate<
      DeleteBrandMutation,
      DeleteBrandMutationVariables
    >(DELETE_BRAND, { input });
    if (res.success && res.data?.deleteBrand)
      return { success: true, data: res.data.deleteBrand as DeleteBrandOutput };
    return res as ApiResponse<DeleteBrandOutput>;
  }

  async deleteBrands(ids: number[]): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteBrands: boolean }, { ids: number[] }>(
      DELETE_BRANDS,
      { ids }
    );
    if (res.success && res.data !== undefined)
      return { success: true, data: res.data.deleteBrands };
    return res as unknown as ApiResponse<boolean>;
  }

  // ===== BusinessType Mutations (슈퍼 어드민) ✅ 신규 =====

  async createBusinessType(
    input: CreateBusinessTypeInput
  ): Promise<ApiResponse<CreateBusinessTypeOutput>> {
    const res = await this.mutate<
      CreateBusinessTypeMutation,
      CreateBusinessTypeMutationVariables
    >(CREATE_BUSINESS_TYPE, { input });
    if (res.success && res.data?.createBusinessType)
      return {
        success: true,
        data: res.data.createBusinessType as CreateBusinessTypeOutput,
      };
    return res as unknown as ApiResponse<CreateBusinessTypeOutput>;
  }

  async updateBusinessType(
    input: UpdateBusinessTypeInput
  ): Promise<ApiResponse<UpdateBusinessTypeOutput>> {
    const res = await this.mutate<
      UpdateBusinessTypeMutation,
      UpdateBusinessTypeMutationVariables
    >(UPDATE_BUSINESS_TYPE, { input });
    if (res.success && res.data?.updateBusinessType)
      return {
        success: true,
        data: res.data.updateBusinessType as UpdateBusinessTypeOutput,
      };
    return res as unknown as ApiResponse<UpdateBusinessTypeOutput>;
  }

  // ===== ServiceType Mutations (슈퍼 어드민) ✅ 신규 =====

  async createServiceType(
    input: CreateServiceTypeInput
  ): Promise<ApiResponse<CreateServiceTypeOutput>> {
    const res = await this.mutate<
      CreateServiceTypeMutation,
      CreateServiceTypeMutationVariables
    >(CREATE_SERVICE_TYPE, { input });
    if (res.success && res.data?.createServiceType)
      return {
        success: true,
        data: res.data.createServiceType as CreateServiceTypeOutput,
      };
    return res as unknown as ApiResponse<CreateServiceTypeOutput>;
  }

  async updateServiceType(
    input: UpdateServiceTypeInput
  ): Promise<ApiResponse<UpdateServiceTypeOutput>> {
    const res = await this.mutate<
      UpdateServiceTypeMutation,
      UpdateServiceTypeMutationVariables
    >(UPDATE_SERVICE_TYPE, { input });
    if (res.success && res.data?.updateServiceType)
      return {
        success: true,
        data: res.data.updateServiceType as UpdateServiceTypeOutput,
      };
    return res as unknown as ApiResponse<UpdateServiceTypeOutput>;
  }
}
