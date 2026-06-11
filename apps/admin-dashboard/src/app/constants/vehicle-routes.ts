export const VEHICLE_ROUTES = {
  LIST: '/admin/vehicles',
  DETAIL: '/admin/vehicles/:id',
  BRANDS: '/admin/vehicles/brands',
  MODELS: '/admin/vehicles/models',
  DIMENSION_RULES: '/admin/vehicles/dimension-rules',
  PENDING_REVIEW: '/admin/vehicles/pending-review',
  LOW_CONFIDENCE: '/admin/vehicles/low-confidence',
} as const;

export const VEHICLE_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/vehicles\/(\d+)$/,
} as const;
