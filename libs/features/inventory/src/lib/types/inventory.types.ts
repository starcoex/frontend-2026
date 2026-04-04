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
  | 'FUEL_DELIVERY_IN' // 신규: 난방유 입고
  | 'FUEL_DISPENSED' // 신규: 주유 출고
  | 'FUEL_ADJUSTMENT' // 신규: 연료 조정
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
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
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
  // computed fields
  isInbound?: boolean | null;
  isOutbound?: boolean | null;
  isAdjustment?: boolean | null;
  hasCosting?: boolean | null;
  averageCost?: number | null;
  hasBatch?: boolean | null;
  hasExpiry?: boolean | null;
  isExpiringSoon?: boolean | null;
  isProcessed?: boolean | null;
  processingTime?: number | null;
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
  // 신규: 재고 단위 및 부피 관련
  unit: string;
  currentVolume?: number | null;
  reservedVolume?: number | null;
  availableVolume?: number | null;
  minVolume?: number | null;
  maxVolume?: number | null;
  reorderVolume?: number | null;
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
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // computed fields
  isLowStock?: boolean | null;
  isOutOfStock?: boolean | null;
  needsReorder?: boolean | null;
  isOverStock?: boolean | null;
  stockLevel?: number | null;
  totalValue?: number | null;
  // 신규 computed fields
  reservedPercentage?: number | null;
  totalTransactions?: number | null;
  lastTransactionAt?: string | null;
  daysSinceLastCount?: number | null;
  hasMinStockAlert?: boolean | null;
  hasReorderAlert?: boolean | null;
  hasExpiringItems?: boolean | null;
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
  unit?: string; // ← 추가
  minVolume?: number; // ← 추가
  maxVolume?: number; // ← 추가
  reorderVolume?: number; // ← 추가
}

export interface CreateStoreInventoryOutput {
  success?: boolean | null;
  error?: ErrorInfo | null;
  inventory?: StoreInventory | null;
  creationMessage?: string | null;
  notificationMessage?: string | null;
}

// 신규: updateStoreInventory Input
export interface UpdateStoreInventoryInput {
  id: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  costPrice?: number | null;
  storePrice?: number | null;
  isAvailable?: boolean;
  isSellable?: boolean;
  location?: string | null;
  zone?: string | null;
  unit?: string;
  minVolume?: number | null;
  maxVolume?: number | null;
  reorderVolume?: number | null;
}

export interface AddStockInput {
  productId: number;
  storeId: number;
  quantity: number;
  notes?: string;
}

export interface AddStockOutput {
  success: boolean;
  message: string;
  inventory?: StoreInventory | null;
}

// 신규: updateStoreInventory Output
export interface UpdateStoreInventoryOutput {
  success: boolean;
  message: string;
  inventory?: StoreInventory | null;
}

// 신규: 연료 재고 Input
export interface AddFuelStockInput {
  productId: number;
  storeId: number;
  volumeLiters: number;
  deliveryId?: number; // ← optional로 변경
  notes?: string; // ← 추가
  idempotencyKey?: string;
}

export interface DispenseFuelInput {
  productId: number;
  storeId: number;
  volumeLiters: number;
  fuelWalkInId: number;
  idempotencyKey?: string;
}

// 신규: 연료 재고 Output
export interface FuelInventoryOutput {
  success: boolean;
  message: string;
  inventory?: StoreInventory | null;
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
  updateStoreInventory( // 신규
    input: UpdateStoreInventoryInput
  ): Promise<ApiResponse<UpdateStoreInventoryOutput>>;
  deleteStoreInventory(id: number): Promise<ApiResponse<boolean>>;
  deleteStoreInventories(ids: number[]): Promise<ApiResponse<boolean>>;
  // 신규
  addFuelStock(
    input: AddFuelStockInput
  ): Promise<ApiResponse<FuelInventoryOutput>>;
  dispenseFuel(
    input: DispenseFuelInput
  ): Promise<ApiResponse<FuelInventoryOutput>>;
  addStock(input: AddStockInput): Promise<ApiResponse<AddStockOutput>>; // 신규
}

// ============================================================================
// Context 상태 타입 (기존과 동일)
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
