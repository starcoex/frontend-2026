import { useCallback, useRef, useMemo } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { VehiclesService } from '../services';
import { useCarCareContext } from '../context/car-care.context';
import type {
  ApiResponse,
  UpdateCarCareSurchargeInput,
  UpdateCarCareSurchargeOutput,
} from '../types';
import type {
  CarCarePrice,
  CarCareSurcharge,
  CreateCarCarePriceOutput,
  CreateCarCareSurchargeOutput,
  CreateCarCarePriceInput,
  CreateCarCareSurchargeInput,
} from '../types';

export const useCarCare = () => {
  const client = useApolloClient();
  const service = useMemo(() => new VehiclesService(client), [client]);

  const context = useCarCareContext();
  const {
    setPrices,
    addPrice,
    updatePriceInContext,
    removePrice,
    setCurrentPrice,
    setSurcharges,
    addSurcharge,
    updateSurchargeInContext,
    removeSurcharge,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    prices,
    surcharges,
    currentPrice,
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) setLoading(true);
        clearError();
        const res = await operation();
        if (!res.success) {
          setError(res.error?.message ?? defaultErrorMessage);
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

  // ── Queries ──────────────────────────────────────────────────────────────────

  const fetchCarCarePricesByStore = useCallback(
    async (storeId: number): Promise<ApiResponse<CarCarePrice[]>> =>
      withLoading(async () => {
        const res = await service.carCarePricesByStore(storeId);
        if (res.success && res.data) setPrices(res.data);
        return res;
      }, '세차 가격 목록을 불러오는데 실패했습니다.'),
    [withLoading, setPrices, service]
  );

  const fetchCarCarePriceByGrade = useCallback(
    async (
      storeId: number,
      serviceTypeCode: string,
      bodyType: string,
      sizeGrade: string
    ): Promise<ApiResponse<CarCarePrice>> =>
      withLoading(async () => {
        const res = await service.carCarePriceByGrade(
          storeId,
          serviceTypeCode,
          bodyType,
          sizeGrade
        );
        if (res.success && res.data) setCurrentPrice(res.data);
        return res;
      }, '세차 가격을 불러오는데 실패했습니다.'),
    [withLoading, setCurrentPrice, service]
  );

  const fetchCarCareSurchargesByStore = useCallback(
    async (storeId: number): Promise<ApiResponse<CarCareSurcharge[]>> =>
      withLoading(async () => {
        const res = await service.carCareSurchargesByStore(storeId);
        if (res.success && res.data) setSurcharges(res.data);
        return res;
      }, '세차 추가금 목록을 불러오는데 실패했습니다.'),
    [withLoading, setSurcharges, service]
  );

  // ── Mutations ─────────────────────────────────────────────────────────────────

  const createCarCarePrice = useCallback(
    async (
      input: CreateCarCarePriceInput
    ): Promise<ApiResponse<CreateCarCarePriceOutput>> =>
      withLoading(async () => {
        const res = await service.createCarCarePrice(input);
        if (res.success && res.data?.carCarePrice)
          addPrice(res.data.carCarePrice);
        return res;
      }, '세차 가격 생성에 실패했습니다.'),
    [withLoading, addPrice, service]
  );

  const createCarCareSurcharge = useCallback(
    async (
      input: CreateCarCareSurchargeInput
    ): Promise<ApiResponse<CreateCarCareSurchargeOutput>> =>
      withLoading(async () => {
        const res = await service.createCarCareSurcharge(input);
        if (res.success && res.data?.surcharge)
          addSurcharge(res.data.surcharge);
        return res;
      }, '세차 추가금 생성에 실패했습니다.'),
    [withLoading, addSurcharge, service]
  );

  const updateCarCarePrice = useCallback(
    async (
      id: number,
      input: CreateCarCarePriceInput
    ): Promise<ApiResponse<CarCarePrice>> =>
      withLoading(async () => {
        const res = await service.updateCarCarePrice(id, input);
        if (res.success && res.data) updatePriceInContext(id, res.data);
        return res;
      }, '세차 가격 수정에 실패했습니다.'),
    [withLoading, updatePriceInContext, service]
  );

  const deleteCarCarePrice = useCallback(
    async (id: number): Promise<ApiResponse<boolean>> =>
      withLoading(async () => {
        const res = await service.deleteCarCarePrice(id);
        if (res.success) removePrice(id);
        return res;
      }, '세차 가격 삭제에 실패했습니다.'),
    [withLoading, removePrice, service]
  );

  const updateCarCareSurcharge = useCallback(
    async (
      input: UpdateCarCareSurchargeInput
    ): Promise<ApiResponse<UpdateCarCareSurchargeOutput>> =>
      withLoading(async () => {
        const res = await service.updateCarCareSurcharge(input);
        if (res.success && res.data?.surcharge) {
          updateSurchargeInContext(input.id, res.data.surcharge);
        }
        return res;
      }, '세차 추가금 수정에 실패했습니다.'),
    [withLoading, updateSurchargeInContext, service]
  );

  const deleteCarCareSurcharge = useCallback(
    async (id: number): Promise<ApiResponse<boolean>> =>
      withLoading(async () => {
        const res = await service.deleteCarCareSurcharge(id);
        if (res.success) removeSurcharge(id);
        return res;
      }, '세차 추가금 삭제에 실패했습니다.'),
    [withLoading, removeSurcharge, service]
  );

  return {
    ...context,
    prices,
    surcharges,
    currentPrice,
    // Queries
    fetchCarCarePricesByStore,
    fetchCarCarePriceByGrade,
    fetchCarCareSurchargesByStore,
    // Mutations
    createCarCarePrice,
    createCarCareSurcharge,
    updateCarCareSurcharge,
    updateCarCarePrice,
    deleteCarCarePrice,
    deleteCarCareSurcharge,
  };
};
