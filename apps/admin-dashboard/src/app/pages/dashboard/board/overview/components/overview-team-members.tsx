import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAuth } from '@starcoex-frontend/auth';
import { ExportButton } from '@starcoex-frontend/common';

interface Props {
  isLoading: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  phone?: string | null;
  createdAt?: string;
  isActive?: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: '슈퍼관리자',
  ADMIN: '관리자',
  USER: '일반',
  DELIVERY: '배달기사',
};

const EXPORT_COLUMNS = [
  { header: '이름', key: 'name' },
  { header: '이메일', key: 'email' },
  { header: '역할', key: 'roleLabel' },
  { header: '상태', key: 'statusLabel' },
  { header: '가입일', key: 'createdAtFormatted' },
];

// ─── 상세 드로어 ──────────────────────────────────────────────────────────────
function TeamMemberDrawer({
  open,
  onOpenChange,
  member,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  member: TeamMember | null;
}) {
  if (!member) return null;
  const initials = member.name.slice(0, 2).toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar ?? undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle>{member.name}</SheetTitle>
              <SheetDescription>{member.email}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-2 sm:px-6">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">기본 정보</h4>
            <Separator />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">역할</dt>
                <dd>
                  <Badge variant="outline">
                    {ROLE_LABELS[member.role] ?? member.role}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상태</dt>
                <dd>
                  <Badge
                    variant={
                      member.isActive !== false ? 'default' : 'secondary'
                    }
                  >
                    {member.isActive !== false ? '활성' : '비활성'}
                  </Badge>
                </dd>
              </div>
              {member.phone && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">연락처</dt>
                  <dd className="font-medium">{member.phone}</dd>
                </div>
              )}
              {member.createdAt && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">가입일</dt>
                  <dd className="font-medium">
                    {new Date(member.createdAt).toLocaleDateString('ko-KR')}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <SheetFooter className="px-4 sm:px-6">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              닫기
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export function OverviewTeamMembers({ isLoading }: Props) {
  const navigate = useNavigate();
  const { getAllUsers } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    getAllUsers({ page: 1, limit: 8, role: ['SUPER_ADMIN', 'ADMIN'] }).then(
      (res) => {
        if (res.success && (res.data as any)?.getAllUsers?.users) {
          setMembers((res.data as any).getAllUsers.users);
        }
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Export용 데이터 변환
  const exportData = members.map((m) => ({
    name: m.name,
    email: m.email,
    roleLabel: ROLE_LABELS[m.role] ?? m.role,
    statusLabel: m.isActive !== false ? '활성' : '비활성',
    createdAtFormatted: m.createdAt
      ? new Date(m.createdAt).toLocaleDateString('ko-KR')
      : '-',
  }));

  const handleDetail = (member: TeamMember) => {
    setSelected(member);
    setDrawerOpen(true);
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                팀원 목록
              </CardTitle>
              <CardDescription className="mt-1">
                관리자 및 슈퍼관리자 · 총 {members.length}명
              </CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <ExportButton
                data={exportData}
                columns={EXPORT_COLUMNS}
                fileName="team-members"
                pdfTitle="팀원 목록"
              />
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => navigate('/admin/users')}
              >
                전체보기
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))
          ) : members.length === 0 ? (
            <p className="text-muted-foreground text-center text-sm">
              팀원 데이터가 없습니다.
            </p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-2"
              >
                {/* 아바타 + 이름/이메일 */}
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={member.avatar ?? undefined} />
                    <AvatarFallback className="text-xs">
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {member.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {member.email}
                    </p>
                  </div>
                </div>

                {/* 역할 배지 + ⋮ 메뉴 */}
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {ROLE_LABELS[member.role] ?? member.role}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">메뉴 열기</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDetail(member)}>
                        상세보기
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/admin/users/${member.id}`)}
                      >
                        사용자 관리로 이동
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => navigate(`/admin/users/${member.id}`)}
                      >
                        비활성화
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <TeamMemberDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        member={selected}
      />
    </>
  );
}
