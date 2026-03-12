import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
import { Button } from '@/components/ui/button';
import SelectDropdown from '@/components/select-dropdown';
import { useSuggestions } from '@starcoex-frontend/suggestions';
import type { Suggestion } from '@starcoex-frontend/suggestions';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Suggestion;
}

const formSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(200, '제목은 200자 이내여야 합니다.'),
  description: z.string().min(10, '내용은 10자 이상이어야 합니다.'),
  category: z.enum(
    [
      'FEATURE_REQUEST',
      'BUG_REPORT',
      'IMPROVEMENT',
      'COMPLAINT',
      'UI_UX',
      'OTHER',
    ],
    { message: '카테고리를 선택해주세요.' }
  ),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  targetApp: z.string().optional(),
});

type SuggestionForm = z.infer<typeof formSchema>;

export function SuggestionMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow;
  const { createSuggestion, updateSuggestion } = useSuggestions();

  const form = useForm<SuggestionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: currentRow?.title ?? '',
      description: currentRow?.description ?? '',
      category: currentRow?.category ?? undefined,
      priority: currentRow?.priority ?? undefined,
      targetApp: currentRow?.targetApp ?? '',
    },
  });

  const onSubmit = async (data: SuggestionForm) => {
    if (isUpdate && currentRow) {
      // UpdateSuggestionInput: priority 포함
      await updateSuggestion({
        id: currentRow.id,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        targetApp: data.targetApp,
      });
    } else {
      // CreateSuggestionInput: priority 없음
      await createSuggestion({
        title: data.title,
        description: data.description,
        category: data.category,
        targetApp: data.targetApp,
        tags: [],
      });
    }
    onOpenChange(false);
    form.reset();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        form.reset();
      }}
    >
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <SheetTitle>
            {isUpdate ? '건의사항 수정' : '건의사항 등록'}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? '건의사항 내용을 수정합니다.'
              : '새 건의사항을 등록합니다.'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="suggestion-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="건의사항 제목을 입력하세요"
                    />
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
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="건의사항 내용을 상세히 작성해주세요 (10자 이상)"
                      className="min-h-[120px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="카테고리 선택"
                    items={[
                      { label: '기능 요청', value: 'FEATURE_REQUEST' },
                      { label: '버그 신고', value: 'BUG_REPORT' },
                      { label: '개선 제안', value: 'IMPROVEMENT' },
                      { label: '불만 사항', value: 'COMPLAINT' },
                      { label: 'UI/UX 개선', value: 'UI_UX' },
                      { label: '기타', value: 'OTHER' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>우선순위</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="우선순위 선택"
                    items={[
                      { label: '낮음', value: 'LOW' },
                      { label: '보통', value: 'MEDIUM' },
                      { label: '높음', value: 'HIGH' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetApp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    대상 앱{' '}
                    <span className="text-muted-foreground text-xs">
                      (선택)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="예: StarOil, Zeragae, Delivery"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className="gap-2 px-4 sm:px-6">
          <SheetClose asChild>
            <Button variant="outline">취소</Button>
          </SheetClose>
          <Button form="suggestion-form" type="submit">
            {isUpdate ? '수정 완료' : '등록'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
