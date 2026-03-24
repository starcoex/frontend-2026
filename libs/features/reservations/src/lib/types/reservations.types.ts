import type { ApiResponse } from '../types';

// ============================================================================
// 공통 Enum
// ============================================================================

export type ReservationStatus =
  | 'PAYMENT_PENDING'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_EXPIRED'
  | 'PENDING_APPROVAL'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'CANCELLED'
  | 'REFUND_REQUESTED'
  | 'REFUND_PROCESSING'
  | 'REFUNDED'
  | 'PARTIAL_REFUNDED';

export type ConfirmationType = 'AUTO' | 'MANUAL';

export type ReservationPaymentType =
  | 'PREPAID'
  | 'DEPOSIT'
  | 'POSTPAID'
  | 'FREE';

export type ReservationPaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PARTIAL_PAID'
  | 'FULLY_PAID'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REFUND_REQUESTED'
  | 'REFUND_PROCESSING'
  | 'REFUNDED'
  | 'PARTIAL_REFUNDED';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export type ResourceType =
  | 'BAY'
  | 'WASH_MACHINE'
  | 'WASH_STATION'
  | 'FUEL_PUMP'
  | 'STAFF'
  | 'ROOM'
  | 'OTHER';

export type SlotStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'PENDING'
  | 'BLOCKED'
  | 'EXPIRED';

export type WalkInStatus =
  | 'WAITING'
  | 'CALLED'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type ReservationPaymentKind = 'PREPAID' | 'FINAL' | 'REFUND';

export type PaymentsPaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'PARTIAL_CANCELLED';

export type ReservationPaymentReason =
  | 'PREPAID'
  | 'FINAL'
  | 'REFUND'
  | 'DEPOSIT'
  | 'ADDITIONAL';

export type FuelType = 'GASOLINE' | 'DIESEL' | 'PREMIUM_GASOLINE' | 'KEROSENE';

export type FuelPaymentType =
  | 'CARD_PRE'
  | 'APP_PRE'
  | 'CASH_PRE'
  | 'CARD_POST'
  | 'CASH_POST'
  | 'APP_POST';

export type FuelPaymentStatus =
  | 'UNPAID'
  | 'PENDING'
  | 'PAID'
  | 'PARTIAL_PAID'
  | 'REFUNDING'
  | 'REFUNDED'
  | 'FAILED'
  | 'CANCELLED';

export type FuelWalkInStatus =
  | 'WAITING'
  | 'PAYMENT_PENDING'
  | 'READY'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'PAYMENT_DUE'
  | 'CANCELLED'
  | 'REFUND_PENDING';

export type PackageStatus =
  | 'WAITING'
  | 'PAID'
  | 'FUEL_DONE'
  | 'WASH_DONE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'PARTIAL_DONE';

export type HeatingOilFuelType = 'KEROSENE';

export type HeatingOilOrderType = 'STANDARD' | 'URGENT';

export type HeatingOilDeliveryStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'DRIVER_ASSIGNED'
  | 'DISPATCHED'
  | 'ARRIVED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUND_REQUESTED'
  | 'REFUNDED';

// ============================================================================
// 공통 에러
// ============================================================================

export interface ReservationErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

// ============================================================================
// Reservation 엔티티
// ============================================================================

export interface Reservation {
  id: number;
  reservationNumber: string;
  storeId: number;
  serviceId: number;
  timeSlotId?: number | null;
  resourceId?: number | null;
  vehicleId?: number | null;
  reservedDate: string;
  reservedStartTime: string;
  reservedEndTime: string;
  paymentExpiresAt: string;
  autoCancel: boolean;
  userId?: number | null;
  guestEmail?: string | null;
  customerInfo: Record<string, any>;
  status: ReservationStatus;
  confirmationType: ConfirmationType;
  isWalkIn: boolean;
  partySize: number;
  specialRequests?: string | null;
  paymentType: ReservationPaymentType;
  serviceAmount: number;
  depositAmount: number;
  additionalAmount: number;
  totalAmount: number;
  paidAmount: number;
  refundAmount: number;
  paymentStatus: ReservationPaymentStatus;
  prepaidPaymentId?: number | null;
  finalPaymentId?: number | null;
  refundPaymentId?: number | null;
  appliedRefundPolicy?: Record<string, any> | null;
  refundCalculation?: Record<string, any> | null;
  paymentCompletedAt?: string | null;
  confirmedAt?: string | null;
  checkedInAt?: string | null;
  serviceStartedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  refundRequestedAt?: string | null;
  refundCompletedAt?: string | null;
  notes?: string | null;
  metadata?: Record<string, any> | null;
  createdById?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  store?: { id: number } | null;
  user?: { id: number } | null;
  vehicle?: { id: number } | null;
  prepaidPayment?: { id: number } | null;
  finalPayment?: { id: number } | null;
  refundPayment?: { id: number } | null;
}

export interface ReservationTimeSlot {
  id: number;
  serviceId: number;
  resourceId?: number | null;
  date: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  maxCapacity: number;
  currentBookings: number;
  pendingBookings: number;
  priceMultiplier?: number | null;
  bookingDeadline?: string | null;
  isAutoGenerated: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ServiceResource {
  id: number;
  serviceId: number;
  name: string;
  code: string;
  type: ResourceType;
  capacity: number;
  isActive: boolean;
  isAvailable: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ScheduleTemplate {
  id: number;
  serviceId: number;
  name: string;
  isActive: boolean;
  applicableDays: number[];
  openTime: string;
  closeTime: string;
  slotDuration?: number | null;
  maxConcurrentBookings: number;
  autoGenerateDays: number;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ScheduleBlockedDate {
  id: number;
  serviceId: number;
  date: string;
  reason?: string | null;
  isFullDay: boolean;
  blockedStartTime?: string | null;
  blockedEndTime?: string | null;
  createdById: number;
  createdAt: string;
}

export interface WalkIn {
  id: number;
  storeId: number;
  serviceId: number;
  resourceId?: number | null;
  userId?: number | null;
  customerName?: string | null;
  customerPhone?: string | null;
  vehicleId?: number | null;
  packageId?: number | null;
  status: WalkInStatus;
  waitingOrder: number;
  estimatedWaitMinutes?: number | null;
  arrivedAt: string;
  calledAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  notes?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ReservationApproval {
  id: number;
  reservationId: number;
  status: ApprovalStatus;
  reviewedBy?: number | null;
  reviewedAt?: string | null;
  reason?: string | null;
  autoApproveAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// FuelWalkIn 엔티티
// ============================================================================

export interface FuelWalkIn {
  id: number;
  storeId: number;
  resourceId?: number | null;
  userId?: number | null;
  customerName?: string | null;
  customerPhone?: string | null;
  vehicleId?: number | null;
  fuelType: FuelType;
  requestedAmount?: number | null;
  actualAmount?: number | null;
  literAmount?: number | null;
  unitPrice?: number | null;
  paymentType: FuelPaymentType;
  paymentStatus: FuelPaymentStatus;
  paymentId?: number | null;
  paidAmount?: number | null;
  refundAmount?: number | null;
  isPrepaid: boolean;
  packageId?: number | null;
  status: FuelWalkInStatus;
  arrivedAt: string;
  paymentDoneAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  notes?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface FuelWalkInPackage {
  id: number;
  storeId: number;
  userId?: number | null;
  customerName?: string | null;
  customerPhone?: string | null;
  vehicleId?: number | null;
  includesFuel: boolean;
  includesWash: boolean;
  washServiceId?: number | null;
  fuelAmount: number;
  washAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentType: FuelPaymentType;
  paymentStatus: FuelPaymentStatus;
  paymentId?: number | null;
  isPrepaid: boolean;
  status: PackageStatus;
  arrivedAt: string;
  completedAt?: string | null;
  cancelledAt?: string | null;
  notes?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ============================================================================
// HeatingOilDelivery 엔티티
// ============================================================================

export interface HeatingOilDelivery {
  id: number;
  storeId: number;
  deliveryNumber: string;
  userId?: number | null;
  customerName: string;
  customerPhone: string;
  guestEmail?: string | null;
  deliveryAddress: string;
  deliveryAddressDetail?: string | null;
  deliveryLatitude?: number | null;
  deliveryLongitude?: number | null;
  fuelType: HeatingOilFuelType;
  orderType: HeatingOilOrderType;
  requestedLiters: number;
  actualLiters?: number | null;
  unitPrice?: number | null;
  tankCapacity?: number | null;
  tankCurrentLevel?: number | null;
  serviceAmount: number;
  deliveryFee: number;
  urgentFee: number;
  totalAmount: number;
  paidAmount: number;
  paymentType: ReservationPaymentType;
  paymentStatus: ReservationPaymentStatus;
  paymentId?: number | null;
  status: HeatingOilDeliveryStatus;
  scheduledDate: string;
  scheduledTimeSlot: string;
  isUrgent: boolean;
  urgentRequestedAt?: string | null;
  urgentReason?: string | null;
  driverId?: number | null;
  driverAssignedAt?: string | null;
  confirmedAt?: string | null;
  dispatchedAt?: string | null;
  arrivedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  refundAmount?: number | null;
  refundRequestedAt?: string | null;
  refundCompletedAt?: string | null;
  notes?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ReservableService {
  id: number;
  storeId: number;
  name: string;
  type: string;
  description?: string | null;
  businessType: string;
  confirmationType: string;
  slotGenerationType: string;
  requiresPayment: boolean;
  allowWalkIn: boolean;
  operatingHours: Record<string, any>;
  slotDuration: number;
  maxAdvanceDays: number;
  minAdvanceHours: number;
  basePrice: number;
  depositRate: number;
  refundPolicyId: number;
  isActive: boolean;
  isAvailable: boolean;
  createdById: number;
  updatedById: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ============================================================================
// Input 타입 — Reservation
// ============================================================================

export interface FindReservableServicesInput {
  storeId?: number;
  type?: string;
  isActive?: boolean;
}

export interface FindReservableServicesOutput {
  success: boolean;
  services: ReservableService[];
}

export interface FindReservationsInput {
  storeId?: number;
  userId?: number;
  vehicleId?: number;
  resourceId?: number;
  status?: ReservationStatus;
  isWalkIn?: boolean;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CreateReservationInput {
  storeId: number;
  serviceId: number;
  serviceIds: number[]; // ← 추가
  timeSlotId?: number;
  reservedDate: string;
  reservedStartTime: string;
  reservedEndTime: string;
  autoCancel?: boolean;
  userId?: number;
  guestEmail?: string;
  customerInfo: Record<string, any>;
  status?: ReservationStatus;
  partySize?: number;
  specialRequests?: string;
  paymentType?: ReservationPaymentType;
  serviceAmount: number;
  depositAmount?: number;
  additionalAmount?: number;
  totalAmount: number;
  notes?: string;
  metadata?: Record<string, any>;
  createdById?: number;
  resourceId?: number;
  vehicleId?: number;
}

export interface UpdateReservationStatusInput {
  reservationId: number;
  storeId?: number;
  serviceId?: number;
  timeSlotId?: number;
  reservedDate?: string;
  reservedStartTime?: string;
  reservedEndTime?: string;
  paymentExpiresAt?: string;
  autoCancel?: boolean;
  userId?: number;
  guestEmail?: string;
  customerInfo?: Record<string, any>;
  status?: ReservationStatus;
  partySize?: number;
  specialRequests?: string;
  paymentType?: ReservationPaymentType;
  serviceAmount?: number;
  depositAmount?: number;
  additionalAmount?: number;
  totalAmount?: number;
  notes?: string;
  metadata?: Record<string, any>;
  resourceId?: number;
  vehicleId?: number;
  reason?: string;
}

export interface CancelReservationInput {
  reservationId: number;
  cancellationReason: string;
}

export interface CheckInReservationInput {
  reservationId: number;
  notes?: string;
}

export interface CheckOutReservationInput {
  reservationId: number;
  notes?: string;
}

export interface ReviewReservationApprovalInput {
  reservationId: number;
  status: ApprovalStatus;
  reason?: string;
}

export interface CreateWalkInInput {
  storeId: number;
  serviceId: number;
  resourceId?: number;
  userId?: number;
  customerName?: string;
  customerPhone?: string;
  vehicleId?: number;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface UpdateWalkInStatusInput {
  walkInId: number;
  status: WalkInStatus;
  notes?: string;
}

export interface GenerateSlotsInput {
  serviceId: number;
  fromDate: string;
  toDate: string;
  templateId?: number;
}

export interface CreateScheduleTemplateInput {
  serviceId: number;
  name: string;
  isActive?: boolean;
  applicableDays: number[];
  openTime: string;
  closeTime: string;
  slotDuration?: number;
  maxConcurrentBookings?: number;
  autoGenerateDays?: number;
  createdById: number;
  breaks?: { name: string; startTime: string; endTime: string }[];
}

export interface CreateScheduleBlockedDateInput {
  serviceId: number;
  date: string;
  reason?: string;
  isFullDay?: boolean;
  blockedStartTime?: string;
  blockedEndTime?: string;
  createdById: number;
}

export interface CreateServiceResourceInput {
  serviceId: number;
  name: string;
  code: string;
  type: ResourceType;
  capacity?: number;
  isActive?: boolean;
  isAvailable?: boolean;
  notes?: string;
}

export interface UpdateServiceResourceInput {
  id: number;
  isActive?: boolean;
  isAvailable?: boolean;
  notes?: string;
}

// ============================================================================
// Input 타입 — FuelWalkIn
// ============================================================================

export interface CreateFuelWalkInInput {
  storeId: number;
  resourceId?: number;
  userId?: number;
  customerName?: string;
  customerPhone?: string;
  vehicleId?: number;
  fuelType: FuelType;
  requestedAmount?: number;
  paymentType: FuelPaymentType;
  isPrepaid?: boolean;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface AttachFuelPaymentInput {
  fuelWalkInId: number;
  paymentId: number;
  paidAmount: number;
}

export interface CompleteFuelWalkInInput {
  fuelWalkInId: number;
  actualAmount: number;
  literAmount: number;
  unitPrice: number;
}

export interface UpdateFuelWalkInStatusInput {
  fuelWalkInId: number;
  status: FuelWalkInStatus;
}

export interface CreateFuelWalkInPackageInput {
  storeId: number;
  userId?: number;
  customerName?: string;
  customerPhone?: string;
  vehicleId?: number;
  includesFuel?: boolean;
  includesWash?: boolean;
  washServiceId?: number;
  fuelAmount: number;
  washAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  paymentType: FuelPaymentType;
  isPrepaid?: boolean;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface AttachPackagePaymentInput {
  packageId: number;
  paymentId: number;
  paidAmount: number;
}

export interface UpdatePackageStatusInput {
  packageId: number;
  status: PackageStatus;
}

// ============================================================================
// Input 타입 — HeatingOilDelivery
// ============================================================================

export interface CreateHeatingOilDeliveryInput {
  storeId: number;
  userId?: number;
  customerName: string;
  customerPhone: string;
  guestEmail?: string;
  deliveryAddress: string;
  deliveryAddressDetail?: string;
  fuelType: HeatingOilFuelType;
  orderType?: HeatingOilOrderType;
  requestedLiters: number;
  tankCapacity?: number;
  tankCurrentLevel?: number;
  serviceAmount: number;
  deliveryFee?: number;
  urgentFee?: number;
  totalAmount: number;
  paymentType?: ReservationPaymentType;
  scheduledDate: string;
  scheduledTimeSlot: string;
  isUrgent?: boolean;
  urgentReason?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface AssignDriverInput {
  deliveryId: number;
  driverId: number;
}

export interface UpdateHeatingOilDeliveryStatusInput {
  deliveryId: number;
  status: HeatingOilDeliveryStatus;
  reason?: string;
}

export interface CompleteHeatingOilDeliveryInput {
  deliveryId: number;
  actualLiters: number;
  unitPrice: number;
  notes?: string;
}

export interface CreateReservableServiceInput {
  storeId: number;
  name: string;
  type: string;
  description?: string;
  businessType?: string;
  confirmationType?: string;
  slotGenerationType?: string;
  requiresPayment?: boolean;
  allowWalkIn?: boolean;
  operatingHours: Record<string, any>;
  slotDuration: number;
  maxAdvanceDays?: number;
  minAdvanceHours?: number;
  basePrice: number;
  depositRate?: number;
  refundPolicyId: number;
  isActive?: boolean;
  isAvailable?: boolean;
  createdById: number;
  updatedById?: number;
}

export interface UpdateReservableServiceInput {
  id: number;
  name?: string;
  type?: string;
  description?: string;
  confirmationType?: string;
  slotGenerationType?: string;
  requiresPayment?: boolean;
  allowWalkIn?: boolean;
  operatingHours?: Record<string, any>;
  slotDuration?: number;
  maxAdvanceDays?: number;
  minAdvanceHours?: number;
  basePrice?: number;
  depositRate?: number;
  refundPolicyId?: number; // ← 추가
  isActive?: boolean;
  isAvailable?: boolean;
  updatedById: number;
}

export interface ReservableServiceOutput {
  success: boolean;
  service?: ReservableService;
  message: string;
}

export interface DeleteReservableServiceOutput {
  success: boolean;
  message: string;
}

export interface RefundPolicy {
  id: number;
  name: string;
  description?: string | null;
  refundRules: Record<string, any>;
  allowRefund: boolean;
  minimumRefundAmount: number;
  refundFee: number;
  noRefundConditions?: Record<string, any> | null;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface FindRefundPoliciesOutput {
  success: boolean;
  refundPolicies: RefundPolicy[];
}

export interface RefundPolicyOutput {
  success: boolean;
  refundPolicy?: RefundPolicy;
  message: string;
}

export interface CreateRefundPolicyInput {
  name: string;
  description?: string;
  refundRules: Record<string, any>;
  allowRefund?: boolean;
  minimumRefundAmount?: number;
  refundFee?: number;
  noRefundConditions?: Record<string, any>;
}

export interface UpdateRefundPolicyInput {
  id: number;
  name?: string;
  description?: string;
  refundRules?: Record<string, any>;
  allowRefund?: boolean;
  minimumRefundAmount?: number;
  refundFee?: number;
  noRefundConditions?: Record<string, any>;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface DeleteReservationOutput {
  success: boolean;
  message: string;
}

export interface CreateReservationOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  reservation?: Reservation | null;
  message?: string | null;
}

export interface UpdateReservationOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  reservation?: Reservation | null;
  message?: string | null;
}

export interface CancelReservationOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  reservation?: Reservation | null;
  message?: string | null;
  refundRequested?: boolean | null;
}

export interface CheckInReservationOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  reservation?: Reservation | null;
  message?: string | null;
}

export interface CheckOutReservationOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  reservation?: Reservation | null;
  message?: string | null;
}

export interface ReservationApprovalOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  approval?: ReservationApproval | null;
  message?: string | null;
}

export interface FindReservationsOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  reservations?: Reservation[] | null;
  total?: number | null;
  page?: number | null;
  limit?: number | null;
  totalPages?: number | null;
}

export interface WalkInOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  walkIn?: WalkIn | null;
  message?: string | null;
}

export interface GenerateSlotsOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  slots?: ReservationTimeSlot[] | null;
  generatedCount?: number | null;
  message?: string | null;
}

export interface ScheduleTemplateOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  template?: ScheduleTemplate | null;
  message?: string | null;
}

export interface ServiceResourceOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  resource?: ServiceResource | null;
  message?: string | null;
}

export interface ScheduleBlockedDateOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  blockedDate?: ScheduleBlockedDate | null;
  message?: string | null;
}

export interface FuelWalkInOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  fuelWalkIn?: FuelWalkIn | null;
  message?: string | null;
}

export interface FuelWalkInPackageOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  package?: FuelWalkInPackage | null;
  message?: string | null;
}

export interface FindFuelWalkInsOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  fuelWalkIns?: FuelWalkIn[] | null;
  total?: number | null;
}

export interface HeatingOilDeliveryOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  delivery?: HeatingOilDelivery | null;
  message?: string | null;
}

export interface FindHeatingOilDeliveriesOutput {
  success?: boolean | null;
  error?: ReservationErrorInfo | null;
  deliveries?: HeatingOilDelivery[] | null;
  total?: number | null;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IReservationsService {
  // ─── Reservation Queries ───
  getReservationById(id: number): Promise<ApiResponse<Reservation>>;
  listReservations(
    input: FindReservationsInput
  ): Promise<ApiResponse<FindReservationsOutput>>;
  findAvailableSlots(
    serviceId: number,
    date: string
  ): Promise<ApiResponse<ReservationTimeSlot[]>>;
  findServiceResources(
    serviceId: number
  ): Promise<ApiResponse<ServiceResource[]>>;
  findScheduleTemplates(
    serviceId: number
  ): Promise<ApiResponse<ScheduleTemplate[]>>;
  findWalkIns(input: {
    storeId?: number;
    serviceId?: number;
    status?: WalkInStatus;
  }): Promise<ApiResponse<{ walkIns?: WalkIn[]; total?: number }>>;
  // ─── FuelWalkIn Queries ───
  findFuelWalkIns(input: {
    storeId?: number;
    status?: FuelWalkInStatus;
  }): Promise<ApiResponse<FindFuelWalkInsOutput>>;
  // ─── HeatingOilDelivery Queries ───
  findHeatingOilDeliveries(input: {
    storeId?: number;
    status?: HeatingOilDeliveryStatus;
    isUrgent?: boolean;
    driverId?: number;
  }): Promise<ApiResponse<FindHeatingOilDeliveriesOutput>>;

  // ─── Reservation Mutations ───
  createReservation(
    input: CreateReservationInput
  ): Promise<ApiResponse<CreateReservationOutput>>;
  updateReservationStatus(
    input: UpdateReservationStatusInput
  ): Promise<ApiResponse<UpdateReservationOutput>>;
  cancelReservation(
    input: CancelReservationInput
  ): Promise<ApiResponse<CancelReservationOutput>>;
  checkInReservation(
    input: CheckInReservationInput
  ): Promise<ApiResponse<CheckInReservationOutput>>;
  checkOutReservation(
    input: CheckOutReservationInput
  ): Promise<ApiResponse<CheckOutReservationOutput>>;
  reviewReservationApproval(
    input: ReviewReservationApprovalInput
  ): Promise<ApiResponse<ReservationApprovalOutput>>;
  createWalkIn(input: CreateWalkInInput): Promise<ApiResponse<WalkInOutput>>;
  updateWalkInStatus(
    input: UpdateWalkInStatusInput
  ): Promise<ApiResponse<WalkInOutput>>;
  generateSlots(
    input: GenerateSlotsInput
  ): Promise<ApiResponse<GenerateSlotsOutput>>;
  createScheduleTemplate(
    input: CreateScheduleTemplateInput
  ): Promise<ApiResponse<ScheduleTemplateOutput>>;
  createServiceResource(
    input: CreateServiceResourceInput
  ): Promise<ApiResponse<ServiceResourceOutput>>;
  updateServiceResource(
    input: UpdateServiceResourceInput
  ): Promise<ApiResponse<ServiceResourceOutput>>;
  // ─── Reservation 삭제 ───
  deleteReservation(
    reservationId: number
  ): Promise<ApiResponse<DeleteReservationOutput>>;
  bulkDeleteReservations(
    reservationIds: number[]
  ): Promise<ApiResponse<DeleteReservationOutput>>;
  deleteWalkIn(walkInId: number): Promise<ApiResponse<WalkInOutput>>;
  bulkDeleteWalkIns(walkInIds: number[]): Promise<ApiResponse<WalkInOutput>>;
  deactivateServiceResource(
    id: number
  ): Promise<ApiResponse<ServiceResourceOutput>>;
  deactivateScheduleTemplate(
    id: number
  ): Promise<ApiResponse<ScheduleTemplateOutput>>;
  deleteScheduleBlockedDate(
    id: number
  ): Promise<ApiResponse<ScheduleBlockedDateOutput>>;

  // ─── FuelWalkIn Mutations ───
  createFuelWalkIn(
    input: CreateFuelWalkInInput
  ): Promise<ApiResponse<FuelWalkInOutput>>;
  attachFuelPayment(
    input: AttachFuelPaymentInput
  ): Promise<ApiResponse<FuelWalkInOutput>>;
  completeFuelWalkIn(
    input: CompleteFuelWalkInInput
  ): Promise<ApiResponse<FuelWalkInOutput>>;
  updateFuelWalkInStatus(
    input: UpdateFuelWalkInStatusInput
  ): Promise<ApiResponse<FuelWalkInOutput>>;
  deleteFuelWalkIn(
    fuelWalkInId: number
  ): Promise<ApiResponse<FuelWalkInOutput>>;
  bulkDeleteFuelWalkIns(
    fuelWalkInIds: number[]
  ): Promise<ApiResponse<FuelWalkInOutput>>;
  createFuelWalkInPackage(
    input: CreateFuelWalkInPackageInput
  ): Promise<ApiResponse<FuelWalkInPackageOutput>>;
  attachPackagePayment(
    input: AttachPackagePaymentInput
  ): Promise<ApiResponse<FuelWalkInPackageOutput>>;
  updatePackageStatus(
    input: UpdatePackageStatusInput
  ): Promise<ApiResponse<FuelWalkInPackageOutput>>;

  // ─── HeatingOilDelivery Mutations ───
  createHeatingOilDelivery(
    input: CreateHeatingOilDeliveryInput
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>>;
  assignDeliveryDriver(
    input: AssignDriverInput
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>>;
  updateHeatingOilDeliveryStatus(
    input: UpdateHeatingOilDeliveryStatusInput
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>>;
  completeHeatingOilDelivery(
    input: CompleteHeatingOilDeliveryInput
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>>;
  deleteHeatingOilDelivery(
    deliveryId: number
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>>;
  bulkDeleteHeatingOilDeliveries(
    deliveryIds: number[]
  ): Promise<ApiResponse<HeatingOilDeliveryOutput>>;
}

// ============================================================================
// Context 상태 타입 — Reservation
// ============================================================================

export interface ReservationFilters {
  storeId?: number;
  userId?: number;
  status?: ReservationStatus;
  isWalkIn?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface ReservationsState {
  reservations: Reservation[];
  currentReservation: Reservation | null;
  availableSlots: ReservationTimeSlot[];
  walkIns: WalkIn[];
  filters: ReservationFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface ReservationsContextActions {
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  updateReservationInContext: (
    id: number,
    updates: Partial<Reservation>
  ) => void;
  removeReservation: (id: number) => void;
  setCurrentReservation: (reservation: Reservation | null) => void;
  setAvailableSlots: (slots: ReservationTimeSlot[]) => void;
  setWalkIns: (walkIns: WalkIn[]) => void;
  updateWalkInInContext: (id: number, updates: Partial<WalkIn>) => void;
  setFilters: (filters: Partial<ReservationFilters>) => void;
  clearFilters: () => void;
  setPagination: (pagination: Partial<ReservationsState['pagination']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type ReservationsContextValue = ReservationsState &
  ReservationsContextActions;

// ============================================================================
// Context 상태 타입 — FuelWalkIn
// ============================================================================

export interface FuelWalkInFilters {
  storeId?: number;
  status?: FuelWalkInStatus;
}

export interface FuelWalkInsState {
  fuelWalkIns: FuelWalkIn[];
  currentFuelWalkIn: FuelWalkIn | null;
  filters: FuelWalkInFilters;
  isLoading: boolean;
  error: string | null;
}

export interface FuelWalkInsContextActions {
  setFuelWalkIns: (items: FuelWalkIn[]) => void;
  addFuelWalkIn: (item: FuelWalkIn) => void;
  updateFuelWalkInInContext: (id: number, updates: Partial<FuelWalkIn>) => void;
  removeFuelWalkIn: (id: number) => void;
  setCurrentFuelWalkIn: (item: FuelWalkIn | null) => void;
  setFilters: (filters: Partial<FuelWalkInFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type FuelWalkInsContextValue = FuelWalkInsState &
  FuelWalkInsContextActions;

// ============================================================================
// Context 상태 타입 — HeatingOilDelivery
// ============================================================================

export interface HeatingOilDeliveryFilters {
  storeId?: number;
  status?: HeatingOilDeliveryStatus;
  isUrgent?: boolean;
  driverId?: number;
}

export interface HeatingOilDeliveriesState {
  deliveries: HeatingOilDelivery[];
  currentDelivery: HeatingOilDelivery | null;
  filters: HeatingOilDeliveryFilters;
  isLoading: boolean;
  error: string | null;
}

export interface HeatingOilDeliveriesContextActions {
  setDeliveries: (items: HeatingOilDelivery[]) => void;
  addDelivery: (item: HeatingOilDelivery) => void;
  updateDeliveryInContext: (
    id: number,
    updates: Partial<HeatingOilDelivery>
  ) => void;
  removeDelivery: (id: number) => void;
  setCurrentDelivery: (item: HeatingOilDelivery | null) => void;
  setFilters: (filters: Partial<HeatingOilDeliveryFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type HeatingOilDeliveriesContextValue = HeatingOilDeliveriesState &
  HeatingOilDeliveriesContextActions;
