import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  LIST_JOB_POSTINGS,
  GET_JOB_POSTING,
  CREATE_JOB_POSTING,
  UPDATE_JOB_POSTING,
  DELETE_JOB_POSTING,
  SUBMIT_JOB_APPLICATION,
  UPDATE_APPLICATION_STATUS,
  GET_MY_APPLICATIONS,
  LIST_APPLICATIONS_BY_POSTING,
  GET_APPLICATION_BY_ID,
  GET_APPLICANT_PROFILE,
  LIST_ALL_APPLICATIONS,
  DELETE_JOB_POSTINGS,
  DELETE_JOB_APPLICATION,
  DELETE_JOB_APPLICATIONS,
  UPDATE_JOB_APPLICATION,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors';
import type {
  ApiResponse,
  IJobsService,
  JobPosting,
  JobApplication,
  CreateJobPostingInput,
  CreateJobPostingOutput,
  UpdateJobPostingInput,
  UpdateJobPostingOutput,
  SubmitJobApplicationInput,
  SubmitJobApplicationOutput,
  UpdateApplicationStatusInput,
  UpdateApplicationStatusOutput,
  ApplicantProfile,
  ListAllApplicationsOutput,
  DeleteJobPostingOutput,
  DeleteJobPostingsOutput,
  DeleteJobApplicationOutput,
  DeleteJobApplicationsOutput,
  DeleteJobPostingsInput,
  ListAllApplicationsFilter,
  PaginationInput,
  DeleteJobApplicationInput,
  DeleteJobApplicationsInput,
  UpdateJobApplicationInput,
  UpdateJobApplicationOutput,
} from '../types';

// ─── GQL 응답 래퍼 타입 ───────────────────────────────────────────────────────

interface ListJobPostingsQuery {
  listJobPostings: JobPosting[];
}
interface GetJobPostingQuery {
  getJobPosting: JobPosting | null;
}
interface GetMyApplicationsQuery {
  getMyApplications: JobApplication[];
}
interface ListApplicationsByPostingQuery {
  listApplicationsByPosting: JobApplication[];
}
interface ListAllApplicationsQuery {
  listAllApplications: ListAllApplicationsOutput;
}
interface GetApplicationByIdQuery {
  getApplicationById: JobApplication | null;
}
interface GetApplicantProfileQuery {
  getApplicantProfile: ApplicantProfile | null;
}
interface CreateJobPostingMutation {
  createJobPosting: CreateJobPostingOutput;
}
interface UpdateJobPostingMutation {
  updateJobPosting: UpdateJobPostingOutput;
}
interface UpdateJobApplicationMutation {
  updateJobApplication: UpdateJobApplicationOutput;
}
interface DeleteJobPostingMutation {
  deleteJobPosting: DeleteJobPostingOutput;
}
interface DeleteJobPostingsMutation {
  deleteJobPostings: DeleteJobPostingsOutput;
}
interface SubmitJobApplicationMutation {
  submitJobApplication: SubmitJobApplicationOutput;
}
interface UpdateApplicationStatusMutation {
  updateApplicationStatus: UpdateApplicationStatusOutput;
}
interface DeleteJobApplicationMutation {
  deleteJobApplication: DeleteJobApplicationOutput;
}
interface DeleteJobApplicationsMutation {
  deleteJobApplications: DeleteJobApplicationsOutput;
}

export class JobsService implements IJobsService {
  constructor(private client: ApolloClient) {}

  // ─── 공통 helpers ──────────────────────────────────────────────────────────

  private async mutate<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(mutation: any, variables: TVars): Promise<ApiResponse<TData>> {
    try {
      const { data, error, extensions } = await this.client.mutate<
        TData,
        TVars
      >({
        mutation,
        variables,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });
      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: (extensions ?? {}) as Record<string, unknown>,
        };
        return createErrorResponse(apiErrorFromGraphQLErrors([gqlError]));
      }
      return { success: true, data: data as TData };
    } catch (e) {
      return createErrorResponse(
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e)
      );
    }
  }

  private async query<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(
    query: any,
    variables?: TVars,
    fetchPolicy: 'network-only' | 'cache-first' = 'network-only'
  ): Promise<ApiResponse<TData>> {
    try {
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy,
      } as any);
      const { data, error, extensions } = result as {
        data?: TData;
        error?: { message?: string };
        extensions?: Record<string, unknown>;
      };
      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: extensions ?? {},
        };
        return createErrorResponse(apiErrorFromGraphQLErrors([gqlError]));
      }
      return { success: true, data: data as TData };
    } catch (e) {
      return createErrorResponse(
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e)
      );
    }
  }

  // ─── Public Queries ────────────────────────────────────────────────────────

  async listJobPostings(onlyOpen = true): Promise<ApiResponse<JobPosting[]>> {
    const res = await this.query<ListJobPostingsQuery>(
      LIST_JOB_POSTINGS,
      { onlyOpen },
      'network-only'
    );
    if (res.success && res.data?.listJobPostings) {
      return { success: true, data: res.data.listJobPostings };
    }
    return res as unknown as ApiResponse<JobPosting[]>;
  }

  async getJobPosting(id: number): Promise<ApiResponse<JobPosting | null>> {
    const res = await this.query<GetJobPostingQuery>(
      GET_JOB_POSTING,
      { id },
      'cache-first'
    );
    if (res.success) {
      return { success: true, data: res.data?.getJobPosting ?? null };
    }
    return res as unknown as ApiResponse<JobPosting | null>;
  }

  async getMyApplications(): Promise<ApiResponse<JobApplication[]>> {
    const res = await this.query<GetMyApplicationsQuery>(
      GET_MY_APPLICATIONS,
      undefined,
      'network-only'
    );
    if (res.success && res.data?.getMyApplications) {
      return { success: true, data: res.data.getMyApplications };
    }
    return res as unknown as ApiResponse<JobApplication[]>;
  }

  async getApplicationById(
    id: number
  ): Promise<ApiResponse<JobApplication | null>> {
    const res = await this.query<GetApplicationByIdQuery>(
      GET_APPLICATION_BY_ID,
      { id },
      'network-only'
    );
    if (res.success) {
      return { success: true, data: res.data?.getApplicationById ?? null };
    }
    return res as unknown as ApiResponse<JobApplication | null>;
  }

  async getApplicantProfile(
    applicationId: number
  ): Promise<ApiResponse<ApplicantProfile | null>> {
    const res = await this.query<GetApplicantProfileQuery>(
      GET_APPLICANT_PROFILE,
      { applicationId },
      'network-only'
    );
    if (res.success) {
      return { success: true, data: res.data?.getApplicantProfile ?? null };
    }
    return res as unknown as ApiResponse<ApplicantProfile | null>;
  }

  // ─── Admin Queries ─────────────────────────────────────────────────────────

  async listApplicationsByPosting(
    jobPostingId: number
  ): Promise<ApiResponse<JobApplication[]>> {
    const res = await this.query<
      ListApplicationsByPostingQuery,
      { jobPostingId: number }
    >(LIST_APPLICATIONS_BY_POSTING, { jobPostingId }, 'network-only');
    if (res.success && res.data?.listApplicationsByPosting) {
      return { success: true, data: res.data.listApplicationsByPosting };
    }
    return res as unknown as ApiResponse<JobApplication[]>;
  }

  async listAllApplications(
    filter?: ListAllApplicationsFilter,
    pagination?: PaginationInput
  ): Promise<ApiResponse<ListAllApplicationsOutput>> {
    const res = await this.query<
      ListAllApplicationsQuery,
      { filter?: ListAllApplicationsFilter; pagination?: PaginationInput }
    >(LIST_ALL_APPLICATIONS, { filter, pagination }, 'network-only');
    if (res.success && res.data?.listAllApplications) {
      return { success: true, data: res.data.listAllApplications };
    }
    return res as unknown as ApiResponse<ListAllApplicationsOutput>;
  }

  // ─── Public Mutations ──────────────────────────────────────────────────────

  async submitJobApplication(
    input: SubmitJobApplicationInput
  ): Promise<ApiResponse<SubmitJobApplicationOutput>> {
    const res = await this.mutate<
      SubmitJobApplicationMutation,
      { input: SubmitJobApplicationInput }
    >(SUBMIT_JOB_APPLICATION, { input });
    if (res.success && res.data?.submitJobApplication) {
      return { success: true, data: res.data.submitJobApplication };
    }
    return res as unknown as ApiResponse<SubmitJobApplicationOutput>;
  }

  // ─── Admin Mutations ───────────────────────────────────────────────────────

  async createJobPosting(
    input: CreateJobPostingInput
  ): Promise<ApiResponse<CreateJobPostingOutput>> {
    const res = await this.mutate<
      CreateJobPostingMutation,
      { input: CreateJobPostingInput }
    >(CREATE_JOB_POSTING, { input });
    if (res.success && res.data?.createJobPosting) {
      return { success: true, data: res.data.createJobPosting };
    }
    return res as unknown as ApiResponse<CreateJobPostingOutput>;
  }

  async updateJobPosting(
    input: UpdateJobPostingInput
  ): Promise<ApiResponse<UpdateJobPostingOutput>> {
    const res = await this.mutate<
      UpdateJobPostingMutation,
      { input: UpdateJobPostingInput }
    >(UPDATE_JOB_POSTING, { input });
    if (res.success && res.data?.updateJobPosting) {
      return { success: true, data: res.data.updateJobPosting };
    }
    return res as unknown as ApiResponse<UpdateJobPostingOutput>;
  }

  async deleteJobPosting(
    id: number
  ): Promise<ApiResponse<DeleteJobPostingOutput>> {
    const res = await this.mutate<DeleteJobPostingMutation, { id: number }>(
      DELETE_JOB_POSTING,
      { id }
    );
    if (res.success && res.data?.deleteJobPosting) {
      return { success: true, data: res.data.deleteJobPosting };
    }
    return res as unknown as ApiResponse<DeleteJobPostingOutput>;
  }

  async deleteJobPostings(
    input: DeleteJobPostingsInput
  ): Promise<ApiResponse<DeleteJobPostingsOutput>> {
    const res = await this.mutate<
      DeleteJobPostingsMutation,
      { input: DeleteJobPostingsInput }
    >(DELETE_JOB_POSTINGS, { input });
    if (res.success && res.data?.deleteJobPostings) {
      return { success: true, data: res.data.deleteJobPostings };
    }
    return res as unknown as ApiResponse<DeleteJobPostingsOutput>;
  }

  async updateApplicationStatus(
    input: UpdateApplicationStatusInput
  ): Promise<ApiResponse<UpdateApplicationStatusOutput>> {
    const res = await this.mutate<
      UpdateApplicationStatusMutation,
      { input: UpdateApplicationStatusInput }
    >(UPDATE_APPLICATION_STATUS, { input });
    if (res.success && res.data?.updateApplicationStatus) {
      return { success: true, data: res.data.updateApplicationStatus };
    }
    return res as unknown as ApiResponse<UpdateApplicationStatusOutput>;
  }

  async updateJobApplication(
    input: UpdateJobApplicationInput
  ): Promise<ApiResponse<UpdateJobApplicationOutput>> {
    const res = await this.mutate<
      UpdateJobApplicationMutation,
      { input: UpdateJobApplicationInput }
    >(UPDATE_JOB_APPLICATION, { input });
    if (res.success && res.data?.updateJobApplication) {
      return { success: true, data: res.data.updateJobApplication };
    }
    return res as unknown as ApiResponse<UpdateJobApplicationOutput>;
  }

  async deleteJobApplication(
    input: DeleteJobApplicationInput
  ): Promise<ApiResponse<DeleteJobApplicationOutput>> {
    const res = await this.mutate<
      DeleteJobApplicationMutation,
      { input: DeleteJobApplicationInput }
    >(DELETE_JOB_APPLICATION, { input });
    if (res.success && res.data?.deleteJobApplication) {
      return { success: true, data: res.data.deleteJobApplication };
    }
    return res as unknown as ApiResponse<DeleteJobApplicationOutput>;
  }

  async deleteJobApplications(
    input: DeleteJobApplicationsInput
  ): Promise<ApiResponse<DeleteJobApplicationsOutput>> {
    const res = await this.mutate<
      DeleteJobApplicationsMutation,
      { input: DeleteJobApplicationsInput }
    >(DELETE_JOB_APPLICATIONS, { input });
    if (res.success && res.data?.deleteJobApplications) {
      return { success: true, data: res.data.deleteJobApplications };
    }
    return res as unknown as ApiResponse<DeleteJobApplicationsOutput>;
  }
}
