import { gql } from '@apollo/client';

// ─── Fragments ────────────────────────────────────────────────────────────────

export const JOB_POSTING_FIELDS = gql`
  fragment JobPostingFields on JobPosting {
    id
    title
    department
    description
    requirements
    preferredQualifications
    benefits
    employmentType
    jobPostingStatus
    salaryMin
    salaryMax
    salaryNote
    location
    isRemote
    startDate
    endDate
    headcount
    tags
    viewCount
    isActive
    createdById
    updatedById
    applicationCount
    createdAt
    updatedAt
    deletedAt
  }
`;

export const APPLICANT_CAREER_FIELDS = gql`
  fragment ApplicantCareerFields on ApplicantCareer {
    id
    profileId
    companyName
    employmentType
    startDate
    endDate
    isCurrent
    department
    position
    jobDescription
    leavingReason
    leavingReasonDetail
    createdAt
    updatedAt
  }
`;

export const APPLICANT_EDUCATION_FIELDS = gql`
  fragment ApplicantEducationFields on ApplicantEducation {
    id
    profileId
    educationLevel
    schoolName
    major
    graduationStatus
    startDate
    endDate
    gpa
    gpaMax
    createdAt
    updatedAt
  }
`;

export const APPLICANT_CERTIFICATE_FIELDS = gql`
  fragment ApplicantCertificateFields on ApplicantCertificate {
    id
    profileId
    name
    grade
    acquiredDate
    registrationNo
    issuingOrg
    createdAt
    updatedAt
  }
`;

export const APPLICANT_COVER_LETTER_FIELDS = gql`
  fragment ApplicantCoverLetterFields on ApplicantCoverLetter {
    id
    profileId
    questionNo
    question
    answer
    createdAt
    updatedAt
  }
`;

export const APPLICANT_TREATMENT_FIELDS = gql`
  fragment ApplicantTreatmentFields on ApplicantTreatment {
    id
    profileId
    desiredPosition
    desiredSalary
    currentSalary
    createdAt
    updatedAt
  }
`;

export const APPLICANT_REFERRER_FIELDS = gql`
  fragment ApplicantReferrerFields on ApplicantReferrer {
    id
    profileId
    name
    affiliation
    relation
    createdAt
    updatedAt
  }
`;

export const APPLICANT_MILITARY_FIELDS = gql`
  fragment ApplicantMilitaryFields on ApplicantMilitary {
    id
    profileId
    hasServed
    exemptionReason
    branch
    rank
    startDate
    endDate
    isVeteranBenefit
    veteranRelation
    createdAt
    updatedAt
  }
`;

export const APPLICANT_FILE_REF_FIELDS = gql`
  fragment ApplicantFileRefFields on ApplicantFileRef {
    id
    profileId
    fileType
    fileUrl
    fileName
    fileSize
    mimeType
    createdAt
    updatedAt
  }
`;

export const APPLICANT_PROFILE_FIELDS = gql`
  ${APPLICANT_CAREER_FIELDS}
  ${APPLICANT_EDUCATION_FIELDS}
  ${APPLICANT_CERTIFICATE_FIELDS}
  ${APPLICANT_COVER_LETTER_FIELDS}
  ${APPLICANT_TREATMENT_FIELDS}
  ${APPLICANT_REFERRER_FIELDS}
  ${APPLICANT_MILITARY_FIELDS}
  ${APPLICANT_FILE_REF_FIELDS}
  fragment ApplicantProfileFields on ApplicantProfile {
    id
    applicationId
    userId
    availableStartDate
    applicationChannel
    applicationChannelDetail
    privacyAgreed
    privacyAgreedAt
    createdAt
    updatedAt
    deletedAt
    careers {
      ...ApplicantCareerFields
    }
    educations {
      ...ApplicantEducationFields
    }
    certificates {
      ...ApplicantCertificateFields
    }
    coverLetters {
      ...ApplicantCoverLetterFields
    }
    treatment {
      ...ApplicantTreatmentFields
    }
    referrer {
      ...ApplicantReferrerFields
    }
    military {
      ...ApplicantMilitaryFields
    }
    files {
      ...ApplicantFileRefFields
    }
  }
`;

export const JOB_APPLICATION_STATUS_HISTORY_FIELDS = gql`
  fragment JobApplicationStatusHistoryFields on JobApplicationStatusHistory {
    id
    applicationId
    fromStatus
    toStatus
    reason
    changedById
    createdAt
    updatedAt
  }
`;

export const JOB_APPLICATION_FIELDS = gql`
  ${JOB_POSTING_FIELDS}
  ${APPLICANT_PROFILE_FIELDS}
  ${JOB_APPLICATION_STATUS_HISTORY_FIELDS}
  fragment JobApplicationFields on JobApplication {
    id
    jobPostingId
    applicantId
    jobApplicationStatus
    statusNote
    reviewedAt
    reviewedById
    createdAt
    updatedAt
    deletedAt
    jobPosting {
      ...JobPostingFields
    }
    profile {
      ...ApplicantProfileFields
    }
    statusHistories {
      ...JobApplicationStatusHistoryFields
    }
  }
`;

export const PAGINATION_META_FIELDS = gql`
  fragment PaginationMetaFields on PaginationMeta {
    page
    limit
    total
    totalPages
    hasPreviousPage
    hasNextPage
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

export const LIST_JOB_POSTINGS = gql`
  ${JOB_POSTING_FIELDS}
  query ListJobPostings($onlyOpen: Boolean! = true) {
    listJobPostings(onlyOpen: $onlyOpen) {
      ...JobPostingFields
    }
  }
`;

export const GET_JOB_POSTING = gql`
  ${JOB_POSTING_FIELDS}
  query GetJobPosting($id: Int!) {
    getJobPosting(id: $id) {
      ...JobPostingFields
    }
  }
`;

export const GET_MY_APPLICATIONS = gql`
  ${JOB_APPLICATION_FIELDS}
  query GetMyApplications {
    getMyApplications {
      ...JobApplicationFields
    }
  }
`;

export const GET_APPLICATION_BY_ID = gql`
  ${JOB_APPLICATION_FIELDS}
  query GetApplicationById($id: Int!) {
    getApplicationById(id: $id) {
      ...JobApplicationFields
    }
  }
`;

export const GET_APPLICANT_PROFILE = gql`
  ${APPLICANT_PROFILE_FIELDS}
  query GetApplicantProfile($applicationId: Int!) {
    getApplicantProfile(applicationId: $applicationId) {
      ...ApplicantProfileFields
    }
  }
`;

export const LIST_APPLICATIONS_BY_POSTING = gql`
  ${JOB_APPLICATION_FIELDS}
  query ListApplicationsByPosting($jobPostingId: Int!) {
    listApplicationsByPosting(jobPostingId: $jobPostingId) {
      ...JobApplicationFields
    }
  }
`;

export const LIST_ALL_APPLICATIONS = gql`
  ${JOB_APPLICATION_FIELDS}
  ${PAGINATION_META_FIELDS}
  query ListAllApplications(
    $filter: ListAllApplicationsFilter
    $pagination: PaginationInput
  ) {
    listAllApplications(filter: $filter, pagination: $pagination) {
      applications {
        ...JobApplicationFields
      }
      meta {
        ...PaginationMetaFields
      }
    }
  }
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

export const CREATE_JOB_POSTING = gql`
  ${JOB_POSTING_FIELDS}
  mutation CreateJobPosting($input: CreateJobPostingInput!) {
    createJobPosting(input: $input) {
      success
      message
      jobPosting {
        ...JobPostingFields
      }
    }
  }
`;

export const UPDATE_JOB_POSTING = gql`
  ${JOB_POSTING_FIELDS}
  mutation UpdateJobPosting($input: UpdateJobPostingInput!) {
    updateJobPosting(input: $input) {
      success
      message
      jobPosting {
        ...JobPostingFields
      }
    }
  }
`;

export const DELETE_JOB_POSTING = gql`
  mutation DeleteJobPosting($id: Int!) {
    deleteJobPosting(id: $id) {
      success
      jobPostingId
      message
    }
  }
`;

export const DELETE_JOB_POSTINGS = gql`
  mutation DeleteJobPostings($input: DeleteJobPostingsInput!) {
    deleteJobPostings(input: $input) {
      success
      deletedCount
      deletedIds
      message
    }
  }
`;

export const SUBMIT_JOB_APPLICATION = gql`
  ${JOB_APPLICATION_FIELDS}
  mutation SubmitJobApplication($input: SubmitJobApplicationInput!) {
    submitJobApplication(input: $input) {
      success
      message
      application {
        ...JobApplicationFields
      }
    }
  }
`;

export const UPDATE_APPLICATION_STATUS = gql`
  ${JOB_APPLICATION_FIELDS}
  mutation UpdateApplicationStatus($input: UpdateApplicationStatusInput!) {
    updateApplicationStatus(input: $input) {
      success
      message
      application {
        ...JobApplicationFields
      }
    }
  }
`;

export const DELETE_JOB_APPLICATION = gql`
  mutation DeleteJobApplication($input: DeleteJobApplicationInput!) {
    deleteJobApplication(input: $input) {
      success
      applicationId
      message
    }
  }
`;

export const DELETE_JOB_APPLICATIONS = gql`
  mutation DeleteJobApplications($input: DeleteJobApplicationsInput!) {
    deleteJobApplications(input: $input) {
      success
      deletedCount
      deletedIds
      message
    }
  }
`;

export const UPDATE_JOB_APPLICATION = gql`
  ${JOB_APPLICATION_FIELDS}
  mutation UpdateJobApplication($input: UpdateJobApplicationInput!) {
    updateJobApplication(input: $input) {
      success
      message
      application {
        ...JobApplicationFields
      }
    }
  }
`;
