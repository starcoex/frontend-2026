import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  ApiResponse,
  IInventoryService,
  StoreInventory,
  CreateStoreInventoryInput,
  CreateStoreInventoryOutput,
  AddFuelStockInput,
  FuelInventoryOutput,
  DispenseFuelInput,
  UpdateStoreInventoryInput,
  UpdateStoreInventoryOutput,
  AddStockInput,
  AddStockOutput,
} from '../types';
import {
  GET_INVENTORY_BY_ID,
  GET_INVENTORIES_BY_PRODUCT,
  GET_LOW_STOCK_INVENTORIES,
  CREATE_STORE_INVENTORY,
  GET_STORE_INVENTORIES,
  DELETE_STORE_INVENTORY,
  DELETE_STORE_INVENTORIES,
  ADD_FUEL_STOCK,
  DISPENSE_FUEL,
  UPDATE_STORE_INVENTORY,
  ADD_STOCK,
} from '@starcoex-frontend/graphql';

export class InventoryService implements IInventoryService {
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

  async getInventoryById(id: number): Promise<ApiResponse<StoreInventory>> {
    const res = await this.query<{ getInventoryById: StoreInventory }>(
      GET_INVENTORY_BY_ID,
      { id }
    );
    if (res.success && res.data?.getInventoryById) {
      return { success: true, data: res.data.getInventoryById };
    }
    return res as unknown as ApiResponse<StoreInventory>;
  }

  async getStoreInventories(
    storeId?: number
  ): Promise<ApiResponse<StoreInventory[]>> {
    const res = await this.query<{ getStoreInventories: StoreInventory[] }>(
      GET_STORE_INVENTORIES,
      { storeId }
    );
    if (res.success && res.data?.getStoreInventories) {
      return { success: true, data: res.data.getStoreInventories };
    }
    return res as unknown as ApiResponse<StoreInventory[]>;
  }

  async getInventoriesByProduct(
    productId: number,
    storeId?: number
  ): Promise<ApiResponse<StoreInventory[]>> {
    const res = await this.query<{ getInventoriesByProduct: StoreInventory[] }>(
      GET_INVENTORIES_BY_PRODUCT,
      { productId, storeId }
    );
    if (res.success && res.data?.getInventoriesByProduct) {
      return { success: true, data: res.data.getInventoriesByProduct };
    }
    return res as unknown as ApiResponse<StoreInventory[]>;
  }

  async getLowStockInventories(
    storeId?: number
  ): Promise<ApiResponse<StoreInventory[]>> {
    const res = await this.query<{ getLowStockInventories: StoreInventory[] }>(
      GET_LOW_STOCK_INVENTORIES,
      { storeId }
    );
    if (res.success && res.data?.getLowStockInventories) {
      return { success: true, data: res.data.getLowStockInventories };
    }
    return res as unknown as ApiResponse<StoreInventory[]>;
  }

  // ============================================================================
  // Mutations
  // ============================================================================

  async createStoreInventory(
    input: CreateStoreInventoryInput
  ): Promise<ApiResponse<CreateStoreInventoryOutput>> {
    const res = await this.mutate<{
      createStoreInventory: CreateStoreInventoryOutput;
    }>(CREATE_STORE_INVENTORY, { input });
    if (res.success && res.data?.createStoreInventory) {
      return { success: true, data: res.data.createStoreInventory };
    }
    return res as unknown as ApiResponse<CreateStoreInventoryOutput>;
  }

  async updateStoreInventory(
    input: UpdateStoreInventoryInput
  ): Promise<ApiResponse<UpdateStoreInventoryOutput>> {
    const res = await this.mutate<{
      updateStoreInventory: UpdateStoreInventoryOutput;
    }>(UPDATE_STORE_INVENTORY, { input });
    if (res.success && res.data?.updateStoreInventory) {
      return { success: true, data: res.data.updateStoreInventory };
    }
    return res as unknown as ApiResponse<UpdateStoreInventoryOutput>;
  }

  async deleteStoreInventory(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteStoreInventory: boolean }>(
      DELETE_STORE_INVENTORY,
      { id }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteStoreInventory };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async deleteStoreInventories(ids: number[]): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteStoreInventories: boolean }>(
      DELETE_STORE_INVENTORIES,
      { ids }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteStoreInventories };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async addStock(input: AddStockInput): Promise<ApiResponse<AddStockOutput>> {
    const res = await this.mutate<{ addStock: AddStockOutput }>(ADD_STOCK, {
      input,
    });
    if (res.success && res.data?.addStock) {
      return { success: true, data: res.data.addStock };
    }
    return res as unknown as ApiResponse<AddStockOutput>;
  }

  async addFuelStock(
    input: AddFuelStockInput
  ): Promise<ApiResponse<FuelInventoryOutput>> {
    const res = await this.mutate<{ addFuelStock: FuelInventoryOutput }>(
      ADD_FUEL_STOCK,
      { input }
    );
    if (res.success && res.data?.addFuelStock) {
      return { success: true, data: res.data.addFuelStock };
    }
    return res as unknown as ApiResponse<FuelInventoryOutput>;
  }

  async dispenseFuel(
    input: DispenseFuelInput
  ): Promise<ApiResponse<FuelInventoryOutput>> {
    const res = await this.mutate<{ dispenseFuel: FuelInventoryOutput }>(
      DISPENSE_FUEL,
      { input }
    );
    if (res.success && res.data?.dispenseFuel) {
      return { success: true, data: res.data.dispenseFuel };
    }
    return res as unknown as ApiResponse<FuelInventoryOutput>;
  }
}
