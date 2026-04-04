import type { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_DELIVERY_BY_ID,
  LIST_DELIVERIES,
  TRACK_DELIVERY,
  CREATE_DELIVERY,
  CREATE_DELIVERY_DRIVER,
  UPDATE_DELIVERY_STATUS,
  DEACTIVATE_DRIVER,
  DEACTIVATE_DRIVERS,
  UPDATE_DRIVER_AVAILABILITY,
  UPDATE_DRIVER_LOCATION,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  ApiResponse,
  IDeliveryService,
  Delivery,
  DeliveryDriver,
  DeliveryTrackingInfo,
  GetDeliveriesInput,
  GetDeliveriesOutput,
  CreateDeliveryInput,
  CreateDeliveryOutput,
  CreateDeliveryDriverInput,
  CreateDeliveryDriverOutput,
  DeliveryStatus,
} from '../types';

export class DeliveryService implements IDeliveryService {
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

  async getDeliveryById(id: number): Promise<ApiResponse<Delivery>> {
    const res = await this.query<{ getDeliveryById: Delivery }>(
      GET_DELIVERY_BY_ID,
      { id }
    );
    if (res.success && res.data?.getDeliveryById) {
      return { success: true, data: res.data.getDeliveryById };
    }
    return res as unknown as ApiResponse<Delivery>;
  }

  async listDeliveries(
    input: GetDeliveriesInput
  ): Promise<ApiResponse<GetDeliveriesOutput>> {
    const res = await this.query<{ listDeliveries: GetDeliveriesOutput }>(
      LIST_DELIVERIES,
      { input }
    );
    if (res.success && res.data?.listDeliveries) {
      return { success: true, data: res.data.listDeliveries };
    }
    return res as unknown as ApiResponse<GetDeliveriesOutput>;
  }

  async trackDelivery(
    deliveryNumber: string
  ): Promise<ApiResponse<DeliveryTrackingInfo>> {
    const res = await this.query<{ trackDelivery: DeliveryTrackingInfo }>(
      TRACK_DELIVERY,
      { deliveryNumber }
    );
    if (res.success && res.data?.trackDelivery) {
      return { success: true, data: res.data.trackDelivery };
    }
    return res as unknown as ApiResponse<DeliveryTrackingInfo>;
  }

  // ============================================================================
  // Mutations
  // ============================================================================

  async createDelivery(
    input: CreateDeliveryInput
  ): Promise<ApiResponse<CreateDeliveryOutput>> {
    const res = await this.mutate<{ createDelivery: CreateDeliveryOutput }>(
      CREATE_DELIVERY,
      { input }
    );
    if (res.success && res.data?.createDelivery) {
      return { success: true, data: res.data.createDelivery };
    }
    return res as unknown as ApiResponse<CreateDeliveryOutput>;
  }

  async createDeliveryDriver(
    input: CreateDeliveryDriverInput
  ): Promise<ApiResponse<CreateDeliveryDriverOutput>> {
    const res = await this.mutate<{
      createDeliveryDriver: CreateDeliveryDriverOutput;
    }>(CREATE_DELIVERY_DRIVER, { input });
    if (res.success && res.data?.createDeliveryDriver) {
      return { success: true, data: res.data.createDeliveryDriver };
    }
    return res as unknown as ApiResponse<CreateDeliveryDriverOutput>;
  }

  async updateDeliveryStatus(
    deliveryId: number,
    status: DeliveryStatus
  ): Promise<ApiResponse<Delivery>> {
    const res = await this.mutate<{ updateDeliveryStatus: Delivery }>(
      UPDATE_DELIVERY_STATUS,
      { deliveryId, status }
    );
    if (res.success && res.data?.updateDeliveryStatus) {
      return { success: true, data: res.data.updateDeliveryStatus };
    }
    return res as unknown as ApiResponse<Delivery>;
  }

  async deactivateDriver(driverId: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deactivateDriver: boolean }>(
      DEACTIVATE_DRIVER,
      { driverId }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deactivateDriver };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async deactivateDrivers(driverIds: number[]): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deactivateDrivers: boolean }>(
      DEACTIVATE_DRIVERS,
      { driverIds }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deactivateDrivers };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async updateDriverAvailability(
    driverId: number,
    isAvailable: boolean
  ): Promise<ApiResponse<DeliveryDriver>> {
    const res = await this.mutate<{
      updateDriverAvailability: DeliveryDriver;
    }>(UPDATE_DRIVER_AVAILABILITY, { driverId, isAvailable });
    if (res.success && res.data?.updateDriverAvailability) {
      return { success: true, data: res.data.updateDriverAvailability };
    }
    return res as unknown as ApiResponse<DeliveryDriver>;
  }

  async updateDriverLocation(
    driverId: number,
    lat: number,
    lng: number
  ): Promise<ApiResponse<DeliveryDriver>> {
    const res = await this.mutate<{ updateDriverLocation: DeliveryDriver }>(
      UPDATE_DRIVER_LOCATION,
      { driverId, lat, lng }
    );
    if (res.success && res.data?.updateDriverLocation) {
      return { success: true, data: res.data.updateDriverLocation };
    }
    return res as unknown as ApiResponse<DeliveryDriver>;
  }
}
