import { gql } from '@apollo/client';

// ===== Fragments =====

export const PROMOTION_RULE_FIELDS = gql`
  fragment PromotionRuleFields on PromotionRule {
    id
    promotionId
    name
    condition
    action
    priority
    isActive
    createdAt
    updatedAt
  }
`;

export const PROMOTION_FIELDS = gql`
  fragment PromotionFields on Promotion {
    id
    name
    code
    description
    type
    discountType
    discountValue
    maxDiscount
    minOrderAmount
    maxOrderAmount
    targetCustomers
    customerSegments
    excludedCustomers
    startDate
    endDate
    timeRestrictions
    totalLimit
    perUserLimit
    dailyLimit
    currentUsage
    additionalBenefits
    stackable
    priority
    autoApply
    status
    isActive
    isVisible
    imageUrl
    bannerImageUrl
    marketingMessage
    metadata
    createdById
    updatedById
    approvedAt
    approvedById
    appliesToAllStores
    applicableStoreIds
    appliesToAllProducts
    applicableProductIds
    appliesToAllCategories
    applicableCategoryIds
    createdAt
    updatedAt
  }
`;

export const PROMOTION_SUMMARY_STATS_FIELDS = gql`
  fragment PromotionSummaryStatsFields on PromotionSummaryStats {
    statusCounts {
      status
      count
    }
    last30Days {
      totalUsage
      totalDiscount
      totalRevenue
      uniqueUsers
    }
  }
`;

// ===== Queries =====

export const GET_PROMOTION_BY_ID = gql`
  ${PROMOTION_FIELDS}
  query GetPromotionById($id: Int!) {
    getPromotionById(id: $id) {
      ...PromotionFields
      rules {
        id
        name
        condition
        action
        priority
        isActive
      }
    }
  }
`;

export const FIND_PROMOTION_BY_ID = gql`
  ${PROMOTION_FIELDS}
  query FindPromotionById($id: Int!) {
    findPromotionById(id: $id) {
      ...PromotionFields
      rules {
        id
        name
        condition
        action
        priority
        isActive
      }
    }
  }
`;

export const GET_PROMOTIONS = gql`
  ${PROMOTION_FIELDS}
  query GetPromotions($input: GetPromotionsInput!) {
    getPromotions(input: $input) {
      items {
        ...PromotionFields
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_PROMOTION_SUMMARY_STATS = gql`
  ${PROMOTION_SUMMARY_STATS_FIELDS}
  query GetPromotionSummaryStats {
    getPromotionSummaryStats {
      ...PromotionSummaryStatsFields
    }
  }
`;

// ===== Mutations =====

export const CREATE_PROMOTION = gql`
  ${PROMOTION_FIELDS}
  mutation CreatePromotionNew($input: CreatePromotionInput!) {
    createPromotionNew(input: $input) {
      ...PromotionFields
      rules {
        id
        name
        condition
        action
        priority
        isActive
      }
    }
  }
`;

export const UPDATE_PROMOTION = gql`
  ${PROMOTION_FIELDS}
  mutation UpdatePromotionNew($input: UpdatePromotionInput!) {
    updatePromotionNew(input: $input) {
      ...PromotionFields
      rules {
        id
        name
        condition
        action
        priority
        isActive
      }
    }
  }
`;

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($input: DeletePromotionInput!) {
    deletePromotion(input: $input) {
      success
      message
      deletedId
    }
  }
`;

export const BULK_DELETE_PROMOTIONS = gql`
  mutation BulkDeletePromotions($input: BulkDeletePromotionsInput!) {
    bulkDeletePromotions(input: $input) {
      success
      message
      successCount
      failCount
      deletedIds
      failedIds
    }
  }
`;

export const CHANGE_PROMOTION_STATUS = gql`
  ${PROMOTION_FIELDS}
  mutation ChangePromotionStatus($input: ChangePromotionStatusInput!) {
    changePromotionStatus(input: $input) {
      success
      message
      promotion {
        ...PromotionFields
      }
    }
  }
`;
