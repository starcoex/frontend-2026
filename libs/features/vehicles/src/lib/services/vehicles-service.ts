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
  GET_VEHICLE_BY_ID,
  GET_VEHICLE_BY_CAR_NO,
  MY_VEHICLES,
  ADMIN_VEHICLES,
  PENDING_REVIEW_VEHICLES,
  LOW_CONFIDENCE_VEHICLES,
  VEHICLE_BRANDS,
  VEHICLE_BRAND,
  VEHICLE_MODELS_BY_BRAND,
  VEHICLE_MODELS_BY_GRADE,
  VEHICLE_DIMENSION_RULES,
  RESOLVE_VEHICLE_GRADE,
  CREATE_VEHICLE,
  OVERRIDE_VEHICLE_GRADE,
  DELETE_VEHICLE,
  UPDATE_VEHICLE_STATUS,
  CREATE_VEHICLE_BRAND,
  CREATE_VEHICLE_MODEL,
  CREATE_VEHICLE_DIMENSION_RULE,
  UPDATE_VEHICLE_BRAND,
  DELETE_VEHICLE_BRAND,
  UPDATE_VEHICLE_MODEL,
  DELETE_VEHICLE_MODEL,
  DELETE_VEHICLE_DIMENSION_RULE,
  CAR_CARE_PRICES_BY_STORE,
  CAR_CARE_PRICE_BY_GRADE,
  CAR_CARE_SURCHARGES_BY_STORE,
  CREATE_CAR_CARE_PRICE,
  CREATE_CAR_CARE_SURCHARGE,
  UPDATE_CAR_CARE_PRICE,
  DELETE_CAR_CARE_PRICE,
  DELETE_CAR_CARE_SURCHARGE,
  ADMIN_FLOOD_HISTORY,
  ADMIN_FLOOD_HISTORY_BY_ID,
  ADMIN_SCRAP_HISTORY,
  ADMIN_SCRAP_HISTORY_BY_ID,
  ADMIN_SALE_HISTORY,
  ADMIN_SALE_HISTORY_BY_ID,
  SEARCH_APICK_HISTORY,
  APICK_COMPREHENSIVE_STATS,
  APICK_HEALTH_CHECK,
  APICK_ACCOUNT_INFO,
  CHECK_FLOOD_DAMAGE,
  CHECK_SCRAP_STATUS,
  CHECK_SALE_STATUS,
  ADMIN_DELETE_FLOOD_HISTORY,
  ADMIN_DELETE_FLOOD_HISTORY_BULK,
  ADMIN_DELETE_SCRAP_HISTORY,
  ADMIN_DELETE_SCRAP_HISTORY_BULK,
  ADMIN_DELETE_SALE_HISTORY,
  ADMIN_DELETE_SALE_HISTORY_BULK,
  UPDATE_APICK_DAILY_STATS,
  UPDATE_CAR_CARE_SURCHARGE,
} from '@starcoex-frontend/graphql';
import {
  apiErrorFromGraphQLErrors,
  apiErrorFromNetwork,
  apiErrorFromUnknown,
  createErrorResponse,
} from '../errors/api-error';
import {
  IVehiclesService,
  ApiResponse,
  Vehicle,
  VehicleBrand,
  VehicleModel,
  CreateVehicleOutput,
  VehicleDimensionRule,
  ResolveGradeInput,
  ResolveGradeOutput,
  CreateVehicleInput,
  CreateVehicleBrandInput,
  CreateVehicleBrandOutput,
  CreateVehicleModelInput,
  CreateVehicleModelOutput,
  CreateVehicleDimensionRuleInput,
  CreateVehicleDimensionRuleOutput,
  CarCarePrice,
  CarCareSurcharge,
  CreateCarCarePriceInput,
  CreateCarCarePriceOutput,
  CreateCarCareSurchargeInput,
  CreateCarCareSurchargeOutput,
  GetApickFloodHistoryInput,
  GetApickFloodHistoryOutput,
  FloodDamageCheckResult,
  GetApickScrapHistoryInput,
  GetApickScrapHistoryOutput,
  ScrapStatusCheckResult,
  GetApickSaleHistoryInput,
  GetApickSaleHistoryOutput,
  SaleStatusCheckResult,
  SearchApickHistoryInput,
  SearchApickHistoryOutput,
  GetApickStatsInput,
  GetApickStatsOutput,
  ApickAccountInfo,
  CheckFloodDamageInput,
  CheckScrapStatusInput,
  CheckSaleStatusInput,
  DeleteApickHistoryInput,
  DeleteApickHistoryOutput,
  UpdateCarCareSurchargeInput, UpdateCarCareSurchargeOutput,
} from '../types';

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

  // ============================================================================
  // Vehicle Management
  // ============================================================================

  async getVehicleById(id: number): Promise<ApiResponse<Vehicle>> {
    const res = await this.query<{ getVehicleById: Vehicle }>(
      GET_VEHICLE_BY_ID,
      { id }
    );
    if (res.success && res.data?.getVehicleById) {
      return { success: true, data: res.data.getVehicleById };
    }
    return res as unknown as ApiResponse<Vehicle>;
  }

  async getVehicleByCarNo(carNo: string): Promise<ApiResponse<Vehicle>> {
    const res = await this.query<{ getVehicleByCarNo: Vehicle }>(
      GET_VEHICLE_BY_CAR_NO,
      { carNo }
    );
    if (res.success && res.data?.getVehicleByCarNo) {
      return { success: true, data: res.data.getVehicleByCarNo };
    }
    return res as unknown as ApiResponse<Vehicle>;
  }

  async myVehicles(limit = 20, offset = 0): Promise<ApiResponse<Vehicle[]>> {
    const res = await this.query<{ myVehicles: Vehicle[] }>(MY_VEHICLES, {
      limit,
      offset,
    });
    if (res.success && res.data?.myVehicles) {
      return { success: true, data: res.data.myVehicles };
    }
    return res as unknown as ApiResponse<Vehicle[]>;
  }

  async pendingReviewVehicles(
    limit = 20,
    offset = 0
  ): Promise<ApiResponse<Vehicle[]>> {
    const res = await this.query<{ pendingReviewVehicles: Vehicle[] }>(
      PENDING_REVIEW_VEHICLES,
      { limit, offset }
    );
    if (res.success && res.data?.pendingReviewVehicles) {
      return { success: true, data: res.data.pendingReviewVehicles };
    }
    return res as unknown as ApiResponse<Vehicle[]>;
  }

  async adminVehicles(
    limit = 20,
    offset = 0,
    status?: string
  ): Promise<ApiResponse<Vehicle[]>> {
    const res = await this.query<{ adminVehicles: Vehicle[] }>(ADMIN_VEHICLES, {
      limit,
      offset,
      status,
    });
    if (res.success && res.data?.adminVehicles) {
      return { success: true, data: res.data.adminVehicles };
    }
    return res as unknown as ApiResponse<Vehicle[]>;
  }

  async lowConfidenceVehicles(
    limit = 20,
    offset = 0
  ): Promise<ApiResponse<Vehicle[]>> {
    const res = await this.query<{ lowConfidenceVehicles: Vehicle[] }>(
      LOW_CONFIDENCE_VEHICLES,
      { limit, offset }
    );
    if (res.success && res.data?.lowConfidenceVehicles) {
      return { success: true, data: res.data.lowConfidenceVehicles };
    }
    return res as unknown as ApiResponse<Vehicle[]>;
  }

  async vehicleBrands(onlyActive = true): Promise<ApiResponse<VehicleBrand[]>> {
    const res = await this.query<{ vehicleBrands: VehicleBrand[] }>(
      VEHICLE_BRANDS,
      { onlyActive }
    );
    if (res.success && res.data?.vehicleBrands) {
      return { success: true, data: res.data.vehicleBrands };
    }
    return res as unknown as ApiResponse<VehicleBrand[]>;
  }

  async vehicleBrand(id: number): Promise<ApiResponse<VehicleBrand>> {
    const res = await this.query<{ vehicleBrand: VehicleBrand }>(
      VEHICLE_BRAND,
      { id }
    );
    if (res.success && res.data?.vehicleBrand) {
      return { success: true, data: res.data.vehicleBrand };
    }
    return res as unknown as ApiResponse<VehicleBrand>;
  }

  async vehicleModelsByBrand(
    brandId: number
  ): Promise<ApiResponse<VehicleModel[]>> {
    const res = await this.query<{ vehicleModelsByBrand: VehicleModel[] }>(
      VEHICLE_MODELS_BY_BRAND,
      { brandId }
    );
    if (res.success && res.data?.vehicleModelsByBrand) {
      return { success: true, data: res.data.vehicleModelsByBrand };
    }
    return res as unknown as ApiResponse<VehicleModel[]>;
  }

  async vehicleModelsByGrade(
    sizeGrade: string,
    bodyType?: string
  ): Promise<ApiResponse<VehicleModel[]>> {
    const res = await this.query<{ vehicleModelsByGrade: VehicleModel[] }>(
      VEHICLE_MODELS_BY_GRADE,
      { sizeGrade, bodyType }
    );
    if (res.success && res.data?.vehicleModelsByGrade) {
      return { success: true, data: res.data.vehicleModelsByGrade };
    }
    return res as unknown as ApiResponse<VehicleModel[]>;
  }

  async vehicleDimensionRules(
    bodyType?: string
  ): Promise<ApiResponse<VehicleDimensionRule[]>> {
    const res = await this.query<{
      vehicleDimensionRules: VehicleDimensionRule[];
    }>(VEHICLE_DIMENSION_RULES, { bodyType });
    if (res.success && res.data?.vehicleDimensionRules) {
      return { success: true, data: res.data.vehicleDimensionRules };
    }
    return res as unknown as ApiResponse<VehicleDimensionRule[]>;
  }

  async resolveVehicleGrade(
    input: ResolveGradeInput
  ): Promise<ApiResponse<ResolveGradeOutput>> {
    const res = await this.query<{ resolveVehicleGrade: ResolveGradeOutput }>(
      RESOLVE_VEHICLE_GRADE,
      { input }
    );
    if (res.success && res.data?.resolveVehicleGrade) {
      return { success: true, data: res.data.resolveVehicleGrade };
    }
    return res as unknown as ApiResponse<ResolveGradeOutput>;
  }

  async createVehicle(
    input: CreateVehicleInput
  ): Promise<ApiResponse<CreateVehicleOutput>> {
    const res = await this.mutate<{ createVehicle: CreateVehicleOutput }>(
      CREATE_VEHICLE,
      { input }
    );
    if (res.success && res.data?.createVehicle) {
      return { success: true, data: res.data.createVehicle };
    }
    return res as unknown as ApiResponse<CreateVehicleOutput>;
  }

  async overrideVehicleGrade(
    vehicleId: number,
    sizeGrade: string,
    bodyType: string,
    reason: string
  ): Promise<ApiResponse<Vehicle>> {
    const res = await this.mutate<{ overrideVehicleGrade: Vehicle }>(
      OVERRIDE_VEHICLE_GRADE,
      { vehicleId, sizeGrade, bodyType, reason }
    );
    if (res.success && res.data?.overrideVehicleGrade) {
      return { success: true, data: res.data.overrideVehicleGrade };
    }
    return res as unknown as ApiResponse<Vehicle>;
  }

  async deleteVehicle(vehicleId: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteVehicle: boolean }>(DELETE_VEHICLE, {
      vehicleId,
    });
    if (res.success) {
      return { success: true, data: res.data?.deleteVehicle ?? false };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async updateVehicleStatus(
    vehicleId: number,
    status: string
  ): Promise<ApiResponse<Vehicle>> {
    const res = await this.mutate<{ updateVehicleStatus: Vehicle }>(
      UPDATE_VEHICLE_STATUS,
      { vehicleId, status }
    );
    if (res.success && res.data?.updateVehicleStatus) {
      return { success: true, data: res.data.updateVehicleStatus };
    }
    return res as unknown as ApiResponse<Vehicle>;
  }

  async createVehicleBrand(
    input: CreateVehicleBrandInput
  ): Promise<ApiResponse<CreateVehicleBrandOutput>> {
    const res = await this.mutate<{
      createVehicleBrand: CreateVehicleBrandOutput;
    }>(CREATE_VEHICLE_BRAND, { input });
    if (res.success && res.data?.createVehicleBrand) {
      return { success: true, data: res.data.createVehicleBrand };
    }
    return res as unknown as ApiResponse<CreateVehicleBrandOutput>;
  }

  async createVehicleModel(
    input: CreateVehicleModelInput
  ): Promise<ApiResponse<CreateVehicleModelOutput>> {
    const res = await this.mutate<{
      createVehicleModel: CreateVehicleModelOutput;
    }>(CREATE_VEHICLE_MODEL, { input });
    if (res.success && res.data?.createVehicleModel) {
      return { success: true, data: res.data.createVehicleModel };
    }
    return res as unknown as ApiResponse<CreateVehicleModelOutput>;
  }

  async createVehicleDimensionRule(
    input: CreateVehicleDimensionRuleInput
  ): Promise<ApiResponse<CreateVehicleDimensionRuleOutput>> {
    const res = await this.mutate<{
      createVehicleDimensionRule: CreateVehicleDimensionRuleOutput;
    }>(CREATE_VEHICLE_DIMENSION_RULE, { input });
    if (res.success && res.data?.createVehicleDimensionRule) {
      return { success: true, data: res.data.createVehicleDimensionRule };
    }
    return res as unknown as ApiResponse<CreateVehicleDimensionRuleOutput>;
  }

  async updateVehicleBrand(
    id: number,
    input: CreateVehicleBrandInput
  ): Promise<ApiResponse<VehicleBrand>> {
    const res = await this.mutate<{ updateVehicleBrand: VehicleBrand }>(
      UPDATE_VEHICLE_BRAND,
      { id, input }
    );
    if (res.success && res.data?.updateVehicleBrand) {
      return { success: true, data: res.data.updateVehicleBrand };
    }
    return res as unknown as ApiResponse<VehicleBrand>;
  }

  async deleteVehicleBrand(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteVehicleBrand: boolean }>(
      DELETE_VEHICLE_BRAND,
      { id }
    );
    if (res.success) {
      return { success: true, data: res.data?.deleteVehicleBrand ?? false };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async updateVehicleModel(
    id: number,
    input: CreateVehicleModelInput
  ): Promise<ApiResponse<VehicleModel>> {
    const res = await this.mutate<{ updateVehicleModel: VehicleModel }>(
      UPDATE_VEHICLE_MODEL,
      { id, input }
    );
    if (res.success && res.data?.updateVehicleModel) {
      return { success: true, data: res.data.updateVehicleModel };
    }
    return res as unknown as ApiResponse<VehicleModel>;
  }

  async deleteVehicleModel(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteVehicleModel: boolean }>(
      DELETE_VEHICLE_MODEL,
      { id }
    );
    if (res.success) {
      return { success: true, data: res.data?.deleteVehicleModel ?? false };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async deleteVehicleDimensionRule(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteVehicleDimensionRule: boolean }>(
      DELETE_VEHICLE_DIMENSION_RULE,
      { id }
    );
    if (res.success) {
      return {
        success: true,
        data: res.data?.deleteVehicleDimensionRule ?? false,
      };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  // ============================================================================
  // CarCare
  // ============================================================================

  async carCarePricesByStore(
    storeId: number
  ): Promise<ApiResponse<CarCarePrice[]>> {
    const res = await this.query<{ carCarePricesByStore: CarCarePrice[] }>(
      CAR_CARE_PRICES_BY_STORE,
      { storeId }
    );
    if (res.success && res.data?.carCarePricesByStore) {
      return { success: true, data: res.data.carCarePricesByStore };
    }
    return res as unknown as ApiResponse<CarCarePrice[]>;
  }

  async carCarePriceByGrade(
    storeId: number,
    serviceTypeCode: string,
    bodyType: string,
    sizeGrade: string
  ): Promise<ApiResponse<CarCarePrice>> {
    const res = await this.query<{ carCarePriceByGrade: CarCarePrice }>(
      CAR_CARE_PRICE_BY_GRADE,
      { storeId, serviceTypeCode, bodyType, sizeGrade }
    );
    if (res.success && res.data?.carCarePriceByGrade) {
      return { success: true, data: res.data.carCarePriceByGrade };
    }
    return res as unknown as ApiResponse<CarCarePrice>;
  }

  async carCareSurchargesByStore(
    storeId: number
  ): Promise<ApiResponse<CarCareSurcharge[]>> {
    const res = await this.query<{
      carCareSurchargesByStore: CarCareSurcharge[];
    }>(CAR_CARE_SURCHARGES_BY_STORE, { storeId });
    if (res.success && res.data?.carCareSurchargesByStore) {
      return { success: true, data: res.data.carCareSurchargesByStore };
    }
    return res as unknown as ApiResponse<CarCareSurcharge[]>;
  }

  async createCarCarePrice(
    input: CreateCarCarePriceInput
  ): Promise<ApiResponse<CreateCarCarePriceOutput>> {
    const res = await this.mutate<{
      createCarCarePrice: CreateCarCarePriceOutput;
    }>(CREATE_CAR_CARE_PRICE, { input });
    if (res.success && res.data?.createCarCarePrice) {
      return { success: true, data: res.data.createCarCarePrice };
    }
    return res as unknown as ApiResponse<CreateCarCarePriceOutput>;
  }

  async createCarCareSurcharge(
    input: CreateCarCareSurchargeInput
  ): Promise<ApiResponse<CreateCarCareSurchargeOutput>> {
    const res = await this.mutate<{
      createCarCareSurcharge: CreateCarCareSurchargeOutput;
    }>(CREATE_CAR_CARE_SURCHARGE, { input });
    if (res.success && res.data?.createCarCareSurcharge) {
      return { success: true, data: res.data.createCarCareSurcharge };
    }
    return res as unknown as ApiResponse<CreateCarCareSurchargeOutput>;
  }

  async updateCarCarePrice(
    id: number,
    input: CreateCarCarePriceInput
  ): Promise<ApiResponse<CarCarePrice>> {
    const res = await this.mutate<{ updateCarCarePrice: CarCarePrice }>(
      UPDATE_CAR_CARE_PRICE,
      { id, input }
    );
    if (res.success && res.data?.updateCarCarePrice) {
      return { success: true, data: res.data.updateCarCarePrice };
    }
    return res as unknown as ApiResponse<CarCarePrice>;
  }

  async updateCarCareSurcharge(
    input: UpdateCarCareSurchargeInput
  ): Promise<ApiResponse<UpdateCarCareSurchargeOutput>> {
    const res = await this.mutate<{
      updateCarCareSurcharge: UpdateCarCareSurchargeOutput;
    }>(UPDATE_CAR_CARE_SURCHARGE, { input });
    if (res.success && res.data?.updateCarCareSurcharge) {
      return { success: true, data: res.data.updateCarCareSurcharge };
    }
    return res as unknown as ApiResponse<UpdateCarCareSurchargeOutput>;
  }

  async deleteCarCarePrice(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteCarCarePrice: boolean }>(
      DELETE_CAR_CARE_PRICE,
      { id }
    );
    if (res.success) {
      return { success: true, data: res.data?.deleteCarCarePrice ?? false };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  async deleteCarCareSurcharge(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ deleteCarCareSurcharge: boolean }>(
      DELETE_CAR_CARE_SURCHARGE,
      { id }
    );
    if (res.success) {
      return { success: true, data: res.data?.deleteCarCareSurcharge ?? false };
    }
    return res as unknown as ApiResponse<boolean>;
  }

  // ============================================================================
  // Apick
  // ============================================================================

  async adminFloodHistory(
    input?: GetApickFloodHistoryInput
  ): Promise<ApiResponse<GetApickFloodHistoryOutput>> {
    const res = await this.query<{
      adminFloodHistory: GetApickFloodHistoryOutput;
    }>(ADMIN_FLOOD_HISTORY, { input });
    if (res.success && res.data?.adminFloodHistory) {
      return { success: true, data: res.data.adminFloodHistory };
    }
    return res as unknown as ApiResponse<GetApickFloodHistoryOutput>;
  }

  async adminFloodHistoryById(
    id: number
  ): Promise<ApiResponse<FloodDamageCheckResult>> {
    const res = await this.query<{
      adminFloodHistoryById: FloodDamageCheckResult;
    }>(ADMIN_FLOOD_HISTORY_BY_ID, { id });
    if (res.success && res.data?.adminFloodHistoryById) {
      return { success: true, data: res.data.adminFloodHistoryById };
    }
    return res as unknown as ApiResponse<FloodDamageCheckResult>;
  }

  async adminScrapHistory(
    input?: GetApickScrapHistoryInput
  ): Promise<ApiResponse<GetApickScrapHistoryOutput>> {
    const res = await this.query<{
      adminScrapHistory: GetApickScrapHistoryOutput;
    }>(ADMIN_SCRAP_HISTORY, { input });
    if (res.success && res.data?.adminScrapHistory) {
      return { success: true, data: res.data.adminScrapHistory };
    }
    return res as unknown as ApiResponse<GetApickScrapHistoryOutput>;
  }

  async adminScrapHistoryById(
    id: number
  ): Promise<ApiResponse<ScrapStatusCheckResult>> {
    const res = await this.query<{
      adminScrapHistoryById: ScrapStatusCheckResult;
    }>(ADMIN_SCRAP_HISTORY_BY_ID, { id });
    if (res.success && res.data?.adminScrapHistoryById) {
      return { success: true, data: res.data.adminScrapHistoryById };
    }
    return res as unknown as ApiResponse<ScrapStatusCheckResult>;
  }

  async adminSaleHistory(
    input?: GetApickSaleHistoryInput
  ): Promise<ApiResponse<GetApickSaleHistoryOutput>> {
    const res = await this.query<{
      adminSaleHistory: GetApickSaleHistoryOutput;
    }>(ADMIN_SALE_HISTORY, { input });
    if (res.success && res.data?.adminSaleHistory) {
      return { success: true, data: res.data.adminSaleHistory };
    }
    return res as unknown as ApiResponse<GetApickSaleHistoryOutput>;
  }

  async adminSaleHistoryById(
    id: number
  ): Promise<ApiResponse<SaleStatusCheckResult>> {
    const res = await this.query<{
      adminSaleHistoryById: SaleStatusCheckResult;
    }>(ADMIN_SALE_HISTORY_BY_ID, { id });
    if (res.success && res.data?.adminSaleHistoryById) {
      return { success: true, data: res.data.adminSaleHistoryById };
    }
    return res as unknown as ApiResponse<SaleStatusCheckResult>;
  }

  async searchApickHistory(
    input: SearchApickHistoryInput
  ): Promise<ApiResponse<SearchApickHistoryOutput>> {
    const res = await this.query<{
      searchApickHistory: SearchApickHistoryOutput;
    }>(SEARCH_APICK_HISTORY, { input });
    if (res.success && res.data?.searchApickHistory) {
      return { success: true, data: res.data.searchApickHistory };
    }
    return res as unknown as ApiResponse<SearchApickHistoryOutput>;
  }

  async apickComprehensiveStats(
    input?: GetApickStatsInput
  ): Promise<ApiResponse<GetApickStatsOutput>> {
    const res = await this.query<{
      apickComprehensiveStats: GetApickStatsOutput;
    }>(APICK_COMPREHENSIVE_STATS, { input });
    if (res.success && res.data?.apickComprehensiveStats) {
      return { success: true, data: res.data.apickComprehensiveStats };
    }
    return res as unknown as ApiResponse<GetApickStatsOutput>;
  }

  async apickHealthCheck(): Promise<ApiResponse<string>> {
    const res = await this.query<{ apickHealthCheck: string }>(
      APICK_HEALTH_CHECK
    );
    if (res.success && res.data?.apickHealthCheck !== undefined) {
      return { success: true, data: res.data.apickHealthCheck };
    }
    return res as unknown as ApiResponse<string>;
  }

  async apickAccountInfo(): Promise<ApiResponse<ApickAccountInfo>> {
    const res = await this.query<{ apickAccountInfo: ApickAccountInfo }>(
      APICK_ACCOUNT_INFO
    );
    if (res.success && res.data?.apickAccountInfo) {
      return { success: true, data: res.data.apickAccountInfo };
    }
    return res as unknown as ApiResponse<ApickAccountInfo>;
  }

  async checkFloodDamage(
    input: CheckFloodDamageInput
  ): Promise<ApiResponse<FloodDamageCheckResult>> {
    const res = await this.mutate<{ checkFloodDamage: FloodDamageCheckResult }>(
      CHECK_FLOOD_DAMAGE,
      { input }
    );
    if (res.success && res.data?.checkFloodDamage) {
      return { success: true, data: res.data.checkFloodDamage };
    }
    return res as unknown as ApiResponse<FloodDamageCheckResult>;
  }

  async checkScrapStatus(
    input: CheckScrapStatusInput
  ): Promise<ApiResponse<ScrapStatusCheckResult>> {
    const res = await this.mutate<{ checkScrapStatus: ScrapStatusCheckResult }>(
      CHECK_SCRAP_STATUS,
      { input }
    );
    if (res.success && res.data?.checkScrapStatus) {
      return { success: true, data: res.data.checkScrapStatus };
    }
    return res as unknown as ApiResponse<ScrapStatusCheckResult>;
  }

  async checkSaleStatus(
    input: CheckSaleStatusInput
  ): Promise<ApiResponse<SaleStatusCheckResult>> {
    const res = await this.mutate<{ checkSaleStatus: SaleStatusCheckResult }>(
      CHECK_SALE_STATUS,
      { input }
    );
    if (res.success && res.data?.checkSaleStatus) {
      return { success: true, data: res.data.checkSaleStatus };
    }
    return res as unknown as ApiResponse<SaleStatusCheckResult>;
  }

  async adminDeleteFloodHistory(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ adminDeleteFloodHistory: boolean }>(
      ADMIN_DELETE_FLOOD_HISTORY,
      { id }
    );
    if (res.success)
      return {
        success: true,
        data: res.data?.adminDeleteFloodHistory ?? false,
      };
    return res as unknown as ApiResponse<boolean>;
  }

  async adminDeleteFloodHistoryBulk(
    input: DeleteApickHistoryInput
  ): Promise<ApiResponse<DeleteApickHistoryOutput>> {
    const res = await this.mutate<{
      adminDeleteFloodHistoryBulk: DeleteApickHistoryOutput;
    }>(ADMIN_DELETE_FLOOD_HISTORY_BULK, { input });
    if (res.success && res.data?.adminDeleteFloodHistoryBulk) {
      return { success: true, data: res.data.adminDeleteFloodHistoryBulk };
    }
    return res as unknown as ApiResponse<DeleteApickHistoryOutput>;
  }

  async adminDeleteScrapHistory(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ adminDeleteScrapHistory: boolean }>(
      ADMIN_DELETE_SCRAP_HISTORY,
      { id }
    );
    if (res.success)
      return {
        success: true,
        data: res.data?.adminDeleteScrapHistory ?? false,
      };
    return res as unknown as ApiResponse<boolean>;
  }

  async adminDeleteScrapHistoryBulk(
    input: DeleteApickHistoryInput
  ): Promise<ApiResponse<DeleteApickHistoryOutput>> {
    const res = await this.mutate<{
      adminDeleteScrapHistoryBulk: DeleteApickHistoryOutput;
    }>(ADMIN_DELETE_SCRAP_HISTORY_BULK, { input });
    if (res.success && res.data?.adminDeleteScrapHistoryBulk) {
      return { success: true, data: res.data.adminDeleteScrapHistoryBulk };
    }
    return res as unknown as ApiResponse<DeleteApickHistoryOutput>;
  }

  async adminDeleteSaleHistory(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.mutate<{ adminDeleteSaleHistory: boolean }>(
      ADMIN_DELETE_SALE_HISTORY,
      { id }
    );
    if (res.success)
      return { success: true, data: res.data?.adminDeleteSaleHistory ?? false };
    return res as unknown as ApiResponse<boolean>;
  }

  async adminDeleteSaleHistoryBulk(
    input: DeleteApickHistoryInput
  ): Promise<ApiResponse<DeleteApickHistoryOutput>> {
    const res = await this.mutate<{
      adminDeleteSaleHistoryBulk: DeleteApickHistoryOutput;
    }>(ADMIN_DELETE_SALE_HISTORY_BULK, { input });
    if (res.success && res.data?.adminDeleteSaleHistoryBulk) {
      return { success: true, data: res.data.adminDeleteSaleHistoryBulk };
    }
    return res as unknown as ApiResponse<DeleteApickHistoryOutput>;
  }

  async updateApickDailyStats(
    input?: GetApickStatsInput
  ): Promise<ApiResponse<GetApickStatsOutput>> {
    const res = await this.mutate<{
      updateApickDailyStats: GetApickStatsOutput;
    }>(UPDATE_APICK_DAILY_STATS, { input });
    if (res.success && res.data?.updateApickDailyStats) {
      return { success: true, data: res.data.updateApickDailyStats };
    }
    return res as unknown as ApiResponse<GetApickStatsOutput>;
  }
}
