import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Plus, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts } from '@starcoex-frontend/products';
import type { ProductType } from '@starcoex-frontend/products';
import {
  PRODUCT_TYPE_OPTIONS,
  type ProductTypeCode,
} from '@/app/constants/product-type-codes';

const ALLOWED_PRODUCT_TYPE_CODES = PRODUCT_TYPE_OPTIONS;
type AllowedCode = ProductTypeCode;

const createSchema = z.object({
  code: z.enum(
    ALLOWED_PRODUCT_TYPE_CODES.map((c) => c.code) as [
      AllowedCode,
      ...AllowedCode[]
    ],
    { message: '상품 타입 코드를 선택해주세요.' }
  ),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
  description: z.string().optional(),
  sortOrder: z
    .number({ message: '정렬 순서를 입력해주세요.' })
    .int()
    .min(1, '1 이상의 숫자를 입력해주세요.'),
});

const updateSchema = z.object({
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다.'),
  description: z.string().optional(),
  sortOrder: z
    .number({ message: '정렬 순서를 입력해주세요.' })
    .int()
    .min(1, '1 이상의 숫자를 입력해주세요.'),
  isActive: z.boolean(),
});

type CreateForm = z.infer<typeof createSchema>;
type UpdateForm = z.infer<typeof updateSchema>;

export function ProductTypeManager() {
  const {
    productTypes,
    createProductType,
    updateProductType,
    fetchProductTypes,
  } = useProducts();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProductType | null>(null);

  const registeredCodes = new Set(productTypes.map((pt) => pt.code));
  const usedSortOrders = new Set(productTypes.map((pt) => pt.sortOrder));
  const availableCodes = ALLOWED_PRODUCT_TYPE_CODES.filter(
    (c) => !registeredCodes.has(c.code)
  );

  const nextSortOrder = (() => {
    let n = 1;
    while (usedSortOrders.has(n)) n++;
    return n;
  })();

  const createSchemaWithValidation = createSchema.refine(
    (data) => !usedSortOrders.has(data.sortOrder),
    { message: '이미 사용 중인 정렬 순서입니다.', path: ['sortOrder'] }
  );

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchemaWithValidation),
    defaultValues: {
      code: undefined,
      name: '',
      description: '',
      sortOrder: nextSortOrder,
    },
  });

  const handleCodeChange = (
    code: AllowedCode,
    onChange: (val: string) => void
  ) => {
    onChange(code);
    const matched = ALLOWED_PRODUCT_TYPE_CODES.find((c) => c.code === code);
    if (matched) {
      createForm.setValue('name', matched.label, { shouldValidate: true });
    }
  };

  const handleCreate = async (data: CreateForm) => {
    const res = await createProductType({
      code: data.code,
      name: data.name,
      description: data.description || undefined,
      sortOrder: data.sortOrder,
    });
    if (res.success) {
      toast.success('상품 타입이 등록되었습니다.');
      // ✅ 등록 성공 후 목록 명시적 재조회
      await fetchProductTypes();
      createForm.reset();
      setCreateOpen(false);
    } else {
      toast.error(res.error?.message ?? '등록에 실패했습니다.');
    }
  };

  const updateForm = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
  });

  const openEdit = (pt: ProductType) => {
    setEditTarget(pt);
    updateForm.reset({
      name: pt.name,
      description: pt.description ?? '',
      sortOrder: pt.sortOrder,
      isActive: pt.isActive,
    });
  };

  const handleUpdate = async (data: UpdateForm) => {
    if (!editTarget) return;
    const otherSortOrders = new Set(
      productTypes
        .filter((pt) => pt.id !== editTarget.id)
        .map((pt) => pt.sortOrder)
    );
    if (otherSortOrders.has(data.sortOrder)) {
      updateForm.setError('sortOrder', {
        message: '이미 사용 중인 정렬 순서입니다.',
      });
      return;
    }
    const res = await updateProductType({
      id: editTarget.id,
      name: data.name,
      description: data.description || undefined,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    });
    if (res.success) {
      toast.success('상품 타입이 수정되었습니다.');
      // ✅ 수정 성공 후 목록 명시적 재조회
      await fetchProductTypes();
      setEditTarget(null);
    } else {
      toast.error(res.error?.message ?? '수정에 실패했습니다.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>상품 타입 관리</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              createForm.setValue('sortOrder', nextSortOrder);
              setCreateOpen(true);
            }}
            disabled={availableCodes.length === 0}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            추가
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {productTypes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            등록된 상품 타입이 없습니다.
          </p>
        ) : (
          <div className="divide-y rounded-md border">
            {productTypes.map((pt) => (
              <div
                key={pt.id}
                className="flex items-center justify-between px-3 py-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-6 text-center font-mono text-xs">
                      {pt.sortOrder}
                    </span>
                    <span className="text-sm font-medium">{pt.name}</span>
                    <Badge
                      variant={pt.isActive ? 'success' : 'secondary'}
                      className="text-xs"
                    >
                      {pt.isActive ? '활성' : '비활성'}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground ml-6 font-mono text-xs">
                    {pt.code}
                  </span>
                  {pt.metadataSchema && (
                    <p className="text-muted-foreground ml-6 text-xs">
                      메타데이터 스키마 설정됨
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(pt)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {availableCodes.length === 0 && productTypes.length > 0 && (
          <p className="text-muted-foreground mt-3 text-xs">
            모든 상품 타입이 등록되었습니다.
          </p>
        )}
      </CardContent>

      {/* 생성 다이얼로그 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>상품 타입 추가</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreate)}
              className="space-y-4"
            >
              <FormField
                control={createForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>타입 코드 *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) =>
                        handleCodeChange(val as AllowedCode, field.onChange)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="타입 코드를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {availableCodes.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              <span className="font-mono text-sm">
                                {c.code}
                              </span>
                              <span className="text-muted-foreground ml-2 text-xs">
                                ({c.label})
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      코드는 생성 후 변경 불가.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>표시 이름 *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="예: 일반상품" />
                    </FormControl>
                    <FormDescription className="text-xs">
                      코드 선택 시 자동 입력됩니다. 필요 시 수정하세요.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={createForm.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>정렬 순서 *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      사용 중:{' '}
                      {usedSortOrders.size > 0
                        ? Array.from(usedSortOrders)
                            .sort((a, b) => a - b)
                            .join(', ')
                        : '없음'}
                      {' · '}제안: <strong>{nextSortOrder}</strong>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={createForm.formState.isSubmitting}
                >
                  등록
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* 수정 다이얼로그 */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              상품 타입 수정
              <span className="text-muted-foreground ml-2 font-mono text-sm">
                {editTarget?.code}
              </span>
            </DialogTitle>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(handleUpdate)}
              className="space-y-4"
            >
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>표시 이름 *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="resize-none" rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>정렬 순서 *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <FormLabel>활성화</FormLabel>
                      <p className="text-muted-foreground text-xs">
                        비활성 시 상품 등록 시 선택 불가
                      </p>
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditTarget(null)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={updateForm.formState.isSubmitting}
                >
                  저장
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
