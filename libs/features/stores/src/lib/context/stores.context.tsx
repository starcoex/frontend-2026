import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import {
  StoresState,
  StoresContextValue,
  StoreFilters,
  Store,
  Brand,
} from '../types';
import {
  getStoresService,
  initStoresService,
  serviceRegistry,
} from '../services';
import { useApolloClient } from '@apollo/client/react';

const StoresContext = createContext<StoresContextValue | undefined>(undefined);

const initialState: StoresState = {
  stores: [],
  brands: [],
  currentStore: null,
  currentBrand: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const StoresProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StoresState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false); // ✅ 초기화 플래그

  // ✅ 동기적으로 서비스 초기화 (useEffect 전에)
  useMemo(() => {
    if (!serviceRegistry.isServiceInitialized('stores')) {
      try {
        initStoresService(apolloClient);
        console.log('✅ StoresService initialized');
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ StoresService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);
  // =========================================================================
  // 매장 목록 불러오기
  // =========================================================================

  const loadStores = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const service = getStoresService();
      const response = await service.listStores();

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          stores: response.data ?? [],
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || '매장을 불러오지 못했습니다.',
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: '매장을 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      }));
    }
  }, []);

  // =========================================================================
  // 특정 매장 불러오기
  // =========================================================================

  const loadStoreById = useCallback(async (id: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const service = getStoresService();
      const response = await service.getStoreById(id);

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          currentStore: response.data ?? null,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || '매장을 불러오지 못했습니다.',
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: '매장을 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      }));
    }
  }, []);

  // =========================================================================
  // 브랜드 목록 불러오기
  // =========================================================================

  const loadBrands = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const service = getStoresService();
      const response = await service.listBrands();

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          brands: response.data ?? [],
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || '브랜드를 불러오지 못했습니다.',
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: '브랜드를 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      }));
    }
  }, []);

  // =========================================================================
  // 특정 브랜드 불러오기
  // =========================================================================

  const loadBrandById = useCallback(async (id: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const service = getStoresService();
      const response = await service.getBrandById(id);

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          currentBrand: response.data ?? null,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || '브랜드를 불러오지 못했습니다.',
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: '브랜드를 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      }));
    }
  }, []);

  // =========================================================================
  // 매장 관련 액션
  // =========================================================================

  const setStores = useCallback((stores: Store[]) => {
    setState((prev) => ({ ...prev, stores }));
  }, []);

  const addStore = useCallback((store: Store) => {
    setState((prev) => ({ ...prev, stores: [store, ...prev.stores] }));
  }, []);

  const updateStore = useCallback((id: number, updates: Partial<Store>) => {
    setState((prev) => ({
      ...prev,
      stores: prev.stores.map((store) =>
        store.id === id ? { ...store, ...updates } : store
      ),
    }));
  }, []);

  const removeStore = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      stores: prev.stores.filter((store) => store.id !== id),
    }));
  }, []);

  const setCurrentStore = useCallback((store: Store | null) => {
    setState((prev) => ({ ...prev, currentStore: store }));
  }, []);

  // =========================================================================
  // 브랜드 관련 액션
  // =========================================================================

  const setBrands = useCallback((brands: Brand[]) => {
    setState((prev) => ({ ...prev, brands }));
  }, []);

  const addBrand = useCallback((brand: Brand) => {
    setState((prev) => ({ ...prev, brands: [brand, ...prev.brands] }));
  }, []);

  const updateBrand = useCallback((id: number, updates: Partial<Brand>) => {
    setState((prev) => ({
      ...prev,
      brands: prev.brands.map((brand) =>
        brand.id === id ? { ...brand, ...updates } : brand
      ),
    }));
  }, []);

  const removeBrand = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      brands: prev.brands.filter((brand) => brand.id !== id),
    }));
  }, []);

  const setCurrentBrand = useCallback((brand: Brand | null) => {
    setState((prev) => ({ ...prev, currentBrand: brand }));
  }, []);

  // =========================================================================
  // 필터 관련 액션
  // =========================================================================

  const setFilters = useCallback((filters: Partial<StoreFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: {} }));
  }, []);

  // =========================================================================
  // 공통 액션
  // =========================================================================

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // =========================================================================
  // Context Value
  // =========================================================================

  const value = useMemo<StoresContextValue>(
    () => ({
      ...state,
      // 매장 관련
      setStores,
      addStore,
      updateStore,
      removeStore,
      setCurrentStore,
      loadStores,
      loadStoreById,
      // 브랜드 관련
      setBrands,
      addBrand,
      updateBrand,
      removeBrand,
      setCurrentBrand,
      loadBrands,
      loadBrandById,
      // 필터 관련
      setFilters,
      clearFilters,
      // 공통
      setLoading,
      setError,
      clearError,
      reset,
    }),
    [
      state,
      setStores,
      addStore,
      updateStore,
      removeStore,
      setCurrentStore,
      loadStores,
      loadStoreById,
      setBrands,
      addBrand,
      updateBrand,
      removeBrand,
      setCurrentBrand,
      loadBrands,
      loadBrandById,
      setFilters,
      clearFilters,
      setLoading,
      setError,
      clearError,
      reset,
    ]
  );

  // ✅ 서비스 초기화 전까지는 로딩 표시
  if (!serviceInitialized) {
    return <div>Initializing Stores Service...</div>;
  }

  return (
    <StoresContext.Provider value={value}>{children}</StoresContext.Provider>
  );
};

export const useStoresContext = (): StoresContextValue => {
  const ctx = useContext(StoresContext);
  if (!ctx) {
    throw new Error('useStoresContext must be used within a StoresProvider');
  }
  return ctx;
};
