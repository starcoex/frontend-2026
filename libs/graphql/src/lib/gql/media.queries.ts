import { gql } from '@apollo/client';

// ===== Fragments =====

export const MEDIA_ERROR_INFO_FIELDS = gql`
  fragment MediaErrorInfoFields on ErrorInfo {
    code
    message
    details
  }
`;

export const FILE_INFO_FIELDS = gql`
  fragment FileInfoFields on File {
    id
    originalName
    key
    fileUrl
    fileSize
    mimeType
    uploadedBy
    usageType
    entityId
    extension
    fileType
    status
    thumbnailUrl
    description
  }
`;

export const FILE_WITH_URL_FIELDS = gql`
  fragment FileWithUrlFields on FileWithUrl {
    id
    originalName
    description
    fileName
    fileUrl
    fileSize
    mimeType
    extension
    usageType
    entityId
    createdAt
    updatedAt
  }
`;

// ===== Queries =====

export const GET_FILE = gql`
  ${MEDIA_ERROR_INFO_FIELDS}
  ${FILE_INFO_FIELDS}
  query GetFile($input: GetFileInput!) {
    getFile(input: $input) {
      success
      message
      fileUrl
      error {
        ...MediaErrorInfoFields
      }
      file {
        ...FileInfoFields
      }
    }
  }
`;

export const GET_USER_FILES = gql`
  ${MEDIA_ERROR_INFO_FIELDS}
  ${FILE_WITH_URL_FIELDS}
  query GetUserFiles($input: GetUserFilesInput!) {
    getUserFiles(input: $input) {
      success
      totalCount
      hasNext
      error {
        ...MediaErrorInfoFields
      }
      fileWithUrl {
        ...FileWithUrlFields
      }
    }
  }
`;

export const GET_FILE_STATS = gql`
  query GetFileStats {
    getFileStats
  }
`;

// ✅ Schema의 모든 파라미터를 지원하도록 확장
export const SEARCH_FILES = gql`
  query SearchFiles(
    $fileName: String
    $fileType: String
    $mimeType: String
    $extension: String
    $description: String
    $usageType: String
    $entityId: String
    $storageType: String
    $status: String
    $minFileSize: Float
    $maxFileSize: Float
    $startDate: String
    $endDate: String
    $hasVideoMetadata: Boolean
    $hasThumbnail: Boolean
    $orderBy: String
    $orderDir: String
    $limit: Float
    $offset: Float
  ) {
    searchFiles(
      fileName: $fileName
      fileType: $fileType
      mimeType: $mimeType
      extension: $extension
      description: $description
      usageType: $usageType
      entityId: $entityId
      storageType: $storageType
      status: $status
      minFileSize: $minFileSize
      maxFileSize: $maxFileSize
      startDate: $startDate
      endDate: $endDate
      hasVideoMetadata: $hasVideoMetadata
      hasThumbnail: $hasThumbnail
      orderBy: $orderBy
      orderDir: $orderDir
      limit: $limit
      offset: $offset
    )
  }
`;

// ===== Mutations =====

export const DELETE_FILE = gql`
  ${MEDIA_ERROR_INFO_FIELDS}
  mutation DeleteFile($input: DeleteFileInput!) {
    deleteFile(input: $input) {
      success
      deletedFileId
      deletedFileName
      message
      error {
        ...MediaErrorInfoFields
      }
    }
  }
`;

export const UPDATE_FILE = gql`
  ${MEDIA_ERROR_INFO_FIELDS}
  mutation UpdateFile($input: UpdateFileInput!) {
    updateFile(input: $input) {
      success
      message
      file {
        createdAt
        entityId
        extension
        fileName
        fileSize
        fileUrl
        id
        mimeType
        originalName
        updatedAt
        usageType
        description
      }
      error {
        ...MediaErrorInfoFields
      }
    }
  }
`;
