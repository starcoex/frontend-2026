import type { ApolloClient } from '@apollo/client';
import { AddressService } from './address.service';
import { serviceRegistry } from './service-registry';

// AddressService 인스턴스를 직접 생성하고 싶을 때 사용
export const createAddressService = (client: ApolloClient): AddressService =>
  new AddressService(client);

// 모듈 로드 시 한 번만 factory 등록
serviceRegistry.registerService<AddressService>(
  'address',
  (ctx: ApolloClient) => {
    return new AddressService(ctx);
  }
);

/**
 * AddressService 초기화
 * - ApolloClient를 주입해서 전역 레지스트리에 인스턴스를 생성
 */
export const initAddressService = (client: ApolloClient): AddressService => {
  return serviceRegistry.initializeService<AddressService>('address', client);
};

/**
 * 이미 초기화된 AddressService 가져오기
 * - 초기화되지 않았으면 에러
 */
export const getAddressService = (): AddressService => {
  return serviceRegistry.getService<AddressService>('address');
};
