import type { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_DELIVERY_BY_ID,
  LIST_DELIVERIES,
  TRACK_DELIVERY,
  GET_MY_DELIVERIES, // ✅ 신규
  GET_MY_DRIVER_PROFILE, // ✅ 신규
  CREATE_DELIVERY,
  CREATE_DELIVERY_DRIVER,
  UPDATE_DELIVERY_STATUS,
  DEACTIVATE_DRIVER,
  DEACTIVATE_DRIVERS,
  UPDATE_DRIVER_AVAILABILITY,
  UPDATE_DRIVER_LOCATION,
  VERIFY_DRIVER_LICENSE, // ✅ 추가
  OCR_DRIVER_LICENSE, // ✅ 추가
  GET_DRIVER_BY_ID, // ✅ 신규
  GET_DRIVERS, // ✅ 신규
  GET_DRIVER_SETTLEMENTS, // ✅ 신규
  UPDATE_DRIVER_PROFILE, // ✅ 신규
  UPDATE_DRIVER_STATUS, // ✅ 신규
  DELETE_DRIVER, // ✅ 신규
  DELETE_DRIVERS, // ✅ 신규
  DELETE_DELIVERY, // ✅ 신규
  DELETE_DELIVERIES, // ✅ 신규
  ASSIGN_DRIVER_TO_DELIVERY, // ✅ 신규
  UNASSIGN_DRIVER_FROM_DELIVERY, // ✅ 신규
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
  VerifyDriverLicenseInput, // ✅ 추가
  VerifyDriverLicenseOutput, // ✅ 추가
  OcrDriverLicenseInput, // ✅ 추가
  OcrDriverLicenseOutput, // ✅ 추가
  GetDriversInput, // ✅ 신규
  GetDriverSettlementsInput, // ✅ 신규
  GetDriverSettlementsOutput, // ✅ 신규
  UpdateDriverProfileInput, // ✅ 신규
  UpdateDriverProfileOutput,
  GetDriversOutput, // ✅ 신규
  UpdateDriverStatusInput, // ✅ 신규
  UpdateDriverStatusOutput, // ✅ 신규
  AssignDriverInput, // ✅ 신규
  AssignDriverOutput, // ✅ 신규
  UnassignDriverInput, // ✅ 신규
  UnassignDriverOutput,
  GetMyDeliveriesInput, // ✅ 신규
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
  // 신규 Queries
  // ============================================================================

  async getDriverById(id: number): Promise<ApiResponse<DeliveryDriver>> {
    const res = await this.query<{ getDriverById: DeliveryDriver }>(
      GET_DRIVER_BY_ID,
      { id }
    );
    if (res.success && res.data?.getDriverById) {
      return { success: true, data: res.data.getDriverById };
    }
    return res as unknown as ApiResponse<DeliveryDriver>;
  }

  async getDrivers(
    input: GetDriversInput
  ): Promise<ApiResponse<GetDriversOutput>> {
    const res = await this.query<{ getDrivers: GetDriversOutput }>(
      GET_DRIVERS,
      input
    );
    if (res.success && res.data?.getDrivers) {
      return { success: true, data: res.data.getDrivers };
    }
    return res as unknown as ApiResponse<GetDriversOutput>;
  }

  async getDriverSettlements(
    input: GetDriverSettlementsInput
  ): Promise<ApiResponse<GetDriverSettlementsOutput>> {
    const res = await this.query<{
      getDriverSettlements: GetDriverSettlementsOutput;
    }>(GET_DRIVER_SETTLEMENTS, { input });
    if (res.success && res.data?.getDriverSettlements) {
      return { success: true, data: res.data.getDriverSettlements };
    }
    return res as unknown as ApiResponse<GetDriverSettlementsOutput>;
  }

  // ============================================================================
  // 신규 Mutations
  // ============================================================================

  async updateDriverProfile(
    input: UpdateDriverProfileInput
  ): Promise<ApiResponse<UpdateDriverProfileOutput>> {
    const res = await this.mutate<{
      updateDriverProfile: UpdateDriverProfileOutput;
    }>(UPDATE_DRIVER_PROFILE, { input });
    if (res.success && res.data?.updateDriverProfile) {
      return { success: true, data: res.data.updateDriverProfile };
    }
    return res as unknown as ApiResponse<UpdateDriverProfileOutput>;
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

  // ✅ 신규: 배달기사 본인 배송 조회
  async getMyDeliveries(
    input: GetMyDeliveriesInput
  ): Promise<ApiResponse<GetDeliveriesOutput>> {
    const res = await this.query<{ getMyDeliveries: GetDeliveriesOutput }>(
      GET_MY_DELIVERIES,
      { statuses: input.statuses, page: input.page, limit: input.limit }
    );
    if (res.success && res.data?.getMyDeliveries) {
      return { success: true, data: res.data.getMyDeliveries };
    }
    return res as unknown as ApiResponse<GetDeliveriesOutput>;
  }

  // ✅ 신규: 본인 기사 프로필 조회 (인자 없음 — JWT userId 기반)
  async getMyDriverProfile(): Promise<ApiResponse<DeliveryDriver | null>> {
    const res = await this.query<{ getMyDriverProfile: DeliveryDriver | null }>(
      GET_MY_DRIVER_PROFILE
    );
    if (res.success) {
      return { success: true, data: res.data?.getMyDriverProfile ?? null };
    }
    return res as unknown as ApiResponse<DeliveryDriver | null>;
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

  async updateDriverStatus(
    input: UpdateDriverStatusInput
  ): Promise<ApiResponse<UpdateDriverStatusOutput>> {
    const res = await this.mutate<{
      updateDriverStatus: UpdateDriverStatusOutput;
    }>(UPDATE_DRIVER_STATUS, { input });
    if (res.success && res.data?.updateDriverStatus) {
      return { success: true, data: res.data.updateDriverStatus };
    }
    return res as unknown as ApiResponse<UpdateDriverStatusOutput>;
  }

  async deleteDriver(driverId: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteDriver: boolean }>(DELETE_DRIVER, {
      driverId,
    });
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteDriver };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async deleteDrivers(driverIds: number[]): Promise<ApiResponse<number>> {
    const res = await this.mutate<{ deleteDrivers: number }>(DELETE_DRIVERS, {
      driverIds,
    });
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteDrivers };
    }
    return res as unknown as ApiResponse<number>;
  }

  async deleteDelivery(deliveryId: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteDelivery: boolean }>(
      DELETE_DELIVERY,
      { deliveryId }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteDelivery };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async deleteDeliveries(deliveryIds: number[]): Promise<ApiResponse<number>> {
    const res = await this.mutate<{ deleteDeliveries: number }>(
      DELETE_DELIVERIES,
      { deliveryIds }
    );
    if (res.success && res.data !== undefined) {
      return { success: true, data: res.data.deleteDeliveries };
    }
    return res as unknown as ApiResponse<number>;
  }

  // ============================================================================
  // Mutations — 면허 관련 추가
  // ============================================================================

  async verifyDriverLicense(
    input: VerifyDriverLicenseInput
  ): Promise<ApiResponse<VerifyDriverLicenseOutput>> {
    const res = await this.mutate<{
      verifyDriverLicense: VerifyDriverLicenseOutput;
    }>(VERIFY_DRIVER_LICENSE, { input });
    if (res.success && res.data?.verifyDriverLicense) {
      return { success: true, data: res.data.verifyDriverLicense };
    }
    return res as unknown as ApiResponse<VerifyDriverLicenseOutput>;
  }

  async ocrDriverLicense(
    input: OcrDriverLicenseInput
  ): Promise<ApiResponse<OcrDriverLicenseOutput>> {
    const res = await this.mutate<{
      ocrDriverLicense: OcrDriverLicenseOutput;
    }>(OCR_DRIVER_LICENSE, { input });
    if (res.success && res.data?.ocrDriverLicense) {
      return { success: true, data: res.data.ocrDriverLicense };
    }
    return res as unknown as ApiResponse<OcrDriverLicenseOutput>;
  }

  // ✅ 신규: 기사 배정
  async assignDriverToDelivery(
    input: AssignDriverInput
  ): Promise<ApiResponse<AssignDriverOutput>> {
    const res = await this.mutate<{
      assignDriverToDelivery: AssignDriverOutput;
    }>(ASSIGN_DRIVER_TO_DELIVERY, { input });
    if (res.success && res.data?.assignDriverToDelivery) {
      return { success: true, data: res.data.assignDriverToDelivery };
    }
    return res as unknown as ApiResponse<AssignDriverOutput>;
  }

  // ✅ 신규: 기사 배정 해제
  async unassignDriverFromDelivery(
    input: UnassignDriverInput
  ): Promise<ApiResponse<UnassignDriverOutput>> {
    const res = await this.mutate<{
      unassignDriverFromDelivery: UnassignDriverOutput;
    }>(UNASSIGN_DRIVER_FROM_DELIVERY, { input });
    if (res.success && res.data?.unassignDriverFromDelivery) {
      return { success: true, data: res.data.unassignDriverFromDelivery };
    }
    return res as unknown as ApiResponse<UnassignDriverOutput>;
  }
}
