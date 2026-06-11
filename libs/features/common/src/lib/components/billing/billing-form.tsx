import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreditCard,
  MoreVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Badge,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
  Separator,
} from '../ui';
import { cn } from '../../utils';
import { usePayments } from '@starcoex-frontend/payments';
import { toast } from 'sonner';

// ============================================================================
// 타입 & 상수
// ============================================================================

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'paypal';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
  cardholderName?: string;
  isDefault: boolean;
}

const PAYMENT_LOGOS: Record<string, string> = {
  visa: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/visa.svg',
  mastercard:
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/mastercard.svg',
  amex: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/amex.svg',
  paypal:
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/payment-methods/paypal.svg',
};

const CARD_TYPE_LABELS: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  paypal: 'PayPal',
};

// ============================================================================
// 결제 수단 관리 섹션
// ============================================================================

interface PaymentMethodsSectionProps {
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}

function PaymentMethodsSection({
  selectedId,
  onSelect,
}: PaymentMethodsSectionProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PaymentMethod>>({});

  const startEditing = (method: PaymentMethod) => {
    setEditingId(method.id);
    setEditForm({ ...method });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (
      editingId &&
      editForm.type &&
      (editForm.type === 'paypal'
        ? editForm.email
        : editForm.last4 && editForm.expiryMonth && editForm.expiryYear)
    ) {
      setMethods((prev) =>
        prev.map((m) =>
          m.id === editingId ? ({ ...m, ...editForm } as PaymentMethod) : m
        )
      );
      setEditingId(null);
      setEditForm({});
    }
  };

  const startAddingNew = () => {
    setIsAddingNew(true);
    setEditForm({
      type: 'visa',
      last4: '',
      expiryMonth: undefined,
      expiryYear: undefined,
      email: undefined,
      cardholderName: '',
      isDefault: methods.length === 0,
    });
  };

  const cancelAddingNew = () => {
    setIsAddingNew(false);
    setEditForm({});
  };

  const saveNewMethod = () => {
    if (
      editForm.type &&
      (editForm.type === 'paypal'
        ? editForm.email
        : editForm.last4 && editForm.expiryMonth && editForm.expiryYear)
    ) {
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: editForm.type as PaymentMethod['type'],
        last4: editForm.last4,
        expiryMonth: editForm.expiryMonth,
        expiryYear: editForm.expiryYear,
        email: editForm.email,
        cardholderName: editForm.cardholderName,
        isDefault: methods.length === 0,
      };
      setMethods((prev) => [...prev, newMethod]);
      setIsAddingNew(false);
      setEditForm({});
      if (methods.length === 0) onSelect(newMethod.id);
    }
  };

  const deleteMethod = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) {
      const remaining = methods.filter((m) => m.id !== id);
      onSelect(remaining[0]?.id ?? '');
    }
    if (editingId === id) {
      setEditingId(null);
      setEditForm({});
    }
  };

  const setAsDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  const renderEditFields = (idPrefix: string) => (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-type`} className="text-xs">
          카드 종류
        </Label>
        <Select
          value={editForm.type || 'visa'}
          onValueChange={(value: PaymentMethod['type']) =>
            setEditForm({ ...editForm, type: value })
          }
        >
          <SelectTrigger
            id={`${idPrefix}-type`}
            className="h-9"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CARD_TYPE_LABELS).map(([val, label]) => (
              <SelectItem key={val} value={val}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {editForm.type === 'paypal' ? (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-email`} className="text-xs">
            PayPal 이메일
          </Label>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            className="h-9"
            value={editForm.email || ''}
            onChange={(e) =>
              setEditForm({ ...editForm, email: e.target.value })
            }
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-name`} className="text-xs">
              카드 소유자명
            </Label>
            <Input
              id={`${idPrefix}-name`}
              className="h-9"
              value={editForm.cardholderName || ''}
              onChange={(e) =>
                setEditForm({ ...editForm, cardholderName: e.target.value })
              }
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-last4`} className="text-xs">
              카드 번호 끝 4자리
            </Label>
            <Input
              id={`${idPrefix}-last4`}
              className="h-9"
              maxLength={4}
              value={editForm.last4 || ''}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  last4: e.target.value.replace(/\D/g, '').slice(0, 4),
                })
              }
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-month`} className="text-xs">
                만료 월
              </Label>
              <Input
                id={`${idPrefix}-month`}
                type="number"
                className="h-9"
                min={1}
                max={12}
                value={editForm.expiryMonth || ''}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    expiryMonth: parseInt(e.target.value) || undefined,
                  })
                }
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-year`} className="text-xs">
                만료 연도
              </Label>
              <Input
                id={`${idPrefix}-year`}
                type="number"
                className="h-9"
                min={new Date().getFullYear()}
                value={editForm.expiryYear || ''}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    expiryYear: parseInt(e.target.value) || undefined,
                  })
                }
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">등록된 결제 수단</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          아래에서 결제에 사용할 수단을 선택하세요.
        </p>
      </div>

      {methods.length === 0 && !isAddingNew ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <CreditCard className="mb-3 size-10 text-muted-foreground" />
            <p className="text-sm font-medium">등록된 결제 수단이 없습니다</p>
            <p className="mt-1 text-xs text-muted-foreground">
              결제 수단을 추가하면 여기에 표시됩니다.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={startAddingNew}
            >
              <Plus className="mr-2 size-4" />
              결제 수단 추가
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <RadioGroup value={selectedId} onValueChange={onSelect}>
            <div className="grid gap-4 sm:grid-cols-2">
              {methods.map((method) => (
                <Card
                  key={method.id}
                  className={cn(
                    'cursor-pointer transition-all',
                    selectedId === method.id &&
                      editingId !== method.id &&
                      'border-primary ring-2 ring-primary ring-offset-2',
                    editingId === method.id && 'border-primary'
                  )}
                  onClick={() => editingId !== method.id && onSelect(method.id)}
                >
                  <CardContent className="p-5">
                    {editingId === method.id ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">
                            결제 수단 수정
                          </h3>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelEditing();
                              }}
                            >
                              <X className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                saveEdit();
                              }}
                            >
                              <Save className="mr-2 size-4" />
                              저장
                            </Button>
                          </div>
                        </div>
                        {renderEditFields(method.id)}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <RadioGroupItem
                            value={method.id}
                            id={method.id}
                            className="mt-1"
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditing(method);
                                }}
                              >
                                <Pencil className="mr-2 size-4" />
                                수정
                              </DropdownMenuItem>
                              {!method.isDefault && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAsDefault(method.id);
                                  }}
                                >
                                  기본 결제 수단으로 설정
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMethod(method.id);
                                }}
                              >
                                <Trash2 className="mr-2 size-4" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex size-16 items-center justify-center">
                          {PAYMENT_LOGOS[method.type] ? (
                            <img
                              src={PAYMENT_LOGOS[method.type]}
                              alt={method.type}
                              className="h-10 w-auto object-contain"
                            />
                          ) : (
                            <CreditCard className="size-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {method.type === 'paypal'
                                ? 'PayPal'
                                : `${CARD_TYPE_LABELS[method.type]} •••• ${
                                    method.last4
                                  }`}
                            </span>
                            {method.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                기본
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.type === 'paypal'
                              ? method.email
                              : method.cardholderName
                              ? `${method.cardholderName} · 만료 ${method.expiryMonth}/${method.expiryYear}`
                              : `만료 ${method.expiryMonth}/${method.expiryYear}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {isAddingNew && (
                <Card className="border-primary">
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">
                          새 결제 수단 추가
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelAddingNew}
                          >
                            <X className="size-4" />
                          </Button>
                          <Button size="sm" onClick={saveNewMethod}>
                            <Save className="mr-2 size-4" />
                            저장
                          </Button>
                        </div>
                      </div>
                      {renderEditFields('new')}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </RadioGroup>

          {!isAddingNew && (
            <Button variant="outline" size="sm" onClick={startAddingNew}>
              <Plus className="mr-2 size-4" />
              결제 수단 추가
            </Button>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================================
// 청구지 정보 폼
// ============================================================================

const billingFormSchema = z.object({
  username: z.string().min(1, { message: '사용자명을 입력해주세요.' }),
  city: z.string().min(1, { message: '도시명을 입력해주세요.' }),
});

type BillingFormValues = z.infer<typeof billingFormSchema>;

interface BillingFormProps {
  onSuccess?: (values: BillingFormValues) => void;
}

export function BillingForm({ onSuccess }: BillingFormProps) {
  const { createPayment, isSubmitting } = usePayments();
  const [selectedMethodId, setSelectedMethodId] = useState<string | undefined>(
    undefined
  );

  const form = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: { username: '', city: '' },
  });

  async function onSubmit(values: BillingFormValues) {
    const res = await createPayment({
      portOneId: `order_${Date.now()}`,
      amount: 0,
      currency: 'KRW',
      orderName: '결제 정보 등록',
      customData: {
        username: values.username,
        city: values.city,
        paymentMethodId: selectedMethodId,
      },
    });

    if (res.success) {
      toast.success('결제 설정이 저장되었습니다.');
      onSuccess?.(values);
    }
  }

  return (
    <div className="space-y-8">
      <PaymentMethodsSection
        selectedId={selectedMethodId}
        onSelect={setSelectedMethodId}
      />
      <Separator />
      <div>
        <div className="mb-4">
          <h3 className="text-base font-semibold">청구지 정보</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            결제 청구서에 표시될 정보를 입력하세요.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-6 gap-5 space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="col-span-6 md:col-span-3">
                  <FormLabel>사용자명</FormLabel>
                  <FormControl>
                    <Input placeholder="사용자명 입력" {...field} />
                  </FormControl>
                  <FormDescription>청구서에 표시될 이름입니다.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="col-span-6 md:col-span-3">
                  <FormLabel>도시</FormLabel>
                  <FormControl>
                    <Input placeholder="도시명 입력" {...field} />
                  </FormControl>
                  <FormDescription>청구지 도시명입니다.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="col-span-6"
              type="submit"
              disabled={isSubmitting || !selectedMethodId}
            >
              {isSubmitting ? '처리 중...' : '청구지 정보 저장'}
            </Button>
            {!selectedMethodId && (
              <p className="col-span-6 text-xs text-muted-foreground text-center">
                저장하려면 먼저 결제 수단을 선택해주세요.
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
