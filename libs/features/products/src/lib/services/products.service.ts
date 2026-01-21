import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  LIST_PRODUCTS,
  FIND_PRODUCT_BY_ID,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  CREATE_PRODUCT_INVENTORY,
  UPDATE_PRODUCT_INVENTORY,
  DELETE_PRODUCT_INVENTORY,
  ListProductsNewQuery,
  FindProductByIdQuery,
  FindProductByIdQueryVariables,
  CreateProductNewMutation,
  CreateProductNewMutationVariables,
  UpdateProductNewMutation,
  UpdateProductNewMutationVariables,
  CreateProductInventoryMutation,
  CreateProductInventoryMutationVariables,
  UpdateProductInventoryMutation,
  UpdateProductInventoryMutationVariables,
  DeleteProductInventoryMutation,
  DeleteProductInventoryMutationVariables,
  CreateProductInput,
  UpdateProductInput,
  CreateProductInventoryInput,
  UpdateProductInventoryInput,
  Product,
  ProductInventory,
  CreateProductOutput,
  UpdateProductOutput,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import { ApiResponse, IProductsService } from '../types';

export class ProductsService implements IProductsService {
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

  // ===== Queries =====

  async listProducts(): Promise<ApiResponse<Product[]>> {
    const res = await this.query<ListProductsNewQuery>(LIST_PRODUCTS);
    if (res.success && res.data?.listProductsNew) {
      return { success: true, data: res.data.listProductsNew };
    }
    return res as unknown as ApiResponse<Product[]>;
  }

  async findProductById(id: number): Promise<ApiResponse<Product>> {
    const res = await this.query<
      FindProductByIdQuery,
      FindProductByIdQueryVariables
    >(FIND_PRODUCT_BY_ID, { id });
    if (res.success && res.data?.findProductById) {
      return { success: true, data: res.data.findProductById };
    }
    return res as unknown as ApiResponse<Product>;
  }

  // ===== Mutations =====

  async createProduct(
    input: CreateProductInput
  ): Promise<ApiResponse<CreateProductOutput>> {
    const res = await this.mutate<
      CreateProductNewMutation,
      CreateProductNewMutationVariables
    >(CREATE_PRODUCT, { input });
    if (res.success && res.data?.createProductNew) {
      return {
        success: true,
        data: res.data.createProductNew as CreateProductOutput,
      };
    }
    return res as ApiResponse<CreateProductOutput>;
  }

  async updateProduct(
    input: UpdateProductInput
  ): Promise<ApiResponse<UpdateProductOutput>> {
    const res = await this.mutate<
      UpdateProductNewMutation,
      UpdateProductNewMutationVariables
    >(UPDATE_PRODUCT, { input });
    if (res.success && res.data?.updateProductNew) {
      return {
        success: true,
        data: res.data.updateProductNew as UpdateProductOutput,
      };
    }
    return res as ApiResponse<UpdateProductOutput>;
  }

  async createProductInventory(
    input: CreateProductInventoryInput
  ): Promise<ApiResponse<ProductInventory>> {
    const res = await this.mutate<
      CreateProductInventoryMutation,
      CreateProductInventoryMutationVariables
    >(CREATE_PRODUCT_INVENTORY, { input });
    if (res.success && res.data?.createProductInventory) {
      return {
        success: true,
        data: res.data.createProductInventory as ProductInventory,
      };
    }
    return res as unknown as ApiResponse<ProductInventory>;
  }

  async updateProductInventory(
    input: UpdateProductInventoryInput
  ): Promise<ApiResponse<ProductInventory>> {
    const res = await this.mutate<
      UpdateProductInventoryMutation,
      UpdateProductInventoryMutationVariables
    >(UPDATE_PRODUCT_INVENTORY, { input });
    if (res.success && res.data?.updateProductInventory) {
      return {
        success: true,
        data: res.data.updateProductInventory as ProductInventory,
      };
    }
    return res as unknown as ApiResponse<ProductInventory>;
  }

  async deleteProductInventory(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<
      DeleteProductInventoryMutation,
      DeleteProductInventoryMutationVariables
    >(DELETE_PRODUCT_INVENTORY, { id });
    if (res.success) {
      return { success: true, data: res.data?.deleteProductInventory ?? false };
    }
    return res as unknown as ApiResponse<boolean>;
  }
}
