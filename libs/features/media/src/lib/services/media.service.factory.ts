import type { ApolloClient } from '@apollo/client';
import { MediaService } from './media.service';
import { serviceRegistry } from './service-registry'; // 기존 레지스트리 재사용

// LoyaltyService 인스턴스를 직접 생성하고 싶을 때 사용
export const createMediaService = (client: ApolloClient): MediaService =>
  new MediaService(client);

// 모듈 로드 시 한 번만 factory 등록
serviceRegistry.registerService<MediaService>('media', (ctx: ApolloClient) => {
  return new MediaService(ctx);
});

/**
 * LoyaltyService 초기화
 */
export const initMediaService = (client: ApolloClient): MediaService => {
  return serviceRegistry.initializeService<MediaService>('media', client);
};

/**
 * 이미 초기화된 LoyaltyService 가져오기
 */
export const getMediaService = (): MediaService => {
  return serviceRegistry.getService<MediaService>('media');
};
