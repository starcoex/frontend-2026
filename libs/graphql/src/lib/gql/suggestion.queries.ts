import { gql } from '@apollo/client';

// auth.queries.ts import 제거, 독립적으로 정의 (이름 충돌 방지)
export const SUGGESTION_ERROR_INFO_FIELDS = gql`
  fragment SuggestionErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const SUGGESTION_FIELDS = gql`
  fragment SuggestionFields on Suggestion {
    id
    title
    description
    category
    status
    priority
    userId
    userEmail
    targetApp
    tags
    metadata
    resolvedAt
    createdAt
    updatedAt
    deletedAt
    user {
      id
    }
  }
`;

export const GET_SUGGESTIONS_OUTPUT_FIELDS = gql`
  ${SUGGESTION_ERROR_INFO_FIELDS}
  ${SUGGESTION_FIELDS}
  fragment GetSuggestionsOutputFields on GetSuggestionsOutput {
    success
    error {
      ...SuggestionErrorInfoFields
    }
    suggestions {
      ...SuggestionFields
    }
    totalCount
    currentPage
    totalPages
    hasNext
    hasPrev
  }
`;

export const GET_SUGGESTION = gql`
  ${SUGGESTION_FIELDS}
  query GetSuggestion($id: Int!) {
    suggestion(id: $id) {
      ...SuggestionFields
    }
  }
`;

export const GET_SUGGESTIONS = gql`
  ${GET_SUGGESTIONS_OUTPUT_FIELDS}
  query GetSuggestions($input: GetSuggestionsInput) {
    suggestions(input: $input) {
      ...GetSuggestionsOutputFields
    }
  }
`;

export const GET_MY_SUGGESTIONS = gql`
  ${GET_SUGGESTIONS_OUTPUT_FIELDS}
  query GetMySuggestions($input: GetSuggestionsInput) {
    mySuggestions(input: $input) {
      ...GetSuggestionsOutputFields
    }
  }
`;

export const GET_SUGGESTION_STATS = gql`
  query GetSuggestionStats {
    suggestionStats
  }
`;

export const CREATE_SUGGESTION = gql`
  ${SUGGESTION_ERROR_INFO_FIELDS}
  ${SUGGESTION_FIELDS}
  mutation CreateSuggestion($input: CreateSuggestionInput!) {
    createSuggestion(input: $input) {
      success
      error {
        ...SuggestionErrorInfoFields
      }
      suggestion {
        ...SuggestionFields
      }
      creationMessage
      notificationMessage
    }
  }
`;

export const UPDATE_SUGGESTION = gql`
  ${SUGGESTION_ERROR_INFO_FIELDS}
  ${SUGGESTION_FIELDS}
  mutation UpdateSuggestion($input: UpdateSuggestionInput!) {
    updateSuggestion(input: $input) {
      success
      error {
        ...SuggestionErrorInfoFields
      }
      suggestion {
        ...SuggestionFields
      }
      updateMessage
      notificationSent
    }
  }
`;

export const UPDATE_SUGGESTION_STATUS = gql`
  ${SUGGESTION_ERROR_INFO_FIELDS}
  ${SUGGESTION_FIELDS}
  mutation UpdateSuggestionStatus($input: UpdateSuggestionStatusInput!) {
    updateSuggestionStatus(input: $input) {
      success
      error {
        ...SuggestionErrorInfoFields
      }
      suggestion {
        ...SuggestionFields
      }
      updateMessage
      notificationSent
    }
  }
`;

export const DELETE_SUGGESTION = gql`
  mutation DeleteSuggestion($id: Int!) {
    deleteSuggestion(id: $id)
  }
`;

export const DELETE_SUGGESTIONS = gql`
  mutation DeleteSuggestions($ids: [Int!]!) {
    deleteSuggestions(ids: $ids)
  }
`;
