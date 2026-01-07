import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@starcoex-frontend/auth';

const GUEST_LIMIT = 20;
const STORAGE_KEY = 'station_search_limit';

interface SearchLimitData {
  date: string;
  count: number;
}

interface UseSearchLimitReturn {
  canSearch: boolean;
  remainingSearches: number;
  totalLimit: number;
  incrementSearchCount: () => void;
  isAuthenticated: boolean;
}

export const useSearchLimit = (): UseSearchLimitReturn => {
  const { isAuthenticated } = useAuth();
  const [searchCount, setSearchCount] = useState(0);

  // 오늘 날짜 기준 검색 횟수 가져오기
  const getSearchCount = useCallback((): number => {
    if (typeof window === 'undefined') return 0;

    const today = new Date().toDateString();
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const data: SearchLimitData = JSON.parse(stored);
        if (data.date === today) {
          return data.count;
        }
      } catch {
        // 파싱 실패 시 초기화
      }
    }
    return 0;
  }, []);

  // 검색 횟수 증가
  const incrementSearchCount = useCallback(() => {
    if (isAuthenticated) return; // 회원은 제한 없음

    const today = new Date().toDateString();
    const currentCount = getSearchCount();
    const newCount = currentCount + 1;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: today, count: newCount })
    );
    setSearchCount(newCount);
  }, [isAuthenticated, getSearchCount]);

  // 초기 로드
  useEffect(() => {
    setSearchCount(getSearchCount());
  }, [getSearchCount]);

  // 회원은 무제한, 비회원은 제한
  const canSearch = isAuthenticated || searchCount < GUEST_LIMIT;
  const remainingSearches = isAuthenticated
    ? Infinity
    : Math.max(0, GUEST_LIMIT - searchCount);

  return {
    canSearch,
    remainingSearches,
    totalLimit: GUEST_LIMIT,
    incrementSearchCount,
    isAuthenticated: isAuthenticated ?? false,
  };
};
