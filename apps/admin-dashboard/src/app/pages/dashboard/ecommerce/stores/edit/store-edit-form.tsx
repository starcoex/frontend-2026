import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  Pencil,
  Loader2,
} from 'lucide-react';
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
import { useStores } from '@starcoex-frontend/stores';
import { useAddress } from '@starcoex-frontend/address';
import type { Store } from '@starcoex-frontend/stores';
import type { Address } from '@starcoex-frontend/graphql';
import {
  AddressFormFields,
  formatPhoneNumber,
  useAddressForm,
} from '@starcoex-frontend/common';
import { Textarea } from '@/components/ui/textarea';

const FormSchema = z.object({
  name: z.string().min(2, { message: '매장명은 최소 2자 이상이어야 합니다.' }),
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
  businessHours: z.string().optional(),
  // 주소 필드 — 주소 변경 모드일 때만 사용, 평소엔 비어있어도 통과
  roadAddress: z.string().optional(),
  jibunAddress: z.string().optional(),
  zipCode: z.string().optional(),
  addressDetail: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type StoreEditFormData = z.infer<typeof FormSchema>;

interface Props {
  store: Store;
}

export default function StoreEditForm({ store }: Props) {
  const navigate = useNavigate();
  const { updateStore, brands, businessTypes } = useStores(); // ✅ businessTypes 마스터
  const { saveAddress, getUserAddressById } = useAddress(); // ✅ 주소 직접 조회

  const [isAddressEditMode, setIsAddressEditMode] = useState(false);

  // ✅ addressSnapshot 대신 apps/address에서 직접 조회 (store-detail-page 패턴)
  const [storeAddress, setStoreAddress] = useState<Partial<Address> | null>(
    null
  );
  const [addressLoading, setAddressLoading] = useState(false);
  const addressFetchedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!store.addressId) return;
    if (addressFetchedRef.current === store.addressId) return;
    addressFetchedRef.current = store.addressId;

    setAddressLoading(true);
    getUserAddressById(store.addressId)
      .then((res) => {
        if (res.success && res.data?.getUserAddressById) {
          setStoreAddress(res.data.getUserAddressById as Partial<Address>);
        }
      })
      .finally(() => setAddressLoading(false));
  }, [store.addressId]);

  // ✅ 활성화된 비즈니스 타입 마스터 (add-store-form 패턴)
  const activeBusinessTypes = businessTypes.filter((bt) => bt.isActive);

  const form = useForm<StoreEditFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: store.name ?? '',
      slug: store.slug ?? '',
      brandId: String(store.brandId ?? ''),
      businessTypeId: String(store.businessTypeId ?? ''),
      location: store.location ?? '',
      phone: store.phone ?? '',
      email: store.email ?? '',
      pickupEnabled: store.pickupEnabled ?? true,
      isActive: store.isActive ?? true,
      isVisible: store.isVisible ?? true,
      roadAddress: '',
      jibunAddress: '',
      zipCode: '',
      addressDetail: '',
      latitude: undefined,
      longitude: undefined,
      businessHours: (() => {
        if (!store.businessHours) return '';
        if (typeof store.businessHours === 'string') return store.businessHours;
        const bh = store.businessHours as Record<string, unknown>;
        if (typeof bh.text === 'string') return bh.text;
        return '';
      })(),
    },
  });

  const { selectedAddress, handleAddressSelect } = useAddressForm(form);

  async function onSubmit(data: StoreEditFormData) {
    let addressId: number | undefined;

    if (isAddressEditMode && selectedAddress) {
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
      addressId = addressRes.data.saveAddress.id;
    }

    const res = await updateStore({
      id: store.id,
      name: data.name,
      slug: data.slug,
      brandId: parseInt(data.brandId),
      businessTypeId: parseInt(data.businessTypeId),
      location: data.location,
      phone: data.phone || undefined,
      email: data.email || undefined,
      pickupEnabled: data.pickupEnabled,
      isActive: data.isActive,
      isVisible: data.isVisible,
      ...(addressId ? { address: { addressId } } : {}),
      businessHours: data.businessHours
        ? { text: data.businessHours } // JSON으로 감싸서 저장
        : undefined,
    });

    if (res.success) {
      toast.success('매장 정보가 수정되었습니다.');
      navigate(`/admin/stores/${store.id}`);
    } else {
      toast.error(res.error?.message ?? '수정에 실패했습니다.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to={`/admin/stores/${store.id}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              매장 수정 — {store.name}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" asChild>
              <Link to={`/admin/stores/${store.id}`}>취소</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
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
                        <Input {...field} placeholder="예: 도두점" />
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

            {/* 주소 정보 — apps/address에서 조회 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>주소 정보</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddressEditMode((prev) => !prev)}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    {isAddressEditMode ? '변경 취소' : '주소 변경'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!isAddressEditMode ? (
                  // ✅ apps/address에서 조회한 주소 표시
                  <div className="text-sm space-y-1">
                    {addressLoading ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="size-3 animate-spin" />
                        <span className="text-xs">주소 불러오는 중...</span>
                      </div>
                    ) : storeAddress?.roadFullAddr ? (
                      <>
                        <p className="font-medium">
                          {storeAddress.roadFullAddr}
                        </p>
                        {storeAddress.addrDetail && (
                          <p className="text-muted-foreground">
                            {storeAddress.addrDetail}
                          </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                          우편번호: {storeAddress.zipNo ?? '-'}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">
                        {store.addressId
                          ? '주소를 불러오지 못했습니다.'
                          : '등록된 주소가 없습니다.'}
                      </p>
                    )}
                  </div>
                ) : (
                  <AddressFormFields
                    form={form}
                    selectedAddress={selectedAddress}
                    onAddressSelect={handleAddressSelect}
                  />
                )}
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
            {/* 운영 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>운영 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="businessHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>영업시간</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="예: 평일 09:00~22:00, 주말 09:00~18:00, 일요일 휴무"
                          className="resize-none"
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 lg:col-span-2">
            {/* 브랜드 */}
            <Card>
              <CardHeader>
                <CardTitle>브랜드</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  name="brandId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>소속 브랜드 *</FormLabel>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          // ✅ 브랜드 변경 시 businessTypeId 초기화
                          form.setValue('businessTypeId', '');
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="브랜드를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {brands.map((b) => (
                              <SelectItem key={b.id} value={String(b.id)}>
                                {b.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ✅ businessTypes 마스터 사용 (add-store-form 패턴) */}
                <FormField
                  name="businessTypeId"
                  control={form.control}
                  render={({ field }) => {
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
                          disabled={activeBusinessTypes.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  activeBusinessTypes.length === 0
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
                            checked={field.value as boolean}
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
      </form>
    </Form>
  );
}
