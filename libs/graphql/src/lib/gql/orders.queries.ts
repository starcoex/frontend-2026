import { gql } from '@apollo/client';

// ─── Fragments ───────────────────────────────────────────────────────────────

export const ORDER_ERROR_INFO_FIELDS = gql`
  fragment OrderErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const ORDER_ITEM_FIELDS = gql`
  fragment OrderItemFields on OrderItem {
    id
    orderId
    productId
    storeId
    productSnapshot
    quantity
    unitPrice
    totalPrice
    selectedOptions
    status
    createdAt
    updatedAt
    deletedAt
  }
`;

export const ORDER_STATUS_HISTORY_FIELDS = gql`
  fragment OrderStatusHistoryFields on OrderStatusHistory {
    id
    orderId
    fromStatus
    toStatus
    reason
    metadata
    createdById
    createdAt
    updatedAt
    deletedAt
  }
`;

export const ORDER_FIELDS = gql`
  ${ORDER_ITEM_FIELDS}
  ${ORDER_STATUS_HISTORY_FIELDS}
  fragment OrderFields on Order {
    id
    orderNumber
    storeId
    storeName
    status
    fulfillmentType
    totalAmount
    deliveryAmount
    finalAmount
    userId
    guestEmail
    customerInfo
    deliveryAddress
    pickupTime
    deliveryMemo
    paymentId
    paymentStatus
    confirmedAt
    createdAt
    updatedAt
    deletedAt
    items {
      ...OrderItemFields
    }
    OrderStatusHistory {
      ...OrderStatusHistoryFields
    }
  }
`;

export const CREATE_ORDER_OUTPUT_FIELDS = gql`
  ${ORDER_ERROR_INFO_FIELDS}
  ${ORDER_FIELDS}
  fragment CreateOrderOutputFields on CreateOrderOutput {
    success
    error {
      ...OrderErrorInfoFields
    }
    order {
      ...OrderFields
    }
    creationMessage
    paymentUrl
    inventoryMessage
    notificationMessage
  }
`;

export const UPDATE_ORDER_OUTPUT_FIELDS = gql`
  ${ORDER_ERROR_INFO_FIELDS}
  ${ORDER_FIELDS}
  fragment UpdateOrderOutputFields on UpdateOrderOutput {
    success
    error {
      ...OrderErrorInfoFields
    }
    order {
      ...OrderFields
    }
    updateMessage
    notificationSent
    statusChangeMessage
  }
`;

// ─── Queries ─────────────────────────────────────────────────────────────────

export const GET_ORDER_BY_ID = gql`
  ${ORDER_FIELDS}
  query GetOrderById($id: Int!) {
    getOrderById(id: $id) {
      ...OrderFields
    }
  }
`;

export const GET_MY_ORDERS = gql`
  ${ORDER_FIELDS}
  query MyOrders($limit: Int, $offset: Int) {
    myOrders(limit: $limit, offset: $offset) {
      ...OrderFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_ORDER = gql`
  ${CREATE_ORDER_OUTPUT_FIELDS}
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ...CreateOrderOutputFields
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  ${UPDATE_ORDER_OUTPUT_FIELDS}
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      ...UpdateOrderOutputFields
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($id: Int!) {
    deleteOrder(id: $id)
  }
`;

export const DELETE_ORDERS = gql`
  mutation DeleteOrders($ids: [Int!]!) {
    deleteOrders(ids: $ids)
  }
`;

export const UPDATE_ORDER_ITEM_STATUS = gql`
  ${ORDER_ITEM_FIELDS}
  mutation UpdateOrderItemStatus($itemId: Int!, $status: OrderItemStatus!) {
    updateOrderItemStatus(itemId: $itemId, status: $status) {
      ...OrderItemFields
    }
  }
`;

export const ATTACH_PAYMENT_TO_ORDER = gql`
  ${ORDER_FIELDS}
  mutation AttachPaymentToOrder($input: AttachPaymentToOrderInput!) {
    attachPaymentToOrder(input: $input) {
      ...OrderFields
    }
  }
`;
