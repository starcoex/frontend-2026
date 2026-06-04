import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import type { PromotionFormValues } from './promotion-form-schema';

interface Step1Props {
  form: UseFormReturn<PromotionFormValues>;
}

export function PromotionCreateStep1({ form }: Step1Props) {
  const autoApply = form.watch('autoApply');
  const codeValue = form.watch('code');

  const codePreview = (() => {
    if (codeValue && codeValue.trim() !== '') return null;
    if (autoApply) return '코드 없음 (자동 적용)';
    return '자동 생성 예정 (예: PRO-DIS-20250417-A3K9F2)';
  })();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">프로모션 기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>프로모션명 *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="예: 여름 시즌 20% 할인" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>프로모션 코드</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="비워두면 자동 처리됩니다"
                    className="font-mono uppercase"
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <div className="flex items-start gap-1.5 text-xs">
                  <Info className="text-muted-foreground mt-0.5 size-3 shrink-0" />
                  {codeValue && codeValue.trim() !== '' ? (
                    <span className="text-muted-foreground">
                      입력한 코드를 그대로 사용합니다.
                    </span>
                  ) : autoApply ? (
                    <span className="text-muted-foreground">
                      자동 적용 프로모션은 코드가 필요하지 않습니다.{' '}
                      <span className="font-medium">코드 없이 저장됩니다.</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      비워두면 서버에서 자동 생성합니다.{' '}
                      <span className="font-mono font-medium">
                        PRO-{'{TYPE}'}-{'{YYYYMMDD}'}-{'{RANDOM6}'}
                      </span>
                    </span>
                  )}
                </div>
                {codePreview && (
                  <div className="bg-muted rounded-md px-3 py-2 text-xs">
                    <span className="text-muted-foreground">결과: </span>
                    <span className="font-mono font-medium">{codePreview}</span>
                  </div>
                )}
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
                    placeholder="프로모션 설명을 입력하세요"
                    rows={3}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketingMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>마케팅 메시지</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="예: 지금 구매하면 20% 할인!" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
