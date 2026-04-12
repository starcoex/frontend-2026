import { useState } from 'react';
import { Search, Loader2, XIcon, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Input, Badge } from '../ui';
import { useAuth } from '@starcoex-frontend/auth';
import type { User } from '@starcoex-frontend/graphql'; // ✅ auth.types.ts가 참조하는 동일 타입

export interface SelectedDriver {
  userId: number;
  name: string;
  phone: string;
  email?: string;
}

interface Props {
  onSelect: (driver: SelectedDriver) => void;
  onClear?: () => void;
  selected: SelectedDriver | null;
}

// ✅ auth.types.ts의 getAllUsers 반환 타입과 일치
type DriverUser = Pick<User, 'id' | 'name' | 'phoneNumber' | 'email'>;

export function DriverSearch({ onSelect, onClear, selected }: Props) {
  const { getAllUsers } = useAuth();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DriverUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearched(false);
    try {
      // ✅ auth.types.ts IAuthService.getAllUsers 시그니처: role은 string[]
      const res = await getAllUsers({
        page: 1,
        limit: 20,
        search: query.trim(),
        role: ['DELIVERY'],
      });
      if (res.success && res.data?.getAllUsers?.users) {
        setResults(res.data.getAllUsers.users as DriverUser[]);
      } else {
        setResults([]);
      }
      setSearched(true);
    } catch {
      toast.error('기사 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (u: DriverUser) => {
    onSelect({
      userId: u.id,
      name: u.name ?? '이름 없음',
      phone: u.phoneNumber ?? '',
      email: u.email ?? undefined,
    });
    setResults([]);
    setQuery('');
    setSearched(false);
  };

  if (selected) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-900">
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
          placeholder="이름 또는 전화번호로 배달기사 검색"
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
        <div className="divide-y rounded-md border max-h-48 overflow-y-auto">
          {results.map((u) => (
            <button
              key={u.id}
              type="button"
              className="w-full px-3 py-2.5 text-left transition-colors hover:bg-muted"
              onClick={() => handleSelect(u)}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{u.name ?? '이름 없음'}</p>
                <Badge variant="secondary" className="text-xs">
                  배달기사
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                {u.phoneNumber ?? '전화번호 없음'} · {u.email}
              </p>
            </button>
          ))}
        </div>
      )}

      {searched && results.length === 0 && (
        <div className="rounded-lg border border-dashed p-4 text-center space-y-1">
          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-medium">"{query}"</span>로
            등록된 배달기사(DELIVERY role)가 없습니다.
          </p>
          <p className="text-muted-foreground text-xs">
            먼저{' '}
            <a
              href="/admin/users"
              className="text-primary underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              사용자 관리
            </a>
            에서 DELIVERY role을 부여하세요.
          </p>
        </div>
      )}
    </div>
  );
}
