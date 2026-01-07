import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toasts } from '@/components/ui/toast.helpers';
import { UserProfileData } from '@/app/types/user-profile.type';

interface Props {
  initialData: UserProfileData;
  isAdminView: boolean;
}

const businessSchema = z.object({
  businessName: z.string().min(1, '상호명을 입력해주세요'),
  businessNumber: z.string().min(10, '사업자 등록번호를 확인해주세요'),
  representativeName: z.string().min(1, '대표자명을 입력해주세요'),
  businessAddress: z.string().optional(),
  businessType: z.string().optional(), // 업태
  businessItem: z.string().optional(), // 종목
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export function BusinessProfileForm({ initialData, isAdminView }: Props) {
  const bizData = initialData.business;

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: bizData?.businessName || '',
      businessNumber: bizData?.businessNumber || '',
      representativeName: bizData?.representativeName || '',
      businessAddress: bizData?.businessAddress || '',
      businessType: bizData?.businessType || '',
      businessItem: bizData?.businessItem || '',
    },
  });

  function onSubmit(data: BusinessFormValues) {
    toasts.settings.submitValues(data, '사업자 정보 수정');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상호명</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사업자 등록번호</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isAdminView} />
                </FormControl>
                <FormDescription>
                  수정이 필요한 경우 관리자에게 문의하세요.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="representativeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>대표자명</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사업장 주소</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>업태</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="예: 서비스업" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessItem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>종목</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="예: 소프트웨어 개발" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">저장하기</Button>
      </form>
    </Form>
  );
}
