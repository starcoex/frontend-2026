import {
  SmartSearchInput,
  ExternalAddressSearchInput,
  SearchAddressInput,
  FilterAddressInput,
  SaveAddressInput,
  UpdateAddressInput,
  CreateAddressPopupInput,
  SmartSearchAddressesQuery,
  SearchAddressesFromApiQuery,
  SearchUserAddressesQuery,
  GetUserAddressByIdQuery,
  GetUserAddressesQuery,
  GetUserAddressStatsQuery,
  SaveAddressMutation,
  UpdateAddressMutation,
  RemoveAddressMutation,
  CreateAddressPopupUrlMutation,
} from '@starcoex-frontend/graphql';
import { ApiResponse } from './common.types';

export interface IAddressService {
  // 주소 검색
  smartSearchAddresses(
    input: SmartSearchInput
  ): Promise<ApiResponse<SmartSearchAddressesQuery>>;
  searchAddressesFromAPI(
    input: ExternalAddressSearchInput
  ): Promise<ApiResponse<SearchAddressesFromApiQuery>>;
  searchUserAddresses(
    input: SearchAddressInput
  ): Promise<ApiResponse<SearchUserAddressesQuery>>;
  getUserAddressById(id: number): Promise<ApiResponse<GetUserAddressByIdQuery>>;
  getUserAddresses(
    filter: FilterAddressInput
  ): Promise<ApiResponse<GetUserAddressesQuery>>;
  getUserAddressStats(): Promise<ApiResponse<GetUserAddressStatsQuery>>;

  // 주소 관리
  saveAddress(
    input: SaveAddressInput
  ): Promise<ApiResponse<SaveAddressMutation>>;
  updateAddress(
    input: UpdateAddressInput
  ): Promise<ApiResponse<UpdateAddressMutation>>;
  removeAddress(id: number): Promise<ApiResponse<RemoveAddressMutation>>;

  // 팝업 URL 생성
  createAddressPopupUrl(
    input: CreateAddressPopupInput
  ): Promise<ApiResponse<CreateAddressPopupUrlMutation>>;

  // 유틸리티
  clearAddressCache(): void;
}
