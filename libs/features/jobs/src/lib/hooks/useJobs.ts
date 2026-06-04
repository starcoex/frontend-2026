import { useCallback } from 'react';
import { useJobsContext } from '../context';
import { getJobsService } from '../services';
import type {
  ApiResponse,
  CreateJobPostingInput,
  CreateJobPostingOutput,
  UpdateJobPostingInput,
  UpdateJobPostingOutput,
  DeleteJobPostingOutput,
  DeleteJobPostingsInput,
  DeleteJobPostingsOutput,
  SubmitJobApplicationInput,
  SubmitJobApplicationOutput,
  UpdateApplicationStatusInput,
  UpdateApplicationStatusOutput,
  ListAllApplicationsFilter,
  ListAllApplicationsOutput,
  PaginationInput,
  JobApplication,
  ApplicantProfile,
  DeleteJobApplicationInput,
  DeleteJobApplicationOutput,
  DeleteJobApplicationsInput,
  DeleteJobApplicationsOutput,
  UpdateJobApplicationInput,
  UpdateJobApplicationOutput,
} from '../types';

export const useJobs = () => {
  const context = useJobsContext();

  const {
    setJobPostings,
    addJobPosting,
    updateJobPostingInState,
    removeJobPosting,
    removeJobPostings,
    setSelectedJobPosting,
    setMyApplications,
    setSelectedApplication,
    setSelectedApplications,
    setApplicationsMeta,
    removeApplicationFromState,
    removeApplicationsFromState,
    updateApplicationInState,
    setLoading,
    setError,
    clearError,
  } = context;

  // ─── 공통 로딩 래퍼 ────────────────────────────────────────────────────────

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        setLoading(true);
        clearError();
        const res = await operation();
        if (!res.success) {
          const msg = (res as any).error?.message ?? defaultErrorMessage;
          setError(msg);
        }
        return res;
      } catch (e) {
        console.error(e);
        setError(defaultErrorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // ─── Public Queries ────────────────────────────────────────────────────────

  const fetchJobPostings = useCallback(
    async (onlyOpen = true) =>
      withLoading(async () => {
        const res = await getJobsService().listJobPostings(onlyOpen);
        if (res.success && res.data) setJobPostings(res.data);
        return res;
      }, '채용 공고 목록을 불러오는데 실패했습니다.'),
    [withLoading, setJobPostings]
  );

  const fetchJobPosting = useCallback(
    async (id: number) =>
      withLoading(async () => {
        const res = await getJobsService().getJobPosting(id);
        if (res.success && res.data) setSelectedJobPosting(res.data);
        return res;
      }, '채용 공고를 불러오는데 실패했습니다.'),
    [withLoading, setSelectedJobPosting]
  );

  const fetchMyApplications = useCallback(
    async () =>
      withLoading(async () => {
        const res = await getJobsService().getMyApplications();
        if (res.success && res.data) setMyApplications(res.data);
        return res;
      }, '내 지원 현황을 불러오는데 실패했습니다.'),
    [withLoading, setMyApplications]
  );

  const fetchApplicationById = useCallback(
    async (id: number): Promise<ApiResponse<JobApplication | null>> =>
      withLoading(async () => {
        const res = await getJobsService().getApplicationById(id);
        if (res.success && res.data) setSelectedApplication(res.data);
        return res;
      }, '지원서를 불러오는데 실패했습니다.'),
    [withLoading, setSelectedApplication]
  );

  const fetchApplicantProfile = useCallback(
    async (
      applicationId: number
    ): Promise<ApiResponse<ApplicantProfile | null>> =>
      withLoading(
        () => getJobsService().getApplicantProfile(applicationId),
        '지원자 프로필을 불러오는데 실패했습니다.'
      ),
    [withLoading]
  );

  // ─── Admin Queries ─────────────────────────────────────────────────────────

  const fetchApplicationsByPosting = useCallback(
    async (jobPostingId: number) =>
      withLoading(async () => {
        const res = await getJobsService().listApplicationsByPosting(
          jobPostingId
        );
        if (res.success && res.data) setSelectedApplications(res.data);
        return res;
      }, '지원자 목록을 불러오는데 실패했습니다.'),
    [withLoading, setSelectedApplications]
  );

  const fetchAllApplications = useCallback(
    async (
      filter?: ListAllApplicationsFilter,
      pagination?: PaginationInput
    ): Promise<ApiResponse<ListAllApplicationsOutput>> =>
      withLoading(async () => {
        const res = await getJobsService().listAllApplications(
          filter,
          pagination
        );
        if (res.success && res.data) {
          setSelectedApplications(res.data.applications);
          setApplicationsMeta(res.data.meta);
        }
        return res;
      }, '전체 지원자 목록을 불러오는데 실패했습니다.'),
    [withLoading, setSelectedApplications, setApplicationsMeta]
  );

  // ─── Public Mutations ──────────────────────────────────────────────────────

  const submitJobApplication = useCallback(
    async (
      input: SubmitJobApplicationInput
    ): Promise<ApiResponse<SubmitJobApplicationOutput>> =>
      withLoading(
        () => getJobsService().submitJobApplication(input),
        '지원서 제출에 실패했습니다.'
      ),
    [withLoading]
  );

  // ─── Admin Mutations ───────────────────────────────────────────────────────

  const createJobPosting = useCallback(
    async (
      input: CreateJobPostingInput
    ): Promise<ApiResponse<CreateJobPostingOutput>> =>
      withLoading(async () => {
        const res = await getJobsService().createJobPosting(input);
        if (res.success && res.data?.jobPosting)
          addJobPosting(res.data.jobPosting);
        return res;
      }, '채용 공고 생성에 실패했습니다.'),
    [withLoading, addJobPosting]
  );

  const updateJobPosting = useCallback(
    async (
      input: UpdateJobPostingInput
    ): Promise<ApiResponse<UpdateJobPostingOutput>> =>
      withLoading(async () => {
        const res = await getJobsService().updateJobPosting(input);
        if (res.success && res.data?.jobPosting)
          updateJobPostingInState(res.data.jobPosting);
        return res;
      }, '채용 공고 수정에 실패했습니다.'),
    [withLoading, updateJobPostingInState]
  );

  const deleteJobPosting = useCallback(
    async (id: number): Promise<ApiResponse<DeleteJobPostingOutput>> =>
      withLoading(async () => {
        const res = await getJobsService().deleteJobPosting(id);
        if (res.success && res.data?.jobPostingId)
          removeJobPosting(res.data.jobPostingId);
        return res;
      }, '채용 공고 삭제에 실패했습니다.'),
    [withLoading, removeJobPosting]
  );

  const deleteJobPostings = useCallback(
    async (
      input: DeleteJobPostingsInput
    ): Promise<ApiResponse<DeleteJobPostingsOutput>> =>
      withLoading(async () => {
        const res = await getJobsService().deleteJobPostings(input);
        if (res.success && res.data?.deletedIds)
          removeJobPostings(res.data.deletedIds);
        return res;
      }, '채용 공고 일괄 삭제에 실패했습니다.'),
    [withLoading, removeJobPostings]
  );

  const updateApplicationStatus = useCallback(
    async (
      input: UpdateApplicationStatusInput
    ): Promise<ApiResponse<UpdateApplicationStatusOutput>> =>
      withLoading(async () => {
        const res = await getJobsService().updateApplicationStatus(input);
        if (res.success && res.data?.application) {
          updateApplicationInState(res.data.application);
        }
        return res;
      }, '지원서 상태 변경에 실패했습니다.'),
    [withLoading, updateApplicationInState]
  );

  const updateJobApplication = useCallback(
    async (
      input: UpdateJobApplicationInput
    ): Promise<ApiResponse<UpdateJobApplicationOutput>> =>
      withLoading(async () => {
        const res = await getJobsService().updateJobApplication(input);
        if (res.success && res.data?.application) {
          updateApplicationInState(res.data.application);
        }
        return res;
      }, '지원서 수정에 실패했습니다.'),
    [withLoading, updateApplicationInState]
  );

  const deleteJobApplication = useCallback(
    async (
      input: DeleteJobApplicationInput
    ): Promise<ApiResponse<DeleteJobApplicationOutput>> =>
      withLoading(async () => {
        const res = await getJobsService().deleteJobApplication(input);
        if (res.success && res.data?.applicationId)
          removeApplicationFromState(res.data.applicationId);
        return res;
      }, '지원서 삭제에 실패했습니다.'),
    [withLoading, removeApplicationFromState]
  );

  const deleteJobApplications = useCallback(
    async (
      input: DeleteJobApplicationsInput
    ): Promise<ApiResponse<DeleteJobApplicationsOutput>> =>
      withLoading(async () => {
        const res = await getJobsService().deleteJobApplications(input);
        if (res.success && res.data?.deletedIds)
          removeApplicationsFromState(res.data.deletedIds);
        return res;
      }, '지원서 일괄 삭제에 실패했습니다.'),
    [withLoading, removeApplicationsFromState]
  );

  // ─── 유틸리티 ──────────────────────────────────────────────────────────────

  const getDday = useCallback((endDate: string | null | undefined): string => {
    if (!endDate) return '상시';
    const diff = Math.ceil(
      (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (diff < 0) return '마감';
    if (diff === 0) return 'D-day';
    return `D-${diff}`;
  }, []);

  const openPostings = context.jobPostings.filter(
    (p) => p.jobPostingStatus === 'OPEN' && p.isActive
  );

  return {
    ...context,
    openPostings,

    // Public Queries
    fetchJobPostings,
    fetchJobPosting,
    fetchMyApplications,
    fetchApplicationById,
    fetchApplicantProfile,

    // Admin Queries
    fetchApplicationsByPosting,
    fetchAllApplications,

    // Public Mutations
    submitJobApplication,

    // Admin Mutations
    createJobPosting,
    updateJobPosting,
    deleteJobPosting,
    deleteJobPostings,
    updateApplicationStatus,
    updateJobApplication,
    deleteJobApplication,
    deleteJobApplications,

    // Utils
    getDday,
  };
};
