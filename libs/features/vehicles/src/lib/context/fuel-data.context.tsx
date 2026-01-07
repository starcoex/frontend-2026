import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { useVehicles } from '../hooks';
import {
  FuelPrice,
  GasStation,
  SearchStationInput,
} from '@starcoex-frontend/graphql';
import { JEJU_SIDO_CODE, STATION_IDS } from '../constants';

interface FuelDataContextType {
  // 데이터 상태
  nationalPrices: FuelPrice[];
  sidoPrices: FuelPrice[];
  jejuPrices: FuelPrice[];
  jejuSigunPrices: FuelPrice[];
  starStationDetail: GasStation | null;
  searchedStationDetail: GasStation | null;
  monthlyTrendData: FuelPrice[];
  monthlyPollTrendData: FuelPrice[];
  monthlyDataInfo: {
    isComplete: boolean;
    availableDays: number;
    message?: string;
  };

  // 로딩 및 에러 상태
  isLoading: boolean;
  error: string | null;
  lastUpdated: string;
  isInitialized: boolean; // ✅ 초기화 완료 여부 추가

  // 액션
  refreshData: () => Promise<void>;
  clearError: () => void;
  searchGasStations: (input: SearchStationInput) => Promise<GasStation[]>;
  fetchStationDetail: (stationId: string) => Promise<GasStation | null>;

  // 날짜별 조회 함수 추가
  fetchJejuSigunPricesByDate: (date: string) => Promise<FuelPrice[]>;
  fetchSidoPricesByDate: (date: string) => Promise<FuelPrice[]>;
  fetchNationalPricesByDate: (date: string) => Promise<FuelPrice[]>;
}

const FuelDataContext = createContext<FuelDataContextType | null>(null);

interface FuelDataProviderProps {
  children: ReactNode;
  autoLoad?: boolean;
}

export const FuelDataProvider: React.FC<FuelDataProviderProps> = ({
  children,
  autoLoad = true,
}) => {
  const {
    getNationalFuelPrices,
    getSidoFuelPrices,
    getSigunFuelPrices,
    getGasStationDetail,
    getMonthlyAvgPrices,
    getMonthlyPollAvgPrices,
    searchGasStations: searchGasStationsApi,
    clearError: hookClearError,
  } = useVehicles();

  // 전역 상태
  const [nationalPrices, setNationalPrices] = useState<FuelPrice[]>([]);
  const [sidoPrices, setSidoPrices] = useState<FuelPrice[]>([]);
  const [jejuPrices, setJejuPrices] = useState<FuelPrice[]>([]);
  const [jejuSigunPrices, setJejuSigunPrices] = useState<FuelPrice[]>([]);
  const [starStationDetail, setStarStationDetail] = useState<GasStation | null>(
    null
  );
  const [searchedStationDetail, setSearchedStationDetail] =
    useState<GasStation | null>(null);
  const [monthlyTrendData, setMonthlyTrendData] = useState<FuelPrice[]>([]);
  const [monthlyPollTrendData, setMonthlyPollTrendData] = useState<FuelPrice[]>(
    []
  );
  const [monthlyDataInfo, setMonthlyDataInfo] = useState<{
    isComplete: boolean;
    availableDays: number;
    message?: string;
  }>({
    isComplete: false,
    availableDays: 0,
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // ✅ 로딩/에러 상태 직접 관리
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
    hookClearError();
  }, [hookClearError]);

  // 데이터 로딩 함수
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 병렬 호출 - Promise.allSettled 사용
      const results = await Promise.allSettled([
        getNationalFuelPrices(),
        getSidoFuelPrices(),
        getSidoFuelPrices({ sidoCode: JEJU_SIDO_CODE }),
        getSigunFuelPrices({ sidoCode: JEJU_SIDO_CODE }),
        getGasStationDetail(STATION_IDS.STAR),
        getMonthlyAvgPrices({ areaCode: JEJU_SIDO_CODE }),
        getMonthlyPollAvgPrices(),
      ]);

      const [
        nationalRes,
        sidoRes,
        jejuRes,
        jejuSigunRes,
        stationRes,
        monthlyRes,
        monthlyPollRes,
      ] = results;

      // 각 결과 개별 처리
      if (
        nationalRes.status === 'fulfilled' &&
        nationalRes.value.success &&
        nationalRes.value.data
      ) {
        setNationalPrices(nationalRes.value.data);
      }

      if (
        sidoRes.status === 'fulfilled' &&
        sidoRes.value.success &&
        sidoRes.value.data
      ) {
        setSidoPrices(sidoRes.value.data);
      }

      if (
        jejuRes.status === 'fulfilled' &&
        jejuRes.value.success &&
        jejuRes.value.data
      ) {
        setJejuPrices(jejuRes.value.data);
      }

      if (
        jejuSigunRes.status === 'fulfilled' &&
        jejuSigunRes.value.success &&
        jejuSigunRes.value.data
      ) {
        setJejuSigunPrices(jejuSigunRes.value.data);
      }

      if (
        stationRes.status === 'fulfilled' &&
        stationRes.value.success &&
        stationRes.value.data
      ) {
        setStarStationDetail(stationRes.value.data);
      }

      if (
        monthlyRes.status === 'fulfilled' &&
        monthlyRes.value.success &&
        monthlyRes.value.data
      ) {
        setMonthlyTrendData(monthlyRes.value.data.data ?? []);
        setMonthlyDataInfo({
          isComplete: monthlyRes.value.data.isComplete ?? false,
          availableDays: monthlyRes.value.data.availableDays ?? 0,
          message: monthlyRes.value.data.message ?? '',
        });
      }

      if (
        monthlyPollRes.status === 'fulfilled' &&
        monthlyPollRes.value.success &&
        monthlyPollRes.value.data
      ) {
        setMonthlyPollTrendData(monthlyPollRes.value.data.data ?? []);
      }

      // 모든 요청이 실패했는지 확인
      const allFailed = results.every(
        (r) =>
          r.status === 'rejected' ||
          (r.status === 'fulfilled' && !r.value.success)
      );

      if (allFailed) {
        setError(
          '모든 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
        );
      } else {
        // 일부 실패한 경우
        const failedCount = results.filter(
          (r) =>
            r.status === 'rejected' ||
            (r.status === 'fulfilled' && !r.value.success)
        ).length;

        if (failedCount > 0) {
          setError(`일부 데이터(${failedCount}개)를 불러오지 못했습니다.`);
        }
      }

      setLastUpdated(new Date().toLocaleString('ko-KR'));
    } catch (err) {
      console.error('연료 데이터 로딩 실패:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      // ✅ 항상 로딩 종료
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [
    getNationalFuelPrices,
    getSidoFuelPrices,
    getSigunFuelPrices,
    getGasStationDetail,
    getMonthlyAvgPrices,
    getMonthlyPollAvgPrices,
  ]);

  // 주유소 검색 함수
  const searchGasStations = useCallback(
    async (input: SearchStationInput): Promise<GasStation[]> => {
      try {
        const result = await searchGasStationsApi(input);
        if (result.success && result.data) {
          return result.data;
        }
      } catch (err) {
        console.error('주유소 검색 실패:', err);
      }
      return [];
    },
    [searchGasStationsApi]
  );

  // 주유소 상세 조회 함수
  const fetchStationDetail = useCallback(
    async (stationId: string): Promise<GasStation | null> => {
      try {
        const result = await getGasStationDetail(stationId);
        if (result.success && result.data) {
          setSearchedStationDetail(result.data);
          return result.data;
        }
      } catch (err) {
        console.error('주유소 상세 조회 실패:', err);
      }
      return null;
    },
    [getGasStationDetail]
  );

  // 날짜별 제주 시군 가격 조회
  const fetchJejuSigunPricesByDate = useCallback(
    async (date: string): Promise<FuelPrice[]> => {
      try {
        const result = await getSigunFuelPrices({
          sidoCode: JEJU_SIDO_CODE,
          date,
        });
        if (result.success && result.data) {
          setJejuSigunPrices(result.data);
          setLastUpdated(new Date().toLocaleString('ko-KR'));
          return result.data;
        }
      } catch (err) {
        console.error('제주 시군 가격 조회 실패:', err);
      }
      return [];
    },
    [getSigunFuelPrices]
  );

  // 날짜별 시도 가격 조회
  const fetchSidoPricesByDate = useCallback(
    async (date: string): Promise<FuelPrice[]> => {
      try {
        const result = await getSidoFuelPrices({ date });
        if (result.success && result.data) {
          setSidoPrices(result.data);
          setLastUpdated(new Date().toLocaleString('ko-KR'));
          return result.data;
        }
      } catch (err) {
        console.error('시도 가격 조회 실패:', err);
      }
      return [];
    },
    [getSidoFuelPrices]
  );

  // 날짜별 전국 가격 조회
  const fetchNationalPricesByDate = useCallback(
    async (date: string): Promise<FuelPrice[]> => {
      try {
        const result = await getNationalFuelPrices({ date });
        if (result.success && result.data) {
          setNationalPrices(result.data);
          setLastUpdated(new Date().toLocaleString('ko-KR'));
          return result.data;
        }
      } catch (err) {
        console.error('전국 가격 조회 실패:', err);
      }
      return [];
    },
    [getNationalFuelPrices]
  );

  // 초기 로딩
  useEffect(() => {
    if (autoLoad && !isInitialized) {
      loadData();
    }
  }, [autoLoad, isInitialized, loadData]);

  const contextValue: FuelDataContextType = {
    // 데이터
    nationalPrices,
    sidoPrices,
    jejuPrices,
    jejuSigunPrices,
    starStationDetail,
    searchedStationDetail,
    monthlyTrendData,
    monthlyPollTrendData,
    monthlyDataInfo,

    // ✅ 직접 관리하는 상태 사용
    isLoading,
    error,
    lastUpdated,
    isInitialized,

    // 액션
    refreshData: loadData,
    clearError,
    searchGasStations,
    fetchStationDetail,

    // 날짜별 조회
    fetchJejuSigunPricesByDate,
    fetchSidoPricesByDate,
    fetchNationalPricesByDate,
  };

  return (
    <FuelDataContext.Provider value={contextValue}>
      {children}
    </FuelDataContext.Provider>
  );
};

// 컨텍스트 사용 훅
export const useFuelData = (): FuelDataContextType => {
  const context = useContext(FuelDataContext);
  if (!context) {
    throw new Error('useFuelData는 FuelDataProvider 내에서 사용해야 합니다');
  }
  return context;
};
