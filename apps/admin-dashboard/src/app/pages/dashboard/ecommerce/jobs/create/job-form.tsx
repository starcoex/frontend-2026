import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '@starcoex-frontend/jobs';
import type { JobPosting } from '@starcoex-frontend/jobs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { FormPageHeader } from '@starcoex-frontend/common';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  JOB_STATUS_OPTIONS,
} from '@/app/pages/dashboard/ecommerce/jobs/data/job-data';
import { useState } from 'react';

const FormSchema = z.object({
  title: z.string().min(1, '공고 제목을 입력하세요.'),
  department: z.string().optional(),
  description: z.string().min(1, '공고 설명을 입력하세요.'),
  requirements: z.string().optional(),
  preferredQualifications: z.string().optional(),
  benefits: z.string().optional(),
  employmentType: z.enum([
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERNSHIP',
    'FREELANCE',
  ]),
  jobPostingStatus: z.enum(['DRAFT', 'OPEN', 'CLOSED', 'CANCELLED']),
  salaryMin: z.number().min(0).optional().nullable(),
  salaryMax: z.number().min(0).optional().nullable(),
  salaryNote: z.string().optional(),
  location: z.string().optional(),
  isRemote: z.boolean(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  headcount: z.number().min(1).optional().nullable(),
  tags: z.string(),
});

type FormValues = z.infer<typeof FormSchema>;

interface JobFormProps {
  mode: 'create' | 'edit';
  job?: JobPosting;
}

// ── 날짜 피커 필드 컴포넌트 ──────────────────────────────────────────────────
const DatePickerField: React.FC<{
  value: Date | null | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder: string;
  disabled?: (date: Date) => boolean;
}> = ({ value, onChange, placeholder, disabled }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value
            ? format(value, 'yyyy년 MM월 dd일', { locale: ko })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          disabled={disabled}
          locale={ko}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default function JobForm({ mode, job }: JobFormProps) {
  const navigate = useNavigate();
  const { createJobPosting, updateJobPosting, fetchJobPostings } = useJobs();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: job?.title ?? '',
      department: job?.department ?? '',
      description: job?.description ?? '',
      requirements: job?.requirements ?? '',
      preferredQualifications: job?.preferredQualifications ?? '',
      benefits: job?.benefits ?? '',
      employmentType: job?.employmentType ?? 'FULL_TIME',
      jobPostingStatus: job?.jobPostingStatus ?? 'DRAFT',
      salaryMin: job?.salaryMin ?? null,
      salaryMax: job?.salaryMax ?? null,
      salaryNote: job?.salaryNote ?? '',
      location: job?.location ?? '',
      isRemote: job?.isRemote ?? false,
      startDate: job?.startDate ? new Date(job.startDate) : null,
      endDate: job?.endDate ? new Date(job.endDate) : null,
      headcount: job?.headcount ?? null,
      tags: job?.tags?.join(', ') ?? '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const startDate = form.watch('startDate');

  async function onSubmit(data: FormValues) {
    const tags = data.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...data,
      tags,
      salaryMin: data.salaryMin ?? undefined,
      salaryMax: data.salaryMax ?? undefined,
      headcount: data.headcount ?? undefined,
      startDate: data.startDate ? data.startDate.toISOString() : undefined,
      endDate: data.endDate ? data.endDate.toISOString() : undefined,
    };

    if (mode === 'create') {
      const res = await createJobPosting(payload as any);
      if (res.success) {
        toast.success(res.data?.message ?? '채용 공고가 등록되었습니다.');
        await fetchJobPostings(false);
        navigate('/admin/jobs');
      } else {
        toast.error(res.error?.message ?? '등록에 실패했습니다.');
      }
    } else {
      const res = await updateJobPosting({ ...payload, id: job!.id } as any);
      if (res.success) {
        toast.success(res.data?.message ?? '채용 공고가 수정되었습니다.');
        await fetchJobPostings(false);
        navigate('/admin/jobs');
      } else {
        toast.error(res.error?.message ?? '수정에 실패했습니다.');
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormPageHeader
          backTo="/admin/jobs"
          title={mode === 'create' ? '채용 공고 추가' : '채용 공고 수정'}
          actions={[
            {
              label: '취소',
              variant: 'secondary',
              onClick: () => navigate(-1),
            },
            {
              label: mode === 'create' ? '등록하기' : '저장하기',
              loadingLabel: '처리 중...',
              type: 'submit',
              isLoading: isSubmitting,
              disabled: isSubmitting,
            },
          ]}
        />

        <div className="grid gap-4 lg:grid-cols-6">
          {/* ─── 좌측 ── */}
          <div className="space-y-4 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>공고 제목 *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="예: 백엔드 개발자 (Node.js)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>부서</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="예: 개발팀" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>공고 설명 *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={6}
                          placeholder="업무 내용, 조직 소개 등을 입력하세요."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>자격 요건</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>지원 자격</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="줄바꿈으로 구분하여 입력하세요."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredQualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>우대 사항</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="줄바꿈으로 구분하여 입력하세요."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>복리후생</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="줄바꿈으로 구분하여 입력하세요."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* ─── 우측 ── */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>공고 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="jobPostingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>공고 상태 *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {JOB_STATUS_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>고용 형태 *</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EMPLOYMENT_TYPE_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>근무지</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="예: 제주 본사" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isRemote"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label>원격 근무 가능</Label>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>모집 기간 & 인원</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ✅ 모집 시작일 캘린더 */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>모집 시작일</FormLabel>
                      <FormControl>
                        <DatePickerField
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="시작일 선택"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* ✅ 모집 마감일 캘린더 */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>모집 마감일</FormLabel>
                      <FormControl>
                        <DatePickerField
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="마감일 선택"
                          disabled={(date) =>
                            startDate ? date < startDate : false
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headcount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>모집 인원</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="예: 2"
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>급여 & 태그</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="salaryNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>급여 안내</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="예: 협의 가능" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>태그</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="쉼표로 구분 (예: React, Node.js)"
                        />
                      </FormControl>
                      <FormMessage />
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
