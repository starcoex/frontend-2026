import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GET_RESERVATION,
  LIST_RESERVATIONS,
  FIND_AVAILABLE_SLOTS,
  FIND_SERVICE_RESOURCES,
  FIND_SCHEDULE_TEMPLATES,
  FIND_WALK_INS,
  CREATE_RESERVATION,
  UPDATE_RESERVATION_STATUS,
  CANCEL_RESERVATION,
  CHECK_IN_RESERVATION,
  CHECK_OUT_RESERVATION,
  REVIEW_RESERVATION_APPROVAL,
  CREATE_WALK_IN,
  UPDATE_WALK_IN_STATUS,
  GENERATE_SLOTS,
  CREATE_SCHEDULE_TEMPLATE,
  CREATE_SERVICE_RESOURCE,
  UPDATE_SERVICE_RESOURCE,
  DELETE_RESERVATION,
  BULK_DELETE_RESERVATIONS,
  DELETE_FUEL_WALK_IN,
  BULK_DELETE_FUEL_WALK_INS,
  DELETE_HEATING_OIL_DELIVERY,
  BULK_DELETE_HEATING_OIL_DELIVERIES,
  DEACTIVATE_SERVICE_RESOURCE,
  DEACTIVATE_SCHEDULE_TEMPLATE,
  DELETE_SCHEDULE_BLOCKED_DATE,
  DELETE_WALK_IN,
  BULK_DELETE_WALK_INS,
  FIND_FUEL_WALK_INS,
  CREATE_FUEL_WALK_IN,
  ATTACH_FUEL_PAYMENT,
  COMPLETE_FUEL_WALK_IN,
  UPDATE_FUEL_WALK_IN_STATUS,
  CREATE_FUEL_WALK_IN_PACKAGE,
  ATTACH_PACKAGE_PAYMENT,
  UPDATE_PACKAGE_STATUS,
  FIND_HEATING_OIL_DELIVERIES,
  CREATE_HEATING_OIL_DELIVERY,
  ASSIGN_DELIVERY_DRIVER,
  UPDATE_HEATING_OIL_DELIVERY_STATUS,
  COMPLETE_HEATING_OIL_DELIVERY,
  CREATE_SCHEDULE_BLOCKED_DATE,
  FindReservableServicesInput,
  FindReservableServicesOutput,
  FIND_RESERVABLE_SERVICES,
  CREATE_RESERVABLE_SERVICE,
  UPDATE_RESERVABLE_SERVICE,
  DELETE_RESERVABLE_SERVICE,
  FIND_REFUND_POLICIES,
  CREATE_REFUND_POLICY,
  UPDATE_REFUND_POLICY,
  DELETE_REFUND_POLICY, // ← 추가
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  ApiResponse,
  AssignDriverInput,
  AttachFuelPaymentInput,
  AttachPackagePaymentInput,
  CompleteFuelWalkInInput,
  CompleteHeatingOilDeliveryInput,
  CreateFuelWalkInInput,
  CreateFuelWalkInPackageInput,
  CreateHeatingOilDeliveryInput,
  CreateRefundPolicyInput,
  CreateReservableServiceInput,
  CreateScheduleBlockedDateInput,
  DeleteReservableServiceOutput,
  FindFuelWalkInsOutput,
  FindHeatingOilDeliveriesOutput,
  FindRefundPoliciesOutput,
  FuelWalkInPackageOutput,
  RefundPolicyOutput,
  ReservableServiceOutput,
  UpdateFuelWalkInStatusInput,
  UpdateHeatingOilDeliveryStatusInput,
  UpdatePackageStatusInput,
  UpdateRefundPolicyInput,
  UpdateReservableServiceInput,
} from '../types';
import type {
  IReservationsService,
  Reservation,
  ReservationTimeSlot,
  ServiceResource,
  ScheduleTemplate,
  WalkIn,
  FindReservationsInput,
  FindReservationsOutput,
  CreateReservationInput,
  CreateReservationOutput,
  UpdateReservationStatusInput,
  UpdateReservationOutput,
  CancelReservationInput,
  CancelReservationOutput,
  CheckInReservationInput,
  CheckInReservationOutput,
  CheckOutReservationInput,
  CheckOutReservationOutput,
  ReviewReservationApprovalInput,
  ReservationApprovalOutput,
  CreateWalkInInput,
  UpdateWalkInStatusInput,
  WalkInOutput,
  GenerateSlotsInput,
  GenerateSlotsOutput,
  CreateScheduleTemplateInput,
  ScheduleTemplateOutput,
  CreateServiceResourceInput,
  UpdateServiceResourceInput,
  ServiceResourceOutput,
  WalkInStatus,
  DeleteReservationOutput,
  FuelWalkInOutput,
  HeatingOilDeliveryOutput,
  ScheduleBlockedDateOutput,
} from '../types';

export class ReservationsService implements IReservationsService {
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

  async getReservationById(id: number): Promise<ApiResponse<Reservation>> {
    const res = await this.query<{ findReservationNew: Reservation }>(
      GET_RESERVATION,
      { id }
    );
    if (res.success && res.data?.findReservationNew) {
      return { success: true, data: res.data.findReservationNew };
    }
    return res as unknown as ApiResponse<Reservation>;
  }

  async listReservations(
    input: FindReservationsInput
  ): Promise<ApiResponse<FindReservationsOutput>> {
    const res = await this.query<{
      findReservationsNew: FindReservationsOutput;
    }>(LIST_RESERVATIONS, { input });
    if (res.success && res.data?.findReservationsNew) {
      return { success: true, data: res.data.findReservationsNew };
    }
    return res as unknown as ApiResponse<FindReservationsOutput>;
  }

  async findAvailableSlots(
    serviceId: number,
    date: string
  ): Promise<ApiResponse<ReservationTimeSlot[]>> {
    const res = await this.query<{ findAvailableSlots: ReservationTimeSlot[] }>(
      FIND_AVAILABLE_SLOTS,
      { serviceId, date }
    );
    if (res.success && res.data?.findAvailableSlots) {
      return { success: true, data: res.data.findAvailableSlots };
    }
    return res as unknown as ApiResponse<ReservationTimeSlot[]>;
  }

  async findServiceResources(
    serviceId: number
  ): Promise<ApiResponse<ServiceResource[]>> {
    const res = await this.query<{ findServiceResources: ServiceResource[] }>(
      FIND_SERVICE_RESOURCES,
      { serviceId }
    );
    if (res.success && res.data?.findServiceResources) {
      return { success: true, data: res.data.findServiceResources };
    }
    return res as unknown as ApiResponse<ServiceResource[]>;
  }

  async findScheduleTemplates(
    serviceId: number
  ): Promise<ApiResponse<ScheduleTemplate[]>> {
    const res = await this.query<{ findScheduleTemplates: ScheduleTemplate[] }>(
      FIND_SCHEDULE_TEMPLATES,
      { serviceId }
    );
    if (res.success && res.data?.findScheduleTemplates) {
      return { success: true, data: res.data.findScheduleTemplates };
    }
    return res as unknown as ApiResponse<ScheduleTemplate[]>;
  }

  // ─── ReservableService Queries ────────────────────────────────────────────

  async findReservableServices(
    input: FindReservableServicesInput
  ): Promise<ApiResponse<FindReservableServicesOutput>> {
    const res = await this.query<{
      findReservableServices: FindReservableServicesOutput;
    }>(FIND_RESERVABLE_SERVICES, { input });
    if (res.success && res.data?.findReservableServices) {
      return { success: true, data: res.data.findReservableServices };
    }
    return res as unknown as ApiResponse<FindReservableServicesOutput>;
  }

  // ─── ReservableService Mutations ─────────────────────────────────────────

  async createReservableService(
    input: CreateReservableServiceInput
  ): Promise<ApiResponse<ReservableServiceOutput>> {
    const res = await this.mutate<{
      createReservableService: ReservableServiceOutput;
    }>(CREATE_RESERVABLE_SERVICE, { input });
    if (res.success && res.data?.createReservableService) {
      return { success: true, data: res.data.createReservableService };
    }
    return res as unknown as ApiResponse<ReservableServiceOutput>;
  }

  async updateReservableService(
    input: UpdateReservableServiceInput
  ): Promise<ApiResponse<ReservableServiceOutput>> {
    const res = await this.mutate<{
      updateReservableService: ReservableServiceOutput;
    }>(UPDATE_RESERVABLE_SERVICE, { input });
    if (res.success && res.data?.updateReservableService) {
      return { success: true, data: res.data.updateReservableService };
    }
    return res as unknown as ApiResponse<ReservableServiceOutput>;
  }

  async deleteReservableService(
    id: number
  ): Promise<ApiResponse<DeleteReservableServiceOutput>> {
    const res = await this.mutate<{
      deleteReservableService: DeleteReservableServiceOutput;
    }>(DELETE_RESERVABLE_SERVICE, { id });
    if (res.success && res.data?.deleteReservableService) {
      return { success: true, data: res.data.deleteReservableService };
    }
    return res as unknown as ApiResponse<DeleteReservableServiceOutput>;
  }

  async findWalkIns(input: {
    storeId?: number;
    serviceId?: number;
    status?: WalkInStatus;
  }): Promise<ApiResponse<{ walkIns?: WalkIn[]; total?: number }>> {
    const res = await this.query<{
      findWalkIns: { walkIns?: WalkIn[]; total?: number };
    }>(FIND_WALK_INS, { input });
    if (res.success && res.data?.findWalkIns) {
      return { success: true, data: res.data.findWalkIns };
    }
    return res as unknown as ApiResponse<{
      walkIns?: WalkIn[];
      total?: number;
    }>;
  }

  // ─── RefundPolicy ────────────────────────────────────────────────────────

  async findRefundPolicies(): Promise<ApiResponse<FindRefundPoliciesOutput>> {
    const res = await this.query<{
      findRefundPolicies: FindRefundPoliciesOutput;
    }>(FIND_REFUND_POLICIES);
    if (res.success && res.data?.findRefundPolicies) {
      return { success: true, data: res.data.findRefundPolicies };
    }
    return res as unknown as ApiResponse<FindRefundPoliciesOutput>;
  }

  async createRefundPolicy(
    input: CreateRefundPolicyInput
  ): Promise<ApiResponse<RefundPolicyOutput>> {
    const res = await this.mutate<{
      createRefundPolicy: RefundPolicyOutput;
    }>(CREATE_REFUND_POLICY, { input });
    if (res.success && res.data?.createRefundPolicy) {
      return { success: true, data: res.data.createRefundPolicy };
    }
    return res as unknown as ApiResponse<RefundPolicyOutput>;
  }

  async updateRefundPolicy(
    input: UpdateRefundPolicyInput
  ): Promise<ApiResponse<RefundPolicyOutput>> {
    const res = await this.mutate<{
      updateRefundPolicy: RefundPolicyOutput;
    }>(UPDATE_REFUND_POLICY, { input });
    if (res.success && res.data?.updateRefundPolicy) {
      return { success: true, data: res.data.updateRefundPolicy };
    }
    return res as unknown as ApiResponse<RefundPolicyOutput>;
  }

  async deleteRefundPolicy(
    id: number
  ): Promise<ApiResponse<RefundPolicyOutput>> {
    const res = await this.mutate<{
      deleteRefundPolicy: RefundPolicyOutput;
    }>(DELETE_REFUND_POLICY, { id });
    if (res.success && res.data?.deleteRefundPolicy) {
      return { success: true, data: res.data.deleteRefundPolicy };
    }
    return res as unknown as ApiResponse<RefundPolicyOutput>;
  }

  // ============================================================================
  // Mutations
  // ============================================================================

  async createReservation(
    input: CreateReservationInput
  ): Promise<ApiResponse<CreateReservationOutput>> {
    const res = await this.mutate<{
      createReservationNew: CreateReservationOutput;
    }>(CREATE_RESERVATION, { input });
    if (res.success && res.data?.createReservationNew) {
      return { success: true, data: res.data.createReservationNew };
    }
    return res as unknown as ApiResponse<CreateReservationOutput>;
  }

  async updateReservationStatus(
    input: UpdateReservationStatusInput
  ): Promise<ApiResponse<UpdateReservationOutput>> {
    const res = await this.mutate<{
      updateReservationStatus: UpdateReservationOutput;
    }>(UPDATE_RESERVATION_STATUS, { input });
    if (res.success && res.data?.updateReservationStatus) {
      return { success: true, data: res.data.updateReservationStatus };
    }
    return res as unknown as ApiResponse<UpdateReservationOutput>;
  }

  async cancelReservation(
    input: CancelReservationInput
  ): Promise<ApiResponse<CancelReservationOutput>> {
    const res = await this.mutate<{
      cancelReservationNew: CancelReservationOutput;
    }>(CANCEL_RESERVATION, { input });
    if (res.success && res.data?.cancelReservationNew) {
      return { success: true, data: res.data.cancelReservationNew };
    }
    return res as unknown as ApiResponse<CancelReservationOutput>;
  }

  async checkInReservation(
    input: CheckInReservationInput
  ): Promise<ApiResponse<CheckInReservationOutput>> {
    const res = await this.mutate<{
      checkInReservationNew: CheckInReservationOutput;
    }>(CHECK_IN_RESERVATION, { input });
    if (res.success && res.data?.checkInReservationNew) {
      return { success: true, data: res.data.checkInReservationNew };
    }
    return res as unknown as ApiResponse<CheckInReservationOutput>;
  }

  async checkOutReservation(
    input: CheckOutReservationInput
  ): Promise<ApiResponse<CheckOutReservationOutput>> {
    const res = await this.mutate<{
      checkOutReservationNew: CheckOutReservationOutput;
    }>(CHECK_OUT_RESERVATION, { input });
    if (res.success && res.data?.checkOutReservationNew) {
      return { success: true, data: res.data.checkOutReservationNew };
    }
    return res as unknown as ApiResponse<CheckOutReservationOutput>;
  }

  async reviewReservationApproval(
    input: ReviewReservationApprovalInput
  ): Promise<ApiResponse<ReservationApprovalOutput>> {
    const res = await this.mutate<{
      reviewReservationApproval: ReservationApprovalOutput;
    }>(REVIEW_RESERVATION_APPROVAL, { input });
    if (res.success && res.data?.reviewReservationApproval) {
      return { success: true, data: res.data.reviewReservationApproval };
    }
    return res as unknown as ApiResponse<ReservationApprovalOutput>;
  }

  async createWalkIn(
    input: CreateWalkInInput
  ): Promise<ApiResponse<WalkInOutput>> {
    const res = await this.mutate<{ createWalkIn: WalkInOutput }>(
      CREATE_WALK_IN,
      { input }
    );
    if (res.success && res.data?.createWalkIn) {
      return { success: true, data: res.data.createWalkIn };
    }
    return res as unknown as ApiResponse<WalkInOutput>;
  }

  async updateWalkInStatus(
    input: UpdateWalkInStatusInput
  ): Promise<ApiResponse<WalkInOutput>> {
    const res = await this.mutate<{ updateWalkInStatus: WalkInOutput }>(
      UPDATE_WALK_IN_STATUS,
      { input }
    );
    if (res.success && res.data?.updateWalkInStatus) {
      return { success: true, data: res.data.updateWalkInStatus };
    }
    return res as unknown as ApiResponse<WalkInOutput>;
  }

  async generateSlots(
    input: GenerateSlotsInput
  ): Promise<ApiResponse<GenerateSlotsOutput>> {
    const res = await this.mutate<{ generateSlots: GenerateSlotsOutput }>(
      GENERATE_SLOTS,
      { input }
    );
    if (res.success && res.data?.generateSlots) {
      return { success: true, data: res.data.generateSlots };
    }
    return res as unknown as ApiResponse<GenerateSlotsOutput>;
  }

  async createScheduleTemplate(
    input: CreateScheduleTemplateInput
  ): Promise<ApiResponse<ScheduleTemplateOutput>> {
    const res = await this.mutate<{
      createScheduleTemplate: ScheduleTemplateOutput;
    }>(CREATE_SCHEDULE_TEMPLATE, { input });
    if (res.success && res.data?.createScheduleTemplate) {
      return { success: true, data: res.data.createScheduleTemplate };
    }
    return res as unknown as ApiResponse<ScheduleTemplateOutput>;
  }

  async createScheduleBlockedDate(
    input: CreateScheduleBlockedDateInput
  ): Promise<ApiResponse<ScheduleBlockedDateOutput>> {
    const res = await this.mutate<{
      createScheduleBlockedDate: ScheduleBlockedDateOutput;
    }>(CREATE_SCHEDULE_BLOCKED_DATE, { input }); // ← MUTATION 접미사 제거
    if (res.success && res.data?.createScheduleBlockedDate) {
      return { success: true, data: res.data.createScheduleBlockedDate };
    }
    return res as unknown as ApiResponse<ScheduleBlockedDateOutput>;
  }

  async createServiceResource(
    input: CreateServiceResourceInput
  ): Promise<ApiResponse<ServiceResourceOutput>> {
    const res = await this.mutate<{
      createServiceResource: ServiceResourceOutput;
    }>(CREATE_SERVICE_RESOURCE, { input });
    if (res.success && res.data?.createServiceResource) {
      return { success: true, data: res.data.createServiceResource };
    }
    return res as unknown as ApiResponse<ServiceResourceOutput>;
  }

  async updateServiceResource(
    input: UpdateServiceResourceInput
  ): Promise<ApiResponse<ServiceResourceOutput>> {
    const res = await this.mutate<{
      updateServiceResource: ServiceResourceOutput;
    }>(UPDATE_SERVICE_RESOURCE, { input });
    if (res.success && res.data?.updateServiceResource) {
      return { success: true, data: res.data.updateServiceResource };
    }
    return res as unknown as ApiResponse<ServiceResourceOutput>;
  }

  // ============================================================================
  // 삭제 / 비활성화 Mutations
  // ============================================================================

  async deleteReservation(
    reservationId: number
  ): Promise<ApiResponse<DeleteReservationOutput>> {
    const res = await this.mutate<{
      deleteReservation: DeleteReservationOutput;
    }>(DELETE_RESERVATION, { reservationId });
    if (res.success && res.data?.deleteReservation) {
      return { success: true, data: res.data.deleteReservation };
    }
    return res as unknown as ApiResponse<DeleteReservationOutput>;
  }

  async bulkDeleteReservations(
    reservationIds: number[]
  ): Promise<ApiResponse<DeleteReservationOutput>> {
    const res = await this.mutate<{
      bulkDeleteReservations: DeleteReservationOutput;
    }>(BULK_DELETE_RESERVATIONS, { reservationIds });
    if (res.success && res.data?.bulkDeleteReservations) {
      return { success: true, data: res.data.bulkDeleteReservations };
    }
    return res as unknown as ApiResponse<DeleteReservationOutput>;
  }

  async deleteFuelWalkIn(
    fuelWalkInId: number
  ): Promise<ApiResponse<FuelWalkInOutput>> {
    const res = await this.mutate<{ deleteFuelWalkIn: FuelWalkInOutput }>(
      DELETE_FUEL_WALK_IN,
      { fuelWalkInId }
    );
    if (res.success && res.data?.deleteFuelWalkIn) {
      return { success: true, data: res.data.deleteFuelWalkIn };
    }
    return res as unknown as ApiResponse<FuelWalkInOutput>;
  }

  async bulkDeleteFuelWalkIns(
    fuelWalkInIds: number[]
  ): Promise<ApiResponse<FuelWalkInOutput>> {
    const res = await this.mutate<{ bulkDeleteFuelWalkIns: FuelWalkInOutput }>(
      BULK_DELETE_FUEL_WALK_INS,
      { fuelWalkInIds }
    );
    if (res.success && res.data?.bulkDeleteFuelWalkIns) {
      return { success: true, data: res.data.bulkDeleteFuelWalkIns };
    }
    return res as unknown as ApiResponse<FuelWalkInOutput>;
  }

  async deleteHeatingOilDelivery(
    deliveryId: number
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>> {
    const res = await this.mutate<{
      deleteHeatingOilDelivery: HeatingOilDeliveryOutput;
    }>(DELETE_HEATING_OIL_DELIVERY, { deliveryId });
    if (res.success && res.data?.deleteHeatingOilDelivery) {
      return { success: true, data: res.data.deleteHeatingOilDelivery };
    }
    return res as unknown as ApiResponse<HeatingOilDeliveryOutput>;
  }

  async bulkDeleteHeatingOilDeliveries(
    deliveryIds: number[]
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>> {
    const res = await this.mutate<{
      bulkDeleteHeatingOilDeliveries: HeatingOilDeliveryOutput;
    }>(BULK_DELETE_HEATING_OIL_DELIVERIES, { deliveryIds });
    if (res.success && res.data?.bulkDeleteHeatingOilDeliveries) {
      return { success: true, data: res.data.bulkDeleteHeatingOilDeliveries };
    }
    return res as unknown as ApiResponse<HeatingOilDeliveryOutput>;
  }

  async deactivateServiceResource(
    id: number
  ): Promise<ApiResponse<ServiceResourceOutput>> {
    const res = await this.mutate<{
      deactivateServiceResource: ServiceResourceOutput;
    }>(DEACTIVATE_SERVICE_RESOURCE, { id });
    if (res.success && res.data?.deactivateServiceResource) {
      return { success: true, data: res.data.deactivateServiceResource };
    }
    return res as unknown as ApiResponse<ServiceResourceOutput>;
  }

  async deactivateScheduleTemplate(
    id: number
  ): Promise<ApiResponse<ScheduleTemplateOutput>> {
    const res = await this.mutate<{
      deactivateScheduleTemplate: ScheduleTemplateOutput;
    }>(DEACTIVATE_SCHEDULE_TEMPLATE, { id });
    if (res.success && res.data?.deactivateScheduleTemplate) {
      return { success: true, data: res.data.deactivateScheduleTemplate };
    }
    return res as unknown as ApiResponse<ScheduleTemplateOutput>;
  }

  async deleteScheduleBlockedDate(
    id: number
  ): Promise<ApiResponse<ScheduleBlockedDateOutput>> {
    const res = await this.mutate<{
      deleteScheduleBlockedDate: ScheduleBlockedDateOutput;
    }>(DELETE_SCHEDULE_BLOCKED_DATE, { id });
    if (res.success && res.data?.deleteScheduleBlockedDate) {
      return { success: true, data: res.data.deleteScheduleBlockedDate };
    }
    return res as unknown as ApiResponse<ScheduleBlockedDateOutput>;
  }

  async deleteWalkIn(walkInId: number): Promise<ApiResponse<WalkInOutput>> {
    const res = await this.mutate<{ deleteWalkIn: WalkInOutput }>(
      DELETE_WALK_IN,
      { walkInId }
    );
    if (res.success && res.data?.deleteWalkIn) {
      return { success: true, data: res.data.deleteWalkIn };
    }
    return res as unknown as ApiResponse<WalkInOutput>;
  }

  async bulkDeleteWalkIns(
    walkInIds: number[]
  ): Promise<ApiResponse<WalkInOutput>> {
    const res = await this.mutate<{ bulkDeleteWalkIns: WalkInOutput }>(
      BULK_DELETE_WALK_INS,
      { walkInIds }
    );
    if (res.success && res.data?.bulkDeleteWalkIns) {
      return { success: true, data: res.data.bulkDeleteWalkIns };
    }
    return res as unknown as ApiResponse<WalkInOutput>;
  }

  // ============================================================================
  // FuelWalkIn Queries
  // ============================================================================

  async findFuelWalkIns(input: {
    storeId?: number;
    status?: string;
  }): Promise<ApiResponse<FindFuelWalkInsOutput>> {
    const res = await this.query<{ findFuelWalkIns: FindFuelWalkInsOutput }>(
      FIND_FUEL_WALK_INS,
      { input }
    );
    if (res.success && res.data?.findFuelWalkIns) {
      return { success: true, data: res.data.findFuelWalkIns };
    }
    return res as unknown as ApiResponse<FindFuelWalkInsOutput>;
  }

  // ============================================================================
  // FuelWalkIn Mutations
  // ============================================================================

  async createFuelWalkIn(
    input: CreateFuelWalkInInput
  ): Promise<ApiResponse<FuelWalkInOutput>> {
    const res = await this.mutate<{ createFuelWalkIn: FuelWalkInOutput }>(
      CREATE_FUEL_WALK_IN,
      { input }
    );
    if (res.success && res.data?.createFuelWalkIn) {
      return { success: true, data: res.data.createFuelWalkIn };
    }
    return res as unknown as ApiResponse<FuelWalkInOutput>;
  }

  async attachFuelPayment(
    input: AttachFuelPaymentInput
  ): Promise<ApiResponse<FuelWalkInOutput>> {
    const res = await this.mutate<{ attachFuelPayment: FuelWalkInOutput }>(
      ATTACH_FUEL_PAYMENT,
      { input }
    );
    if (res.success && res.data?.attachFuelPayment) {
      return { success: true, data: res.data.attachFuelPayment };
    }
    return res as unknown as ApiResponse<FuelWalkInOutput>;
  }

  async completeFuelWalkIn(
    input: CompleteFuelWalkInInput
  ): Promise<ApiResponse<FuelWalkInOutput>> {
    const res = await this.mutate<{ completeFuelWalkIn: FuelWalkInOutput }>(
      COMPLETE_FUEL_WALK_IN,
      { input }
    );
    if (res.success && res.data?.completeFuelWalkIn) {
      return { success: true, data: res.data.completeFuelWalkIn };
    }
    return res as unknown as ApiResponse<FuelWalkInOutput>;
  }

  async updateFuelWalkInStatus(
    input: UpdateFuelWalkInStatusInput
  ): Promise<ApiResponse<FuelWalkInOutput>> {
    const res = await this.mutate<{ updateFuelWalkInStatus: FuelWalkInOutput }>(
      UPDATE_FUEL_WALK_IN_STATUS,
      { input }
    );
    if (res.success && res.data?.updateFuelWalkInStatus) {
      return { success: true, data: res.data.updateFuelWalkInStatus };
    }
    return res as unknown as ApiResponse<FuelWalkInOutput>;
  }

  async createFuelWalkInPackage(
    input: CreateFuelWalkInPackageInput
  ): Promise<ApiResponse<FuelWalkInPackageOutput>> {
    const res = await this.mutate<{
      createFuelWalkInPackage: FuelWalkInPackageOutput;
    }>(CREATE_FUEL_WALK_IN_PACKAGE, { input });
    if (res.success && res.data?.createFuelWalkInPackage) {
      return { success: true, data: res.data.createFuelWalkInPackage };
    }
    return res as unknown as ApiResponse<FuelWalkInPackageOutput>;
  }

  async attachPackagePayment(
    input: AttachPackagePaymentInput
  ): Promise<ApiResponse<FuelWalkInPackageOutput>> {
    const res = await this.mutate<{
      attachPackagePayment: FuelWalkInPackageOutput;
    }>(ATTACH_PACKAGE_PAYMENT, { input });
    if (res.success && res.data?.attachPackagePayment) {
      return { success: true, data: res.data.attachPackagePayment };
    }
    return res as unknown as ApiResponse<FuelWalkInPackageOutput>;
  }

  async updatePackageStatus(
    input: UpdatePackageStatusInput
  ): Promise<ApiResponse<FuelWalkInPackageOutput>> {
    const res = await this.mutate<{
      updatePackageStatus: FuelWalkInPackageOutput;
    }>(UPDATE_PACKAGE_STATUS, { input });
    if (res.success && res.data?.updatePackageStatus) {
      return { success: true, data: res.data.updatePackageStatus };
    }
    return res as unknown as ApiResponse<FuelWalkInPackageOutput>;
  }

  // ============================================================================
  // HeatingOilDelivery Queries
  // ============================================================================

  async findHeatingOilDeliveries(input: {
    storeId?: number;
    status?: string;
    isUrgent?: boolean;
    driverId?: number;
  }): Promise<ApiResponse<FindHeatingOilDeliveriesOutput>> {
    const res = await this.query<{
      findHeatingOilDeliveries: FindHeatingOilDeliveriesOutput;
    }>(FIND_HEATING_OIL_DELIVERIES, { input });
    if (res.success && res.data?.findHeatingOilDeliveries) {
      return { success: true, data: res.data.findHeatingOilDeliveries };
    }
    return res as unknown as ApiResponse<FindHeatingOilDeliveriesOutput>;
  }

  // ============================================================================
  // HeatingOilDelivery Mutations
  // ============================================================================

  async createHeatingOilDelivery(
    input: CreateHeatingOilDeliveryInput
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>> {
    const res = await this.mutate<{
      createHeatingOilDelivery: HeatingOilDeliveryOutput;
    }>(CREATE_HEATING_OIL_DELIVERY, { input });
    if (res.success && res.data?.createHeatingOilDelivery) {
      return { success: true, data: res.data.createHeatingOilDelivery };
    }
    return res as unknown as ApiResponse<HeatingOilDeliveryOutput>;
  }

  async assignDeliveryDriver(
    input: AssignDriverInput
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>> {
    const res = await this.mutate<{
      assignDeliveryDriver: HeatingOilDeliveryOutput;
    }>(ASSIGN_DELIVERY_DRIVER, { input });
    if (res.success && res.data?.assignDeliveryDriver) {
      return { success: true, data: res.data.assignDeliveryDriver };
    }
    return res as unknown as ApiResponse<HeatingOilDeliveryOutput>;
  }

  async updateHeatingOilDeliveryStatus(
    input: UpdateHeatingOilDeliveryStatusInput
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>> {
    const res = await this.mutate<{
      updateHeatingOilDeliveryStatus: HeatingOilDeliveryOutput;
    }>(UPDATE_HEATING_OIL_DELIVERY_STATUS, { input });
    if (res.success && res.data?.updateHeatingOilDeliveryStatus) {
      return { success: true, data: res.data.updateHeatingOilDeliveryStatus };
    }
    return res as unknown as ApiResponse<HeatingOilDeliveryOutput>;
  }

  async completeHeatingOilDelivery(
    input: CompleteHeatingOilDeliveryInput
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>> {
    const res = await this.mutate<{
      completeHeatingOilDelivery: HeatingOilDeliveryOutput;
    }>(COMPLETE_HEATING_OIL_DELIVERY, { input });
    if (res.success && res.data?.completeHeatingOilDelivery) {
      return { success: true, data: res.data.completeHeatingOilDelivery };
    }
    return res as unknown as ApiResponse<HeatingOilDeliveryOutput>;
  }
}
