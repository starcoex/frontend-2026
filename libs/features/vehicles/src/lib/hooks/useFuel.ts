import { useCallback, useState } from 'react';
import { useVehicles } from './useVehicles'; // 경로에 맞게 수정 필요
import { FuelPrice, GasStation } from '@starcoex-frontend/graphql';
import { JEJU_SIDO_CODE, STATION_IDS } from '../constants';

// 반환 타입 정의
interface UseFuelReturn {
  jejuPrices: FuelPrice[];
  starStationDetail: GasStation | null;
  recentTrendData: FuelPrice[];
  monthlyTrendData: FuelPrice[];
  monthlyDataInfo: {
    isComplete: boolean;
    availableDays: number;
    message?: string;
  };
  isLoading: boolean;
  error: string | null;
  lastUpdated: string;
  refreshAll: () => Promise<void>;
}

export const useFuel = (): UseFuelReturn => {
  const {
    getSidoFuelPrices,
    getGasStationDetail,
    getRecentFuelPrices,
    getMonthlyAvgPrices,
    isLoading: isVehicleLoading,
    error: vehicleError,
    clearError,
  } = useVehicles();

  const [jejuPrices, setJejuPrices] = useState<FuelPrice[]>([]);
  const [starStationDetail, setStarStationDetail] = useState<GasStation | null>(
    null
  );
  const [recentTrendData, setRecentTrendData] = useState<FuelPrice[]>([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState<FuelPrice[]>([]);
  const [monthlyDataInfo, setMonthlyDataInfo] = useState<{
    isComplete: boolean;
    availableDays: number;
    message?: string;
  }>({
    isComplete: false,
    availableDays: 0,
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 전체 데이터 로드 함수
  const loadAllData = useCallback(async () => {
    try {
      clearError();

      // 병렬 요청을 통한 데이터 로딩 최적화
      const [sidoRes, stationRes, trendRes, monthlyRes] = await Promise.all([
        // 1. 제주도 시도별 유가
        getSidoFuelPrices({ sidoCode: JEJU_SIDO_CODE }),
        // 2. 별표주유소 상세 정보
        getGasStationDetail(STATION_IDS.STAR),
        // 3. 최근 유가 추이
        getRecentFuelPrices({ sidoCode: JEJU_SIDO_CODE }),
        // 4. 제주도 한 달간 평균 유가 (GetMonthlyFuelPriceInput 사용)
        getMonthlyAvgPrices({ areaCode: JEJU_SIDO_CODE }),
      ]);

      // 데이터 설정
      if (sidoRes.success && sidoRes.data) {
        setJejuPrices(sidoRes.data);
      }

      if (stationRes.success && stationRes.data) {
        setStarStationDetail(stationRes.data);
      }

      if (trendRes.success && trendRes.data) {
        setRecentTrendData(trendRes.data);
      }

      // 한 달간 데이터 설정
      if (monthlyRes.success && monthlyRes.data) {
        setMonthlyTrendData(monthlyRes.data.data);
        setMonthlyDataInfo({
          isComplete: monthlyRes.data.isComplete,
          availableDays: monthlyRes.data.availableDays,
          message: monthlyRes.data.message || '',
        });
      }

      setLastUpdated(new Date().toLocaleString('ko-KR'));
    } catch (err) {
      console.error('Fuel data loading failed:', err);
    }
  }, [
    getSidoFuelPrices,
    getGasStationDetail,
    getRecentFuelPrices,
    getMonthlyAvgPrices,
    clearError,
  ]);

  return {
    jejuPrices,
    starStationDetail,
    recentTrendData,
    monthlyTrendData,
    monthlyDataInfo,
    isLoading: isVehicleLoading,
    error: vehicleError,
    lastUpdated,
    refreshAll: loadAllData,
  };
};
