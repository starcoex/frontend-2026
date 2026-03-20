import type { ApiResponse } from '../types';

// ============================================================================
// Enum 타입
// ============================================================================

export type InventoryTransactionType =
  | 'IN'
  | 'OUT'
  | 'RESERVE'
  | 'RELEASE'
  | 'ADJUSTMENT'
  | 'TRANSFER'
  | 'RETURN'
  | 'DAMAGE'
  | 'EXPIRE';

export type InventoryReason =
  | 'PURCHASE'
  | 'TRANSFER_IN'
  | 'RETURN_IN'
  | 'ADJUSTMENT_IN'
  | 'SALE'
  | 'TRANSFER_OUT'
  | 'RETURN_OUT'
  | 'DAMAGE_OUT'
  | 'EXPIRE_OUT'
  | 'ADJUSTMENT_OUT'
  | 'ORDER_RESERVE'
  | 'ORDER_RELEASE'
  | 'ORDER_CONFIRM'
  | 'COUNT_ADJUSTMENT';

export type MovementStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SHIPPED'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type CountType = 'FULL' | 'PARTIAL' | 'CYCLE' | 'SPOT';
export type CountStatus =
  | 'PLANNING'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';
export type CountItemStatus = 'PENDING' | 'COUNTED' | 'VARIANCE' | 'ADJUSTED';

// ============================================================================
// 엔티티 타입
// ============================================================================

export interface InventoryTransaction {
  id: number;
  inventoryId: number;
  type: InventoryTransactionType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: InventoryReason;
  referenceType?: string | null;
  referenceId?: number | null;
  unitCost?: number | null;
  totalCost?: number | null;
  notes?: string | null;
  metadata?: Record<string, any> | null;
  batchNumber?: string | null;
  expiryDate?: string | null;
  idempotencyKey?: string | null;
  createdById: number;
  processedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: number;
  fromInventoryId: number;
  toInventoryId: number;
  productId: number;
  requestedQty: number;
  shippedQty?: number | null;
  receivedQty?: number | null;
  status: MovementStatus;
  reason?: string | null;
  requestedById: number;
  approvedById?: number | null;
  requestedAt: string;
  approvedAt?: string | null;
  shippedAt?: string | null;
  receivedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoreInventory {
  id: number;
  storeId: number;
  productId: number;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  costPrice?: number | null;
  storePrice?: number | null;
  isActive: boolean;
  isAvailable: boolean;
  isSellable: boolean;
  location?: string | null;
  zone?: string | null;
  version: number;
  createdById: number;
  updatedById: number;
  lastCountedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // computed fields
  isLowStock?: boolean | null;
  isOutOfStock?: boolean | null;
  needsReorder?: boolean | null;
  isOverStock?: boolean | null;
  stockLevel?: number | null;
  totalValue?: number | null;
  // relations
  transactions?: InventoryTransaction[];
  movementsFrom?: InventoryMovement[];
  movementsTo?: InventoryMovement[];
}

// ============================================================================
// Input / Output 타입
// ============================================================================

export interface ErrorInfo {
  code?: string | null;
  message: string;
  details?: string | null;
}

export interface CreateStoreInventoryInput {
  storeId: number;
  productId: number;
  currentStock?: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  costPrice?: number;
  storePrice?: number;
  isActive?: boolean;
  isAvailable?: boolean;
  isSellable?: boolean;
  location?: string;
  zone?: string;
}

export interface CreateStoreInventoryOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  inventory?: StoreInventory | null;
  creationMessage?: string | null;
  notificationMessage?: string | null;
}

// ============================================================================
// 서비스 인터페이스
// ============================================================================

export interface IInventoryService {
  getInventoryById(id: number): Promise<ApiResponse<StoreInventory>>;
  getStoreInventories(storeId?: number): Promise<ApiResponse<StoreInventory[]>>;
  getInventoriesByProduct(
    productId: number,
    storeId?: number
  ): Promise<ApiResponse<StoreInventory[]>>;
  getLowStockInventories(
    storeId?: number
  ): Promise<ApiResponse<StoreInventory[]>>;
  createStoreInventory(
    input: CreateStoreInventoryInput
  ): Promise<ApiResponse<CreateStoreInventoryOutput>>;
  deleteStoreInventory(id: number): Promise<ApiResponse<boolean>>;
  deleteStoreInventories(ids: number[]): Promise<ApiResponse<boolean>>;
}

// ============================================================================
// Context 상태 타입
// ============================================================================

export interface InventoryFilters {
  storeId?: number;
  productId?: number;
  zone?: string;
  isLowStock?: boolean;
  isAvailable?: boolean;
  isActive?: boolean;
}

export interface InventoryState {
  inventories: StoreInventory[];
  currentInventory: StoreInventory | null;
  lowStockInventories: StoreInventory[];
  filters: InventoryFilters;
  isLoading: boolean;
  error: string | null;
}

export interface InventoryContextActions {
  setInventories: (inventories: StoreInventory[]) => void;
  addInventory: (inventory: StoreInventory) => void;
  updateInventoryInContext: (
    id: number,
    updates: Partial<StoreInventory>
  ) => void;
  removeInventory: (id: number) => void;
  setCurrentInventory: (inventory: StoreInventory | null) => void;
  setLowStockInventories: (inventories: StoreInventory[]) => void;
  setFilters: (filters: Partial<InventoryFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type InventoryContextValue = InventoryState & InventoryContextActions;
