import React, { useState } from 'react';
import { useAuth } from '@starcoex-frontend/auth';
import { toast } from 'sonner';
import {
  Loader2,
  ShieldAlert,
  Lock,
  X,
  KeyRound,
  Shield,
  ClipboardList,
  Search,
  CheckCircle2,
  XIcon,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import ContentSection from '@/app/pages/dashboard/settings/components/content-section';
import type { User } from '@starcoex-frontend/graphql';

type SearchedUser = Pick<User, 'id' | 'name' | 'phoneNumber' | 'email'>;

interface SelectedUser {
  userId: number;
  name: string;
  email: string;
}

export function MasterKeyPromotePage() {
  const { promoteToSuperAdminWithMasterKey, currentUser, getAllUsers } =
    useAuth();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  const [masterKey, setMasterKey] = useState('');
  const [isPromoting, setIsPromoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearched(false);
    try {
      const res = await getAllUsers({
        page: 1,
        limit: 20,
        search: query.trim(),
      });
      if (res.success && res.data?.getAllUsers?.users) {
        setSearchResults(res.data.getAllUsers.users as SearchedUser[]);
      } else {
        setSearchResults([]);
      }
      setSearched(true);
    } catch {
      toast.error('사용자 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (u: SearchedUser) => {
    setSelectedUser({
      userId: u.id,
      name: u.name ?? '이름 없음',
      email: u.email ?? '',
    });
    setSearchResults([]);
    setQuery('');
    setSearched(false);
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setSearched(false);
  };

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedUser || !masterKey) {
      setError('사용자를 선택하고 마스터 키를 입력해주세요.');
      return;
    }

    if (
      !window.confirm(
        `정말로 ${selectedUser.name}(ID: ${selectedUser.userId})을 SUPER_ADMIN으로 승격하시겠습니까?`
      )
    ) {
      return;
    }

    setIsPromoting(true);

    try {
      const response = await promoteToSuperAdminWithMasterKey({
        userId: selectedUser.userId,
        masterKey,
      });

      if (response.success) {
        toast.success(
          response.data?.promoteToSuperAdminWithMasterKey?.message ||
            'SUPER_ADMIN으로 승격되었습니다!'
        );

        setSelectedUser(null);
        setMasterKey('');

        if (currentUser?.id === selectedUser.userId) {
          setTimeout(() => {
            toast.success(
              '권한이 업데이트되었습니다. 페이지를 새로고침합니다.'
            );
            setTimeout(() => window.location.reload(), 1000);
          }, 1500);
        }
      } else {
        const errorMsg =
          response.error?.message ||
          response.graphQLErrors?.[0]?.message ||
          'SUPER_ADMIN 승격에 실패했습니다.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <ContentSection
      title="시스템 초기화"
      desc="마스터 키를 사용하여 첫 SUPER_ADMIN을 생성합니다."
      className="w-full lg:max-w-2xl"
    >
      <div>
        <Alert variant="destructive" className="mb-6">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">보안 경고</AlertTitle>
          <AlertDescription>
            이 페이지는 시스템 초기 설정용입니다.
            <br />
            마스터 키는 절대 공유하지 마세요.
            <br />
            이미 SUPER_ADMIN이 존재하는 경우 이 기능을 사용할 수 없습니다.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              마스터 키 인증
            </CardTitle>
            <CardDescription>
              백엔드 환경 변수에 설정된 마스터 키가 필요합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>오류 발생</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setError(null)}
                    className="h-6 w-6 hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handlePromote} className="space-y-6">
              {/* 사용자 검색 */}
              <div className="space-y-2">
                <Label>승격할 사용자 *</Label>
                {selectedUser ? (
                  <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          {selectedUser.name}
                        </p>
                        <p className="text-xs text-green-700">
                          ID: {selectedUser.userId}
                          {selectedUser.email && ` · ${selectedUser.email}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-green-700 hover:text-destructive"
                      onClick={handleClearUser}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setSearched(false);
                        }}
                        placeholder="이름 또는 이메일로 사용자 검색"
                        disabled={isPromoting}
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

                    {searched && searchResults.length > 0 && (
                      <div className="max-h-48 overflow-y-auto divide-y rounded-md border">
                        {searchResults.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            className="w-full px-3 py-2.5 text-left transition-colors hover:bg-muted"
                            onClick={() => handleSelectUser(u)}
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                {u.name ?? '이름 없음'}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                ID: {u.id}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {u.email}
                              {u.phoneNumber && ` · ${u.phoneNumber}`}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}

                    {searched && searchResults.length === 0 && (
                      <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-3 text-center">
                        <span className="font-medium text-foreground">
                          "{query}"
                        </span>
                        에 해당하는 사용자가 없습니다.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 마스터 키 */}
              <div className="space-y-2">
                <Label htmlFor="masterKey">마스터 키 *</Label>
                <div className="relative">
                  <Input
                    id="masterKey"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="마스터 키 입력"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    disabled={isPromoting}
                    required
                    className="pr-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    disabled={isPromoting}
                  >
                    {showPassword ? '숨기기' : '보기'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <KeyRound className="h-3 w-3" />
                  환경 변수:{' '}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    MASTER_KEY
                  </code>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPromoting || !selectedUser || !masterKey}
              >
                {isPromoting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    승격 처리 중...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    SUPER_ADMIN으로 승격
                  </>
                )}
              </Button>
            </form>

            {/* 안내 사항 */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                사용 가이드
              </h4>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>일반 사용자로 회원가입 완료</li>
                <li>
                  위 검색창에서 해당 사용자 이름 또는 이메일로 검색 후 선택
                </li>
                <li>
                  백엔드{' '}
                  <code className="bg-muted-foreground/10 px-1 rounded">
                    env
                  </code>{' '}
                  파일에서 마스터 키 확인
                </li>
                <li>마스터 키 입력 후 승격 실행</li>
                <li>승격 완료 후 로그아웃 후 재로그인 (권한 갱신)</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentSection>
  );
}

export default MasterKeyPromotePage;
