import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  LIST_PRODUCTS,
  GET_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  DELETE_PRODUCTS,
  GET_PRODUCT_BY_BARCODE,
  LIST_PRODUCT_TYPES,
  GET_PRODUCT_TYPE_BY_ID,
  GET_PRODUCT_TYPE_BY_CODE,
  CREATE_PRODUCT_TYPE,
  UPDATE_PRODUCT_TYPE,
  CREATE_PRODUCT_INVENTORY,
  UPDATE_PRODUCT_INVENTORY,
  DELETE_PRODUCT_INVENTORY,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  ApiResponse,
  IProductsService,
  Product,
  ProductType,
  ProductInventory,
  CreateProductInput,
  CreateProductOutput,
  UpdateProductInput,
  UpdateProductOutput,
  DeleteProductOutput,
  CreateProductTypeInput,
  UpdateProductTypeInput,
  CreateProductInventoryInput,
  UpdateProductInventoryInput,
} from '../types';

export class ProductsService implements IProductsService {
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
  // Product Queries
  // ============================================================================

  async listProducts(): Promise<ApiResponse<Product[]>> {
    const res = await this.query<{ listProductsNew: Product[] }>(LIST_PRODUCTS);
    if (res.success && res.data?.listProductsNew) {
      return { success: true, data: res.data.listProductsNew };
    }
    return res as unknown as ApiResponse<Product[]>;
  }

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    const res = await this.query<{ findProductById: Product }>(GET_PRODUCT, {
      id,
    });
    if (res.success && res.data?.findProductById) {
      return { success: true, data: res.data.findProductById };
    }
    return res as unknown as ApiResponse<Product>;
  }

  async getProductByBarcode(barcode: string): Promise<ApiResponse<Product>> {
    const res = await this.query<{ productByBarcode: Product }>(
      GET_PRODUCT_BY_BARCODE,
      { barcode }
    );
    if (res.success && res.data?.productByBarcode) {
      return { success: true, data: res.data.productByBarcode };
    }
    return res as unknown as ApiResponse<Product>;
  }

  // ============================================================================
  // Product Mutations
  // ============================================================================

  async createProduct(
    input: CreateProductInput
  ): Promise<ApiResponse<CreateProductOutput>> {
    const res = await this.mutate<{ createProductNew: CreateProductOutput }>(
      CREATE_PRODUCT,
      { input }
    );
    if (res.success && res.data?.createProductNew) {
      return { success: true, data: res.data.createProductNew };
    }
    return res as unknown as ApiResponse<CreateProductOutput>;
  }

  async updateProduct(
    input: UpdateProductInput
  ): Promise<ApiResponse<UpdateProductOutput>> {
    const res = await this.mutate<{ updateProductNew: UpdateProductOutput }>(
      UPDATE_PRODUCT,
      { input }
    );
    if (res.success && res.data?.updateProductNew) {
      return { success: true, data: res.data.updateProductNew };
    }
    return res as unknown as ApiResponse<UpdateProductOutput>;
  }

  async deleteProduct(id: number): Promise<ApiResponse<DeleteProductOutput>> {
    const res = await this.mutate<{ deleteProductNew: DeleteProductOutput }>(
      DELETE_PRODUCT,
      { id }
    );
    if (res.success && res.data?.deleteProductNew) {
      return { success: true, data: res.data.deleteProductNew };
    }
    return res as unknown as ApiResponse<DeleteProductOutput>;
  }

  async deleteProducts(ids: number[]): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteProductsNew: boolean }>(
      DELETE_PRODUCTS,
      { ids }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteProductsNew };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  // ============================================================================
  // ProductType Queries
  // ============================================================================

  async listProductTypes(): Promise<ApiResponse<ProductType[]>> {
    const res = await this.query<{ listProductTypes: ProductType[] }>(
      LIST_PRODUCT_TYPES
    );
    if (res.success && res.data?.listProductTypes) {
      return { success: true, data: res.data.listProductTypes };
    }
    return res as unknown as ApiResponse<ProductType[]>;
  }

  async getProductTypeById(id: number): Promise<ApiResponse<ProductType>> {
    const res = await this.query<{ productTypeById: ProductType }>(
      GET_PRODUCT_TYPE_BY_ID,
      { id }
    );
    if (res.success && res.data?.productTypeById) {
      return { success: true, data: res.data.productTypeById };
    }
    return res as unknown as ApiResponse<ProductType>;
  }

  async getProductTypeByCode(code: string): Promise<ApiResponse<ProductType>> {
    const res = await this.query<{ productTypeByCode: ProductType }>(
      GET_PRODUCT_TYPE_BY_CODE,
      { code }
    );
    if (res.success && res.data?.productTypeByCode) {
      return { success: true, data: res.data.productTypeByCode };
    }
    return res as unknown as ApiResponse<ProductType>;
  }

  // ============================================================================
  // ProductType Mutations
  // ============================================================================

  async createProductType(
    input: CreateProductTypeInput
  ): Promise<ApiResponse<ProductType>> {
    const res = await this.mutate<{ createProductType: ProductType }>(
      CREATE_PRODUCT_TYPE,
      { input }
    );
    if (res.success && res.data?.createProductType) {
      return { success: true, data: res.data.createProductType };
    }
    return res as unknown as ApiResponse<ProductType>;
  }

  async updateProductType(
    input: UpdateProductTypeInput
  ): Promise<ApiResponse<ProductType>> {
    const res = await this.mutate<{ updateProductType: ProductType }>(
      UPDATE_PRODUCT_TYPE,
      { input }
    );
    if (res.success && res.data?.updateProductType) {
      return { success: true, data: res.data.updateProductType };
    }
    return res as unknown as ApiResponse<ProductType>;
  }

  // ============================================================================
  // Inventory Mutations
  // ============================================================================

  async createProductInventory(
    input: CreateProductInventoryInput
  ): Promise<ApiResponse<ProductInventory>> {
    const res = await this.mutate<{ createProductInventory: ProductInventory }>(
      CREATE_PRODUCT_INVENTORY,
      { input }
    );
    if (res.success && res.data?.createProductInventory) {
      return { success: true, data: res.data.createProductInventory };
    }
    return res as unknown as ApiResponse<ProductInventory>;
  }

  async updateProductInventory(
    input: UpdateProductInventoryInput
  ): Promise<ApiResponse<ProductInventory>> {
    const res = await this.mutate<{ updateProductInventory: ProductInventory }>(
      UPDATE_PRODUCT_INVENTORY,
      { input }
    );
    if (res.success && res.data?.updateProductInventory) {
      return { success: true, data: res.data.updateProductInventory };
    }
    return res as unknown as ApiResponse<ProductInventory>;
  }

  async deleteProductInventory(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteProductInventory: boolean }>(
      DELETE_PRODUCT_INVENTORY,
      { id }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteProductInventory };
    }
    return res as unknown as ApiResponse<boolean>;
  }
}
