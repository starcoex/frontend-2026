import type { ApolloClient } from '@apollo/client';
import { QueueService } from './queue.service';

// ── 단순 레지스트리 (stores 패턴 참조) ───────────────────────────────────────

let instance: QueueService | null = null;

export const initQueueService = (client: ApolloClient): QueueService => {
  instance = new QueueService(client);
  return instance;
};

export const getQueueService = (): QueueService => {
  if (!instance) {
    throw new Error(
      'QueueService가 초기화되지 않았습니다. initQueueService()를 먼저 호출하세요.'
    );
  }
  return instance;
};

export const isQueueServiceInitialized = (): boolean => instance !== null;
