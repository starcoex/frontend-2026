import { gql } from '@apollo/client';

// ─── Fragments ───────────────────────────────────────────────────────────────

export const CART_ERROR_INFO_FIELDS = gql`
  fragment CartErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const CART_ITEM_FIELDS = gql`
  fragment CartItemFields on CartItem {
    id
    cartId
    productId
    storeId
    quantity
    appliedPromotionId
    product {
      id
    }
    store {
      id
    }
    subtotal
    currentPrice
    isPriceChanged
    isAvailable
    availableStock
    createdAt
    updatedAt
    deletedAt
  }
`;

export const CART_FIELDS = gql`
  ${CART_ITEM_FIELDS}
  fragment CartFields on Cart {
    id
    userId
    expiresAt
    lastAccessedAt
    items {
      ...CartItemFields
    }
    itemCount
    totalAmount
    estimatedShipping
    isEmpty
    isExpired
    daysUntilExpiry
    user {
      id
    }
    createdAt
    updatedAt
    deletedAt
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_MY_CART = gql`
  ${CART_FIELDS}
  query MyCart {
    myCart {
      ...CartFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const ADD_TO_CART = gql`
  ${CART_ERROR_INFO_FIELDS}
  ${CART_FIELDS}
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      success
      error {
        ...CartErrorInfoFields
      }
      cart {
        ...CartFields
      }
      message
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  ${CART_ERROR_INFO_FIELDS}
  ${CART_FIELDS}
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      success
      error {
        ...CartErrorInfoFields
      }
      cart {
        ...CartFields
      }
      message
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  ${CART_ERROR_INFO_FIELDS}
  ${CART_FIELDS}
  mutation RemoveFromCart($input: RemoveFromCartInput!) {
    removeFromCart(input: $input) {
      success
      error {
        ...CartErrorInfoFields
      }
      cart {
        ...CartFields
      }
      message
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;
