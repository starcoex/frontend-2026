import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '@starcoex-frontend/jobs';
import { useAuth } from '@starcoex-frontend/auth';
import {
  Loader2,
  Briefcase,
  Calendar,
  MapPin,
  ChevronRight,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company.config';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { JobApplication } from '@starcoex-frontend/jobs';

// ─── 상태 설정 맵 ─────────────────────────────────────────────────────────────

const APPLICATION_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    variant:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline'
      | 'success'
      | 'warning';
  }
> = {
  PENDING: { label: '검토 대기', variant: 'secondary' },
  REVIEWING: { label: '검토중', variant: 'warning' },
  PASSED: { label: '합격', variant: 'success' },
  REJECTED: { label: '불합격', variant: 'destructive' },
  CANCELLED: { label: '취소', variant: 'outline' },
};

const EMPLOYMENT_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: '정규직',
  PART_TIME: '파트타임',
  CONTRACT: '계약직',
  INTERNSHIP: '인턴',
  FREELANCE: '프리랜서',
};

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

// ─── 지원서 카드 ──────────────────────────────────────────────────────────────

const ApplicationCard: React.FC<{ application: JobApplication }> = ({
  application,
}) => {
  const navigate = useNavigate();
  const job = application.jobPosting;
  const profile = application.profile;
  const statusConfig =
    APPLICATION_STATUS_CONFIG[application.jobApplicationStatus] ??
    APPLICATION_STATUS_CONFIG['PENDING'];
  const canEdit = application.jobApplicationStatus === 'PENDING';

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <CardTitle className="text-base leading-snug">
              {job ? (
                <Link
                  to={`/careers/${job.id}`}
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  {job.title}
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              ) : (
                `공고 #${application.jobPostingId}`
              )}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-2 text-xs">
              {job?.department && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {job.department}
                </span>
              )}
              {job?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
              )}
              {job?.employmentType && (
                <span>{EMPLOYMENT_TYPE_LABEL[job.employmentType]}</span>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge variant={statusConfig.variant as any}>
              {statusConfig.label}
            </Badge>
            {/* PENDING 상태일 때만 수정 버튼 표시 */}
            {canEdit && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() =>
                  navigate(`/my-applications/${application.id}/edit`)
                }
              >
                지원서 수정
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* 지원일 */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          지원일:{' '}
          {format(new Date(application.createdAt), 'yyyy년 MM월 dd일 HH:mm', {
            locale: ko,
          })}
        </div>

        {/* 입사 가능일 */}
        {profile?.availableStartDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            입사 가능일:{' '}
            {format(new Date(profile.availableStartDate), 'yyyy년 MM월 dd일', {
              locale: ko,
            })}
          </div>
        )}

        {/* 학력 요약 */}
        {profile?.educations && profile.educations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.educations.slice(0, 2).map((edu) => (
              <Badge key={edu.id} variant="outline" className="text-xs gap-1">
                <GraduationCap className="w-3 h-3" />
                {edu.schoolName}
                {' · '}
                {EDUCATION_LEVEL_LABEL[edu.educationLevel] ??
                  edu.educationLevel}
                {' · '}
                {GRADUATION_STATUS_LABEL[edu.graduationStatus] ??
                  edu.graduationStatus}
              </Badge>
            ))}
          </div>
        )}

        {/* 경력 요약 */}
        {profile?.careers && profile.careers.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.careers.slice(0, 2).map((career) => (
              <Badge
                key={career.id}
                variant="secondary"
                className="text-xs gap-1"
              >
                <Briefcase className="w-3 h-3" />
                {career.companyName}
                {career.position && ` · ${career.position}`}
                {career.isCurrent && ' (재직중)'}
              </Badge>
            ))}
            {profile.careers.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{profile.careers.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* 자기소개서 요약 */}
        {profile?.coverLetters && profile.coverLetters.length > 0 && (
          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              자기소개서 ({profile.coverLetters.length}문항)
            </p>
            {profile.coverLetters.slice(0, 1).map((cl) => (
              <div key={cl.id}>
                {cl.question && (
                  <p className="text-xs font-medium">Q. {cl.question}</p>
                )}
                {cl.answer && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {cl.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 상태 이력 타임라인 */}
        {application.statusHistories &&
          application.statusHistories.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                진행 현황
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[...application.statusHistories]
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((h, idx, arr) => {
                    const config =
                      APPLICATION_STATUS_CONFIG[h.toStatus] ??
                      APPLICATION_STATUS_CONFIG['PENDING'];
                    return (
                      <React.Fragment key={h.id}>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            idx === arr.length - 1
                              ? 'border-primary/40 bg-primary/5 text-primary font-medium'
                              : 'border-border text-muted-foreground'
                          }`}
                        >
                          {config.label}
                        </span>
                        {idx < arr.length - 1 && (
                          <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
              </div>
            </div>
          )}

        {/* 담당자 메모 */}
        {application.statusNote && (
          <div className="rounded-lg bg-muted/50 border p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              담당자 메모
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {application.statusNote}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ─── 페이지 ───────────────────────────────────────────────────────────────────

export const MyApplicationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { myApplications, isLoading, error, fetchMyApplications } = useJobs();

  useEffect(() => {
    fetchMyApplications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHead
        title={`내 지원 현황 - ${COMPANY_INFO.name}`}
        description="지원한 채용 공고 현황을 확인하세요."
        keywords={['내 지원 현황', '채용 지원', COMPANY_INFO.name]}
        og={{
          title: `내 지원 현황 - ${COMPANY_INFO.name}`,
          description: '지원한 채용 공고 현황을 확인하세요.',
          type: 'website',
        }}
      />

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* 헤더 */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">내 지원 현황</h1>
          <p className="text-sm text-muted-foreground">
            {currentUser?.name ?? '고객'}님이 지원한 채용 공고 목록입니다.
          </p>
        </div>

        {/* 로딩 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* 에러 */}
        {!isLoading && error && (
          <div className="rounded-xl border bg-destructive/5 border-destructive/20 p-6 text-center space-y-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchMyApplications()}
            >
              다시 시도
            </Button>
          </div>
        )}

        {/* 지원 없음 */}
        {!isLoading && !error && myApplications.length === 0 && (
          <div className="rounded-xl border bg-card p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">아직 지원한 공고가 없습니다.</p>
              <p className="text-sm text-muted-foreground">
                채용 공고를 확인하고 지원해보세요.
              </p>
            </div>
            <Button asChild>
              <Link to="/careers">채용 공고 보기</Link>
            </Button>
          </div>
        )}

        {/* 지원 목록 */}
        {!isLoading && !error && myApplications.length > 0 && (
          <>
            {/* 요약 통계 */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(APPLICATION_STATUS_CONFIG).map(
                ([status, config]) => {
                  const count = myApplications.filter(
                    (a) => a.jobApplicationStatus === status
                  ).length;
                  return (
                    <div
                      key={status}
                      className="rounded-xl border bg-card p-3 text-center space-y-0.5"
                    >
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground">
                        {config.label}
                      </p>
                    </div>
                  );
                }
              )}
            </div>

            <Separator />

            {/* 카드 목록 */}
            <div className="space-y-3">
              {[...myApplications]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
