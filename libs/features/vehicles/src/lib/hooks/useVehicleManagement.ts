import { useCallback, useRef, useMemo } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { VehiclesService } from '../services';
import { useVehicleContext } from '../context/vehicles.context';
import type { ApiResponse } from '../types';
import type {
  Vehicle,
  VehicleBrand,
  VehicleModel,
  VehicleDimensionRule,
  CreateVehicleOutput,
  CreateVehicleBrandOutput,
  CreateVehicleModelOutput,
  CreateVehicleDimensionRuleOutput,
  ResolveGradeOutput,
  CreateVehicleInput,
  CreateVehicleBrandInput,
  CreateVehicleModelInput,
  CreateVehicleDimensionRuleInput,
  ResolveGradeInput,
} from '../types';

export const useVehicleManagement = () => {
  const client = useApolloClient();
  const service = useMemo(() => new VehiclesService(client), [client]);

  const context = useVehicleContext();
  const {
    setVehicles,
    addVehicle,
    updateVehicleInContext,
    removeVehicle,
    setCurrentVehicle,
    setBrands,
    setModels,
    setDimensionRules,
    setLoading,
    setError,
    clearError,
    isLoading: contextIsLoading,
    vehicles,
    currentVehicle,
    brands,
    models,
    dimensionRules,
  } = context;

  const isLoadingRef = useRef(contextIsLoading);
  isLoadingRef.current = contextIsLoading;

  const withLoading = useCallback(
    async <T>(
      operation: () => Promise<ApiResponse<T>>,
      defaultErrorMessage: string
    ): Promise<ApiResponse<T>> => {
      try {
        if (!isLoadingRef.current) setLoading(true);
        clearError();
        const res = await operation();
        if (!res.success) {
          setError(res.error?.message ?? defaultErrorMessage);
        }
        return res;
      } catch (e) {
        console.error(e);
        setError(defaultErrorMessage);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // ── Queries ──────────────────────────────────────────────────────────────────

  const fetchVehicleById = useCallback(
    async (id: number): Promise<ApiResponse<Vehicle>> =>
      withLoading(async () => {
        const res = await service.getVehicleById(id);
        if (res.success && res.data) setCurrentVehicle(res.data);
        return res;
      }, '차량 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentVehicle, service]
  );

  const fetchVehicleByCarNo = useCallback(
    async (carNo: string): Promise<ApiResponse<Vehicle>> =>
      withLoading(async () => {
        const res = await service.getVehicleByCarNo(carNo);
        if (res.success && res.data) setCurrentVehicle(res.data);
        return res;
      }, '차량 정보를 불러오는데 실패했습니다.'),
    [withLoading, setCurrentVehicle, service]
  );

  const fetchMyVehicles = useCallback(
    async (limit = 20, offset = 0): Promise<ApiResponse<Vehicle[]>> =>
      withLoading(async () => {
        const res = await service.myVehicles(limit, offset);
        if (res.success && res.data) setVehicles(res.data);
        return res;
      }, '내 차량 목록을 불러오는데 실패했습니다.'),
    [withLoading, setVehicles, service]
  );

  const fetchAdminVehicles = useCallback(
    async (
      limit = 20,
      offset = 0,
      status?: string
    ): Promise<ApiResponse<Vehicle[]>> =>
      withLoading(async () => {
        const res = await service.adminVehicles(limit, offset, status);
        if (res.success && res.data) setVehicles(res.data);
        return res;
      }, '차량 목록을 불러오는데 실패했습니다.'),
    [withLoading, setVehicles, service]
  );

  const fetchPendingReviewVehicles = useCallback(
    async (limit = 20, offset = 0): Promise<ApiResponse<Vehicle[]>> =>
      withLoading(async () => {
        const res = await service.pendingReviewVehicles(limit, offset);
        if (res.success && res.data) setVehicles(res.data);
        return res;
      }, '검토 대기 차량 목록을 불러오는데 실패했습니다.'),
    [withLoading, setVehicles, service]
  );

  const fetchLowConfidenceVehicles = useCallback(
    async (limit = 20, offset = 0): Promise<ApiResponse<Vehicle[]>> =>
      withLoading(async () => {
        const res = await service.lowConfidenceVehicles(limit, offset);
        if (res.success && res.data) setVehicles(res.data);
        return res;
      }, '낮은 신뢰도 차량 목록을 불러오는데 실패했습니다.'),
    [withLoading, setVehicles, service]
  );

  const fetchVehicleBrands = useCallback(
    async (onlyActive = true): Promise<ApiResponse<VehicleBrand[]>> =>
      withLoading(async () => {
        const res = await service.vehicleBrands(onlyActive);
        if (res.success && res.data) setBrands(res.data);
        return res;
      }, '브랜드 목록을 불러오는데 실패했습니다.'),
    [withLoading, setBrands, service]
  );

  const fetchVehicleBrand = useCallback(
    async (id: number): Promise<ApiResponse<VehicleBrand>> =>
      withLoading(
        () => service.vehicleBrand(id),
        '브랜드 정보를 불러오는데 실패했습니다.'
      ),
    [withLoading, service]
  );

  const fetchVehicleModelsByBrand = useCallback(
    async (brandId: number): Promise<ApiResponse<VehicleModel[]>> =>
      withLoading(async () => {
        const res = await service.vehicleModelsByBrand(brandId);
        if (res.success && res.data) setModels(res.data);
        return res;
      }, '차량 모델 목록을 불러오는데 실패했습니다.'),
    [withLoading, setModels, service]
  );

  const fetchVehicleModelsByGrade = useCallback(
    async (
      sizeGrade: string,
      bodyType?: string
    ): Promise<ApiResponse<VehicleModel[]>> =>
      withLoading(async () => {
        const res = await service.vehicleModelsByGrade(sizeGrade, bodyType);
        if (res.success && res.data) setModels(res.data);
        return res;
      }, '차량 모델 목록을 불러오는데 실패했습니다.'),
    [withLoading, setModels, service]
  );

  const fetchDimensionRules = useCallback(
    async (bodyType?: string): Promise<ApiResponse<VehicleDimensionRule[]>> =>
      withLoading(async () => {
        const res = await service.vehicleDimensionRules(bodyType);
        if (res.success && res.data) setDimensionRules(res.data);
        return res;
      }, '차체 치수 룰을 불러오는데 실패했습니다.'),
    [withLoading, setDimensionRules, service]
  );

  const resolveVehicleGrade = useCallback(
    async (
      input: ResolveGradeInput
    ): Promise<ApiResponse<ResolveGradeOutput>> =>
      withLoading(
        () => service.resolveVehicleGrade(input),
        '차량 등급 결정에 실패했습니다.'
      ),
    [withLoading, service]
  );

  // ── Mutations ─────────────────────────────────────────────────────────────────

  const createVehicle = useCallback(
    async (
      input: CreateVehicleInput
    ): Promise<ApiResponse<CreateVehicleOutput>> =>
      withLoading(async () => {
        const res = await service.createVehicle(input);
        if (res.success && res.data?.vehicle) addVehicle(res.data.vehicle);
        return res;
      }, '차량 등록에 실패했습니다.'),
    [withLoading, addVehicle, service]
  );

  const overrideVehicleGrade = useCallback(
    async (
      vehicleId: number,
      sizeGrade: string,
      bodyType: string,
      reason: string
    ): Promise<ApiResponse<Vehicle>> =>
      withLoading(async () => {
        const res = await service.overrideVehicleGrade(
          vehicleId,
          sizeGrade,
          bodyType,
          reason
        );
        if (res.success && res.data)
          updateVehicleInContext(vehicleId, res.data);
        return res;
      }, '차량 등급 수동 지정에 실패했습니다.'),
    [withLoading, updateVehicleInContext, service]
  );

  const deleteVehicle = useCallback(
    async (vehicleId: number): Promise<ApiResponse<boolean>> =>
      withLoading(async () => {
        const res = await service.deleteVehicle(vehicleId);
        if (res.success) removeVehicle(vehicleId);
        return res;
      }, '차량 삭제에 실패했습니다.'),
    [withLoading, removeVehicle, service]
  );

  const updateVehicleStatus = useCallback(
    async (vehicleId: number, status: string): Promise<ApiResponse<Vehicle>> =>
      withLoading(async () => {
        const res = await service.updateVehicleStatus(vehicleId, status);
        if (res.success && res.data)
          updateVehicleInContext(vehicleId, res.data);
        return res;
      }, '차량 상태 변경에 실패했습니다.'),
    [withLoading, updateVehicleInContext, service]
  );

  const createVehicleBrand = useCallback(
    async (
      input: CreateVehicleBrandInput
    ): Promise<ApiResponse<CreateVehicleBrandOutput>> =>
      withLoading(async () => {
        const res = await service.createVehicleBrand(input);
        if (res.success && res.data?.vehicleBrand) {
          setBrands([...brands, res.data.vehicleBrand]);
        }
        return res;
      }, '브랜드 생성에 실패했습니다.'),
    [withLoading, setBrands, brands, service]
  );

  const updateVehicleBrand = useCallback(
    async (
      id: number,
      input: CreateVehicleBrandInput
    ): Promise<ApiResponse<VehicleBrand>> =>
      withLoading(async () => {
        const res = await service.updateVehicleBrand(id, input);
        if (res.success && res.data) {
          setBrands(brands.map((b) => (b.id === id ? res.data! : b)));
        }
        return res;
      }, '브랜드 수정에 실패했습니다.'),
    [withLoading, setBrands, brands, service]
  );

  const deleteVehicleBrand = useCallback(
    async (id: number): Promise<ApiResponse<boolean>> =>
      withLoading(async () => {
        const res = await service.deleteVehicleBrand(id);
        if (res.success) setBrands(brands.filter((b) => b.id !== id));
        return res;
      }, '브랜드 삭제에 실패했습니다.'),
    [withLoading, setBrands, brands, service]
  );

  const createVehicleModel = useCallback(
    async (
      input: CreateVehicleModelInput
    ): Promise<ApiResponse<CreateVehicleModelOutput>> =>
      withLoading(async () => {
        const res = await service.createVehicleModel(input);
        if (res.success && res.data?.vehicleModel) {
          setModels([...models, res.data.vehicleModel]);
        }
        return res;
      }, '차량 모델 생성에 실패했습니다.'),
    [withLoading, setModels, models, service]
  );

  const updateVehicleModel = useCallback(
    async (
      id: number,
      input: CreateVehicleModelInput
    ): Promise<ApiResponse<VehicleModel>> =>
      withLoading(async () => {
        const res = await service.updateVehicleModel(id, input);
        if (res.success && res.data) {
          setModels(models.map((m) => (m.id === id ? res.data! : m)));
        }
        return res;
      }, '차량 모델 수정에 실패했습니다.'),
    [withLoading, setModels, models, service]
  );

  const deleteVehicleModel = useCallback(
    async (id: number): Promise<ApiResponse<boolean>> =>
      withLoading(async () => {
        const res = await service.deleteVehicleModel(id);
        if (res.success) setModels(models.filter((m) => m.id !== id));
        return res;
      }, '차량 모델 삭제에 실패했습니다.'),
    [withLoading, setModels, models, service]
  );

  const createVehicleDimensionRule = useCallback(
    async (
      input: CreateVehicleDimensionRuleInput
    ): Promise<ApiResponse<CreateVehicleDimensionRuleOutput>> =>
      withLoading(async () => {
        const res = await service.createVehicleDimensionRule(input);
        if (res.success && res.data?.rule) {
          setDimensionRules([...dimensionRules, res.data.rule]);
        }
        return res;
      }, '차체 치수 룰 생성에 실패했습니다.'),
    [withLoading, setDimensionRules, dimensionRules, service]
  );

  const deleteDimensionRule = useCallback(
    async (id: number): Promise<ApiResponse<boolean>> =>
      withLoading(async () => {
        const res = await service.deleteVehicleDimensionRule(id);
        if (res.success)
          setDimensionRules(dimensionRules.filter((r) => r.id !== id));
        return res;
      }, '차체 치수 룰 삭제에 실패했습니다.'),
    [withLoading, setDimensionRules, dimensionRules, service]
  );

  return {
    ...context,
    vehicles,
    currentVehicle,
    brands,
    models,
    dimensionRules,
    // Queries
    fetchVehicleById,
    fetchVehicleByCarNo,
    fetchMyVehicles,
    fetchAdminVehicles,
    fetchPendingReviewVehicles,
    fetchLowConfidenceVehicles,
    fetchVehicleBrands,
    fetchVehicleBrand,
    fetchVehicleModelsByBrand,
    fetchVehicleModelsByGrade,
    fetchDimensionRules,
    resolveVehicleGrade,
    // Mutations
    createVehicle,
    overrideVehicleGrade,
    deleteVehicle,
    updateVehicleStatus,
    createVehicleBrand,
    updateVehicleBrand,
    deleteVehicleBrand,
    createVehicleModel,
    updateVehicleModel,
    deleteVehicleModel,
    createVehicleDimensionRule,
    deleteDimensionRule,
  };
};
