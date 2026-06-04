import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '@starcoex-frontend/jobs';
import {
  ChevronLeft,
  Loader2,
  Briefcase,
  GraduationCap,
  FileText,
  Clock,
  User,
  DollarSign,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  JOB_APPLICATION_STATUS_MAP,
  JOB_APPLICATION_STATUS_OPTIONS,
  type JobApplicationStatusValue,
} from '../../data/job-data';

// ─── 레이블 맵 ────────────────────────────────────────────────────────────────

const EDUCATION_LEVEL_LABEL: Record<string, string> = {
  HIGH_SCHOOL: '고등학교',
  ASSOCIATE: '전문대',
  BACHELOR: '학사',
  MASTER: '석사',
  DOCTOR: '박사',
};
const GRADUATION_STATUS_LABEL: Record<string, string> = {
  GRADUATED: '졸업',
  ENROLLED: '재학중',
  LEAVE: '휴학',
  DROPPED: '중퇴',
  EXPECTED: '졸업예정',
};
const APPLICATION_CHANNEL_LABEL: Record<string, string> = {
  WEBSITE: '홈페이지',
  JOBKOREA: '잡코리아',
  SARAMIN: '사람인',
  LINKEDIN: '링크드인',
  RECRUIT: '리쿠르트',
  OTHER: '기타',
};
const EMPLOYMENT_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: '정규직',
  PART_TIME: '파트타임',
  CONTRACT: '계약직',
  INTERNSHIP: '인턴',
  FREELANCE: '프리랜서',
};

// ─── 모바일 탭 ────────────────────────────────────────────────────────────────

const MOBILE_TABS = [
  { id: 'basic', label: '기본 정보' },
  { id: 'career', label: '경력 정보' },
  { id: 'education', label: '학력 정보' },
  { id: 'certificate', label: '자격증' },
  { id: 'cover-letter', label: '자기소개서' },
  { id: 'treatment', label: '처우 희망' },
  { id: 'history', label: '상태 이력' },
];

const SECTION_NAV = [
  { id: 'basic', label: '기본 정보' },
  { id: 'career', label: '직장 경력' },
  { id: 'education', label: '학력 정보' },
  { id: 'certificate', label: '자격증' },
  { id: 'cover-letter', label: '자기소개서' },
  { id: 'treatment', label: '처우 희망' },
  { id: 'history', label: '상태 이력' },
];

// ─── 섹션 헤더 ────────────────────────────────────────────────────────────────

const SectionHeader = ({
  id,
  icon: Icon,
  title,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
}) => (
  <div id={`section-${id}`} className="flex items-center gap-2 py-4 border-b">
    <Icon className="w-4 h-4 text-muted-foreground" />
    <h2 className="text-lg font-bold">{title}</h2>
  </div>
);

// ─── 상태 수정 다이얼로그 ────────────────────────────────────────────────────

interface StatusEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: JobApplicationStatusValue;
  currentNote: string | null | undefined;
  onSave: (status: JobApplicationStatusValue, note: string) => Promise<void>;
}

const StatusEditDialog: React.FC<StatusEditDialogProps> = ({
  open,
  onOpenChange,
  currentStatus,
  currentNote,
  onSave,
}) => {
  const [status, setStatus] =
    useState<JobApplicationStatusValue>(currentStatus);
  const [note, setNote] = useState(currentNote ?? '');
  const [isSaving, setIsSaving] = useState(false);

  // 다이얼로그 열릴 때 현재 값으로 초기화
  useEffect(() => {
    if (open) {
      setStatus(currentStatus);
      setNote(currentNote ?? '');
    }
  }, [open, currentStatus, currentNote]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(status, note);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>지원서 상태 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>지원 상태</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as JobApplicationStatusValue)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_APPLICATION_STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>담당자 메모 (선택)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="내부용 메모를 입력하세요."
              className="resize-none min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            취소
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              '저장'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export default function JobApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedApplication,
    isLoading,
    error,
    fetchApplicationById,
    updateApplicationStatus,
  } = useJobs();

  const [activeTab, setActiveTab] = useState('basic');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  useEffect(() => {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) return;
    fetchApplicationById(numId);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            지원서 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !selectedApplication) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '지원서를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/jobs/applications')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const app = selectedApplication;
  const profile = app.profile;
  const statusConfig =
    JOB_APPLICATION_STATUS_MAP[
      app.jobApplicationStatus as JobApplicationStatusValue
    ];

  // 프로필 사진 — fileUrl 직접 사용
  const profileImageFile = profile?.files?.find(
    (f) => f.fileType === 'PROFILE_IMAGE'
  );
  const profileImageUrl = profileImageFile?.fileUrl ?? null;

  const handleStatusSave = async (
    status: JobApplicationStatusValue,
    note: string
  ) => {
    const res = await updateApplicationStatus({
      applicationId: app.id,
      jobApplicationStatus: status,
      statusNote: note || undefined,
    });
    if (res.success) {
      toast.success('지원서 상태가 수정되었습니다.');
    } else {
      toast.error((res as any).error?.message ?? '수정에 실패했습니다.');
    }
  };

  const scrollTo = (sectionId: string) => {
    document
      .getElementById(`section-${sectionId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ─── 섹션 콘텐츠 ────────────────────────────────────────────────────────────

  const renderBasic = () => (
    <>
      <SectionHeader id="basic" icon={User} title="기본 정보" />
      <div className="py-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="shrink-0 flex flex-col items-center sm:items-start">
            <div className="w-32 h-40 rounded-lg border bg-muted/50 flex items-center justify-center overflow-hidden">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="지원자 프로필"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
                  <User className="w-10 h-10" />
                  <span className="text-[10px]">사진 없음</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">지원자 유형</p>
              <p className="font-medium">
                {app.applicantId ? `회원 #${app.applicantId}` : '비회원'}
              </p>
            </div>
            {profile?.availableStartDate && (
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">입사 가능일</p>
                <p className="font-medium">
                  {format(
                    new Date(profile.availableStartDate),
                    'yyyy년 MM월 dd일',
                    { locale: ko }
                  )}
                </p>
              </div>
            )}
            {profile?.applicationChannel && (
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">지원 경로</p>
                <p className="font-medium">
                  {APPLICATION_CHANNEL_LABEL[profile.applicationChannel] ??
                    profile.applicationChannel}
                  {profile.applicationChannelDetail &&
                    ` (${profile.applicationChannelDetail})`}
                </p>
              </div>
            )}
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">지원일</p>
              <p className="font-medium">
                {format(new Date(app.createdAt), 'yyyy/MM/dd HH:mm', {
                  locale: ko,
                })}
              </p>
            </div>
            {app.reviewedAt && (
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">검토일</p>
                <p className="font-medium">
                  {format(new Date(app.reviewedAt), 'yyyy/MM/dd HH:mm', {
                    locale: ko,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderCareer = () => (
    <>
      <SectionHeader id="career" icon={Briefcase} title="직장 경력" />
      <div className="py-6 space-y-4">
        {profile?.careers && profile.careers.length > 0 ? (
          profile.careers.map((career) => (
            <div
              key={career.id}
              className="rounded-xl border bg-muted/10 p-4 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{career.companyName}</span>
                    {career.isCurrent && (
                      <Badge variant="secondary" className="text-[10px]">
                        재직중
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {career.position && `${career.position}`}
                    {career.department && ` · ${career.department}`}
                    {` · ${
                      EMPLOYMENT_TYPE_LABEL[career.employmentType] ??
                      career.employmentType
                    }`}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground sm:shrink-0">
                  {format(new Date(career.startDate), 'yyyy.MM', {
                    locale: ko,
                  })}
                  {' ~ '}
                  {career.endDate
                    ? format(new Date(career.endDate), 'yyyy.MM', {
                        locale: ko,
                      })
                    : '현재'}
                </p>
              </div>
              {career.jobDescription && (
                <>
                  <Separator />
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {career.jobDescription}
                  </p>
                </>
              )}
              {career.leavingReason && (
                <p className="text-xs text-muted-foreground">
                  종료사유: {career.leavingReason}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground py-4">경력 정보 없음</p>
        )}
      </div>
    </>
  );

  const renderEducation = () => (
    <>
      <SectionHeader id="education" icon={GraduationCap} title="학력 정보" />
      <div className="py-6 space-y-4">
        {profile?.educations && profile.educations.length > 0 ? (
          profile.educations.map((edu) => (
            <div
              key={edu.id}
              className="rounded-xl border bg-muted/10 p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{edu.schoolName}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {EDUCATION_LEVEL_LABEL[edu.educationLevel] ??
                        edu.educationLevel}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {GRADUATION_STATUS_LABEL[edu.graduationStatus] ??
                        edu.graduationStatus}
                    </Badge>
                  </div>
                  {edu.major && (
                    <p className="text-sm text-muted-foreground">
                      {edu.major}
                      {edu.gpa != null &&
                        ` · 학점 ${edu.gpa}/${edu.gpaMax ?? 4.5}`}
                    </p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground sm:shrink-0">
                  {edu.startDate &&
                    format(new Date(edu.startDate), 'yyyy.MM', { locale: ko })}
                  {edu.endDate &&
                    ` ~ ${format(new Date(edu.endDate), 'yyyy.MM', {
                      locale: ko,
                    })}`}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground py-4">학력 정보 없음</p>
        )}
      </div>
    </>
  );

  const renderCertificate = () => (
    <>
      <SectionHeader id="certificate" icon={FileText} title="자격증" />
      <div className="py-6">
        {profile?.certificates && profile.certificates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.certificates.map((cert) => (
              <div
                key={cert.id}
                className="rounded-lg border bg-muted/10 px-4 py-3 text-sm space-y-0.5"
              >
                <p className="font-medium">
                  {cert.name}
                  {cert.grade && ` (${cert.grade})`}
                </p>
                {cert.issuingOrg && (
                  <p className="text-xs text-muted-foreground">
                    {cert.issuingOrg}
                    {cert.acquiredDate &&
                      ` · ${format(new Date(cert.acquiredDate), 'yyyy.MM.dd', {
                        locale: ko,
                      })}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">자격증 없음</p>
        )}
      </div>
    </>
  );

  const renderCoverLetter = () => (
    <>
      <SectionHeader id="cover-letter" icon={FileText} title="자기소개서" />
      <div className="py-6 space-y-6">
        {profile?.coverLetters && profile.coverLetters.length > 0 ? (
          [...profile.coverLetters]
            .sort((a, b) => a.questionNo - b.questionNo)
            .map((cl) => (
              <div key={cl.id} className="space-y-2">
                {cl.question && (
                  <p className="text-base font-medium border-b pb-2">
                    Q{cl.questionNo}. {cl.question}
                  </p>
                )}
                {cl.answer ? (
                  <p className="text-sm text-muted-foreground whitespace-pre-line rounded-xl bg-muted/30 p-4 leading-relaxed">
                    {cl.answer}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">(답변 없음)</p>
                )}
              </div>
            ))
        ) : (
          <p className="text-sm text-muted-foreground py-4">자기소개서 없음</p>
        )}
      </div>
    </>
  );

  const renderTreatment = () => (
    <>
      <SectionHeader id="treatment" icon={DollarSign} title="처우 희망" />
      <div className="py-6">
        {profile?.treatment ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {profile.treatment.desiredPosition && (
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">희망 직위</p>
                <p className="font-medium">
                  {profile.treatment.desiredPosition}
                </p>
              </div>
            )}
            {profile.treatment.desiredSalary != null && (
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">희망 연봉</p>
                <p className="font-medium">
                  {profile.treatment.desiredSalary.toLocaleString()}만원
                </p>
              </div>
            )}
            {profile.treatment.currentSalary != null && (
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">직전 연봉</p>
                <p className="font-medium">
                  {profile.treatment.currentSalary.toLocaleString()}만원
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">처우 정보 없음</p>
        )}
      </div>
    </>
  );

  const renderHistory = () => (
    <>
      <SectionHeader id="history" icon={Clock} title="상태 이력" />
      <div className="py-6 space-y-4">
        {app.statusHistories && app.statusHistories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {[...app.statusHistories]
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
              .map((h) => {
                const cfg =
                  JOB_APPLICATION_STATUS_MAP[
                    h.toStatus as JobApplicationStatusValue
                  ];
                return (
                  <div
                    key={h.id}
                    className="rounded-lg border bg-muted/10 px-3 py-2 text-sm space-y-0.5"
                  >
                    <Badge
                      variant={(cfg?.variant as any) ?? 'secondary'}
                      className="text-[10px]"
                    >
                      {cfg?.label ?? h.toStatus}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(h.createdAt), 'yyyy/MM/dd HH:mm', {
                        locale: ko,
                      })}
                    </p>
                    {h.reason && (
                      <p className="text-xs text-muted-foreground">
                        {h.reason}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">이력 없음</p>
        )}
        {app.statusNote && (
          <div className="space-y-1.5">
            <p className="text-sm font-medium">담당자 메모</p>
            <p className="text-sm text-muted-foreground whitespace-pre-line rounded-xl bg-muted/30 px-4 py-3">
              {app.statusNote}
            </p>
          </div>
        )}
      </div>
    </>
  );

  const SECTION_RENDER_MAP: Record<string, () => React.ReactNode> = {
    basic: renderBasic,
    career: renderCareer,
    education: renderEducation,
    certificate: renderCertificate,
    'cover-letter': renderCoverLetter,
    treatment: renderTreatment,
    history: renderHistory,
  };

  return (
    <>
      <PageHead
        title={`지원서 #${app.id} - ${COMPANY_INFO.name}`}
        description="지원자 상세 정보"
        keywords={['지원서', '지원자', COMPANY_INFO.name]}
        og={{
          title: `지원서 #${app.id} - ${COMPANY_INFO.name}`,
          description: `${app.jobPosting?.title ?? ''} 지원서`,
          image: '/images/og-jobs.jpg',
          type: 'website',
        }}
      />

      {/* job-detail-page.tsx 와 동일한 패턴 — sticky 헤더 없음 */}
      <div className="space-y-4">
        {/* ─── 헤더 ── */}
        <div className="flex flex-row items-start justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-4">
              <Button
                aria-label="뒤로가기"
                variant="outline"
                size="icon"
                onClick={() => navigate(-1)}
                className="shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="font-display text-xl tracking-tight lg:text-2xl truncate">
                지원서 #{app.id}
              </h1>
            </div>
            <div className="text-muted-foreground ml-12 flex flex-wrap gap-2 text-sm">
              {app.jobPosting?.title && (
                <span className="font-medium text-foreground">
                  {app.jobPosting.title}
                </span>
              )}
              <span>·</span>
              <span>
                지원일{' '}
                {format(new Date(app.createdAt), 'yyyy년 MM월 dd일', {
                  locale: ko,
                })}
              </span>
            </div>
          </div>

          {/* 우측 액션 버튼 */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchApplicationById(app.id)}
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              새로고침
            </Button>
            {/* PENDING 상태일 때만 수정 버튼 표시 */}
            {app.jobApplicationStatus === 'PENDING' && (
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/admin/jobs/applications/${app.id}/edit`)
                }
              >
                지원서 수정
              </Button>
            )}
            <Button onClick={() => setStatusDialogOpen(true)}>상태 수정</Button>
          </div>
        </div>

        {/* ─── 상태 배지 ── */}
        <div className="flex flex-wrap gap-2 ml-12">
          <Badge variant={(statusConfig?.variant as any) ?? 'secondary'}>
            {statusConfig?.label ?? app.jobApplicationStatus}
          </Badge>
          {app.applicantId ? (
            <Badge variant="outline">회원 #{app.applicantId}</Badge>
          ) : (
            <Badge variant="outline">비회원</Badge>
          )}
          {app.reviewedAt && (
            <Badge variant="outline">
              검토{' '}
              {format(new Date(app.reviewedAt), 'yyyy/MM/dd', { locale: ko })}
            </Badge>
          )}
        </div>

        {/* ─── 모바일 탭 네비게이션 ── */}
        <div className="md:hidden border-b">
          <div className="flex overflow-x-auto scrollbar-none">
            {MOBILE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── 모바일: 탭별 단일 섹션 ── */}
        <div className="md:hidden">{SECTION_RENDER_MAP[activeTab]?.()}</div>

        {/* ─── 데스크톱: job-detail-page.tsx 와 동일하게 grid 레이아웃 ── */}
        <div className="hidden md:grid gap-6 lg:grid-cols-[1fr_240px] lg:items-start">
          {/* 좌측 섹션 본문 */}
          <div className="space-y-0">
            {renderBasic()}
            {renderCareer()}
            {renderEducation()}
            {renderCertificate()}
            {renderCoverLetter()}
            {renderTreatment()}
            {renderHistory()}
          </div>

          {/* 우측 사이드바 — job-detail-page.tsx 의 aside 패턴 */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            {/* 목차 */}
            <div className="rounded-xl border bg-card p-4 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                목차
              </p>
              {SECTION_NAV.map((nav) => (
                <button
                  key={nav.id}
                  type="button"
                  className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  onClick={() => scrollTo(nav.id)}
                >
                  {nav.label}
                </button>
              ))}
            </div>

            {/* 채용 공고 정보 */}
            {app.jobPosting && (
              <div className="rounded-xl border bg-card p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  채용 공고
                </p>
                <p className="text-sm font-medium">{app.jobPosting.title}</p>
                {app.jobPosting.department && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {app.jobPosting.department}
                  </p>
                )}
                {app.jobPosting.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {app.jobPosting.location}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs mt-1"
                  onClick={() => navigate(`/admin/jobs/${app.jobPostingId}`)}
                >
                  공고 상세 보기
                </Button>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* ─── 상태 수정 다이얼로그 ── */}
      <StatusEditDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        currentStatus={app.jobApplicationStatus as JobApplicationStatusValue}
        currentNote={app.statusNote}
        onSave={handleStatusSave}
      />
    </>
  );
}
