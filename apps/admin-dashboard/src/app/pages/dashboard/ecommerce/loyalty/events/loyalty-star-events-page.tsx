import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Loader2, Star, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageHead } from '@starcoex-frontend/common';
// ✅ libs/feature/common 에서 임포트
import {
  CustomerSearch,
  type SelectedCustomer,
} from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import type { OrderCategory } from '@starcoex-frontend/graphql';

const starEventSchema = z.object({
  amountSpent: z
    .number({ message: '결제 금액을 입력해주세요.' })
    .int()
    .min(1, '1원 이상이어야 합니다.'),
  category: z.enum(['GAS', 'OIL', 'CAR_CARE'], {
    message: '카테고리를 선택해주세요.',
  }),
  orderId: z
    .number({ message: '주문 ID를 입력해주세요.' })
    .int()
    .min(1, '1 이상의 ID를 입력해주세요.'),
});

type StarEventForm = z.infer<typeof starEventSchema>;

const CATEGORY_OPTIONS: {
  value: OrderCategory;
  label: string;
  description: string;
}[] = [
  { value: 'GAS', label: '주유', description: '주유소 주유 서비스' },
  { value: 'OIL', label: '난방유', description: '난방유 배달 서비스' },
  { value: 'CAR_CARE', label: '카케어', description: '세차/정비 서비스' },
];

interface StarEventRecord {
  id: string;
  userId: number;
  userName: string;
  category: OrderCategory;
  amountSpent: number;
  orderId: number;
  earnedStars: number;
  createdAt: string;
}

const categoryConfig: Record<OrderCategory, { label: string; color: string }> =
  {
    GAS: { label: '주유', color: 'text-orange-500' },
    OIL: { label: '난방유', color: 'text-blue-500' },
    CAR_CARE: { label: '카케어', color: 'text-green-500' },
  };

export default function LoyaltyStarEventsPage() {
  const { accumulateStars } = useLoyalty();
  const [createOpen, setCreateOpen] = useState(false);
  const [recentEvents, setRecentEvents] = useState<StarEventRecord[]>([]);
  // ✅ CustomerSearch 선택 상태
  const [selectedCustomer, setSelectedCustomer] =
    useState<SelectedCustomer | null>(null);

  const form = useForm<StarEventForm>({
    resolver: zodResolver(starEventSchema),
    defaultValues: {
      amountSpent: 0,
      category: undefined,
      orderId: undefined,
    },
  });

  const amountSpent = form.watch('amountSpent') || 0;
  const previewStars = amountSpent > 0 ? Math.floor(amountSpent / 10000) : 0;

  const handleSubmit = async (data: StarEventForm) => {
    if (!selectedCustomer) {
      toast.error('별 적립 대상 회원을 선택해주세요.');
      return;
    }

    const res = await accumulateStars({
      userId: selectedCustomer.userId,
      amountSpent: data.amountSpent,
      category: data.category as OrderCategory,
      orderId: data.orderId,
    });

    if (res.success) {
      const earned = res.data?.earnedStars ?? 0;
      toast.success(
        `${selectedCustomer.name}에게 별 ${earned}개가 적립되었습니다.`,
        {
          description: `주문 #${data.orderId}`,
        }
      );

      setRecentEvents((prev) => [
        {
          id: `${Date.now()}`,
          userId: selectedCustomer.userId,
          userName: selectedCustomer.name,
          category: data.category as OrderCategory,
          amountSpent: data.amountSpent,
          orderId: data.orderId,
          earnedStars: earned,
          createdAt: new Date().toISOString(),
        },
        ...prev.slice(0, 19),
      ]);

      form.reset();
      setSelectedCustomer(null);
      setCreateOpen(false);
    } else {
      toast.error((res as any).error?.message ?? '별 적립에 실패했습니다.');
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      form.reset();
      setSelectedCustomer(null);
    }
    setCreateOpen(open);
  };

  return (
    <>
      <PageHead
        title={`별 적립 이벤트 - ${COMPANY_INFO.name}`}
        description="회원 별 적립 이벤트를 수동으로 등록하고 관리합니다."
        keywords={['별 적립', '이벤트', '로열티', COMPANY_INFO.name]}
        og={{ title: `별 적립 이벤트 - ${COMPANY_INFO.name}`, type: 'website' }}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">별 적립 이벤트</h2>
            <p className="text-muted-foreground text-sm">
              결제 기반 별 적립을 수동으로 처리합니다.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />별 적립 등록
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {CATEGORY_OPTIONS.map((cat) => (
            <Card key={cat.value}>
              <CardHeader className="pb-2">
                <CardDescription>{cat.label}</CardDescription>
                <CardTitle className="text-base">{cat.description}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs">
                  만원당 적립률은 멤버십 설정에서 확인하세요.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 text-sm font-medium">
            이번 세션 적립 내역
            {recentEvents.length > 0 && (
              <span className="text-muted-foreground ml-2 font-normal">
                ({recentEvents.length}건)
              </span>
            )}
          </h3>

          {recentEvents.length === 0 ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center rounded-lg border border-dashed text-sm">
              아직 등록된 적립 이벤트가 없습니다.
            </div>
          ) : (
            <div className="divide-y rounded-lg border">
              {recentEvents.map((event) => {
                const config = categoryConfig[event.category];
                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-muted flex size-9 items-center justify-center rounded-full">
                        <Star className={`size-4 ${config.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {event.userName}
                          <span className="text-muted-foreground ml-2 font-mono text-xs">
                            주문 #{event.orderId}
                          </span>
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {config.label} · {event.amountSpent.toLocaleString()}
                          원
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <TrendingUp className="size-3.5 text-green-500" />
                        <span className="text-green-600">
                          +{event.earnedStars}별
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>별 적립 등록</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* ✅ CustomerSearch로 회원 검색 */}
              <div className="space-y-1.5">
                <p className="text-sm font-medium">적립 대상 회원 *</p>
                <CustomerSearch
                  selected={selectedCustomer}
                  onSelect={setSelectedCustomer}
                  onClear={() => setSelectedCustomer(null)}
                  enableCreate={false}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>서비스 카테고리 *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <span className="font-medium">{opt.label}</span>
                            <span className="text-muted-foreground ml-2 text-xs">
                              {opt.description}
                            </span>
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
                name="amountSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>결제 금액 (원) *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        placeholder="결제 금액 (원 단위)"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      예상 적립 별:{' '}
                      <strong className="text-yellow-600">
                        약 {previewStars}개 이상
                      </strong>
                      <span className="text-muted-foreground ml-1">
                        (실제 적립률은 카테고리 설정에 따라 다름)
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>주문 ID *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        placeholder="참조할 주문 ID"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      별 적립 이력에 참조되는 주문 ID입니다.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || !selectedCustomer}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    '별 적립 등록'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
