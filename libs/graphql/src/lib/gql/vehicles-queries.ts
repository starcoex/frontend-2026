import { gql } from '@apollo/client';

// ===== Fragments =====

export const FUEL_PRICE_FIELDS = gql`
  fragment FuelPriceFields on FuelPrice {
    TRADE_DT
    PRODCD
    PRODNM
    PRICE
    DIFF
    WEEK
    STA_DT
    END_DT
    AREA_CD
    AREA_NM
    POLL_DIV_CD
    POLL_NM
  }
`;

export const GAS_STATION_FIELDS = gql`
  ${FUEL_PRICE_FIELDS}
  fragment GasStationFields on GasStation {
    UNI_ID
    OS_NM
    POLL_DIV_CD
    GPOLL_DIV_CD
    VAN_ADR
    NEW_ADR
    TEL
    SIGUNCD
    LPG_YN
    MAINT_YN
    CAR_WASH_YN
    KPETRO_YN
    CVS_YN
    GIS_X_COOR
    GIS_Y_COOR
    PRICE
    DISTANCE
    OIL_PRICE {
      ...FuelPriceFields
    }
  }
`;

// ===== Queries (Fuel Prices) =====

// 전국 주유소 평균 가격 조회
export const GET_NATIONAL_FUEL_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetNationalFuelPrices($input: GetFuelPriceInput) {
    nationalFuelPrices(input: $input) {
      ...FuelPriceFields
    }
  }
`;

// 시/도별 주유소 평균 가격 조회
export const GET_SIDO_FUEL_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetSidoFuelPrices($input: GetFuelPriceInput) {
    sidoFuelPrices(input: $input) {
      ...FuelPriceFields
    }
  }
`;

// 시/군/구별 주유소 평균 가격 조회
export const GET_SIGUN_FUEL_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetSigunFuelPrices($input: GetFuelPriceInput!) {
    sigunFuelPrices(input: $input) {
      ...FuelPriceFields
    }
  }
`;

// 최근 7일간 전국 일일 평균가격 조회
export const GET_RECENT_FUEL_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetRecentFuelPrices($input: GetFuelPriceInput) {
    recentFuelPrices(input: $input) {
      ...FuelPriceFields
    }
  }
`;

// 최근 7일간 전국 일일 상표별 평균가격 조회
export const GET_POLL_RECENT_FUEL_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetPollRecentFuelPrices($input: GetFuelPriceInput) {
    pollRecentFuelPrices(input: $input) {
      ...FuelPriceFields
    }
  }
`;

// 최근 1주간 주간 평균유가 조회
export const GET_LAST_WEEK_AVG_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetLastWeekAvgPrices($input: GetFuelPriceInput) {
    lastWeekAvgPrices(input: $input) {
      ...FuelPriceFields
    }
  }
`;

// ===== Queries (Date-based Fuel Prices) =====

// 특정 7일간 전국 일일 평균가격 조회
export const GET_DATE_FUEL_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetDateFuelPrices($input: GetDateFuelPriceInput!) {
    dateFuelPrices(input: $input) {
      ...FuelPriceFields
    }
  }
`;

// 특정 7일간 전국 일일 상표별 평균가격 조회
export const GET_DATE_POLL_FUEL_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetDatePollFuelPrices($input: GetDatePollFuelPriceInput!) {
    datePollFuelPrices(input: $input) {
      ...FuelPriceFields
    }
  }
`;

// 특정 7일간 전국 일일 지역별 평균가격 조회
export const GET_DATE_AREA_FUEL_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetDateAreaFuelPrices($input: GetDateAreaFuelPriceInput!) {
    dateAreaFuelPrices(input: $input) {
      ...FuelPriceFields
    }
  }
`;

// 최근 1개월간 일별 평균유가 조회 (전국/시도별)
export const GET_MONTHLY_AVG_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetMonthlyAvgPrices($input: GetMonthlyFuelPriceInput) {
    monthlyAvgPrices(input: $input) {
      data {
        ...FuelPriceFields
      }
      isComplete
      availableDays
      message
    }
  }
`;

// 최근 1개월간 상표별 평균유가 조회
export const GET_MONTHLY_POLL_AVG_PRICES = gql`
  ${FUEL_PRICE_FIELDS}
  query GetMonthlyPollAvgPrices($input: GetMonthlyPollFuelPriceInput) {
    monthlyPollAvgPrices(input: $input) {
      data {
        ...FuelPriceFields
      }
      isComplete
      availableDays
      message
    }
  }
`;

// ===== Queries (Gas Stations) =====

// 지역별 최저가 주유소 TOP 20 조회
export const GET_LOW_TOP_20_STATIONS = gql`
  ${GAS_STATION_FIELDS}
  query GetLowTop20Stations($input: GetLowTop20Input!) {
    lowTop20Stations(input: $input) {
      ...GasStationFields
    }
  }
`;

// 주유소 검색 (반경/상호/지역)
export const SEARCH_GAS_STATIONS = gql`
  ${GAS_STATION_FIELDS}
  query SearchGasStations($input: SearchStationInput!) {
    searchGasStations(input: $input) {
      ...GasStationFields
    }
  }
`;

// 주유소 상세 정보 조회
export const GET_GAS_STATION_DETAIL = gql`
  ${GAS_STATION_FIELDS}
  query GetGasStationDetail($stationId: String!) {
    gasStationDetail(stationId: $stationId) {
      ...GasStationFields
    }
  }
`;

// ===== Queries (Vehicles) =====

// ===== Mutations (Vehicles) =====
