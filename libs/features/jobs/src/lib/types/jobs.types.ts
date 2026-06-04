import type { ApiResponse } from '../types';

// ─── Enum 타입 ────────────────────────────────────────────────────────────────

export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'FREELANCE';

export type JobPostingStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'CANCELLED';

export type JobApplicationStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'PASSED'
  | 'REJECTED'
  | 'CANCELLED';

export type EducationLevel =
  | 'HIGH_SCHOOL'
  | 'ASSOCIATE'
  | 'BACHELOR'
  | 'MASTER'
  | 'DOCTOR';

export type GraduationStatus =
  | 'GRADUATED'
  | 'ENROLLED'
  | 'LEAVE'
  | 'DROPPED'
  | 'EXPECTED';

export type ReferrerRelation =
  | 'COLLEAGUE'
  | 'SENIOR'
  | 'PROFESSOR'
  | 'ACQUAINTANCE'
  | 'OTHER';

export type MilitaryExemptionReason = 'NONE' | 'PHYSICAL' | 'FAMILY' | 'OTHER';

export type MilitaryBranch =
  | 'ARMY'
  | 'NAVY'
  | 'AIR_FORCE'
  | 'MARINES'
  | 'PUBLIC'
  | 'NOT_SERVED';

export type ApplicantFileType =
  | 'PROFILE_IMAGE'
  | 'ATTACHMENT'
  | 'VETERAN_CERTIFICATE';

export type ApplicationChannel =
  | 'WEBSITE'
  | 'JOBKOREA'
  | 'SARAMIN'
  | 'LINKEDIN'
  | 'RECRUIT'
  | 'OTHER';

// ─── 서브 엔티티 타입 ──────────────────────────────────────────────────────────

export interface ApplicantCareer {
  id: number;
  profileId: number;
  companyName: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  department?: string | null;
  position?: string | null;
  jobDescription?: string | null;
  leavingReason?: string | null;
  leavingReasonDetail?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ApplicantEducation {
  id: number;
  profileId: number;
  educationLevel: EducationLevel;
  schoolName: string;
  major?: string | null;
  graduationStatus: GraduationStatus;
  startDate?: string | null;
  endDate?: string | null;
  gpa?: number | null;
  gpaMax?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ApplicantCertificate {
  id: number;
  profileId: number;
  name: string;
  grade?: string | null;
  acquiredDate?: string | null;
  registrationNo?: string | null;
  issuingOrg?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ApplicantCoverLetter {
  id: number;
  profileId: number;
  questionNo: number;
  question?: string | null;
  answer?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ApplicantTreatment {
  id: number;
  profileId: number;
  desiredPosition?: string | null;
  desiredSalary?: number | null;
  currentSalary?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ApplicantReferrer {
  id: number;
  profileId: number;
  name?: string | null;
  affiliation?: string | null;
  relation?: ReferrerRelation | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ApplicantMilitary {
  id: number;
  profileId: number;
  hasServed: boolean;
  exemptionReason?: MilitaryExemptionReason | null;
  branch?: MilitaryBranch | null;
  rank?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isVeteranBenefit: boolean;
  veteranRelation?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ApplicantFileRef {
  id: number;
  profileId: number;
  fileType: ApplicantFileType;
  fileUrl: string;
  fileName?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ApplicantProfile {
  id: number;
  applicationId: number;
  userId: number;
  availableStartDate?: string | null;
  applicationChannel?: ApplicationChannel | null;
  applicationChannelDetail?: string | null;
  privacyAgreed: boolean;
  privacyAgreedAt?: string | null;
  careers?: ApplicantCareer[] | null;
  educations?: ApplicantEducation[] | null;
  certificates?: ApplicantCertificate[] | null;
  coverLetters?: ApplicantCoverLetter[] | null;
  treatment?: ApplicantTreatment | null;
  referrer?: ApplicantReferrer | null;
  military?: ApplicantMilitary | null;
  files?: ApplicantFileRef[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface JobApplicationStatusHistory {
  id: number;
  applicationId: number;
  fromStatus?: JobApplicationStatus | null;
  toStatus: JobApplicationStatus;
  reason?: string | null;
  changedById?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ─── 메인 엔티티 타입 ──────────────────────────────────────────────────────────

export interface JobPosting {
  id: number;
  title: string;
  department?: string | null;
  description: string;
  requirements?: string | null;
  preferredQualifications?: string | null;
  benefits?: string | null;
  employmentType: EmploymentType;
  jobPostingStatus: JobPostingStatus;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryNote?: string | null;
  location?: string | null;
  isRemote: boolean;
  startDate?: string | null;
  endDate?: string | null;
  headcount?: number | null;
  tags: string[];
  viewCount: number;
  isActive: boolean;
  createdById: number;
  updatedById: number;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface JobApplication {
  id: number;
  jobPostingId: number;
  applicantId?: number | null;
  jobApplicationStatus: JobApplicationStatus;
  statusNote?: string | null;
  reviewedAt?: string | null;
  reviewedById?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  jobPosting?: JobPosting | null;
  profile?: ApplicantProfile | null;
  statusHistories?: JobApplicationStatusHistory[];
}

// ─── 페이지네이션 타입 ────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

// ─── Input 타입 ───────────────────────────────────────────────────────────────

export interface CareerInput {
  companyName: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  department?: string;
  position?: string;
  jobDescription?: string;
  leavingReason?: string;
  leavingReasonDetail?: string;
}

export interface EducationInput {
  educationLevel: string;
  schoolName: string;
  major?: string;
  graduationStatus: string;
  startDate?: string;
  endDate?: string;
  gpa?: number;
  gpaMax?: number;
}

export interface CertificateInput {
  name: string;
  grade?: string;
  acquiredDate?: string;
  registrationNo?: string;
  issuingOrg?: string;
}

export interface CoverLetterInput {
  questionNo: number;
  question?: string;
  answer?: string;
}

export interface TreatmentInput {
  desiredPosition?: string;
  desiredSalary?: number;
  currentSalary?: number;
}

export interface ReferrerInput {
  name?: string;
  affiliation?: string;
  relation?: string;
}

export interface MilitaryInput {
  hasServed: boolean;
  exemptionReason?: string;
  branch?: string;
  rank?: string;
  startDate?: string;
  endDate?: string;
  isVeteranBenefit: boolean;
  veteranRelation?: string;
}

export interface FileRefInput {
  fileType: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface ListAllApplicationsFilter {
  jobPostingId?: number;
  jobApplicationStatus?: JobApplicationStatus;
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateJobPostingInput {
  title: string;
  department?: string;
  description: string;
  requirements?: string;
  preferredQualifications?: string;
  benefits?: string;
  employmentType: EmploymentType;
  jobPostingStatus: JobPostingStatus;
  salaryMin?: number;
  salaryMax?: number;
  salaryNote?: string;
  location?: string;
  isRemote: boolean;
  startDate?: string;
  endDate?: string;
  headcount?: number;
  tags: string[];
}

export interface UpdateJobPostingInput {
  id: number;
  title?: string;
  department?: string;
  description?: string;
  requirements?: string;
  preferredQualifications?: string;
  benefits?: string;
  employmentType?: EmploymentType;
  jobPostingStatus?: JobPostingStatus;
  salaryMin?: number;
  salaryMax?: number;
  salaryNote?: string;
  location?: string;
  isRemote?: boolean;
  startDate?: string;
  endDate?: string;
  headcount?: number;
  tags?: string[];
}

export interface DeleteJobPostingsInput {
  ids: number[];
}

export interface SubmitJobApplicationInput {
  jobPostingId: number;
  availableStartDate?: string;
  applicationChannel?: ApplicationChannel;
  applicationChannelDetail?: string;
  careers?: CareerInput[];
  educations: EducationInput[];
  certificates?: CertificateInput[];
  coverLetters?: CoverLetterInput[];
  treatment?: TreatmentInput;
  referrer?: ReferrerInput;
  military?: MilitaryInput;
  files?: FileRefInput[];
  privacyAgreed: boolean;
}

export interface UpdateApplicationStatusInput {
  applicationId: number;
  jobApplicationStatus: JobApplicationStatus;
  statusNote?: string;
}

export interface DeleteJobApplicationInput {
  id: number;
  reason?: string;
}

export interface DeleteJobApplicationsInput {
  ids: number[];
  reason?: string;
}

// ─── Update Application Input 타입 ───────────────────────────────────────────

export interface UpdateCareerInput {
  id?: number;
  companyName: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  department?: string;
  position?: string;
  jobDescription?: string;
  leavingReason?: string;
  leavingReasonDetail?: string;
}

export interface UpdateEducationInput {
  id?: number;
  educationLevel: string;
  schoolName: string;
  major?: string;
  graduationStatus: string;
  startDate?: string;
  endDate?: string;
  gpa?: number;
  gpaMax?: number;
}

export interface UpdateCertificateInput {
  id?: number;
  name: string;
  grade?: string;
  acquiredDate?: string;
  registrationNo?: string;
  issuingOrg?: string;
}

export interface UpdateCoverLetterInput {
  id?: number;
  questionNo: number;
  question?: string;
  answer?: string;
}

export interface UpdateTreatmentInput {
  desiredPosition?: string;
  desiredSalary?: number;
  currentSalary?: number;
}

export interface UpdateReferrerInput {
  name?: string;
  affiliation?: string;
  relation?: string;
}

export interface UpdateMilitaryInput {
  hasServed: boolean;
  exemptionReason?: string;
  branch?: string;
  rank?: string;
  startDate?: string;
  endDate?: string;
  isVeteranBenefit: boolean;
  veteranRelation?: string;
}

export interface UpdateFileRefInput {
  fileType: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface UpdateJobApplicationInput {
  applicationId: number;
  availableStartDate?: string;
  applicationChannel?: ApplicationChannel;
  applicationChannelDetail?: string;
  careers?: UpdateCareerInput[];
  educations: UpdateEducationInput[];
  certificates?: UpdateCertificateInput[];
  coverLetters?: UpdateCoverLetterInput[];
  treatment?: UpdateTreatmentInput;
  referrer?: UpdateReferrerInput;
  military?: UpdateMilitaryInput;
  files?: UpdateFileRefInput[];
}

export interface UpdateJobApplicationOutput {
  success: boolean;
  application: JobApplication;
  message?: string | null;
}

// ─── Output 타입 ──────────────────────────────────────────────────────────────

export interface CreateJobPostingOutput {
  success: boolean;
  jobPosting: JobPosting;
  message?: string | null;
}

export interface UpdateJobPostingOutput {
  success: boolean;
  jobPosting: JobPosting;
  message?: string | null;
}

export interface DeleteJobPostingOutput {
  success: boolean;
  jobPostingId: number;
  message?: string | null;
}

export interface DeleteJobPostingsOutput {
  success: boolean;
  deletedCount: number;
  deletedIds: number[];
  message?: string | null;
}

export interface SubmitJobApplicationOutput {
  success: boolean;
  application: JobApplication;
  message?: string | null;
}

export interface UpdateApplicationStatusOutput {
  success: boolean;
  application: JobApplication;
  message?: string | null;
}

export interface ListAllApplicationsOutput {
  applications: JobApplication[];
  meta: PaginationMeta;
}

export interface DeleteJobApplicationOutput {
  success: boolean;
  applicationId: number;
  message?: string | null;
}

export interface DeleteJobApplicationsOutput {
  success: boolean;
  deletedCount: number;
  deletedIds: number[];
  message?: string | null;
}

// ─── 서비스 인터페이스 ────────────────────────────────────────────────────────

export interface IJobsService {
  // Public Queries
  listJobPostings(onlyOpen?: boolean): Promise<ApiResponse<JobPosting[]>>;
  getJobPosting(id: number): Promise<ApiResponse<JobPosting | null>>;
  getMyApplications(): Promise<ApiResponse<JobApplication[]>>;
  getApplicationById(id: number): Promise<ApiResponse<JobApplication | null>>;
  getApplicantProfile(
    applicationId: number
  ): Promise<ApiResponse<ApplicantProfile | null>>;

  // Admin Queries
  listApplicationsByPosting(
    jobPostingId: number
  ): Promise<ApiResponse<JobApplication[]>>;
  listAllApplications(
    filter?: ListAllApplicationsFilter,
    pagination?: PaginationInput
  ): Promise<ApiResponse<ListAllApplicationsOutput>>;

  // Public Mutations
  submitJobApplication(
    input: SubmitJobApplicationInput
  ): Promise<ApiResponse<SubmitJobApplicationOutput>>;

  // Admin Mutations
  createJobPosting(
    input: CreateJobPostingInput
  ): Promise<ApiResponse<CreateJobPostingOutput>>;
  updateJobPosting(
    input: UpdateJobPostingInput
  ): Promise<ApiResponse<UpdateJobPostingOutput>>;
  deleteJobPosting(id: number): Promise<ApiResponse<DeleteJobPostingOutput>>;
  deleteJobPostings(
    input: DeleteJobPostingsInput
  ): Promise<ApiResponse<DeleteJobPostingsOutput>>;
  updateApplicationStatus(
    input: UpdateApplicationStatusInput
  ): Promise<ApiResponse<UpdateApplicationStatusOutput>>;
  updateJobApplication(
    input: UpdateJobApplicationInput
  ): Promise<ApiResponse<UpdateJobApplicationOutput>>;
  deleteJobApplication(
    input: DeleteJobApplicationInput
  ): Promise<ApiResponse<DeleteJobApplicationOutput>>;
  deleteJobApplications(
    input: DeleteJobApplicationsInput
  ): Promise<ApiResponse<DeleteJobApplicationsOutput>>;
}

// ─── Context 상태 타입 ────────────────────────────────────────────────────────

export interface JobsState {
  jobPostings: JobPosting[];
  selectedJobPosting: JobPosting | null;
  myApplications: JobApplication[];
  selectedApplication: JobApplication | null;
  selectedApplications: JobApplication[];
  applicationsMeta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

export interface JobsContextActions {
  setJobPostings: (postings: JobPosting[]) => void;
  addJobPosting: (posting: JobPosting) => void;
  updateJobPostingInState: (posting: JobPosting) => void;
  removeJobPosting: (id: number) => void;
  removeJobPostings: (ids: number[]) => void;
  setSelectedJobPosting: (posting: JobPosting | null) => void;
  setMyApplications: (applications: JobApplication[]) => void;
  setSelectedApplication: (application: JobApplication | null) => void;
  setSelectedApplications: (applications: JobApplication[]) => void;
  setApplicationsMeta: (meta: PaginationMeta | null) => void;
  removeApplicationFromState: (id: number) => void;
  removeApplicationsFromState: (ids: number[]) => void;
  updateApplicationInState: (application: JobApplication) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearPageState: () => void;
  reset: () => void;
}

export type JobsContextValue = JobsState & JobsContextActions;
