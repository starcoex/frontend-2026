import { gql } from '@apollo/client';

// ─── Fragments ───────────────────────────────────────────────────────────────

export const DELIVERY_ERROR_INFO_FIELDS = gql`
  fragment DeliveryErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const DELIVERY_DRIVER_TRACK_INFO_FIELDS = gql`
  fragment DeliveryDriverTrackInfoFields on DeliveryDriverTrackInfo {
    name
    vehicleType
    vehicleNumber
    currentLocation
  }
`;

export const DELIVERY_STATUS_HISTORY_TRACK_INFO_FIELDS = gql`
  fragment DeliveryStatusHistoryTrackInfoFields on DeliveryStatusHistoryTrackInfo {
    fromStatus
    toStatus
    createdAt
    location
  }
`;

/**
 * DeliveryStatusHistory Fragment
 * - delivery 관계는 순환참조 방지를 위해 id만 포함
 */
export const DELIVERY_STATUS_HISTORY_FIELDS = gql`
  fragment DeliveryStatusHistoryFields on DeliveryStatusHistory {
    id
    deletedAt
    createdAt
    updatedAt
    deliveryId
    fromStatus
    toStatus
    reason
    location
    notes
    createdById
    delivery {
      id
    }
  }
`;

/**
 * DeliveryRating Fragment
 * - delivery, driver 관계는 순환참조 방지를 위해 id만 포함
 */
export const DELIVERY_RATING_FIELDS = gql`
  fragment DeliveryRatingFields on DeliveryRating {
    id
    deletedAt
    createdAt
    updatedAt
    deliveryId
    customerId
    driverId
    rating
    comment
    speedRating
    serviceRating
    accuracyRating
    delivery {
      id
    }
  }
`;

/**
 * DeliveryDriver Fragment
 * - deliveries, settlements, ratings, user 관계 추가 (스키마 반영)
 * - 관계 필드는 순환참조 방지를 위해 최소 필드만 포함
 */
export const DELIVERY_DRIVER_FIELDS = gql`
  fragment DeliveryDriverFields on DeliveryDriver {
    id
    deletedAt
    createdAt
    updatedAt
    userId
    driverCode
    name
    phone
    email
    licenseNumber
    vehicleType
    vehicleNumber
    vehicleModel
    workingAreas
    baseStoreId
    paymentType
    ratePerDelivery
    hourlyRate
    status
    isAvailable
    maxConcurrentOrders
    totalDeliveries
    completionRate
    avgRating
    workingHours
    deviceToken
    lastLocationUpdate
    currentLocation
    createdById
    updatedById
    approvedAt
    lastActiveAt
    deliveries {
      id
      deliveryNumber
      status
      requestedAt
    }
    settlements {
      id
      settlementDate
      status
      netAmount
    }
    ratings {
      id
      rating
      comment
      createdAt
    }
    user {
      id
    }
  }
`;

/**
 * Delivery Fragment
 * - order, store 관계 추가 (스키마 반영, Federation stub)
 * - driver, statusHistory, ratings은 기존 Fragment 재사용
 */
export const DELIVERY_FIELDS = gql`
  ${DELIVERY_STATUS_HISTORY_FIELDS}
  ${DELIVERY_RATING_FIELDS}
  ${DELIVERY_DRIVER_FIELDS}
  fragment DeliveryFields on Delivery {
    id
    deletedAt
    createdAt
    updatedAt
    deliveryNumber
    orderId
    storeId
    driverId
    assignedAt
    pickupAddress
    deliveryAddress
    deliveryDistance
    estimatedTime
    deliveryFee
    driverFee
    platformFee
    itemCount
    totalWeight
    specialInstructions
    status
    priority
    requestedAt
    acceptedAt
    pickedUpAt
    deliveredAt
    trackingUpdates
    currentLocation
    customerNotes
    driverNotes
    issueReported
    issueReason
    issueResolvedAt
    pickupPhoto
    deliveryPhoto
    notificationsSent
    cancelledAt
    cancelReason
    statusHistory {
      ...DeliveryStatusHistoryFields
    }
    ratings {
      ...DeliveryRatingFields
    }
    driver {
      ...DeliveryDriverFields
    }
    order {
      id
    }
    store {
      id
    }
  }
`;

export const DELIVERY_TRACKING_INFO_FIELDS = gql`
  ${DELIVERY_DRIVER_TRACK_INFO_FIELDS}
  ${DELIVERY_STATUS_HISTORY_TRACK_INFO_FIELDS}
  fragment DeliveryTrackingInfoFields on DeliveryTrackingInfo {
    id
    deliveryNumber
    status
    estimatedTime
    deliveryAddress
    currentLocation
    trackingUpdates
    requestedAt
    acceptedAt
    pickedUpAt
    deliveredAt
    driver {
      ...DeliveryDriverTrackInfoFields
    }
    statusHistory {
      ...DeliveryStatusHistoryTrackInfoFields
    }
  }
`;

// ─── 신규 Fragments ───────────────────────────────────────────────────────────

export const DRIVER_SETTLEMENT_FIELDS = gql`
  fragment DriverSettlementFields on DriverSettlement {
    id
    deletedAt
    createdAt
    updatedAt
    driverId
    settlementDate
    totalDeliveries
    completedDeliveries
    cancelledDeliveries
    grossAmount
    deductions
    netAmount
    status
    paidAt
    paymentMethod
    deliveryDetails
    notes
  }
`;

// ─── 신규 Queries ─────────────────────────────────────────────────────────────

export const GET_DRIVER_BY_ID = gql`
  ${DELIVERY_DRIVER_FIELDS}
  query GetDriverById($id: Int!) {
    getDriverById(id: $id) {
      ...DeliveryDriverFields
    }
  }
`;

export const GET_DRIVERS = gql`
  ${DELIVERY_DRIVER_FIELDS}
  query GetDrivers(
    $page: Int
    $limit: Int
    $search: String
    $status: String
    $isAvailable: Boolean
  ) {
    getDrivers(
      page: $page
      limit: $limit
      search: $search
      status: $status
      isAvailable: $isAvailable
    ) {
      drivers {
        ...DeliveryDriverFields
      }
      totalCount
      currentPage
      totalPages
      hasNext
      hasPrev
    }
  }
`;

export const GET_DRIVER_SETTLEMENTS = gql`
  ${DRIVER_SETTLEMENT_FIELDS}
  query GetDriverSettlements($input: GetDriverSettlementsInput!) {
    getDriverSettlements(input: $input) {
      error {
        code
        message
        details
      }
      success
      settlements {
        ...DriverSettlementFields
      }
      summary {
        totalGrossAmount
        totalNetAmount
        totalDeliveries
        totalCount
      }
    }
  }
`;

// ─── 신규 Mutations ───────────────────────────────────────────────────────────

export const UPDATE_DRIVER_PROFILE = gql`
  ${DELIVERY_DRIVER_FIELDS}
  mutation UpdateDriverProfile($input: UpdateDriverProfileInput!) {
    updateDriverProfile(input: $input) {
      error {
        code
        message
        details
      }
      success
      driver {
        ...DeliveryDriverFields
      }
    }
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_DELIVERY_BY_ID = gql`
  ${DELIVERY_FIELDS}
  query GetDeliveryById($id: Int!) {
    getDeliveryById(id: $id) {
      ...DeliveryFields
    }
  }
`;

export const LIST_DELIVERIES = gql`
  ${DELIVERY_ERROR_INFO_FIELDS}
  ${DELIVERY_FIELDS}
  query ListDeliveries($input: GetDeliveriesInput!) {
    listDeliveries(input: $input) {
      error {
        ...DeliveryErrorInfoFields
      }
      success
      deliveries {
        ...DeliveryFields
      }
      totalCount
      currentPage
      totalPages
      hasNext
      hasPrev
    }
  }
`;

export const TRACK_DELIVERY = gql`
  ${DELIVERY_TRACKING_INFO_FIELDS}
  query TrackDelivery($deliveryNumber: String!) {
    trackDelivery(deliveryNumber: $deliveryNumber) {
      ...DeliveryTrackingInfoFields
    }
  }
`;

// ✅ 신규: 배달기사 본인 배송 목록 조회
export const GET_MY_DELIVERIES = gql`
  ${DELIVERY_ERROR_INFO_FIELDS}
  ${DELIVERY_FIELDS}
  query GetMyDeliveries($statuses: [DeliveryStatus!], $page: Int, $limit: Int) {
    getMyDeliveries(statuses: $statuses, page: $page, limit: $limit) {
      error {
        ...DeliveryErrorInfoFields
      }
      success
      deliveries {
        ...DeliveryFields
      }
      totalCount
      currentPage
      totalPages
      hasNext
      hasPrev
    }
  }
`;

// ✅ 신규: 본인 기사 프로필 조회 (JWT userId 기반, 인자 없음)
export const GET_MY_DRIVER_PROFILE = gql`
  ${DELIVERY_DRIVER_FIELDS}
  query GetMyDriverProfile {
    getMyDriverProfile {
      ...DeliveryDriverFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_DELIVERY = gql`
  ${DELIVERY_ERROR_INFO_FIELDS}
  ${DELIVERY_FIELDS}
  mutation CreateDelivery($input: CreateDeliveryInput!) {
    createDelivery(input: $input) {
      error {
        ...DeliveryErrorInfoFields
      }
      success
      delivery {
        ...DeliveryFields
      }
      creationMessage
      assignmentMessage
      notificationMessage
      estimatedTimeMessage
    }
  }
`;

export const CREATE_DELIVERY_DRIVER = gql`
  ${DELIVERY_ERROR_INFO_FIELDS}
  ${DELIVERY_DRIVER_FIELDS}
  mutation CreateDeliveryDriver($input: CreateDeliveryDriverInput!) {
    createDeliveryDriver(input: $input) {
      error {
        ...DeliveryErrorInfoFields
      }
      success
      driver {
        ...DeliveryDriverFields
      }
      creationMessage
      approvalMessage
      notificationMessage
    }
  }
`;

export const UPDATE_DELIVERY_STATUS = gql`
  ${DELIVERY_FIELDS}
  mutation UpdateDeliveryStatus($deliveryId: Int!, $status: DeliveryStatus!) {
    updateDeliveryStatus(deliveryId: $deliveryId, status: $status) {
      ...DeliveryFields
    }
  }
`;

export const DEACTIVATE_DRIVER = gql`
  mutation DeactivateDriver($driverId: Int!) {
    deactivateDriver(driverId: $driverId)
  }
`;

export const DEACTIVATE_DRIVERS = gql`
  mutation DeactivateDrivers($driverIds: [Int!]!) {
    deactivateDrivers(driverIds: $driverIds)
  }
`;

export const UPDATE_DRIVER_AVAILABILITY = gql`
  ${DELIVERY_DRIVER_FIELDS}
  mutation UpdateDriverAvailability($driverId: Int!, $isAvailable: Boolean!) {
    updateDriverAvailability(driverId: $driverId, isAvailable: $isAvailable) {
      ...DeliveryDriverFields
    }
  }
`;

export const UPDATE_DRIVER_LOCATION = gql`
  ${DELIVERY_DRIVER_FIELDS}
  mutation UpdateDriverLocation($driverId: Int!, $lat: Float!, $lng: Float!) {
    updateDriverLocation(driverId: $driverId, lat: $lat, lng: $lng) {
      ...DeliveryDriverFields
    }
  }
`;

export const VERIFY_DRIVER_LICENSE = gql`
  mutation VerifyDriverLicense($input: VerifyDriverLicenseInput!) {
    verifyDriverLicense(input: $input) {
      error {
        code
        message
        details
      }
      success
      verified
      message
      resultCode
    }
  }
`;

export const OCR_DRIVER_LICENSE = gql`
  mutation OcrDriverLicense($input: OcrDriverLicenseInput!) {
    ocrDriverLicense(input: $input) {
      error {
        code
        message
        details
      }
      success
      result {
        name
        birthY
        birthM
        birthD
        rrn1
        rrn2
        licenNo0
        licenNo1
        licenNo2
        licenNo3
        ghostNum
      }
    }
  }
`;

export const UPDATE_DRIVER_STATUS = gql`
  ${DELIVERY_DRIVER_FIELDS}
  mutation UpdateDriverStatus($input: UpdateDriverStatusInput!) {
    updateDriverStatus(input: $input) {
      error {
        code
        message
        details
      }
      success
      driver {
        ...DeliveryDriverFields
      }
    }
  }
`;

export const DELETE_DRIVER = gql`
  mutation DeleteDriver($driverId: Int!) {
    deleteDriver(driverId: $driverId)
  }
`;

export const DELETE_DRIVERS = gql`
  mutation DeleteDrivers($driverIds: [Int!]!) {
    deleteDrivers(driverIds: $driverIds)
  }
`;

export const DELETE_DELIVERY = gql`
  mutation DeleteDelivery($deliveryId: Int!) {
    deleteDelivery(deliveryId: $deliveryId)
  }
`;

export const DELETE_DELIVERIES = gql`
  mutation DeleteDeliveries($deliveryIds: [Int!]!) {
    deleteDeliveries(deliveryIds: $deliveryIds)
  }
`;

// ✅ 신규: 기사 배정 / 해제
export const ASSIGN_DRIVER_TO_DELIVERY = gql`
  ${DELIVERY_FIELDS}
  mutation AssignDriverToDelivery($input: AssignDriverInput!) {
    assignDriverToDelivery(input: $input) {
      error {
        code
        message
        details
      }
      success
      delivery {
        ...DeliveryFields
      }
    }
  }
`;

export const UNASSIGN_DRIVER_FROM_DELIVERY = gql`
  ${DELIVERY_FIELDS}
  mutation UnassignDriverFromDelivery($input: UnassignDriverInput!) {
    unassignDriverFromDelivery(input: $input) {
      error {
        code
        message
        details
      }
      success
      delivery {
        ...DeliveryFields
      }
    }
  }
`;
