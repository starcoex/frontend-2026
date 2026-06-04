import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react';
import type {
  JobsState,
  JobsContextValue,
  JobPosting,
  JobApplication,
  PaginationMeta,
} from '../types';
import { useApolloClient } from '@apollo/client/react';
import { initJobsService, serviceRegistry } from '../services';

const JobsContext = createContext<JobsContextValue | undefined>(undefined);

const initialState: JobsState = {
  jobPostings: [],
  selectedJobPosting: null,
  myApplications: [],
  selectedApplication: null,
  selectedApplications: [],
  applicationsMeta: null,
  isLoading: false,
  error: null,
};

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<JobsState>(initialState);
  const apolloClient = useApolloClient();

  useLayoutEffect(() => {
    if (!serviceRegistry.isServiceInitialized('jobs')) {
      try {
        initJobsService(apolloClient);
      } catch (error) {
        console.error('❌ JobsService initialization failed:', error);
      }
    }
  }, [apolloClient]);

  // ─── 공고 Actions ──────────────────────────────────────────────────────────

  const setJobPostings = useCallback((jobPostings: JobPosting[]) => {
    setState((prev) => ({ ...prev, jobPostings }));
  }, []);

  const addJobPosting = useCallback((posting: JobPosting) => {
    setState((prev) => ({
      ...prev,
      jobPostings: [posting, ...prev.jobPostings],
    }));
  }, []);

  const updateJobPostingInState = useCallback((posting: JobPosting) => {
    setState((prev) => ({
      ...prev,
      jobPostings: prev.jobPostings.map((p) =>
        p.id === posting.id ? posting : p
      ),
      selectedJobPosting:
        prev.selectedJobPosting?.id === posting.id
          ? posting
          : prev.selectedJobPosting,
    }));
  }, []);

  const removeJobPosting = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      jobPostings: prev.jobPostings.filter((p) => p.id !== id),
      selectedJobPosting:
        prev.selectedJobPosting?.id === id ? null : prev.selectedJobPosting,
    }));
  }, []);

  const removeJobPostings = useCallback((ids: number[]) => {
    const idSet = new Set(ids);
    setState((prev) => ({
      ...prev,
      jobPostings: prev.jobPostings.filter((p) => !idSet.has(p.id)),
      selectedJobPosting:
        prev.selectedJobPosting && idSet.has(prev.selectedJobPosting.id)
          ? null
          : prev.selectedJobPosting,
    }));
  }, []);

  const setSelectedJobPosting = useCallback(
    (selectedJobPosting: JobPosting | null) => {
      setState((prev) => ({ ...prev, selectedJobPosting }));
    },
    []
  );

  // ─── 지원서 Actions ────────────────────────────────────────────────────────

  const setMyApplications = useCallback((myApplications: JobApplication[]) => {
    setState((prev) => ({ ...prev, myApplications }));
  }, []);

  const setSelectedApplication = useCallback(
    (selectedApplication: JobApplication | null) => {
      setState((prev) => ({ ...prev, selectedApplication }));
    },
    []
  );

  const setSelectedApplications = useCallback(
    (selectedApplications: JobApplication[]) => {
      setState((prev) => ({ ...prev, selectedApplications }));
    },
    []
  );

  const setApplicationsMeta = useCallback(
    (applicationsMeta: PaginationMeta | null) => {
      setState((prev) => ({ ...prev, applicationsMeta }));
    },
    []
  );

  const removeApplicationFromState = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      myApplications: prev.myApplications.filter((a) => a.id !== id),
      selectedApplications: prev.selectedApplications.filter(
        (a) => a.id !== id
      ),
      selectedApplication:
        prev.selectedApplication?.id === id ? null : prev.selectedApplication,
    }));
  }, []);

  const removeApplicationsFromState = useCallback((ids: number[]) => {
    const idSet = new Set(ids);
    setState((prev) => ({
      ...prev,
      myApplications: prev.myApplications.filter((a) => !idSet.has(a.id)),
      selectedApplications: prev.selectedApplications.filter(
        (a) => !idSet.has(a.id)
      ),
      selectedApplication:
        prev.selectedApplication && idSet.has(prev.selectedApplication.id)
          ? null
          : prev.selectedApplication,
    }));
  }, []);

  const updateApplicationInState = useCallback(
    (application: JobApplication) => {
      setState((prev) => ({
        ...prev,
        myApplications: prev.myApplications.map((a) =>
          a.id === application.id ? application : a
        ),
        selectedApplication:
          prev.selectedApplication?.id === application.id
            ? application
            : prev.selectedApplication,
        selectedApplications: prev.selectedApplications.map((a) =>
          a.id === application.id ? application : a
        ),
      }));
    },
    []
  );

  // ─── 공통 Actions ──────────────────────────────────────────────────────────

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const clearPageState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      selectedJobPosting: null,
      selectedApplication: null,
      selectedApplications: [],
      applicationsMeta: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // ─── Context Value ─────────────────────────────────────────────────────────

  const value = useMemo<JobsContextValue>(
    () => ({
      ...state,
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
      clearPageState,
      reset,
    }),
    [
      state,
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
      clearPageState,
      reset,
    ]
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobsContext = (): JobsContextValue => {
  const ctx = useContext(JobsContext);
  if (!ctx) {
    throw new Error('useJobsContext must be used within a JobsProvider');
  }
  return ctx;
};
