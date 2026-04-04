import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, MapPin, Phone, Mail, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { useStores } from '@starcoex-frontend/stores';
import { useAddress } from '@starcoex-frontend/address';
import { slugify as transliterateSlugify } from 'transliteration';
import { BrandMutateDrawer } from '@/app/pages/dashboard/ecommerce/stores/brands/components/brand-mutate-drawer';
import {
  AddressFormFields,
  addressFormSchema,
  formatPhoneNumber,
  useAddressForm,
} from '@starcoex-frontend/common';

const FormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: '매장명은 최소 2자 이상이어야 합니다.' }),
    slug: z.string().min(2, { message: 'Slug는 최소 2자 이상이어야 합니다.' }),
    brandId: z.string().min(1, { message: '브랜드를 선택해주세요.' }),
    businessTypeId: z
      .string()
      .min(1, { message: '비즈니스 타입을 선택해주세요.' }),
    location: z.string().min(2, { message: '지점명을 입력해주세요.' }),
    phone: z
      .string()
      .regex(/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/, {
        message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)',
      })
      .optional()
      .or(z.literal('')),
    email: z
      .string()
      .email({ message: '이메일 형식이 올바르지 않습니다.' })
      .optional()
      .or(z.literal('')),
    pickupEnabled: z.boolean(),
    isActive: z.boolean(),
    isVisible: z.boolean(),
  })
  .merge(addressFormSchema);

type StoreFormData = z.infer<typeof FormSchema>;

export default function AddStoreForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const {
    createStore,
    brands,
    fetchBrands,
    businessTypes, // ✅ 마스터 데이터
    fetchBusinessTypes,
  } = useStores();
  const { saveAddress } = useAddress();
  const [brandDrawerOpen, setBrandDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StoreFormData>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      brandId: '',
      businessTypeId: '',
      location: '',
      phone: '',
      email: '',
      pickupEnabled: true,
      isActive: true,
      isVisible: true,
      // addressFormSchema 기본값
      roadAddress: '',
      jibunAddress: '',
      zipCode: '',
      addressDetail: '',
      latitude: undefined,
      longitude: undefined,
    },
  });

  // ✅ 공통 훅 — selectedAddress, handleAddressSelect 모두 여기서
  const { selectedAddress, handleAddressSelect } = useAddressForm(form);

  useEffect(() => {
    fetchBrands();
    fetchBusinessTypes(); // ✅ 마스터 데이터 로딩
  }, [fetchBrands, fetchBusinessTypes]);

  const handleNameChange = (name: string) => {
    if (!name.trim()) {
      form.setValue('slug', '');
      return;
    }
    const slug = transliterateSlugify(name, {
      lowercase: true,
      separator: '-',
    });
    form.setValue('slug', slug);
  };

  // 주소 선택 시 지점명 자동 입력 (추가 동작)
  const handleAddressSelectWithLocation = (
    address: Parameters<typeof handleAddressSelect>[0]
  ) => {
    handleAddressSelect(address);
    if (!form.getValues('location')) {
      const locationName = `${address.siNm || ''} ${
        address.sggNm || ''
      }`.trim();
      if (locationName) form.setValue('location', locationName);
    }
  };

  async function onSubmit(data: StoreFormData) {
    if (!currentUser?.id) {
      toast.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }
    if (!selectedAddress) {
      toast.error('주소를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const brandId = parseInt(data.brandId);
      if (isNaN(brandId)) {
        toast.error('유효하지 않은 브랜드입니다.');
        return;
      }

      // 1️⃣ Address Service에 주소 저장
      const addressRes = await saveAddress({
        roadFullAddr: selectedAddress.roadAddr,
        roadAddrPart1: selectedAddress.roadAddr,
        roadAddrPart2: '',
        jibunAddr: selectedAddress.jibunAddr || '',
        engAddr: selectedAddress.engAddr || '',
        zipNo: selectedAddress.zipNo,
        admCd: selectedAddress.admCd || '',
        siNm: selectedAddress.siNm || '',
        sggNm: selectedAddress.sggNm || '',
        emdNm: selectedAddress.emdNm || '',
        rn: selectedAddress.rn || '',
        rnMgtSn: selectedAddress.rnMgtSn || '',
        bdMgtSn: selectedAddress.bdMgtSn || '',
        bdNm: selectedAddress.bdNm || '',
        buildingType: 'SINGLE_HOUSE',
        buldMnnm: parseInt(selectedAddress.buldMnnm || '0'),
        buldSlno: parseInt(selectedAddress.buldSlno || '0'),
        lnbrMnnm: 0,
        lnbrSlno: 0,
        emdNo: '01',
        addrDetail: data.addressDetail || '',
        status: 'ACTIVE',
        dataSource: 'JUSO_API',
      });

      if (!addressRes.success || !addressRes.data) {
        toast.error(addressRes.error?.message || '주소 저장에 실패했습니다.');
        return;
      }

      const addressId = addressRes.data.saveAddress.id;

      // 2️⃣ Store 생성
      const response = await createStore({
        name: data.name,
        slug: data.slug,
        brandId,
        businessTypeId: parseInt(data.businessTypeId),
        location: data.location,
        address: { addressId },
        coordinates:
          data.latitude && data.longitude
            ? { latitude: data.latitude, longitude: data.longitude }
            : undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
        pickupEnabled: data.pickupEnabled,
        isActive: data.isActive,
        isVisible: data.isVisible,
      });

      if (response.success && response.data) {
        toast.success('매장이 성공적으로 등록되었습니다!');
        navigate('/admin/stores');
      } else {
        toast.error(response.error?.message || '매장 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('매장 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin/stores">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">매장 추가</h1>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" asChild>
              <Link to="/admin/stores">취소</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '등록 중...' : '등록하기'}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {/* 왼쪽 col-span-4 */}
          <div className="space-y-4 lg:col-span-4">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>매장명 *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="예: 도두점"
                          onChange={(e) => {
                            field.onChange(e);
                            handleNameChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="dodu-jeju" />
                      </FormControl>
                      <FormDescription>
                        URL에 사용될 고유 식별자입니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>지점명 *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
                          <Input
                            {...field}
                            placeholder="예: 제주 도두점"
                            className="pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 주소 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>주소 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressFormFields
                  form={form}
                  selectedAddress={selectedAddress}
                  onAddressSelect={handleAddressSelectWithLocation}
                />
              </CardContent>
            </Card>

            {/* 연락처 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>연락처 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
                          <Input
                            {...field}
                            placeholder="010-1234-5678"
                            className="pl-9"
                            inputMode="numeric"
                            maxLength={13}
                            onChange={(e) => {
                              field.onChange(formatPhoneNumber(e.target.value));
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="text-muted-foreground absolute left-3 top-3 h-4 w-4" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="store@example.com"
                            className="pl-9"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽 col-span-2 — 브랜드 상단 고정 */}
          <div className="space-y-4 lg:col-span-2">
            {/* ✅ 브랜드 최상단 */}
            <Card>
              <CardHeader>
                <CardTitle>브랜드</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 소속 브랜드 */}
                <FormField
                  name="brandId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>소속 브랜드 *</FormLabel>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            // 브랜드 변경 시 businessTypeId 초기화
                            form.setValue('businessTypeId', '');
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="브랜드를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {brands.map((brand) => (
                                <SelectItem
                                  key={brand.id}
                                  value={String(brand.id)}
                                >
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setBrandDrawerOpen(true)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ✅ 비즈니스 타입 — 마스터 데이터 사용 */}
                <FormField
                  name="businessTypeId"
                  control={form.control}
                  render={({ field }) => {
                    const selectedBrandId = form.watch('brandId');

                    // ✅ brand.businessTypes 대신 마스터 businessTypes 직접 사용
                    // brand_business_types 연결 여부와 무관하게 동작
                    const activeBusinessTypes = businessTypes.filter(
                      (bt) => bt.isActive
                    );

                    // 선택된 비즈니스 타입의 허용 서비스
                    const selectedBt = activeBusinessTypes.find(
                      (bt) => String(bt.id) === field.value
                    );
                    const allowedServices = selectedBt?.allowedServices ?? [];

                    return (
                      <FormItem>
                        <FormLabel>비즈니스 타입 *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={
                            !selectedBrandId || activeBusinessTypes.length === 0
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !selectedBrandId
                                    ? '브랜드를 먼저 선택하세요'
                                    : activeBusinessTypes.length === 0
                                    ? '비즈니스 타입을 먼저 등록하세요'
                                    : '비즈니스 타입 선택'
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {activeBusinessTypes.map((bt) => (
                                <SelectItem key={bt.id} value={String(bt.id)}>
                                  {bt.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {!selectedBrandId && (
                          <FormDescription className="text-xs">
                            브랜드 선택 후 활성화됩니다.
                          </FormDescription>
                        )}
                        {allowedServices.length > 0 && (
                          <div className="mt-2">
                            <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                              운영 가능 서비스
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {allowedServices.map((s) => (
                                <span
                                  key={s.id}
                                  className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs"
                                >
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </CardContent>
            </Card>

            {/* 매장 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>매장 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: 'pickupEnabled' as const,
                    label: '픽업 가능',
                    desc: '고객이 매장에서 직접 픽업 가능',
                  },
                  {
                    name: 'isActive' as const,
                    label: '활성화',
                    desc: '매장 운영 활성화 여부',
                  },
                  {
                    name: 'isVisible' as const,
                    label: '고객 노출',
                    desc: '고객에게 매장 정보 노출',
                  },
                ].map(({ name, label, desc }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>{label}</FormLabel>
                          <FormDescription className="text-xs">
                            {desc}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <BrandMutateDrawer
          open={brandDrawerOpen}
          onOpenChange={setBrandDrawerOpen}
        />
      </form>
    </Form>
  );
}
