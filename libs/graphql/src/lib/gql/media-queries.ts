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
  }
`;

export const FILE_WITH_URL_FIELDS = gql`
  fragment FileWithUrlFields on FileWithUrl {
    id
    originalName
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

// 단일 파일 조회
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

// 사용자 파일 목록 조회
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

// 파일 시스템 통계 정보 조회 (관리자용, 문자열 반환)
export const GET_FILE_STATS = gql`
  query GetFileStats {
    getFileStats
  }
`;

// 파일 검색 (서버에서 JSON/string으로 반환)
export const SEARCH_FILES = gql`
  query SearchFiles(
    $fileName: String
    $fileType: String
    $usageType: String
    $limit: Float
    $offset: Float
  ) {
    searchFiles(
      fileName: $fileName
      fileType: $fileType
      usageType: $usageType
      limit: $limit
      offset: $offset
    )
  }
`;

// ===== Mutations =====

// 파일 삭제
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

// 파일 정보 수정
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
      }
      error {
        ...MediaErrorInfoFields
      }
    }
  }
`;
