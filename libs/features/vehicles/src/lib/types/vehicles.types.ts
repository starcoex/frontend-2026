import {
  FuelPrice,
  GasStation,
  GetFuelPriceInput,
  GetLowTop20Input,
  GetMonthlyFuelPriceInput,
  GetMonthlyPollFuelPriceInput,
  MonthlyFuelPriceResponse,
  SearchStationInput,
} from '@starcoex-frontend/graphql';
import type { ApiResponse } from '../types';

export interface IVehiclesService {
  // Fuel Prices
  getNationalFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getSidoFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getSigunFuelPrices(
    input: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getRecentFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getPollRecentFuelPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getLastWeekAvgPrices(
    input?: GetFuelPriceInput
  ): Promise<ApiResponse<FuelPrice[]>>;
  getMonthlyAvgPrices(
    input?: GetMonthlyFuelPriceInput
  ): Promise<ApiResponse<MonthlyFuelPriceResponse>>;
  getMonthlyPollAvgPrices(
    input?: GetMonthlyPollFuelPriceInput
  ): Promise<ApiResponse<MonthlyFuelPriceResponse>>;

  // Gas Stations
  getLowTop20Stations(
    input: GetLowTop20Input
  ): Promise<ApiResponse<GasStation[]>>;
  searchGasStations(
    input: SearchStationInput
  ): Promise<ApiResponse<GasStation[]>>;
  getGasStationDetail(stationId: string): Promise<ApiResponse<GasStation>>;

  // Vehicles
}
