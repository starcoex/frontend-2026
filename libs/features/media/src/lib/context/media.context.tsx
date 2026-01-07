import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import type { FileWithUrl } from '@starcoex-frontend/graphql';

export interface PaginationState {
  totalCount: number;
  hasNext: boolean;
  limit: number;
  offset: number;
}

export interface MediaState {
  files: FileWithUrl[];
  pagination: PaginationState;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

interface MediaContextValue extends MediaState {
  setFiles: (files: FileWithUrl[]) => void;
  addFiles: (files: FileWithUrl[]) => void; // 목록 추가 (infinite scroll 등)
  removeFile: (fileId: string) => void;
  updateFileInList: (fileId: string, updates: Partial<FileWithUrl>) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (message: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const MediaContext = createContext<MediaContextValue | undefined>(undefined);

export const MediaProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<MediaState>({
    files: [],
    pagination: {
      totalCount: 0,
      hasNext: false,
      limit: 20,
      offset: 0,
    },
    isLoading: false,
    error: null,
    initialized: false,
  });

  const setFiles = useCallback((files: FileWithUrl[]) => {
    setState((prev) => ({ ...prev, files, initialized: true }));
  }, []);

  const addFiles = useCallback((newFiles: FileWithUrl[]) => {
    setState((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setState((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.id !== fileId),
      pagination: {
        ...prev.pagination,
        totalCount: Math.max(0, prev.pagination.totalCount - 1),
      },
    }));
  }, []);

  // ✅ [NEW] 구현
  const updateFileInList = useCallback(
    (fileId: string, updates: Partial<FileWithUrl>) => {
      setState((prev) => ({
        ...prev,
        files: prev.files.map((f) =>
          f.id === fileId ? { ...f, ...updates } : f
        ),
      }));
    },
    []
  );

  const setPagination = useCallback((pagination: Partial<PaginationState>) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, ...pagination },
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((message: string | null) => {
    setState((prev) => ({ ...prev, error: message, isLoading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      files: [],
      pagination: { totalCount: 0, hasNext: false, limit: 20, offset: 0 },
      isLoading: false,
      error: null,
      initialized: false,
    });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setFiles,
      addFiles,
      removeFile,
      updateFileInList, // ✅ 추가
      setPagination,
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setFiles,
      addFiles,
      removeFile,
      updateFileInList, // ✅ 추가
      setPagination,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  return (
    <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
  );
};

export const useMediaContext = (): MediaContextValue => {
  const ctx = useContext(MediaContext);
  if (!ctx) {
    throw new Error(
      'useMediaContext는 MediaProvider 내부에서만 사용해야 합니다.'
    );
  }
  return ctx;
};
