import { gql } from '@apollo/client';

// ── Fragments ─────────────────────────────────────────────────────────────────

export const NOTICE_ERROR_INFO_FIELDS = gql`
  fragment NoticeErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const NOTICE_FIELDS = gql`
  fragment NoticeFields on Notice {
    id
    deletedAt
    createdAt
    updatedAt
    title
    content
    status
    type
    isPinned
    isPopup
    targetApps
    targetRoles
    visibleFrom
    visibleUntil
    publishedAt
    scheduledAt
    archivedAt
    createdBy
    updatedBy
    publishedBy
    archivedBy
    sourceSuggestionId
    metadata
  }
`;

export const MANUAL_HISTORY_FIELDS = gql`
  fragment ManualHistoryFields on ManualHistory {
    id
    deletedAt
    createdAt
    updatedAt
    manualId
    version
    title
    content
    updatedBy
    changeLog
  }
`;

export const MANUAL_CATEGORY_FIELDS = gql`
  fragment ManualCategoryFields on ManualCategory {
    id
    deletedAt
    createdAt
    updatedAt
    name
    description
    slug
    targetBusiness
    targetApp
    order
    isVisible
    iconMediaId
    createdBy
    updatedBy
  }
`;

export const MANUAL_FIELDS = gql`
  ${MANUAL_CATEGORY_FIELDS}
  fragment ManualFields on Manual {
    id
    deletedAt
    createdAt
    updatedAt
    title
    content
    categoryId
    status
    version
    targetBusiness
    targetApp
    tags
    summary
    order
    imageMediaIds
    videoMediaIds
    createdBy
    updatedBy
    publishedBy
    archivedBy
    relatedManualIds
    metadata
    publishedAt
    archivedAt
    category {
      ...ManualCategoryFields
    }
  }
`;

export const MANUAL_CATEGORY_COMMAND_RESULT_FIELDS = gql`
  ${NOTICE_ERROR_INFO_FIELDS}
  ${MANUAL_CATEGORY_FIELDS}
  fragment ManualCategoryCommandResultFields on ManualCategoryCommandResult {
    success
    error {
      ...NoticeErrorInfoFields
    }
    category {
      ...ManualCategoryFields
    }
    message
  }
`;

export const GET_NOTICES_OUTPUT_FIELDS = gql`
  ${NOTICE_ERROR_INFO_FIELDS}
  ${NOTICE_FIELDS}
  fragment GetNoticesOutputFields on GetNoticesOutput {
    success
    error {
      ...NoticeErrorInfoFields
    }
    notices {
      ...NoticeFields
    }
    totalCount
    currentPage
    totalPages
    hasNext
    hasPrev
  }
`;

export const CREATE_NOTICE_OUTPUT_FIELDS = gql`
  ${NOTICE_ERROR_INFO_FIELDS}
  ${NOTICE_FIELDS}
  fragment CreateNoticeOutputFields on CreateNoticeOutput {
    success
    error {
      ...NoticeErrorInfoFields
    }
    notice {
      ...NoticeFields
    }
    message
  }
`;

export const UPDATE_NOTICE_OUTPUT_FIELDS = gql`
  ${NOTICE_ERROR_INFO_FIELDS}
  ${NOTICE_FIELDS}
  fragment UpdateNoticeOutputFields on UpdateNoticeOutput {
    success
    error {
      ...NoticeErrorInfoFields
    }
    notice {
      ...NoticeFields
    }
    updateMessage
    notificationSent
  }
`;

export const GET_MANUALS_OUTPUT_FIELDS = gql`
  ${NOTICE_ERROR_INFO_FIELDS}
  ${MANUAL_FIELDS}
  fragment GetManualsOutputFields on GetManualsOutput {
    success
    error {
      ...NoticeErrorInfoFields
    }
    manuals {
      ...ManualFields
    }
    totalCount
    currentPage
    totalPages
    hasNext
    hasPrev
  }
`;

export const CREATE_MANUAL_OUTPUT_FIELDS = gql`
  ${NOTICE_ERROR_INFO_FIELDS}
  ${MANUAL_FIELDS}
  fragment CreateManualOutputFields on CreateManualOutput {
    success
    error {
      ...NoticeErrorInfoFields
    }
    manual {
      ...ManualFields
    }
    message
  }
`;

export const UPDATE_MANUAL_OUTPUT_FIELDS = gql`
  ${NOTICE_ERROR_INFO_FIELDS}
  ${MANUAL_FIELDS}
  fragment UpdateManualOutputFields on UpdateManualOutput {
    success
    error {
      ...NoticeErrorInfoFields
    }
    manual {
      ...ManualFields
    }
    updateMessage
  }
`;

// ── Notice Queries ─────────────────────────────────────────────────────────────

export const GET_NOTICES = gql`
  ${GET_NOTICES_OUTPUT_FIELDS}
  query GetNotices($input: GetNoticesInput!) {
    notices(input: $input) {
      ...GetNoticesOutputFields
    }
  }
`;

export const GET_NOTICE_BY_ID = gql`
  ${NOTICE_FIELDS}
  query GetNoticeById($id: Int!) {
    notice(id: $id) {
      ...NoticeFields
    }
  }
`;

export const GET_PUBLISHED_NOTICES = gql`
  ${NOTICE_FIELDS}
  query GetPublishedNotices($targetApp: String) {
    publishedNotices(targetApp: $targetApp) {
      ...NoticeFields
    }
  }
`;

// ── Notice Mutations ───────────────────────────────────────────────────────────

export const CREATE_NOTICE = gql`
  ${CREATE_NOTICE_OUTPUT_FIELDS}
  mutation CreateNotice($input: CreateNoticeInput!) {
    createNotice(input: $input) {
      ...CreateNoticeOutputFields
    }
  }
`;

export const UPDATE_NOTICE = gql`
  ${UPDATE_NOTICE_OUTPUT_FIELDS}
  mutation UpdateNotice($input: UpdateNoticeInput!) {
    updateNotice(input: $input) {
      ...UpdateNoticeOutputFields
    }
  }
`;

export const PUBLISH_NOTICE = gql`
  ${UPDATE_NOTICE_OUTPUT_FIELDS}
  mutation PublishNotice($input: PublishNoticeInput!) {
    publishNotice(input: $input) {
      ...UpdateNoticeOutputFields
    }
  }
`;

export const ARCHIVE_NOTICE = gql`
  ${UPDATE_NOTICE_OUTPUT_FIELDS}
  mutation ArchiveNotice($input: ArchiveNoticeInput!) {
    archiveNotice(input: $input) {
      ...UpdateNoticeOutputFields
    }
  }
`;

export const DELETE_NOTICE = gql`
  mutation DeleteNotice($id: Int!) {
    deleteNotice(id: $id)
  }
`;

export const DELETE_NOTICES = gql`
  mutation DeleteNotices($ids: [Int!]!) {
    deleteNotices(ids: $ids)
  }
`;

export const CREATE_NOTICE_FROM_SUGGESTION = gql`
  ${CREATE_NOTICE_OUTPUT_FIELDS}
  mutation CreateNoticeFromSuggestion(
    $suggestionId: Int!
    $suggestionTitle: String!
    $suggestionContent: String!
  ) {
    createNoticeFromSuggestion(
      suggestionId: $suggestionId
      suggestionTitle: $suggestionTitle
      suggestionContent: $suggestionContent
    ) {
      ...CreateNoticeOutputFields
    }
  }
`;

// ── Manual Category Queries/Mutations ─────────────────────────────────────────

export const GET_MANUAL_CATEGORIES = gql`
  ${MANUAL_CATEGORY_FIELDS}
  query GetManualCategories(
    $targetBusiness: NoticeBusinessType
    $targetApp: String
  ) {
    manualCategories(targetBusiness: $targetBusiness, targetApp: $targetApp) {
      ...ManualCategoryFields
    }
  }
`;

export const CREATE_MANUAL_CATEGORY = gql`
  ${MANUAL_CATEGORY_COMMAND_RESULT_FIELDS}
  mutation CreateManualCategory($input: CreateManualCategoryInput!) {
    createManualCategory(input: $input) {
      ...ManualCategoryCommandResultFields
    }
  }
`;

export const UPDATE_MANUAL_CATEGORY = gql`
  ${MANUAL_CATEGORY_COMMAND_RESULT_FIELDS}
  mutation UpdateManualCategory($input: UpdateManualCategoryInput!) {
    updateManualCategory(input: $input) {
      ...ManualCategoryCommandResultFields
    }
  }
`;

export const DELETE_MANUAL_CATEGORY = gql`
  mutation DeleteManualCategory($id: Int!) {
    deleteManualCategory(id: $id)
  }
`;

// ── Manual Queries/Mutations ───────────────────────────────────────────────────

export const GET_MANUALS = gql`
  ${GET_MANUALS_OUTPUT_FIELDS}
  query GetManuals($input: GetManualsInput!) {
    manuals(input: $input) {
      ...GetManualsOutputFields
    }
  }
`;

export const GET_MANUAL_BY_ID = gql`
  ${MANUAL_FIELDS}
  ${MANUAL_HISTORY_FIELDS}
  query GetManualById($id: Int!) {
    manual(id: $id) {
      ...ManualFields
      histories {
        ...ManualHistoryFields
      }
    }
  }
`;

export const GET_PUBLISHED_MANUALS = gql`
  ${MANUAL_FIELDS}
  query GetPublishedManuals(
    $targetBusiness: NoticeBusinessType!
    $targetApp: String!
    $categoryId: Int
  ) {
    publishedManuals(
      targetBusiness: $targetBusiness
      targetApp: $targetApp
      categoryId: $categoryId
    ) {
      ...ManualFields
    }
  }
`;

export const GET_MANUAL_HISTORIES = gql`
  ${MANUAL_HISTORY_FIELDS}
  query GetManualHistories($manualId: Int!) {
    manualHistories(manualId: $manualId) {
      ...ManualHistoryFields
    }
  }
`;

export const CREATE_MANUAL = gql`
  ${CREATE_MANUAL_OUTPUT_FIELDS}
  mutation CreateManual($input: CreateManualInput!) {
    createManual(input: $input) {
      ...CreateManualOutputFields
    }
  }
`;

export const UPDATE_MANUAL = gql`
  ${UPDATE_MANUAL_OUTPUT_FIELDS}
  mutation UpdateManual($input: UpdateManualInput!) {
    updateManual(input: $input) {
      ...UpdateManualOutputFields
    }
  }
`;

export const PUBLISH_MANUAL = gql`
  ${UPDATE_MANUAL_OUTPUT_FIELDS}
  mutation PublishManual($input: PublishManualInput!) {
    publishManual(input: $input) {
      ...UpdateManualOutputFields
    }
  }
`;

export const ARCHIVE_MANUAL = gql`
  ${UPDATE_MANUAL_OUTPUT_FIELDS}
  mutation ArchiveManual($input: ArchiveManualInput!) {
    archiveManual(input: $input) {
      ...UpdateManualOutputFields
    }
  }
`;

export const DELETE_MANUAL = gql`
  mutation DeleteManual($id: Int!) {
    deleteManual(id: $id)
  }
`;

export const DELETE_MANUALS = gql`
  mutation DeleteManuals($ids: [Int!]!) {
    deleteManuals(ids: $ids)
  }
`;
