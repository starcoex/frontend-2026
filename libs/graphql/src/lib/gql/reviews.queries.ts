import { gql } from '@apollo/client';

// ===== Fragments =====

export const REVIEW_COMMENT_FIELDS = gql`
  fragment ReviewCommentFields on ReviewComment {
    id
    deletedAt
    createdAt
    updatedAt
    content
    status
    reviewId
    userId
    parentId
  }
`;

export const REVIEW_VOTE_FIELDS = gql`
  fragment ReviewVoteFields on ReviewVote {
    id
    deletedAt
    createdAt
    updatedAt
    reviewId
    userId
    type
  }
`;

export const REVIEW_FIELDS = gql`
  fragment ReviewFields on Review {
    id
    deletedAt
    createdAt
    updatedAt
    title
    content
    rating
    type
    status
    targetId
    targetType
    userId
    imageUrls
    helpfulCount
    notHelpfulCount
  }
`;

export const GENERAL_REVIEW_SCOPE_FIELDS = gql`
  fragment GeneralReviewScopeFields on GeneralReviewScope {
    id
    deletedAt
    createdAt
    updatedAt
    slug
    name
    description
    metadata
    isActive
  }
`;

export const REVIEW_SUMMARY_STATS_FIELDS = gql`
  fragment ReviewSummaryStatsFields on ReviewSummaryStats {
    total
    active
    hidden
    deleted
    reported
  }
`;

// ===== Queries =====

export const GET_REVIEW_BY_ID = gql`
  ${REVIEW_FIELDS}
  ${REVIEW_COMMENT_FIELDS}
  ${REVIEW_VOTE_FIELDS}
  query GetReviewById($id: Int!) {
    getReviewById(id: $id) {
      ...ReviewFields
      comments {
        ...ReviewCommentFields
        replies {
          ...ReviewCommentFields
        }
      }
      votes {
        ...ReviewVoteFields
      }
    }
  }
`;

export const GET_REVIEWS = gql`
  ${REVIEW_FIELDS}
  query GetReviews($input: GetReviewsInput!) {
    getReviews(input: $input) {
      items {
        ...ReviewFields
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_REVIEW_SUMMARY_STATS = gql`
  ${REVIEW_SUMMARY_STATS_FIELDS}
  query GetReviewSummaryStats {
    getReviewSummaryStats {
      ...ReviewSummaryStatsFields
    }
  }
`;

export const REVIEWS_BY_TARGET = gql`
  ${REVIEW_FIELDS}
  query ReviewsByTarget($targetType: ReviewTargetType!, $targetId: Int!) {
    reviewsByTarget(targetType: $targetType, targetId: $targetId) {
      ...ReviewFields
    }
  }
`;

export const GET_GENERAL_REVIEW_SCOPE_BY_ID = gql`
  ${GENERAL_REVIEW_SCOPE_FIELDS}
  query GetGeneralReviewScopeById($id: Int!) {
    getGeneralReviewScopeById(id: $id) {
      ...GeneralReviewScopeFields
    }
  }
`;

export const GET_GENERAL_REVIEW_SCOPES = gql`
  ${GENERAL_REVIEW_SCOPE_FIELDS}
  query GeneralReviewScopes($isActive: Boolean) {
    generalReviewScopes(isActive: $isActive) {
      ...GeneralReviewScopeFields
    }
  }
`;

export const GET_GENERAL_SCOPES = gql`
  ${GENERAL_REVIEW_SCOPE_FIELDS}
  query GeneralScopes($input: GetGeneralScopesInput) {
    generalScopes(input: $input) {
      items {
        ...GeneralReviewScopeFields
      }
      total
    }
  }
`;

export const GET_GENERAL_SCOPE = gql`
  ${GENERAL_REVIEW_SCOPE_FIELDS}
  query GeneralScope($id: Int!) {
    generalScope(id: $id) {
      ...GeneralReviewScopeFields
    }
  }
`;

export const MY_REVIEWS = gql`
  ${REVIEW_FIELDS}
  query MyReviewsNew($limit: Int) {
    myReviewsNew(limit: $limit) {
      ...ReviewFields
    }
  }
`;

// ===== Mutations =====

export const CREATE_REVIEW = gql`
  ${REVIEW_FIELDS}
  mutation CreateReviewNew($input: CreateReviewInput!) {
    createReviewNew(input: $input) {
      success
      creationMessage
      userAverageRating
      error {
        code
        message
        details
      }
      review {
        ...ReviewFields
      }
    }
  }
`;

export const VOTE_REVIEW = gql`
  ${REVIEW_VOTE_FIELDS}
  mutation VoteReview($input: VoteReviewInput!) {
    voteReview(input: $input) {
      success
      voteMessage
      helpfulCount
      notHelpfulCount
      wasChanged
      error {
        code
        message
        details
      }
      vote {
        ...ReviewVoteFields
      }
    }
  }
`;

export const CREATE_REVIEW_COMMENT = gql`
  ${REVIEW_COMMENT_FIELDS}
  mutation CreateReviewComment($input: CreateCommentInput!) {
    createReviewComment(input: $input) {
      success
      creationMessage
      totalCommentCount
      notifiedUserIds
      error {
        code
        message
        details
      }
      comment {
        ...ReviewCommentFields
      }
    }
  }
`;

export const CHANGE_REVIEW_STATUS = gql`
  ${REVIEW_FIELDS}
  mutation ChangeReviewStatus($input: ChangeReviewStatusInput!) {
    changeReviewStatus(input: $input) {
      success
      message
      review {
        ...ReviewFields
      }
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) {
      success
      message
      deletedId
    }
  }
`;

export const BULK_DELETE_REVIEWS = gql`
  mutation BulkDeleteReviews($input: BulkDeleteReviewsInput!) {
    bulkDeleteReviews(input: $input) {
      success
      message
      successCount
      failCount
      deletedIds
      failedIds
    }
  }
`;

export const CHANGE_COMMENT_STATUS = gql`
  mutation ChangeCommentStatus($input: ChangeCommentStatusInput!) {
    changeCommentStatus(input: $input) {
      success
      message
    }
  }
`;

export const CREATE_GENERAL_REVIEW_SCOPE = gql`
  ${GENERAL_REVIEW_SCOPE_FIELDS}
  mutation CreateGeneralReviewScope($input: CreateGeneralReviewScopeInput!) {
    createGeneralReviewScope(input: $input) {
      ...GeneralReviewScopeFields
    }
  }
`;

export const UPDATE_GENERAL_REVIEW_SCOPE = gql`
  ${GENERAL_REVIEW_SCOPE_FIELDS}
  mutation UpdateGeneralReviewScope($input: UpdateGeneralReviewScopeInput!) {
    updateGeneralReviewScope(input: $input) {
      ...GeneralReviewScopeFields
    }
  }
`;

export const DELETE_GENERAL_REVIEW_SCOPE = gql`
  ${GENERAL_REVIEW_SCOPE_FIELDS}
  mutation DeleteGeneralReviewScope($id: Int!) {
    deleteGeneralReviewScope(id: $id) {
      ...GeneralReviewScopeFields
    }
  }
`;
