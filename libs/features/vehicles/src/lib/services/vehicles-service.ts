import { ApolloClient, OperationVariables } from '@apollo/client';
import type { GraphQLFormattedError } from 'graphql/error';
import {
  GetNationalFuelPricesQuery,
  GetNationalFuelPricesQueryVariables,
  GetSidoFuelPricesQuery,
  GetSidoFuelPricesQueryVariables,
  GetSigunFuelPricesQuery,
  GetSigunFuelPricesQueryVariables,
  GetRecentFuelPricesQuery,
  GetRecentFuelPricesQueryVariables,
  GetPollRecentFuelPricesQuery,
  GetPollRecentFuelPricesQueryVariables,
  GetLastWeekAvgPricesQuery,
  GetLastWeekAvgPricesQueryVariables,
  GetLowTop20StationsQuery,
  GetLowTop20StationsQueryVariables,
  SearchGasStationsQuery,
  SearchGasStationsQueryVariables,
  GetGasStationDetailQuery,
  GetGasStationDetailQueryVariables,
  GetFuelPriceInput,
  GetLowTop20Input,
  SearchStationInput,
  FuelPrice,
  GasStation,
  GET_NATIONAL_FUEL_PRICES,
  GET_SIDO_FUEL_PRICES,
  GET_SIGUN_FUEL_PRICES,
  GET_RECENT_FUEL_PRICES,
  GET_POLL_RECENT_FUEL_PRICES,
  GET_LAST_WEEK_AVG_PRICES,
  GET_LOW_TOP_20_STATIONS,
  SEARCH_GAS_STATIONS,
  GET_GAS_STATION_DETAIL,
  MonthlyFuelPriceResponse,
  GET_MONTHLY_AVG_PRICES,
  GetMonthlyFuelPriceInput,
  GetMonthlyPollFuelPriceInput,
  GET_MONTHLY_POLL_AVG_PRICES,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors/api-error';
import { IVehiclesService, ApiResponse } from '../types';

export class VehiclesService implements IVehiclesService {
  constructor(private client: ApolloClient) {}

  // 공통 mutation helper
  private async mutate<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(mutation: any, variables: TVars): Promise<ApiResponse<TData>> {
    try {
      const { data, error, extensions } = await this.client.mutate<
        TData,
        TVars
      >({
        mutation,
        variables,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      });

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: (extensions ?? {}) as Record<string, unknown>,
        };

        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return {
        success: true,
        data: data as TData,
      };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // 공통 query helper
  private async query<
    TData = any,
    TVars extends OperationVariables = OperationVariables
  >(query: any, variables?: TVars): Promise<ApiResponse<TData>> {
    try {
      const result = await this.client.query<TData, TVars>({
        query,
        variables: variables as TVars,
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
      } as any);

      const { data, error, extensions } = result as {
        data?: TData;
        error?: { message?: string };
        extensions?: Record<string, unknown>;
      };

      if (error) {
        const gqlError: GraphQLFormattedError = {
          message: error.message ?? '요청 처리 중 오류가 발생했습니다.',
          locations: undefined,
          path: undefined,
          extensions: extensions ?? {},
        };

        const apiError = apiErrorFromGraphQLErrors([gqlError]);
        return createErrorResponse<TData>(apiError);
      }

      return {
        success: true,
        data: data as TData,
      };
    } catch (e) {
      const apiError =
        e instanceof Error ? apiErrorFromNetwork(e) : apiErrorFromUnknown(e);
      return createErrorResponse<TData>(apiError);
    }
  }

  // ===== Fuel Prices =====

  async getNationalFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>> {
    const res = await this.query<
      GetNationalFuelPricesQuery,
      GetNationalFuelPricesQueryVariables
    >(GET_NATIONAL_FUEL_PRICES, { input });

    if (!res.success) return res as unknown as ApiResponse<FuelPrice[]>;
    return { success: true, data: res.data?.nationalFuelPrices ?? [] };
  }

  async getSidoFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>> {
    const res = await this.query<
      GetSidoFuelPricesQuery,
      GetSidoFuelPricesQueryVariables
    >(GET_SIDO_FUEL_PRICES, { input });

    if (!res.success) return res as unknown as ApiResponse<FuelPrice[]>;
    return { success: true, data: res.data?.sidoFuelPrices ?? [] };
  }

  async getSigunFuelPrices(
    input: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>> {
    const res = await this.query<
      GetSigunFuelPricesQuery,
      GetSigunFuelPricesQueryVariables
    >(GET_SIGUN_FUEL_PRICES, { input });

    if (!res.success) return res as unknown as ApiResponse<FuelPrice[]>;
    return { success: true, data: res.data?.sigunFuelPrices ?? [] };
  }

  async getRecentFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>> {
    const res = await this.query<
      GetRecentFuelPricesQuery,
      GetRecentFuelPricesQueryVariables
    >(GET_RECENT_FUEL_PRICES, { input });

    if (!res.success) return res as unknown as ApiResponse<FuelPrice[]>;
    return { success: true, data: res.data?.recentFuelPrices ?? [] };
  }

  async getPollRecentFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>> {
    const res = await this.query<
      GetPollRecentFuelPricesQuery,
      GetPollRecentFuelPricesQueryVariables
    >(GET_POLL_RECENT_FUEL_PRICES, { input });

    if (!res.success) return res as unknown as ApiResponse<FuelPrice[]>;
    return { success: true, data: res.data?.pollRecentFuelPrices ?? [] };
  }

  async getLastWeekAvgPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>> {
    const res = await this.query<
      GetLastWeekAvgPricesQuery,
      GetLastWeekAvgPricesQueryVariables
    >(GET_LAST_WEEK_AVG_PRICES, { input });

    if (!res.success) return res as unknown as ApiResponse<FuelPrice[]>;
    return { success: true, data: res.data?.lastWeekAvgPrices ?? [] };
  }

  async getMonthlyAvgPrices(
    input?: GetMonthlyFuelPriceInput
  ): Promise<ApiResponse<MonthlyFuelPriceResponse>> {
    const res = await this.query<
      { monthlyAvgPrices: MonthlyFuelPriceResponse },
      { input?: GetMonthlyFuelPriceInput }
    >(GET_MONTHLY_AVG_PRICES, { input });

    if (!res.success)
      return res as unknown as ApiResponse<MonthlyFuelPriceResponse>;
    return {
      success: true,
      data: res.data?.monthlyAvgPrices ?? {
        data: [],
        isComplete: false,
        availableDays: 0,
        message: '',
      },
    };
  }

  async getMonthlyPollAvgPrices(
    input?: GetMonthlyPollFuelPriceInput
  ): Promise<ApiResponse<MonthlyFuelPriceResponse>> {
    const res = await this.query<
      { monthlyPollAvgPrices: MonthlyFuelPriceResponse },
      { input?: GetMonthlyPollFuelPriceInput }
    >(GET_MONTHLY_POLL_AVG_PRICES, { input });

    if (!res.success)
      return res as unknown as ApiResponse<MonthlyFuelPriceResponse>;
    return {
      success: true,
      data: res.data?.monthlyPollAvgPrices ?? {
        data: [],
        isComplete: false,
        availableDays: 0,
        message: '',
      },
    };
  }

  // ===== Gas Stations =====

  async getLowTop20Stations(
    input: GetLowTop20Input
  ): Promise<ApiResponse<GasStation[]>> {
    const res = await this.query<
      GetLowTop20StationsQuery,
      GetLowTop20StationsQueryVariables
    >(GET_LOW_TOP_20_STATIONS, { input });

    if (!res.success) return res as unknown as ApiResponse<GasStation[]>;
    return { success: true, data: res.data?.lowTop20Stations ?? [] };
  }

  async searchGasStations(
    input: SearchStationInput
  ): Promise<ApiResponse<GasStation[]>> {
    const res = await this.query<
      SearchGasStationsQuery,
      SearchGasStationsQueryVariables
    >(SEARCH_GAS_STATIONS, { input });

    if (!res.success) return res as unknown as ApiResponse<GasStation[]>;
    return { success: true, data: res.data?.searchGasStations ?? [] };
  }

  async getGasStationDetail(
    stationId: string
  ): Promise<ApiResponse<GasStation>> {
    const res = await this.query<
      GetGasStationDetailQuery,
      GetGasStationDetailQueryVariables
    >(GET_GAS_STATION_DETAIL, { stationId });
    if (!res.success) return res as unknown as ApiResponse<GasStation>;
    return { success: true, data: res.data?.gasStationDetail as GasStation };
  }

  // ===== Vehicles =====
}
