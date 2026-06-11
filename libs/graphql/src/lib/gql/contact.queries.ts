import { gql } from '@apollo/client';

// ─── Fragments ───────────────────────────────────────────────────────────────

export const CONTACT_ERROR_INFO_FIELDS = gql`
  fragment ContactErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const CONTACT_REPLY_FIELDS = gql`
  fragment ContactReplyFields on ContactReply {
    id
    contactId
    authorId
    authorType
    authorName
    message
    attachments
    isInternal
    notified
    notifiedAt
    createdAt
    updatedAt
    deletedAt
  }
`;

export const CONTACT_FIELDS = gql`
  ${CONTACT_REPLY_FIELDS}
  fragment ContactFields on Contact {
    id
    name
    email
    phone
    userId
    contactUserType
    category
    subject
    message
    agreedToTerms
    status
    assignedTo
    assignedAt
    resolvedAt
    closedAt
    adminNote
    ipAddress
    sourceApp
    createdAt
    updatedAt
    deletedAt
    replies {
      ...ContactReplyFields
    }
  }
`;

export const SUBMIT_CONTACT_OUTPUT_FIELDS = gql`
  ${CONTACT_ERROR_INFO_FIELDS}
  ${CONTACT_FIELDS}
  fragment SubmitContactOutputFields on SubmitContactOutput {
    success
    message
    error {
      ...ContactErrorInfoFields
    }
    contact {
      ...ContactFields
    }
  }
`;

export const GET_CONTACTS_OUTPUT_FIELDS = gql`
  ${CONTACT_ERROR_INFO_FIELDS}
  ${CONTACT_FIELDS}
  fragment GetContactsOutputFields on GetContactsOutput {
    success
    error {
      ...ContactErrorInfoFields
    }
    contacts {
      ...ContactFields
    }
    totalCount
    hasNextPage
  }
`;

// ─── Queries ─────────────────────────────────────────────────────────────────

export const GET_CONTACT = gql`
  ${CONTACT_FIELDS}
  ${CONTACT_ERROR_INFO_FIELDS}
  query GetContact($contactId: String!) {
    getContact(contactId: $contactId) {
      success
      message
      error {
        ...ContactErrorInfoFields
      }
      contact {
        ...ContactFields
      }
    }
  }
`;

export const GET_MY_CONTACTS = gql`
  ${GET_CONTACTS_OUTPUT_FIELDS}
  query MyContacts($limit: Int, $offset: Int) {
    myContacts(limit: $limit, offset: $offset) {
      ...GetContactsOutputFields
    }
  }
`;

export const ADMIN_CONTACTS = gql`
  ${GET_CONTACTS_OUTPUT_FIELDS}
  query AdminContacts($input: GetContactsInput) {
    adminContacts(input: $input) {
      ...GetContactsOutputFields
    }
  }
`;

export const CONTACT_STATS = gql`
  ${CONTACT_ERROR_INFO_FIELDS}
  query ContactStats {
    contactStats {
      success
      error {
        ...ContactErrorInfoFields
      }
      total
      pending
      inProgress
      resolved
      closed
      todayCount
      thisWeekCount
      thisMonthCount
      memberCount
      guestCount
      resolvedRate
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const SUBMIT_CONTACT = gql`
  ${SUBMIT_CONTACT_OUTPUT_FIELDS}
  mutation SubmitContact($input: SubmitContactInput!) {
    submitContact(input: $input) {
      ...SubmitContactOutputFields
    }
  }
`;

export const SUBMIT_CONTACT_REPLY = gql`
  ${CONTACT_REPLY_FIELDS}
  ${CONTACT_ERROR_INFO_FIELDS}
  mutation SubmitContactReply($input: SubmitContactReplyInput!) {
    submitContactReply(input: $input) {
      success
      message
      error {
        ...ContactErrorInfoFields
      }
      reply {
        ...ContactReplyFields
      }
    }
  }
`;

export const UPDATE_CONTACT = gql`
  ${CONTACT_FIELDS}
  ${CONTACT_ERROR_INFO_FIELDS}
  mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
      success
      message
      error {
        ...ContactErrorInfoFields
      }
      contact {
        ...ContactFields
      }
    }
  }
`;

export const UPDATE_CONTACT_STATUS = gql`
  ${CONTACT_FIELDS}
  ${CONTACT_ERROR_INFO_FIELDS}
  mutation UpdateContactStatus($input: UpdateContactStatusInput!) {
    updateContactStatus(input: $input) {
      success
      message
      error {
        ...ContactErrorInfoFields
      }
      contact {
        ...ContactFields
      }
    }
  }
`;

export const DELETE_CONTACT = gql`
  ${CONTACT_ERROR_INFO_FIELDS}
  mutation DeleteContact($input: DeleteContactInput!) {
    deleteContact(input: $input) {
      success
      message
      contactId
      error {
        ...ContactErrorInfoFields
      }
    }
  }
`;

export const BULK_DELETE_CONTACTS = gql`
  ${CONTACT_ERROR_INFO_FIELDS}
  mutation BulkDeleteContacts($input: BulkDeleteContactInput!) {
    bulkDeleteContacts(input: $input) {
      success
      message
      deletedIds
      deletedCount
      error {
        ...ContactErrorInfoFields
      }
    }
  }
`;

export const UPDATE_CONTACT_REPLY = gql`
  ${CONTACT_REPLY_FIELDS}
  ${CONTACT_ERROR_INFO_FIELDS}
  mutation UpdateContactReply($input: UpdateContactReplyInput!) {
    updateContactReply(input: $input) {
      success
      message
      error {
        ...ContactErrorInfoFields
      }
      reply {
        ...ContactReplyFields
      }
    }
  }
`;

export const DELETE_CONTACT_REPLY = gql`
  ${CONTACT_ERROR_INFO_FIELDS}
  mutation DeleteContactReply($input: DeleteContactReplyInput!) {
    deleteContactReply(input: $input) {
      success
      message
      replyId
      error {
        ...ContactErrorInfoFields
      }
    }
  }
`;
