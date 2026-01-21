import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
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
import { useEffect, useState } from 'react';
import { AddBrandDialog } from '@/app/pages/dashboard/ecommerce/stores/create/add-brand-dialog';
import { JusoApiAddress } from '@starcoex-frontend/graphql';
import { AddressSearchInput } from '@/components/address-search';
import { slugify as transliterateSlugify } from 'transliteration'; // ✅ 추가

const FormSchema = z.object({
  name: z.string().min(2, {
    message: '매장명은 최소 2자 이상이어야 합니다.',
  }),
  slug: z.string().min(2, {
    message: 'Slug는 최소 2자 이상이어야 합니다.',
  }),
  brandId: z.string().min(1, {
    message: '브랜드를 선택해주세요.',
  }),
  location: z.string().min(2, {
    message: '지점명을 입력해주세요.',
  }),
  // ✅ 주소 필드 구조화
  roadAddress: z.string().min(5, {
    message: '도로명 주소를 입력해주세요.',
  }),
  jibunAddress: z.string().optional(),
  zipCode: z.string().min(5, {
    message: '우편번호를 입력해주세요.',
  }),
  addressDetail: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  services: z.string().optional(),
  pickupEnabled: z.boolean(),
  isActive: z.boolean(),
  isVisible: z.boolean(),
});

type StoreFormData = z.infer<typeof FormSchema>;

export default function AddStoreForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { createStore, brands, fetchBrands } = useStores();

  // ✅ 주소 선택 상태
  const [selectedAddress, setSelectedAddress] = useState<JusoApiAddress | null>(
    null
  );

  const form = useForm<StoreFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      slug: '',
      brandId: '',
      location: '',
      roadAddress: '',
      jibunAddress: '',
      zipCode: '',
      addressDetail: '',
      phone: '',
      email: '',
      services: '',
      pickupEnabled: true,
      isActive: true,
      isVisible: true,
    },
  });

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleNameChange = (name: string) => {
    if (!name.trim()) {
      form.setValue('slug', '');
      return;
    }

    // ✅ transliteration 라이브러리는 한글을 매우 정확하게 변환
    const slug = transliterateSlugify(name, {
      lowercase: true,
      separator: '-',
    });

    console.log('🔍 매장명:', name, '→ Slug:', slug);

    form.setValue('slug', slug);
  };

  // ✅ 주소 선택 핸들러
  const handleAddressSelect = (address: JusoApiAddress) => {
    setSelectedAddress(address);
    form.setValue('roadAddress', address.roadAddr);
    form.setValue('jibunAddress', address.jibunAddr || '');
    form.setValue('zipCode', address.zipNo);

    // 지점명에 지역명 자동 입력 (선택사항)
    if (!form.getValues('location')) {
      const locationName = `${address.siNm || ''} ${
        address.sggNm || ''
      }`.trim();
      form.setValue('location', locationName);
    }

    toast.success('주소가 선택되었습니다.');
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!currentUser?.id) {
      toast.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      const brandId = parseInt(data.brandId);
      if (isNaN(brandId)) {
        toast.error('유효하지 않은 브랜드입니다.');
        return;
      }

      const services = data.services
        ? data.services.split(',').map((s) => s.trim())
        : [];

      // ✅ 구조화된 주소 객체
      const address = {
        street: data.roadAddress,
        city: selectedAddress?.siNm || '',
        district: selectedAddress?.sggNm || '',
        zipCode: data.zipCode,
        detail: data.addressDetail || '',
        jibunAddress: data.jibunAddress || '',
      };

      const response = await createStore({
        name: data.name,
        slug: data.slug,
        brandId,
        location: data.location,
        address,
        phone: data.phone || undefined,
        email: data.email || undefined,
        services,
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
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin/stores">
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">매장 추가</h1>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" asChild>
              <Link to="/admin/stores">취소</Link>
            </Button>
            <Button type="submit">등록하기</Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          <div className="space-y-4 lg:col-span-4">
            {/* 기본 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                </div>
              </CardContent>
            </Card>

            {/* ✅ 주소 정보 (주소 검색 통합) */}
            <Card>
              <CardHeader>
                <CardTitle>주소 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 주소 검색 */}
                  <div>
                    <FormLabel>주소 검색 *</FormLabel>
                    <AddressSearchInput
                      onSelectAddress={handleAddressSelect}
                      className="mt-2"
                    />
                    <FormDescription className="mt-2">
                      도로명 주소 또는 건물명으로 검색하세요.
                    </FormDescription>
                  </div>

                  {/* 선택된 주소 표시 */}
                  {selectedAddress && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-green-900">
                            {selectedAddress.roadAddr}
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            지번: {selectedAddress.jibunAddr}
                          </p>
                          <p className="text-xs text-green-700">
                            우편번호: {selectedAddress.zipNo}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 도로명 주소 (읽기 전용) */}
                  <FormField
                    control={form.control}
                    name="roadAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>도로명 주소 *</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-muted" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 우편번호 (읽기 전용) */}
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>우편번호 *</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-muted" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 상세주소 (사용자 입력) */}
                  <FormField
                    control={form.control}
                    name="addressDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상세주소</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="예: 3층 301호"
                            disabled={!selectedAddress}
                          />
                        </FormControl>
                        <FormDescription>
                          건물명, 층, 호수 등 상세 정보를 입력하세요.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 연락처 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>연락처 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>전화번호</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="010-1234-5678"
                              className="pl-9"
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
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                </div>
              </CardContent>
            </Card>

            {/* 제공 서비스 */}
            <Card>
              <CardHeader>
                <CardTitle>제공 서비스</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="services"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>서비스 목록</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="배달, 픽업, 포장 (쉼표로 구분)"
                        />
                      </FormControl>
                      <FormDescription>
                        제공하는 서비스를 쉼표(,)로 구분하여 입력하세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 lg:col-span-2">
            {/* 브랜드 선택 */}
            <Card>
              <CardHeader>
                <CardTitle>브랜드</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  name="brandId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>소속 브랜드 *</FormLabel>
                      <div className="flex gap-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                        <AddBrandDialog />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 매장 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>매장 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pickupEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>픽업 가능</FormLabel>
                          <FormDescription className="text-xs">
                            고객이 매장에서 직접 픽업 가능
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

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>활성화</FormLabel>
                          <FormDescription className="text-xs">
                            매장 운영 활성화 여부
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

                  <FormField
                    control={form.control}
                    name="isVisible"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>고객 노출</FormLabel>
                          <FormDescription className="text-xs">
                            고객에게 매장 정보 노출
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
