import { useState } from 'react';
import { Search, Loader2, UserPlus, XIcon, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui';
import { useAuth } from '@starcoex-frontend/auth';

export interface SelectedCustomer {
  userId: number;
  name: string;
  phone: string;
  email?: string;
}

interface Props {
  onSelect: (customer: SelectedCustomer) => void;
  onClear: () => void;
  selected: SelectedCustomer | null;
  enableCreate?: boolean;
}

const NewCustomerSchema = z.object({
  name: z.string().min(2, { message: '이름은 2자 이상 입력하세요.' }),
  phone: z
    .string()
    .min(10, { message: '올바른 전화번호를 입력하세요.' })
    .regex(/^[0-9\-]+$/, { message: '숫자와 하이픈만 입력 가능합니다.' }),
  email: z
    .string()
    .email({ message: '올바른 이메일 형식이 아닙니다.' })
    .optional()
    .or(z.literal('')),
});

type NewCustomerValues = z.infer<typeof NewCustomerSchema>;

export function CustomerSearch({
  onSelect,
  onClear,
  selected,
  enableCreate = true,
}: Props) {
  const { getAllUsers, createGuestUserByAdmin } = useAuth();

  const [query, setQuery] = useState('');
  // ✅ User 전체 타입 대신 필요한 필드만 pick → null 허용
  const [results, setResults] = useState<
    Array<{
      id: number;
      name?: string | null;
      phoneNumber?: string | null;
      email: string;
    }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const newCustomerForm = useForm<NewCustomerValues>({
    resolver: zodResolver(NewCustomerSchema),
    defaultValues: { name: '', phone: '', email: '' },
  });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearched(false);
    setShowNewForm(false);
    try {
      const res = await getAllUsers({
        page: 1,
        limit: 20,
        search: query.trim(),
      });
      if (res.success && res.data?.getAllUsers?.users) {
        // ✅ User[] → 내부 타입으로 그대로 할당 (타입 체크 통과)
        setResults(res.data.getAllUsers.users);
      } else {
        setResults([]);
      }
      setSearched(true);
    } catch {
      toast.error('고객 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (c: {
    id: number;
    name?: string | null;
    phoneNumber?: string | null;
    email: string;
  }) => {
    onSelect({
      userId: c.id,
      name: c.name ?? '이름 없음',
      phone: c.phoneNumber ?? '',
      email: c.email,
    });
    setResults([]);
    setQuery('');
    setSearched(false);
  };

  const handleCreateCustomer = async (data: NewCustomerValues) => {
    setIsCreating(true);
    try {
      const res = await createGuestUserByAdmin({
        name: data.name,
        phoneNumber: data.phone,
        email: data.email || undefined,
      });

      if (res.success && res.data?.createGuestUserByAdmin?.user) {
        const u = res.data.createGuestUserByAdmin.user;
        toast.success(
          res.data.createGuestUserByAdmin.message ??
            `${data.name} 고객이 등록되었습니다.`
        );
        onSelect({
          userId: u.id,
          name: u.name ?? data.name,
          phone: u.phoneNumber ?? data.phone,
          email: u.email,
        });
        setShowNewForm(false);
        setSearched(false);
        setQuery('');
        newCustomerForm.reset();
      } else {
        toast.error(
          res.data?.createGuestUserByAdmin?.error?.message ??
            res.error?.message ??
            '고객 등록에 실패했습니다.'
        );
      }
    } catch {
      toast.error('고객 등록 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  // ── 선택된 고객 표시 ─────────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="font-medium text-green-900 text-sm">
              {selected.name}
            </p>
            <p className="text-xs text-green-700">
              {selected.phone}
              {selected.email && ` · ${selected.email}`}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-green-700 hover:text-destructive"
          onClick={onClear}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearched(false);
          }}
          placeholder="이름 또는 전화번호로 검색"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {searched && results.length > 0 && (
        <div className="rounded-md border divide-y max-h-48 overflow-y-auto">
          {results.map((c) => (
            <button
              key={c.id}
              type="button"
              className="w-full px-3 py-2.5 text-left hover:bg-muted transition-colors"
              onClick={() => handleSelect(c)}
            >
              <p className="text-sm font-medium">{c.name ?? '이름 없음'}</p>
              <p className="text-muted-foreground text-xs">
                {c.phoneNumber ?? '전화번호 없음'} · {c.email}
              </p>
            </button>
          ))}
        </div>
      )}

      {searched && results.length === 0 && (
        <div className="rounded-lg border border-dashed p-4 text-center space-y-2">
          <p className="text-muted-foreground text-sm">
            <span className="font-medium text-foreground">"{query}"</span>로
            등록된 고객이 없습니다.
          </p>
          {enableCreate && !showNewForm && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowNewForm(true);
                const looksLikeName = /^[가-힣a-zA-Z\s]+$/.test(query.trim());
                looksLikeName
                  ? newCustomerForm.setValue('name', query.trim())
                  : newCustomerForm.setValue('phone', query.trim());
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              신규 고객으로 등록하기
            </Button>
          )}
          {!enableCreate && (
            <p className="text-xs text-muted-foreground">
              신규 고객은{' '}
              <a
                href="/admin/users/new"
                className="text-primary underline underline-offset-2"
                target="_blank"
                rel="noreferrer"
              >
                회원 관리
              </a>
              에서 먼저 등록 후 주문하세요.
            </p>
          )}
        </div>
      )}

      {showNewForm && enableCreate && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              신규 고객 등록
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => setShowNewForm(false)}
            >
              <XIcon className="size-3" />
            </Button>
          </div>
          <Form {...newCustomerForm}>
            <form
              onSubmit={newCustomerForm.handleSubmit(handleCreateCustomer)}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={newCustomerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">이름 *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="홍길동"
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newCustomerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">전화번호 *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="010-0000-0000"
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={newCustomerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">이메일 (선택)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@email.com"
                        className="h-8 text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      등록 중...
                    </>
                  ) : (
                    '등록 후 선택'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewForm(false)}
                >
                  취소
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
