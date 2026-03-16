import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft, MapPin, Phone, Mail } from 'lucide-react';
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
import type { Store } from '@starcoex-frontend/stores';

const FormSchema = z.object({
  name: z.string().min(2, { message: '매장명은 최소 2자 이상이어야 합니다.' }),
  slug: z.string().min(2, { message: 'Slug는 최소 2자 이상이어야 합니다.' }),
  brandId: z.string().min(1, { message: '브랜드를 선택해주세요.' }),
  location: z.string().min(2, { message: '지점명을 입력해주세요.' }),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  services: z.string().optional(),
  pickupEnabled: z.boolean(),
  isActive: z.boolean(),
  isVisible: z.boolean(),
});

type StoreEditFormData = z.infer<typeof FormSchema>;

interface Props {
  store: Store;
}

export default function StoreEditForm({ store }: Props) {
  const navigate = useNavigate();
  const { updateStore, brands } = useStores();

  const brand = store.brand as Record<string, any> | null;

  const form = useForm<StoreEditFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: store.name ?? '',
      slug: store.slug ?? '',
      brandId: String(store.brandId ?? brand?.id ?? ''),
      location: store.location ?? '',
      phone: store.phone ?? '',
      email: store.email ?? '',
      services: store.services?.join(', ') ?? '',
      pickupEnabled: store.pickupEnabled ?? true,
      isActive: store.isActive ?? true,
      isVisible: store.isVisible ?? true,
    },
  });

  async function onSubmit(data: StoreEditFormData) {
    const services = data.services
      ? data.services
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const res = await updateStore({
      id: store.id,
      name: data.name,
      slug: data.slug,
      brandId: parseInt(data.brandId),
      location: data.location,
      phone: data.phone || undefined,
      email: data.email || undefined,
      services,
      pickupEnabled: data.pickupEnabled,
      isActive: data.isActive,
      isVisible: data.isVisible,
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
                      <Select
                        onValueChange={field.onChange}
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
              </CardContent>
            </Card>

            {/* 매장 설정 */}
            <Card>
              <CardHeader>
                <CardTitle>매장 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
