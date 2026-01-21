import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import {
  ProductsState,
  ProductsContextValue,
  ProductFilters,
  Product,
} from '../types';
import {
  getProductsService,
  initProductsService,
  serviceRegistry,
} from '../services';
import { useApolloClient } from '@apollo/client/react';

const ProductsContext = createContext<ProductsContextValue | undefined>(
  undefined
);

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ProductsState>(initialState);
  const apolloClient = useApolloClient();
  const [serviceInitialized, setServiceInitialized] = useState(false);

  // ✅ 동기적으로 서비스 초기화
  useMemo(() => {
    if (!serviceRegistry.isServiceInitialized('products')) {
      try {
        initProductsService(apolloClient);
        console.log('✅ ProductsService initialized');
        setServiceInitialized(true);
      } catch (error) {
        console.error('❌ ProductsService initialization failed:', error);
      }
    } else {
      setServiceInitialized(true);
    }
  }, [apolloClient]);

  // =========================================================================
  // 제품 목록 불러오기
  // =========================================================================

  const loadProducts = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const service = getProductsService();
      const response = await service.listProducts();

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          products: response.data ?? [], // undefined를 빈 배열로 변환
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || '제품을 불러오지 못했습니다.',
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: '제품을 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      }));
    }
  }, []);

  // =========================================================================
  // 특정 제품 불러오기
  // =========================================================================

  const loadProductById = useCallback(async (id: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const service = getProductsService();
      const response = await service.findProductById(id);

      if (response.success && response.data) {
        setState((prev) => ({
          ...prev,
          currentProduct: response.data ?? null, // undefined를 null로 변환
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error?.message || '제품을 불러오지 못했습니다.',
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: '제품을 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      }));
    }
  }, []);

  // =========================================================================
  // 제품 관련 액션
  // =========================================================================

  const setProducts = useCallback((products: Product[]) => {
    setState((prev) => ({ ...prev, products }));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setState((prev) => ({ ...prev, products: [product, ...prev.products] }));
  }, []);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      ),
    }));
  }, []);

  const removeProduct = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== id),
    }));
  }, []);

  const setCurrentProduct = useCallback((product: Product | null) => {
    setState((prev) => ({ ...prev, currentProduct: product }));
  }, []);

  // =========================================================================
  // 필터 관련 액션
  // =========================================================================

  const setFilters = useCallback((filters: Partial<ProductFilters>) => {
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

  const value = useMemo<ProductsContextValue>(
    () => ({
      ...state,
      // 제품 관련
      setProducts,
      addProduct,
      updateProduct,
      removeProduct,
      setCurrentProduct,
      loadProducts,
      loadProductById,
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
      setProducts,
      addProduct,
      updateProduct,
      removeProduct,
      setCurrentProduct,
      loadProducts,
      loadProductById,
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
    return <div>Initializing Products Service...</div>;
  }

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = (): ProductsContextValue => {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error(
      'useProductsContext must be used within a ProductsProvider'
    );
  }
  return ctx;
};
