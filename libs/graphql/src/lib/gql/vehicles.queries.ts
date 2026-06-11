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

export const GET_VEHICLE_BY_ID = gql`
  query GetVehicleById($id: Int!) {
    getVehicleById(id: $id) {
      id
      userId
      carNo
      ownerName
      displayName
      dataSource
      status
      isVerified
      verifiedBy
      verifiedAt
      apiCarName
      apiCarTypeName
      apiCarClassName
      apiVin
      apiModelYear
      apiMakingDate
      apiFirstRegDate
      apiFuelType
      apiColor
      apiDisplacement
      apiSeatingCap
      apiBodyLength
      apiBodyWidth
      apiBodyHeight
      apiVehicleWeight
      apiTotalWeight
      apiEngineType
      apiMaxPower
      vehicleModelId
      resolvedGrade
      resolvedBody
      gradeSource
      gradeConfidence
      createdByAdmin
      adminReason
      createdAt
      updatedAt
      deletedAt
      vehicleModel {
        id
        name
        bodyType
        sizeGrade
        brand {
          id
          name
        }
      }
      adminEdits {
        id
        editType
        reason
        oldValues
        newValues
        createdAt
      }
    }
  }
`;

export const GET_VEHICLE_BY_CAR_NO = gql`
  query GetVehicleByCarNo($carNo: String!) {
    getVehicleByCarNo(carNo: $carNo) {
      id
      userId
      carNo
      ownerName
      displayName
      dataSource
      status
      isVerified
      apiCarName
      apiCarTypeName
      apiCarClassName
      resolvedGrade
      resolvedBody
      gradeSource
      gradeConfidence
      createdAt
      updatedAt
      vehicleModel {
        id
        name
        bodyType
        sizeGrade
      }
    }
  }
`;

export const MY_VEHICLES = gql`
  query MyVehicles($limit: Int, $offset: Int) {
    myVehicles(limit: $limit, offset: $offset) {
      id
      userId
      carNo
      ownerName
      displayName
      dataSource
      status
      isVerified
      apiCarName
      resolvedGrade
      resolvedBody
      gradeConfidence
      createdAt
      updatedAt
    }
  }
`;

export const PENDING_REVIEW_VEHICLES = gql`
  query PendingReviewVehicles($limit: Int, $offset: Int) {
    pendingReviewVehicles(limit: $limit, offset: $offset) {
      id
      userId
      carNo
      ownerName
      dataSource
      status
      isVerified
      apiCarName
      apiCarClassName
      resolvedGrade
      resolvedBody
      gradeSource
      gradeConfidence
      createdAt
      updatedAt
    }
  }
`;

export const ADMIN_VEHICLES = gql`
  query AdminVehicles($limit: Int, $offset: Int, $status: String) {
    adminVehicles(limit: $limit, offset: $offset, status: $status) {
      id
      userId
      carNo
      ownerName
      displayName
      dataSource
      status
      isVerified
      apiCarName
      apiCarClassName
      resolvedGrade
      resolvedBody
      gradeSource
      gradeConfidence
      createdAt
      updatedAt
    }
  }
`;

export const LOW_CONFIDENCE_VEHICLES = gql`
  query LowConfidenceVehicles($limit: Int, $offset: Int) {
    lowConfidenceVehicles(limit: $limit, offset: $offset) {
      id
      userId
      carNo
      ownerName
      dataSource
      status
      apiCarName
      apiCarClassName
      resolvedGrade
      resolvedBody
      gradeSource
      gradeConfidence
      createdAt
      updatedAt
    }
  }
`;

export const VEHICLE_BRANDS = gql`
  query VehicleBrands($onlyActive: Boolean) {
    vehicleBrands(onlyActive: $onlyActive) {
      id
      name
      nameEn
      isActive
      createdAt
      updatedAt
      models {
        id
        name
        bodyType
        sizeGrade
        isActive
      }
    }
  }
`;

export const VEHICLE_BRAND = gql`
  query VehicleBrand($id: Int!) {
    vehicleBrand(id: $id) {
      id
      name
      nameEn
      isActive
      createdAt
      updatedAt
      models {
        id
        name
        bodyType
        sizeGrade
        isActive
      }
    }
  }
`;

export const VEHICLE_MODELS_BY_BRAND = gql`
  query VehicleModelsByBrand($brandId: Int!) {
    vehicleModelsByBrand(brandId: $brandId) {
      id
      brandId
      name
      bodyType
      sizeGrade
      aliases
      apiClassName
      refLength
      refWidth
      yearFrom
      yearTo
      dataSource
      isVerified
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const VEHICLE_MODELS_BY_GRADE = gql`
  query VehicleModelsByGrade($sizeGrade: String!, $bodyType: String) {
    vehicleModelsByGrade(sizeGrade: $sizeGrade, bodyType: $bodyType) {
      id
      brandId
      name
      bodyType
      sizeGrade
      isActive
      brand {
        id
        name
      }
    }
  }
`;

export const VEHICLE_DIMENSION_RULES = gql`
  query VehicleDimensionRules($bodyType: String) {
    vehicleDimensionRules(bodyType: $bodyType) {
      id
      bodyType
      minLength
      maxLength
      sizeGrade
      createdAt
      updatedAt
    }
  }
`;

export const RESOLVE_VEHICLE_GRADE = gql`
  query ResolveVehicleGrade($input: ResolveGradeInput!) {
    resolveVehicleGrade(input: $input) {
      success
      error {
        code
        message
        details
      }
      grade
      bodyType
      source
      confidence
      vehicleModelId
    }
  }
`;

// ===== Mutations (Vehicles) =====

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle($input: CreateVehicleInput!) {
    createVehicle(input: $input) {
      success
      error {
        code
        message
        details
      }
      vehicle {
        id
        userId
        carNo
        ownerName
        displayName
        dataSource
        status
        isVerified
        resolvedGrade
        resolvedBody
        gradeSource
        gradeConfidence
        createdAt
        updatedAt
      }
      gradeMessage
    }
  }
`;

export const OVERRIDE_VEHICLE_GRADE = gql`
  mutation OverrideVehicleGrade(
    $vehicleId: Int!
    $sizeGrade: String!
    $bodyType: String!
    $reason: String!
  ) {
    overrideVehicleGrade(
      vehicleId: $vehicleId
      sizeGrade: $sizeGrade
      bodyType: $bodyType
      reason: $reason
    ) {
      id
      resolvedGrade
      resolvedBody
      gradeSource
      gradeConfidence
      updatedAt
    }
  }
`;

export const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($vehicleId: Int!) {
    deleteVehicle(vehicleId: $vehicleId)
  }
`;

export const UPDATE_VEHICLE_STATUS = gql`
  mutation UpdateVehicleStatus($vehicleId: Int!, $status: String!) {
    updateVehicleStatus(vehicleId: $vehicleId, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const CREATE_VEHICLE_BRAND = gql`
  mutation CreateVehicleBrand($input: CreateVehicleBrandInput!) {
    createVehicleBrand(input: $input) {
      success
      error {
        code
        message
        details
      }
      vehicleBrand {
        id
        name
        nameEn
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_VEHICLE_MODEL = gql`
  mutation CreateVehicleModel($input: CreateVehicleModelInput!) {
    createVehicleModel(input: $input) {
      success
      error {
        code
        message
        details
      }
      vehicleModel {
        id
        brandId
        name
        bodyType
        sizeGrade
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_VEHICLE_DIMENSION_RULE = gql`
  mutation CreateVehicleDimensionRule(
    $input: CreateVehicleDimensionRuleInput!
  ) {
    createVehicleDimensionRule(input: $input) {
      success
      error {
        code
        message
        details
      }
      rule {
        id
        bodyType
        minLength
        maxLength
        sizeGrade
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_VEHICLE_BRAND = gql`
  mutation UpdateVehicleBrand($id: Int!, $input: CreateVehicleBrandInput!) {
    updateVehicleBrand(id: $id, input: $input) {
      id
      name
      nameEn
      isActive
      updatedAt
    }
  }
`;

export const DELETE_VEHICLE_BRAND = gql`
  mutation DeleteVehicleBrand($id: Int!) {
    deleteVehicleBrand(id: $id)
  }
`;

export const UPDATE_VEHICLE_MODEL = gql`
  mutation UpdateVehicleModel($id: Int!, $input: CreateVehicleModelInput!) {
    updateVehicleModel(id: $id, input: $input) {
      id
      name
      bodyType
      sizeGrade
      isActive
      updatedAt
    }
  }
`;

export const DELETE_VEHICLE_MODEL = gql`
  mutation DeleteVehicleModel($id: Int!) {
    deleteVehicleModel(id: $id)
  }
`;

// ===== Queries (CarCare) =====

export const CAR_CARE_PRICES_BY_STORE = gql`
  query CarCarePricesByStore($storeId: Int!) {
    carCarePricesByStore(storeId: $storeId) {
      id
      storeId
      serviceTypeCode
      bodyType
      sizeGrade
      price
      unit
      priceCondition
      productId
      lastPriceChangedAt
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CAR_CARE_PRICE_BY_GRADE = gql`
  query CarCarePriceByGrade(
    $storeId: Int!
    $serviceTypeCode: String!
    $bodyType: String!
    $sizeGrade: String!
  ) {
    carCarePriceByGrade(
      storeId: $storeId
      serviceTypeCode: $serviceTypeCode
      bodyType: $bodyType
      sizeGrade: $sizeGrade
    ) {
      id
      storeId
      serviceTypeCode
      bodyType
      sizeGrade
      price
      unit
      priceCondition
      productId
      isActive
    }
  }
`;

export const CAR_CARE_SURCHARGES_BY_STORE = gql`
  query CarCareSurchargesByStore($storeId: Int!) {
    carCareSurchargesByStore(storeId: $storeId) {
      id
      storeId
      surchargeType
      description
      minAmount
      maxAmount
      isActive
      createdAt
      updatedAt
    }
  }
`;

// ===== Mutations (CarCare) =====

export const CREATE_CAR_CARE_PRICE = gql`
  mutation CreateCarCarePrice($input: CreateCarCarePriceInput!) {
    createCarCarePrice(input: $input) {
      success
      error {
        code
        message
        details
      }
      carCarePrice {
        id
        storeId
        serviceTypeCode
        bodyType
        sizeGrade
        price
        unit
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_CAR_CARE_SURCHARGE = gql`
  mutation CreateCarCareSurcharge($input: CreateCarCareSurchargeInput!) {
    createCarCareSurcharge(input: $input) {
      success
      error {
        code
        message
        details
      }
      surcharge {
        id
        storeId
        surchargeType
        description
        minAmount
        maxAmount
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_CAR_CARE_PRICE = gql`
  mutation UpdateCarCarePrice($id: Int!, $input: CreateCarCarePriceInput!) {
    updateCarCarePrice(id: $id, input: $input) {
      id
      storeId
      serviceTypeCode
      bodyType
      sizeGrade
      price
      unit
      isActive
      updatedAt
    }
  }
`;

export const DELETE_CAR_CARE_PRICE = gql`
  mutation DeleteCarCarePrice($id: Int!) {
    deleteCarCarePrice(id: $id)
  }
`;

export const DELETE_CAR_CARE_SURCHARGE = gql`
  mutation DeleteCarCareSurcharge($id: Int!) {
    deleteCarCareSurcharge(id: $id)
  }
`;

export const DELETE_VEHICLE_DIMENSION_RULE = gql`
  mutation DeleteVehicleDimensionRule($id: Int!) {
    deleteVehicleDimensionRule(id: $id)
  }
`;

// ===== Queries (Apick) =====

export const ADMIN_FLOOD_HISTORY = gql`
  query AdminFloodHistory($input: GetApickFloodHistoryInput) {
    adminFloodHistory(input: $input) {
      success
      error {
        code
        message
        details
      }
      items {
        requestId
        searchType
        searchValue
        success
        data {
          result
          message
          success
        }
        api {
          apiCost
          responseTime
          apiLogId
        }
        errorMessage
      }
      totalCount
      currentPage
      totalPages
      hasNext
    }
  }
`;

export const ADMIN_FLOOD_HISTORY_BY_ID = gql`
  query AdminFloodHistoryById($id: Int!) {
    adminFloodHistoryById(id: $id) {
      requestId
      searchType
      searchValue
      success
      data {
        result
        message
        success
      }
      api {
        apiCost
        responseTime
        apiLogId
      }
      errorMessage
    }
  }
`;

export const ADMIN_SCRAP_HISTORY = gql`
  query AdminScrapHistory($input: GetApickScrapHistoryInput) {
    adminScrapHistory(input: $input) {
      success
      error {
        code
        message
        details
      }
      items {
        ok
        requestId
        searchType
        searchValue
        success
        data {
          result
          message
          success
        }
        api {
          apiCost
          responseTime
          apiLogId
        }
        errorMessage
      }
      totalCount
      currentPage
      totalPages
      hasNext
    }
  }
`;

export const ADMIN_SCRAP_HISTORY_BY_ID = gql`
  query AdminScrapHistoryById($id: Int!) {
    adminScrapHistoryById(id: $id) {
      ok
      requestId
      searchType
      searchValue
      success
      data {
        result
        message
        success
      }
      api {
        apiCost
        responseTime
        apiLogId
      }
      errorMessage
    }
  }
`;

export const ADMIN_SALE_HISTORY = gql`
  query AdminSaleHistory($input: GetApickSaleHistoryInput) {
    adminSaleHistory(input: $input) {
      success
      error {
        code
        message
        details
      }
      items {
        ok
        requestId
        searchType
        searchValue
        success
        data {
          success
        }
        api {
          apiCost
          responseTime
          apiLogId
        }
        errorMessage
      }
      totalCount
      currentPage
      totalPages
      hasNext
    }
  }
`;

export const ADMIN_SALE_HISTORY_BY_ID = gql`
  query AdminSaleHistoryById($id: Int!) {
    adminSaleHistoryById(id: $id) {
      ok
      requestId
      searchType
      searchValue
      success
      data {
        success
      }
      api {
        apiCost
        responseTime
        apiLogId
      }
      errorMessage
    }
  }
`;

export const SEARCH_APICK_HISTORY = gql`
  query SearchApickHistory($input: SearchApickHistoryInput!) {
    searchApickHistory(input: $input) {
      success
      error {
        code
        message
        details
      }
      result {
        summary {
          searchValue
          searchType
          services
          total
          successful
          failed
          avgResponseTime
        }
        results {
          flood {
            requestId
            searchType
            searchValue
            success
            data {
              result
              message
            }
          }
          scrap {
            ok
            requestId
            searchType
            searchValue
            success
            data {
              result
              message
            }
          }
          sale {
            ok
            requestId
            searchType
            searchValue
            success
          }
        }
        searchedAt
      }
    }
  }
`;

export const APICK_COMPREHENSIVE_STATS = gql`
  query ApickComprehensiveStats($input: GetApickStatsInput) {
    apickComprehensiveStats(input: $input) {
      success
      error {
        code
        message
        details
      }
      stats {
        date
        totalChecks
        successChecks
        failedChecks
        successRate
        avgResponseTime
        totalCost
        floodedVehicles
        scrapVehicles
        saleVehicles
      }
    }
  }
`;

export const APICK_HEALTH_CHECK = gql`
  query ApickHealthCheck {
    apickHealthCheck
  }
`;

export const APICK_ACCOUNT_INFO = gql`
  query ApickAccountInfo {
    apickAccountInfo {
      data {
        email
        name
        phone
        point
        usedPoint
        lastLogin
        pointLimit
        pointLimitNotice
        company
        billingPoint
        isActive
        success
      }
      api {
        success
        cost
        ms
        plId
      }
    }
  }
`;

// ===== Mutations (Apick) =====

export const CHECK_FLOOD_DAMAGE = gql`
  mutation CheckFloodDamage($input: CheckFloodDamageInput!) {
    checkFloodDamage(input: $input) {
      success
      error {
        code
        message
        details
      }
      requestId
      searchType
      searchValue
      data {
        result
        message
        success
      }
      api {
        apiCost
        responseTime
        apiLogId
      }
      errorMessage
    }
  }
`;

export const CHECK_SCRAP_STATUS = gql`
  mutation CheckScrapStatus($input: CheckScrapStatusInput!) {
    checkScrapStatus(input: $input) {
      success
      error {
        code
        message
        details
      }
      requestId
      searchType
      searchValue
      data {
        result
        message
        success
      }
      api {
        apiCost
        responseTime
        apiLogId
      }
      errorMessage
    }
  }
`;

export const CHECK_SALE_STATUS = gql`
  mutation CheckSaleStatus($input: CheckSaleStatusInput!) {
    checkSaleStatus(input: $input) {
      success
      error {
        code
        message
        details
      }
      requestId
      searchType
      searchValue
      api {
        apiCost
        responseTime
        apiLogId
      }
      errorMessage
    }
  }
`;

export const ADMIN_DELETE_FLOOD_HISTORY = gql`
  mutation AdminDeleteFloodHistory($id: Int!) {
    adminDeleteFloodHistory(id: $id)
  }
`;

export const ADMIN_DELETE_FLOOD_HISTORY_BULK = gql`
  mutation AdminDeleteFloodHistoryBulk($input: DeleteApickHistoryInput!) {
    adminDeleteFloodHistoryBulk(input: $input) {
      success
      error {
        code
        message
        details
      }
      deletedCount
    }
  }
`;

export const ADMIN_DELETE_SCRAP_HISTORY = gql`
  mutation AdminDeleteScrapHistory($id: Int!) {
    adminDeleteScrapHistory(id: $id)
  }
`;

export const ADMIN_DELETE_SCRAP_HISTORY_BULK = gql`
  mutation AdminDeleteScrapHistoryBulk($input: DeleteApickHistoryInput!) {
    adminDeleteScrapHistoryBulk(input: $input) {
      success
      error {
        code
        message
        details
      }
      deletedCount
    }
  }
`;

export const ADMIN_DELETE_SALE_HISTORY = gql`
  mutation AdminDeleteSaleHistory($id: Int!) {
    adminDeleteSaleHistory(id: $id)
  }
`;

export const ADMIN_DELETE_SALE_HISTORY_BULK = gql`
  mutation AdminDeleteSaleHistoryBulk($input: DeleteApickHistoryInput!) {
    adminDeleteSaleHistoryBulk(input: $input) {
      success
      error {
        code
        message
        details
      }
      deletedCount
    }
  }
`;

export const UPDATE_APICK_DAILY_STATS = gql`
  mutation UpdateApickDailyStats($input: GetApickStatsInput) {
    updateApickDailyStats(input: $input) {
      success
      error {
        code
        message
        details
      }
      stats {
        id
        date
        totalChecks
        successChecks
        failedChecks
        avgResponseTime
        totalCost
        floodChecks
        floodedVehicles
        scrapChecks
        scrapVehicles
        saleChecks
        saleVehicles
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_CAR_CARE_SURCHARGE = gql`
  mutation UpdateCarCareSurcharge($input: UpdateCarCareSurchargeInput!) {
    updateCarCareSurcharge(input: $input) {
      success
      error {
        code
        message
        details
      }
      surcharge {
        id
        storeId
        surchargeType
        description
        minAmount
        maxAmount
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;
