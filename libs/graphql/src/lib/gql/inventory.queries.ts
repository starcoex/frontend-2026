import { gql } from '@apollo/client';

// ── Fragments ────────────────────────────────────────────────────────────────

export const STORE_INVENTORY_FRAGMENT = gql`
  fragment StoreInventoryFields on StoreInventory {
    id
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
    createdAt
    updatedAt
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
    batchNumber
    expiryDate
    createdById
    processedAt
    createdAt
    isInbound
    isOutbound
    isAdjustment
    hasCosting
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
  ${STORE_INVENTORY_FRAGMENT}
  mutation CreateStoreInventory($input: CreateStoreInventoryInput!) {
    createStoreInventory(input: $input) {
      success
      creationMessage
      notificationMessage
      error {
        code
        message
        details
      }
      inventory {
        ...StoreInventoryFields
      }
    }
  }
`;

export const UPDATE_STORE_INVENTORY = gql`
  mutation UpdateStoreInventory($input: UpdateStoreInventoryInput!) {
    updateStoreInventory(input: $input) {
      success
      message
      inventory {
        ...StoreInventoryFields
      }
    }
  }
  ${STORE_INVENTORY_FRAGMENT}
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
  mutation AddStock($input: AddStockInput!) {
    addStock(input: $input) {
      success
      message
      inventory {
        ...StoreInventoryFields
      }
    }
  }
  ${STORE_INVENTORY_FRAGMENT}
`;

// ── 연료 재고 Mutations (신규) ─────────────────────────────────────────────────

export const ADD_FUEL_STOCK = gql`
  mutation AddFuelStock($input: AddFuelStockInput!) {
    addFuelStock(input: $input) {
      success
      message
      inventory {
        id
        productId
        storeId
        currentVolume
        availableVolume
        reservedVolume
        unit
      }
    }
  }
`;

export const DISPENSE_FUEL = gql`
  mutation DispenseFuel($input: DispenseFuelInput!) {
    dispenseFuel(input: $input) {
      success
      message
      inventory {
        id
        productId
        storeId
        currentVolume
        availableVolume
        reservedVolume
        unit
      }
    }
  }
`;
