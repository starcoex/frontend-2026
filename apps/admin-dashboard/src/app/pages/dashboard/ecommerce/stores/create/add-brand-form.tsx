import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@starcoex-frontend/auth';
import { useStores } from '@starcoex-frontend/stores';

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: '브랜드명은 최소 2자 이상이어야 합니다.' }),
  slug: z.string().min(2, { message: 'Slug는 최소 2자 이상이어야 합니다.' }),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  brandColor: z.string().optional(),
  isActive: z.boolean(),
});

type BrandFormData = z.infer<typeof FormSchema>;

export default function AddBrandForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { createBrand } = useStores();

  const form = useForm<BrandFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      logoUrl: '',
      brandColor: '#000000',
      isActive: true,
    },
  });

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-');
    form.setValue('slug', slug);
  };

  async function onSubmit(data: BrandFormData) {
    if (!currentUser?.id) {
      toast.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      const response = await createBrand({
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        logoUrl: data.logoUrl || undefined,
        brandColor: data.brandColor || undefined,
        isActive: data.isActive,
      });

      if (response.success && response.data) {
        toast.success('브랜드가 성공적으로 등록되었습니다!');
        navigate('/admin/stores/brands');
      } else {
        toast.error(response.error?.message || '브랜드 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('브랜드 등록 중 오류가 발생했습니다.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin/stores/brands">
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">브랜드 추가</h1>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" asChild>
              <Link to="/admin/stores/brands">취소</Link>
            </Button>
            <Button type="submit">등록하기</Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
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
                        <FormLabel>브랜드명 *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="예: 스타코엑스"
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
                          <Input {...field} placeholder="starcoex" />
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>설명</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="브랜드 설명을 입력하세요"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>브랜드 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>로고 URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://example.com/logo.png"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>브랜드 컬러</FormLabel>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={field.value}
                            onChange={field.onChange}
                            className="w-20 h-10"
                          />
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="#000000"
                              className="flex-1"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
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
                            브랜드 활성화 여부
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
