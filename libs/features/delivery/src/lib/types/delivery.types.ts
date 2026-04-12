import type { ApiResponse } from '../types';

// ============================================================================
// Federation stub 타입
// ============================================================================

export interface StoreRef {
  id: number;
}

export interface OrderRef {
  id: number;
}

export interface UserRef {
  id: number;
}

// ============================================================================
// Enum 타입
// ============================================================================

export type DeliveryStatus =
  | 'PENDING'
  | 'DRIVER_ASSIGNED'
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED'
  | 'RETURNED';

export type DeliveryPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type DeliverySortField =
  | 'CREATED_AT'
  | 'UPDATED_AT'
  | 'REQUESTED_AT'
  | 'ASSIGNED_AT'
  | 'DELIVERED_AT'
  | 'DELIVERY_FEE'
  | 'DELIVERY_NUMBER'
  | 'STATUS'
  | 'PRIORITY';

export type SortOrder = 'ASC' | 'DESC';

export type VehicleType = 'BICYCLE' | 'MOTORCYCLE' | 'CAR' | 'TRUCK';

export type DriverPaymentType = 'PER_DELIVERY' | 'HOURLY' | 'MONTHLY';

export type DriverStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'TERMINATED';

export type SettlementStatus = 'PENDING' | 'CALCULATED' | 'APPROVED' | 'PAID';

// ============================================================================
// 순환 참조 방지용 경량 Stub 타입
// (Fragment depth 제한과 동일한 원칙 적용)
// ============================================================================

/** Delivery → DeliveryDriver 관계에서 역방향 참조 시 사용 */
export interface DeliveryDriverStub {
  id: number;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  vehicleNumber?: string | null;
  status: DriverStatus;
  isAvailable: boolean;
}

/** DeliveryDriver → Delivery 관계에서 역방향 참조 시 사용 */
export interface DeliveryStub {
  id: number;
  deliveryNumber: string;
  status: DeliveryStatus;
  requestedAt: string;
}

/** DeliveryDriver → DriverSettlement 관계에서 역방향 참조 시 사용 */
export interface DriverSettlementStub {
  id: number;
  settlementDate: string;
  status: SettlementStatus;
  netAmount: number;
}

// ============================================================================
// 엔티티 타입
// ============================================================================

export interface DeliveryDriver {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
  driverCode: string;
  name: string;
  phone: string;
  email?: string | null;
  licenseNumber?: string | null;
  vehicleType: VehicleType;
  vehicleNumber?: string | null;
  vehicleModel?: string | null;
  workingAreas: Record<string, unknown>;
  baseStoreId?: number | null;
  paymentType: DriverPaymentType;
  ratePerDelivery?: number | null;
  hourlyRate?: number | null;
  status: DriverStatus;
  isAvailable: boolean;
  maxConcurrentOrders: number;
  totalDeliveries: number;
  completionRate?: number | null;
  avgRating?: number | null;
  workingHours?: Record<string, unknown> | null;
  deviceToken?: string | null;
  lastLocationUpdate?: string | null;
  currentLocation?: Record<string, unknown> | null;
  createdById: number;
  updatedById: number;
  approvedAt?: string | null;
  lastActiveAt?: string | null;
  // ── 관계 필드 (스키마 반영, Stub으로 순환참조 방지) ──
  deliveries: DeliveryStub[];
  settlements: DriverSettlementStub[];
  ratings: DeliveryRatingStub[];
  user?: UserRef | null;
}

/** DeliveryDriver → DeliveryRating 관계 역방향 참조용 */
export interface DeliveryRatingStub {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface DeliveryStatusHistory {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deliveryId: number;
  fromStatus?: DeliveryStatus | null;
  toStatus: DeliveryStatus;
  reason?: string | null;
  location?: Record<string, unknown> | null;
  notes?: string | null;
  createdById?: number | null;
  // ── 관계 필드 (스키마 반영, Stub으로 순환참조 방지) ──
  delivery: DeliveryStub;
}

export interface DeliveryRating {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deliveryId: number;
  customerId: number;
  driverId: number;
  rating: number;
  comment?: string | null;
  speedRating?: number | null;
  serviceRating?: number | null;
  accuracyRating?: number | null;
  // ── 관계 필드 (스키마 반영, Stub으로 순환참조 방지) ──
  delivery: DeliveryStub;
  driver?: DeliveryDriverStub | null; // ✅ optional로 변경 — DELIVERY_RATING_FIELDS에서 driver 블록 제거했으므로
}

export interface DriverSettlement {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  driverId: number;
  settlementDate: string;
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  status: SettlementStatus;
  paidAt?: string | null;
  paymentMethod?: string | null;
  deliveryDetails?: Record<string, unknown> | null;
  notes?: string | null;
  // ── 관계 필드 (스키마 반영) ──
  driver: DeliveryDriverStub;
}

export interface Delivery {
  id: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  deliveryNumber: string;
  orderId: number;
  storeId: number;
  driverId?: number | null;
  assignedAt?: string | null;
  pickupAddress: Record<string, unknown>;
  deliveryAddress: Record<string, unknown>;
  deliveryDistance?: number | null;
  estimatedTime?: number | null;
  deliveryFee: number;
  driverFee: number;
  platformFee: number;
  itemCount: number;
  totalWeight?: number | null;
  specialInstructions?: string | null;
  status: DeliveryStatus;
  priority: DeliveryPriority;
  requestedAt: string;
  acceptedAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  trackingUpdates?: Record<string, unknown> | null;
  currentLocation?: Record<string, unknown> | null;
  customerNotes?: string | null;
  driverNotes?: string | null;
  issueReported: boolean;
  issueReason?: string | null;
  issueResolvedAt?: string | null;
  pickupPhoto?: string | null;
  deliveryPhoto?: string | null;
  notificationsSent?: Record<string, unknown> | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  statusHistory: DeliveryStatusHistory[];
  ratings: DeliveryRating[];
  driver?: DeliveryDriver | null;
  // ── 관계 필드 (스키마 반영, Federation stub) ──
  order?: OrderRef | null;
  store?: StoreRef | null;
}

// ============================================================================
// 트래킹 타입
// ============================================================================

export interface DeliveryDriverTrackInfo {
  name: string;
  vehicleType: string;
  vehicleNumber?: string | null;
  currentLocation?: Record<string, unknown> | null;
}

export interface DeliveryStatusHistoryTrackInfo {
  fromStatus?: DeliveryStatus | null;
  toStatus: DeliveryStatus;
  createdAt: string;
  location?: Record<string, unknown> | null;
}

export interface DeliveryTrackingInfo {
  id: number;
  deliveryNumber: string;
  status: DeliveryStatus;
  estimatedTime?: number | null;
  deliveryAddress: Record<string, unknown>;
  currentLocation?: Record<string, unknown> | null;
  trackingUpdates?: Record<string, unknown> | null;
  requestedAt: string;
  acceptedAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  driver?: DeliveryDriverTrackInfo | null;
  statusHistory: DeliveryStatusHistoryTrackInfo[];
}

// ============================================================================
// 운전면허 관련 타입 (schema-new-delivery.graphql 반영)
// ============================================================================

export interface OcrLicenseResult {
  name?: string | null;
  birthY?: string | null;
  birthM?: string | null;
  birthD?: string | null;
  rrn1?: string | null;
  rrn2?: string | null;
  licenNo0?: string | null;
  licenNo1?: string | null;
  licenNo2?: string | null;
  licenNo3?: string | null;
  ghostNum?: string | null;
}

export interface VerifyDriverLicenseOutput {
  error?: DeliveryErrorInfo | null;
  success?: boolean | null;
  verified: boolean;
  message?: string | null;
  resultCode?: number | null;
}

export interface OcrDriverLicenseOutput {
  error?: DeliveryErrorInfo | null;
  success?: boolean | null;
  result?: OcrLicenseResult | null;
}

export interface VerifyDriverLicenseInput {
  name: string;
  birthY: string;
  birthM: string;
  birthD: string;
  licenNo0: string;
  licenNo1: string;
  licenNo2: string;
  licenNo3: string;
  ghostNum?: string;
  driverId?: number; // ✅ 필수 → 선택으로 변경 (등록 전 진위확인 지원)
}

export interface OcrDriverLicenseInput {
  imageBase64: string;
}

// ============================================================================
// 정산 관련 신규 타입
// ============================================================================

export interface DriverSettlementSummary {
  totalGrossAmount: number;
  totalNetAmount: number;
  totalDeliveries: number;
  totalCount: number;
}

export interface GetDriverSettlementsOutput {
  error?: DeliveryErrorInfo | null;
  success?: boolean | null;
  settlements?: DriverSettlement[] | null;
  summary?: DriverSettlementSummary | null;
}

export interface GetDriverSettlementsInput {
  driverId: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================================
// 기사 프로필 수정 신규 타입
// ============================================================================

export interface UpdateDriverProfileInput {
  driverId: number;
  name?: string;
  phone?: string;
  email?: string;
  vehicleNumber?: string;
  vehicleModel?: string;
  vehicleType?: VehicleType; // ✅ 신규 추가
  workingAreas?: string[];
}

export interface UpdateDriverProfileOutput {
  error?: DeliveryErrorInfo | null;
  success?: boolean | null;
  driver?: DeliveryDriver | null;
}

// ============================================================================
// 기사 목록 조회 Input 신규 타입
// ============================================================================

export interface GetDriversInput {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  isAvailable?: boolean;
}

// ============================================================================
// ✅ 신규: 배달기사 본인 배송 조회 Input
// ============================================================================

export interface GetMyDeliveriesInput {
  statuses?: DeliveryStatus[];
  page?: number;
  limit?: number;
}

// ============================================================================
// ErrorInfo
// ============================================================================

export interface DeliveryErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

// ============================================================================
// Output 타입
// ============================================================================

export interface CreateDeliveryOutput {
  error?: DeliveryErrorInfo | null;
  success?: boolean | null;
  delivery?: Delivery | null;
  creationMessage?: string | null;
  assignmentMessage?: string | null;
  notificationMessage?: string | null;
  estimatedTimeMessage?: string | null;
}

export interface GetDeliveriesOutput {
  error?: DeliveryErrorInfo | null;
  success?: boolean | null;
  deliveries: Delivery[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CreateDeliveryDriverOutput {
  error?: DeliveryErrorInfo | null;
  success?: boolean | null;
  driver?: DeliveryDriver | null;
  creationMessage?: string | null;
  approvalMessage?: string | null;
  notificationMessage?: string | null;
}

export interface GetDriversOutput {
  drivers: DeliveryDriver[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UpdateDriverStatusInput {
  driverId: number;
  status: DriverStatus;
  reason?: string;
}

export interface UpdateDriverStatusOutput {
  error?: DeliveryErrorInfo | null;
  success?: boolean | null;
  driver?: DeliveryDriver | null;
}

// ============================================================================
// Input 타입
// ============================================================================

export interface GetDeliveriesInput {
  deliveryNumber?: string;
  orderId?: number;
  storeId?: number;
  driverId?: number;
  statuses?: DeliveryStatus[];
  priorities?: DeliveryPriority[];
  requestedDateFrom?: string;
  requestedDateTo?: string;
  deliveredDateFrom?: string;
  deliveredDateTo?: string;
  deliveryCity?: string;
  deliveryState?: string;
  assignedOnly?: boolean;
  completedOnly?: boolean;
  withIssuesOnly?: boolean;
  urgentOnly?: boolean;
  sortBy?: DeliverySortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  includeDriver?: boolean;
  includeStatusHistory?: boolean;
  includeRatings?: boolean;
}

export interface CreateDeliveryInput {
  orderId: number;
  storeId: number;
  deliveryFee: number;
  driverFee: number;
  platformFee?: number;
  itemCount: number;
  totalWeight?: number;
  specialInstructions?: string;
  priority?: DeliveryPriority;
  customerNotes?: string;
  pickupAddress: Record<string, unknown>;
  deliveryAddress: Record<string, unknown>;
  itemDetails?: Record<string, unknown>;
  preferredDeliveryTime?: string;
  deliveryTimeSlot?: Record<string, unknown>;
  additionalFees?: Record<string, unknown>;
  deliveryOptions?: Record<string, unknown>;
  constraints?: Record<string, unknown>;
}

export interface CreateDeliveryDriverInput {
  userId: number;
  name: string;
  phone: string;
  email?: string;
  licenseNumber?: string;
  vehicleType: VehicleType;
  vehicleNumber?: string;
  vehicleModel?: string;
  baseStoreId?: number;
  paymentType?: DriverPaymentType;
  ratePerDelivery?: number;
  hourlyRate?: number;
  maxConcurrentOrders?: number;
  workingAreas: string[];
  workingHours?: Record<string, unknown>;
  deviceToken?: string;
  vehicleDetails?: Record<string, unknown>;
  qualifications?: Record<string, unknown>;
}

// ============================================================================
// ✅ 기사 배정 / 해제 타입 (schema-new-delivery.graphql 반영)
// ============================================================================

export interface AssignDriverInput {
  deliveryId: number;
  driverId: number;
}

export interface UnassignDriverInput {
  deliveryId: number;
  reason?: string;
}

export interface AssignDriverOutput {
  error?: DeliveryErrorInfo | null;
  success?: boolean | null;
  delivery?: Delivery | null;
}

export interface UnassignDriverOutput {
  error?: DeliveryErrorInfo | null;
  success?: boolean | null;
  delivery?: Delivery | null;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IDeliveryService {
  getDeliveryById(id: number): Promise<ApiResponse<Delivery>>;
  listDeliveries(
    input: GetDeliveriesInput
  ): Promise<ApiResponse<GetDeliveriesOutput>>;
  // ✅ 신규: 배달기사 본인 배송 조회
  getMyDeliveries(
    input: GetMyDeliveriesInput
  ): Promise<ApiResponse<GetDeliveriesOutput>>;
  // ✅ 신규: 본인 기사 프로필 조회
  getMyDriverProfile(): Promise<ApiResponse<DeliveryDriver | null>>;
  trackDelivery(
    deliveryNumber: string
  ): Promise<ApiResponse<DeliveryTrackingInfo>>;
  createDelivery(
    input: CreateDeliveryInput
  ): Promise<ApiResponse<CreateDeliveryOutput>>;
  createDeliveryDriver(
    input: CreateDeliveryDriverInput
  ): Promise<ApiResponse<CreateDeliveryDriverOutput>>;
  updateDeliveryStatus(
    deliveryId: number,
    status: DeliveryStatus
  ): Promise<ApiResponse<Delivery>>;
  deactivateDriver(driverId: number): Promise<ApiResponse<boolean>>;
  deactivateDrivers(driverIds: number[]): Promise<ApiResponse<boolean>>;
  updateDriverAvailability(
    driverId: number,
    isAvailable: boolean
  ): Promise<ApiResponse<DeliveryDriver>>;
  updateDriverLocation(
    driverId: number,
    lat: number,
    lng: number
  ): Promise<ApiResponse<DeliveryDriver>>;
  // ✅ 신규
  verifyDriverLicense(
    input: VerifyDriverLicenseInput
  ): Promise<ApiResponse<VerifyDriverLicenseOutput>>;
  ocrDriverLicense(
    input: OcrDriverLicenseInput
  ): Promise<ApiResponse<OcrDriverLicenseOutput>>;
  // ✅ 신규
  getDriverById(id: number): Promise<ApiResponse<DeliveryDriver>>;
  getDrivers(input: GetDriversInput): Promise<ApiResponse<GetDriversOutput>>; // ✅ 반환 타입 변경
  getDriverSettlements(
    input: GetDriverSettlementsInput
  ): Promise<ApiResponse<GetDriverSettlementsOutput>>;
  updateDriverProfile(
    input: UpdateDriverProfileInput
  ): Promise<ApiResponse<UpdateDriverProfileOutput>>;
  // ✅ 신규
  updateDriverStatus(
    input: UpdateDriverStatusInput
  ): Promise<ApiResponse<UpdateDriverStatusOutput>>;
  // ✅ 신규: 기사 배정 / 해제
  assignDriverToDelivery(
    input: AssignDriverInput
  ): Promise<ApiResponse<AssignDriverOutput>>;
  unassignDriverFromDelivery(
    input: UnassignDriverInput
  ): Promise<ApiResponse<UnassignDriverOutput>>;
  deleteDriver(driverId: number): Promise<ApiResponse<boolean>>;
  deleteDrivers(driverIds: number[]): Promise<ApiResponse<number>>;
  // ✅ 신규
  deleteDelivery(deliveryId: number): Promise<ApiResponse<boolean>>;
  deleteDeliveries(deliveryIds: number[]): Promise<ApiResponse<number>>;
}
// ============================================================================
// Context 상태 타입
// ============================================================================

export type DeliveryFilters = GetDeliveriesInput;

export interface DeliveryState {
  deliveries: Delivery[];
  currentDelivery: Delivery | null;
  trackingInfo: DeliveryTrackingInfo | null;
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: DeliveryFilters;
  isLoading: boolean;
  error: string | null;
}

export interface DeliveryContextActions {
  setDeliveries: (deliveries: Delivery[]) => void;
  addDelivery: (delivery: Delivery) => void;
  updateDeliveryInContext: (id: number, updates: Partial<Delivery>) => void;
  removeDelivery: (id: number) => void;
  setCurrentDelivery: (delivery: Delivery | null) => void;
  setTrackingInfo: (info: DeliveryTrackingInfo | null) => void;
  setPagination: (pagination: DeliveryState['pagination']) => void;
  setFilters: (filters: Partial<DeliveryFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// ============================================================================
// Socket 실시간 상태 타입
// ============================================================================

export interface LiveDriverLocation {
  driverId: number;
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  updatedAt: string;
}

// ✅ 신규: 소켓 위치 업데이트 페이로드 — 백엔드가 driverId 없이 deliveryId만 보낼 수 있음
export interface DriverLocationPayload {
  deliveryId: number;
  driverId?: number; // optional — 백엔드 구현에 따라 없을 수 있음
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
    heading?: number;
    speed?: number;
    timestamp: string;
  };
}

export interface DeliveryRealtimeState {
  liveLocations: Record<number, LiveDriverLocation>;
  socketStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  subscribedDeliveryIds: number[];
}

export interface DeliveryRealtimeActions {
  setLiveLocation: (location: LiveDriverLocation) => void;
  clearLiveLocation: (driverId: number) => void;
  clearAllLiveLocations: () => void;
  setSocketStatus: (status: DeliveryRealtimeState['socketStatus']) => void;
  addSubscribedDelivery: (deliveryId: number) => void;
  removeSubscribedDelivery: (deliveryId: number) => void;
}

export type DeliveryContextValue = DeliveryState &
  DeliveryContextActions &
  DeliveryRealtimeState &
  DeliveryRealtimeActions;
