import { gql } from '@apollo/client';

// ─── Fragments ───────────────────────────────────────────────────────────────

export const CATEGORY_ERROR_INFO_FIELDS = gql`
  fragment CategoryErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const CATEGORY_FIELDS = gql`
  fragment CategoryFields on Category {
    id
    name
    slug
    description
    metadata
    isActive
    sortOrder
    productCount
    parentId
    createdAt
    updatedAt
    deletedAt
  }
`;

export const CATEGORY_WITH_CHILDREN_FIELDS = gql`
  ${CATEGORY_FIELDS}
  fragment CategoryWithChildrenFields on Category {
    ...CategoryFields
    children {
      ...CategoryFields
    }
    parent {
      ...CategoryFields
    }
  }
`;

export const CREATE_CATEGORY_OUTPUT_FIELDS = gql`
  ${CATEGORY_ERROR_INFO_FIELDS}
  ${CATEGORY_FIELDS}
  fragment CreateCategoryOutputFields on CreateCategoryOutput {
    success
    error {
      ...CategoryErrorInfoFields
    }
    category {
      ...CategoryFields
    }
    creationMessage
    notificationMessage
    hierarchyMessage
  }
`;

export const UPDATE_CATEGORY_OUTPUT_FIELDS = gql`
  ${CATEGORY_ERROR_INFO_FIELDS}
  ${CATEGORY_FIELDS}
  fragment UpdateCategoryOutputFields on UpdateCategoryOutput {
    success
    error {
      ...CategoryErrorInfoFields
    }
    category {
      ...CategoryFields
    }
    updateMessage
    notificationSent
    hierarchyUpdateMessage
  }
`;

// ─── Queries ─────────────────────────────────────────────────────────────────

export const GET_CATEGORY = gql`
  ${CATEGORY_FIELDS}
  query GetCategoryById($id: Int!) {
    getCategoryById(id: $id) {
      ...CategoryFields
    }
  }
`;

export const GET_CATEGORY_BY_SLUG = gql`
  ${CATEGORY_FIELDS}
  query GetCategoryBySlug($slug: String!) {
    findCategoryBySlug(slug: $slug) {
      ...CategoryFields
    }
  }
`;

export const LIST_CATEGORIES = gql`
  ${CATEGORY_FIELDS}
  query ListCategories($parentId: Int) {
    listCategories(parentId: $parentId) {
      ...CategoryFields
    }
  }
`;

export const GET_CATEGORY_TREE = gql`
  ${CATEGORY_WITH_CHILDREN_FIELDS}
  query GetCategoryTree($rootId: Int, $maxDepth: Int) {
    findCategoryTree(rootId: $rootId, maxDepth: $maxDepth) {
      ...CategoryWithChildrenFields
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_CATEGORY = gql`
  ${CREATE_CATEGORY_OUTPUT_FIELDS}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategoryNew(input: $input) {
      ...CreateCategoryOutputFields
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  ${UPDATE_CATEGORY_OUTPUT_FIELDS}
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategoryNew(input: $input) {
      ...UpdateCategoryOutputFields
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id)
  }
`;

export const MOVE_CATEGORY = gql`
  ${UPDATE_CATEGORY_OUTPUT_FIELDS}
  mutation MoveCategory($id: Int!, $newParentId: Int) {
    moveCategoryNew(id: $id, newParentId: $newParentId) {
      ...UpdateCategoryOutputFields
    }
  }
`;
