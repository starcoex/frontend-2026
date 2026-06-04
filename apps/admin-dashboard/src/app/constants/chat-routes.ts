export const CHAT_ROUTES = {
  LIST: '/admin/chats',
  DETAIL: '/admin/chats/:roomId',
} as const;

export const CHAT_ROUTE_PATTERNS = {
  DETAIL: /^\/admin\/chats\/(\d+)$/,
} as const;
