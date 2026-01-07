import { useCallback, useState, useRef, useMemo } from 'react';
import {
  GetFuelPriceInput,
  GetLowTop20Input,
  SearchStationInput,
  FuelPrice,
  GasStation,
  MonthlyFuelPriceResponse,
  GetMonthlyFuelPriceInput,
  GetMonthlyPollFuelPriceInput,
} from '@starcoex-frontend/graphql';
import type { ApiResponse } from '../types';
import { useApolloClient } from '@apollo/client/react';
import { VehiclesService } from '../services';

interface UseVehiclesReturn {
  isLoading: boolean;
  error: string | null;

  // Fuel Prices
  getNationalFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getSidoFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getSigunFuelPrices(
    input: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getRecentFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getPollRecentFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getLastWeekAvgPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getMonthlyAvgPrices(
    input?: GetMonthlyFuelPriceInput
  ): Promise<ApiResponse<MonthlyFuelPriceResponse>>;
  getMonthlyPollAvgPrices(
    input?: GetMonthlyPollFuelPriceInput
  ): Promise<ApiResponse<MonthlyFuelPriceResponse>>;

  // Gas Stations
  getLowTop20Stations(
    input: GetLowTop20Input
  ): Promise<ApiResponse<GasStation[]>>;
  searchGasStations(
    input: SearchStationInput
  ): Promise<ApiResponse<GasStation[]>>;
  getGasStationDetail(stationId: string): Promise<ApiResponse<GasStation>>;

  // Vehicles

  clearError: () => void;
}

export const useVehicles = (): UseVehiclesReturn => {
  // ✅ 1. Apollo Client 인스턴스 가져오기
  const client = useApolloClient();

  // ✅ 2. Service 인스턴스 생성 (client가 변경되지 않는 한 재사용)
  const vehiclesService = useMemo(() => new VehiclesService(client), [client]);

  const [isLoading, setIsLoadingState] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  const isLoadingRef = useRef(isLoading);

  const setLoading = useCallback((loading: boolean) => {
    isLoadingRef.current = loading;
    setIsLoadingState(loading);
  }, []);

  const setError = useCallback((msg: string | null) => {
    setErrorState(msg);
  }, []);

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) {
          setLoading(true);
        }
        setError(null);

        const res = await operation();

        if (!res.success) {
          const msg =
            res.error?.message ??
            res.graphQLErrors?.[0]?.message ??
            defaultErrorMessage;
          setError(msg);
        }

        return res;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  // ===== Fuel Prices Methods (vehiclesService 인스턴스 사용) =====

  const getNationalFuelPrices = useCallback(
    (input?: GetFuelPriceInput) =>
      withLoading(
        () => vehiclesService.getNationalFuelPrices(input),
        '전국 유가 정보를 불러오는데 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  const getSidoFuelPrices = useCallback(
    (input?: GetFuelPriceInput) =>
      withLoading(
        () => vehiclesService.getSidoFuelPrices(input),
        '시도별 유가 정보를 불러오는데 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  const getSigunFuelPrices = useCallback(
    (input: GetFuelPriceInput) =>
      withLoading(
        () => vehiclesService.getSigunFuelPrices(input),
        '시군구별 유가 정보를 불러오는데 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  const getRecentFuelPrices = useCallback(
    (input?: GetFuelPriceInput) =>
      withLoading(
        () => vehiclesService.getRecentFuelPrices(input),
        '최근 유가 추이를 불러오는데 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  const getPollRecentFuelPrices = useCallback(
    (input?: GetFuelPriceInput) =>
      withLoading(
        () => vehiclesService.getPollRecentFuelPrices(input),
        '상표별 유가 추이를 불러오는데 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  const getLastWeekAvgPrices = useCallback(
    (input?: GetFuelPriceInput) =>
      withLoading(
        () => vehiclesService.getLastWeekAvgPrices(input),
        '주간 평균 유가를 불러오는데 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  const getMonthlyAvgPrices = useCallback(
    (input?: GetFuelPriceInput) =>
      withLoading(
        () => vehiclesService.getMonthlyAvgPrices(input),
        '월간 평균 유가를 불러오는데 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  const getMonthlyPollAvgPrices = useCallback(
    (input?: GetMonthlyPollFuelPriceInput) =>
      withLoading(
        () => vehiclesService.getMonthlyPollAvgPrices(input),
        '상표별 월간 평균 유가를 불러오는데 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  // ===== Gas Stations Methods =====

  const getLowTop20Stations = useCallback(
    (input: GetLowTop20Input) =>
      withLoading(
        () => vehiclesService.getLowTop20Stations(input),
        '최저가 주유소 정보를 불러오는데 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  const searchGasStations = useCallback(
    (input: SearchStationInput) =>
      withLoading(
        () => vehiclesService.searchGasStations(input),
        '주유소 검색에 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  const getGasStationDetail = useCallback(
    (stationId: string) =>
      withLoading(
        () => vehiclesService.getGasStationDetail(stationId),
        '주유소 상세 정보를 불러오는데 실패했습니다.'
      ),
    [withLoading, vehiclesService]
  );

  // ===== Vehicles Methods =====

  return {
    isLoading,
    error,
    getNationalFuelPrices,
    getSidoFuelPrices,
    getSigunFuelPrices,
    getRecentFuelPrices,
    getPollRecentFuelPrices,
    getLastWeekAvgPrices,
    getMonthlyAvgPrices,
    getMonthlyPollAvgPrices,
    getLowTop20Stations,
    searchGasStations,
    getGasStationDetail,
    clearError: () => setError(null),
  };
};
