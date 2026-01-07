import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse, isValid } from 'date-fns'; // 날짜 변환용
import { IconCalendarMonth } from '@tabler/icons-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toasts } from '@/components/ui/toast.helpers';
import { UserProfileData } from '@/app/types/user-profile.type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 통신사 한글 라벨 매핑
const TELECOM_LABELS: Record<string, string> = {
  SKT: 'SKT',
  KT: 'KT',
  LGU: 'LG U+',
  SKT_MVNO: 'SKT 알뜰폰',
  KT_MVNO: 'KT 알뜰폰',
  LGU_MVNO: 'LG U+ 알뜰폰',
  UNKNOWN: '기타',
};

interface Props {
  initialData: UserProfileData;
  isAdminView: boolean;
}

// DB의 String Date를 핸들링하기 위한 변환 로직 포함
const individualSchema = z.object({
  name: z.string().min(2).max(30).optional(), // 닉네임
  realName: z.string().optional(), // 실명 (본인인증 된 경우 수정 불가 처리가 일반적)
  realPhoneNumber: z.string().optional(), // 실명 (본인인증 된 경우 수정 불가 처리가 일반적)
  email: z.string().email(),

  // DB에는 String(YYYY-MM-DD)으로 저장되지만, 폼에서는 Date 객체로 다룸
  dob: z.date().optional(),
});

type IndividualFormValues = z.infer<typeof individualSchema>;

export function IndividualProfileForm({ initialData, isAdminView }: Props) {
  // "YYYY-MM-DD" 문자열을 Date 객체로 변환
  const parsedDob = initialData.realBirthDate
    ? parse(initialData.realBirthDate, 'yyyy-MM-dd', new Date())
    : undefined;

  const form = useForm<IndividualFormValues>({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      name: initialData.name || '',
      realName: initialData.realName || '',
      email: initialData.email || '',
      dob: isValid(parsedDob) ? parsedDob : undefined,
    },
  });

  function onSubmit(data: IndividualFormValues) {
    // Date 객체를 다시 "YYYY-MM-DD" 문자열로 변환하여 API 전송
    const payload = {
      ...data,
      realBirthDate: data.dob ? format(data.dob, 'yyyy-MM-dd') : null,
    };
    toasts.settings.submitValues(payload, '개인 프로필 수정');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임 (표시 이름)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="realName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>실명</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isAdminView} />
                </FormControl>
                <FormDescription>
                  본인인증을 통해 확인된 이름입니다.
                </FormDescription>
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
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel>생년월일</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                        disabled={!isAdminView} // 보통 생년월일은 본인인증 후 수정 불가
                      >
                        {field.value ? (
                          format(field.value, 'yyyy-MM-dd')
                        ) : (
                          <span>날짜 선택</span>
                        )}
                        <IconCalendarMonth className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>본인인증 정보 기준입니다.</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 실명 인증된 전화번호 */}
          <FormField
            control={form.control}
            name="realPhoneNumber" // 스키마에 있다면 추가 필요
            render={({ field }) => (
              <FormItem>
                <FormLabel>휴대폰 번호 (본인인증)</FormLabel>
                <FormControl>
                  {/* 관리자도 함부로 못 바꾸게 막거나, 관리자만 풀 수 있게 처리 */}
                  <Input {...field} disabled={true} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* 통신사 정보 (보여주기용) */}
          <FormItem>
            <FormLabel>통신사</FormLabel>
            <Select disabled value={initialData.telecomOperator || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="미인증" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(TELECOM_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              본인인증을 통해서만 변경 가능합니다.
            </FormDescription>
          </FormItem>
        </div>
        <Button type="submit">저장하기</Button>
      </form>
    </Form>
  );
}
