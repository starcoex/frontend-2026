import { useEffect, useCallback } from 'react';
import { useQueue, useQueueSocket } from '@starcoex-frontend/queue';
import { useStores } from '@starcoex-frontend/stores';
import { STORE_UI_META } from '@/app/config/stores-meta.config';

export function useStoreQueue() {
  const { integratedStats, loadIntegratedStats } = useQueue();
  const { stores, fetchStores } = useStores();

  // UI 메타가 있는 매장만 필터링
  const storeIds = stores.filter((s) => STORE_UI_META[s.id]).map((s) => s.id);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const refresh = useCallback(() => {
    if (storeIds.length === 0) return;
    loadIntegratedStats(storeIds);
  }, [storeIds.join(','), loadIntegratedStats]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const { isSocketConnected } = useQueueSocket({
    storeIds,
    onLoadBalanceAlert: ({ currentWaitMin, alternativeWaitMin }) => {
      console.info(
        `[StoreQueue] 수요 분산 제안: ${currentWaitMin}분 → ${alternativeWaitMin}분`
      );
    },
  });

  // WS 미연결 시 15초 폴링 폴백
  useEffect(() => {
    if (isSocketConnected) return;
    const timer = setInterval(refresh, 15_000);
    return () => clearInterval(timer);
  }, [isSocketConnected, refresh]);

  const getStatsById = useCallback(
    (storeId: number) =>
      integratedStats.find((s) => s.storeId === storeId) ?? null,
    [integratedStats]
  );

  // stores + UI 메타 병합 데이터
  const storeMeta = stores
    .filter((s) => STORE_UI_META[s.id])
    .map((s) => ({
      storeId: s.id,
      label: s.name,
      live: isSocketConnected,
      filled: true,
      ...STORE_UI_META[s.id],
    }));

  return { integratedStats, storeMeta, isSocketConnected, getStatsById };
}
