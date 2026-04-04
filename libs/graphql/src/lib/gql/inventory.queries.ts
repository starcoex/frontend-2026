import { gql } from '@apollo/client';

// ── Fragments ────────────────────────────────────────────────────────────────

export const INVENTORY_ERROR_INFO_FIELDS = gql`
  fragment InventoryErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const STORE_INVENTORY_FRAGMENT = gql`
  fragment StoreInventoryFields on StoreInventory {
    id
    deletedAt
    createdAt
    updatedAt
    storeId
    productId
    currentStock
    reservedStock
    availableStock
    unit
    currentVolume
    reservedVolume
    availableVolume
    minVolume
    maxVolume
    reorderVolume
    minStock
    maxStock
    reorderPoint
    reorderQuantity
    costPrice
    storePrice
    isActive
    isAvailable
    isSellable
    location
    zone
    version
    createdById
    updatedById
    lastCountedAt
    isLowStock
    isOutOfStock
    needsReorder
    isOverStock
    stockLevel
    reservedPercentage
    totalValue
    hasMinStockAlert
    hasReorderAlert
    hasExpiringItems
    totalTransactions
    lastTransactionAt
    daysSinceLastCount
  }
`;

export const INVENTORY_TRANSACTION_FRAGMENT = gql`
  fragment InventoryTransactionFields on InventoryTransaction {
    id
    deletedAt
    createdAt
    updatedAt
    inventoryId
    type
    quantity
    previousStock
    newStock
    reason
    referenceType
    referenceId
    unitCost
    totalCost
    notes
    metadata
    batchNumber
    expiryDate
    createdById
    processedAt
    isInbound
    isOutbound
    isAdjustment
    hasCosting
    averageCost
    hasBatch
    hasExpiry
    isExpiringSoon
    isProcessed
    processingTime
  }
`;

// ── Queries ───────────────────────────────────────────────────────────────────

export const GET_INVENTORY_BY_ID = gql`
  ${STORE_INVENTORY_FRAGMENT}
  ${INVENTORY_TRANSACTION_FRAGMENT}
  query GetInventoryById($id: Int!) {
    getInventoryById(id: $id) {
      ...StoreInventoryFields
      transactions {
        ...InventoryTransactionFields
      }
    }
  }
`;

export const GET_INVENTORIES_BY_PRODUCT = gql`
  ${STORE_INVENTORY_FRAGMENT}
  query GetInventoriesByProduct($productId: Int!, $storeId: Int) {
    getInventoriesByProduct(productId: $productId, storeId: $storeId) {
      ...StoreInventoryFields
    }
  }
`;

export const GET_LOW_STOCK_INVENTORIES = gql`
  ${STORE_INVENTORY_FRAGMENT}
  query GetLowStockInventories($storeId: Int) {
    getLowStockInventories(storeId: $storeId) {
      ...StoreInventoryFields
    }
  }
`;

export const GET_STORE_INVENTORIES = gql`
  ${STORE_INVENTORY_FRAGMENT}
  query GetStoreInventories($storeId: Int) {
    getStoreInventories(storeId: $storeId) {
      ...StoreInventoryFields
    }
  }
`;

// ── Mutations ─────────────────────────────────────────────────────────────────

export const CREATE_STORE_INVENTORY = gql`
  ${INVENTORY_ERROR_INFO_FIELDS}
  ${STORE_INVENTORY_FRAGMENT}
  mutation CreateStoreInventory($input: CreateStoreInventoryInput!) {
    createStoreInventory(input: $input) {
      success
      creationMessage
      notificationMessage
      error {
        ...InventoryErrorInfoFields
      }
      inventory {
        ...StoreInventoryFields
      }
    }
  }
`;

export const UPDATE_STORE_INVENTORY = gql`
  ${STORE_INVENTORY_FRAGMENT}
  mutation UpdateStoreInventory($input: UpdateStoreInventoryInput!) {
    updateStoreInventory(input: $input) {
      success
      message
      inventory {
        ...StoreInventoryFields
      }
    }
  }
`;

export const DELETE_STORE_INVENTORY = gql`
  mutation DeleteStoreInventory($id: Int!) {
    deleteStoreInventory(id: $id)
  }
`;

export const DELETE_STORE_INVENTORIES = gql`
  mutation DeleteStoreInventories($ids: [Int!]!) {
    deleteStoreInventories(ids: $ids)
  }
`;

export const ADD_STOCK = gql`
  ${STORE_INVENTORY_FRAGMENT}
  mutation AddStock($input: AddStockInput!) {
    addStock(input: $input) {
      success
      message
      inventory {
        ...StoreInventoryFields
      }
    }
  }
`;

// ── 연료 재고 Mutations ────────────────────────────────────────────────────────

export const ADD_FUEL_STOCK = gql`
  ${STORE_INVENTORY_FRAGMENT}
  mutation AddFuelStock($input: AddFuelStockInput!) {
    addFuelStock(input: $input) {
      success
      message
      inventory {
        ...StoreInventoryFields
      }
    }
  }
`;

export const DISPENSE_FUEL = gql`
  ${STORE_INVENTORY_FRAGMENT}
  mutation DispenseFuel($input: DispenseFuelInput!) {
    dispenseFuel(input: $input) {
      success
      message
      inventory {
        ...StoreInventoryFields
      }
    }
  }
`;
