import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useJobs } from '@starcoex-frontend/jobs';
import {
  ChevronLeft,
  Edit3Icon,
  Loader2,
  MapPin,
  Users,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHead } from '@starcoex-frontend/common';
import { COMPANY_INFO } from '@/app/config/company-config';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  JobStatusBadge,
  EmploymentTypeBadge,
} from '../components/job-status-badge';
import { calcDday } from '../data/job-data';

// 문자열 → 배열 파싱
function parseLines(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n|·/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedJobPosting, isLoading, error, fetchJobPosting } = useJobs();

  useEffect(() => {
    const numId = Number(id);
    if (!id || isNaN(numId) || numId <= 0) return;
    fetchJobPosting(numId);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            공고 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error || !selectedJobPosting) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-destructive">
          {error || '공고를 찾을 수 없습니다.'}
        </p>
        <Button onClick={() => navigate('/admin/jobs')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const job = selectedJobPosting;
  const dday = calcDday(job.endDate);
  const requirements = parseLines(job.requirements);
  const preferred = parseLines(job.preferredQualifications);
  const benefits = parseLines(job.benefits);

  const formatDate = (date?: string | null) =>
    date ? format(new Date(date), 'yyyy년 MM월 dd일', { locale: ko }) : '-';

  return (
    <>
      <PageHead
        title={`${job.title} - ${COMPANY_INFO.name}`}
        description="채용 공고 상세 정보"
        keywords={['채용 공고', job.title, COMPANY_INFO.name]}
        og={{
          title: `${job.title} - ${COMPANY_INFO.name}`,
          description: job.description.slice(0, 100),
          image: '/images/og-jobs.jpg',
          type: 'website',
        }}
      />

      <div className="space-y-4">
        {/* ─── 헤더 ── */}
        <div className="flex flex-row items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Button
                aria-label="뒤로가기"
                variant="outline"
                size="icon"
                onClick={() => navigate('/admin/jobs')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="font-display text-xl tracking-tight lg:text-2xl">
                {job.title}
              </h1>
            </div>
            <div className="text-muted-foreground ml-12 flex flex-wrap gap-2 text-sm">
              {job.department && <span>{job.department}</span>}
              {job.department && <span>·</span>}
              <span>등록일 {formatDate(job.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to={`/careers/${job.id}`} target="_blank">
                <ExternalLink className="mr-1 h-4 w-4" />
                공개 페이지
              </Link>
            </Button>
            <Button onClick={() => navigate(`/admin/jobs/${id}/edit`)}>
              <Edit3Icon className="mr-1 h-4 w-4" />
              수정
            </Button>
          </div>
        </div>

        {/* ─── 상태 배지 ── */}
        <div className="flex flex-wrap gap-2 ml-12">
          <JobStatusBadge status={job.jobPostingStatus} />
          <EmploymentTypeBadge type={job.employmentType} />
          {job.isRemote && <Badge variant="outline">원격 가능</Badge>}
          <Badge variant={dday === '마감' ? 'outline' : 'default'}>
            {dday}
          </Badge>
        </div>

        {/* ─── 요약 카드 ── */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              icon: MapPin,
              label: '근무지',
              value: job.location ?? '미지정',
            },
            {
              icon: Users,
              label: '모집 인원',
              value: job.headcount ? `${job.headcount}명` : '00명',
            },
            {
              icon: Calendar,
              label: '모집 기간',
              value: `${formatDate(job.startDate)} ~ ${formatDate(
                job.endDate
              )}`,
            },
            {
              icon: Users,
              label: '지원자 수',
              value: `${job.applicationCount}명`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 rounded-xl border bg-card p-4"
            >
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </div>
              <p className="text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* ─── 본문 + 사이드바 ── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_240px] lg:items-start">
          {/* 본문 */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">공고 설명</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">지원 자격</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {requirements.map((req, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex gap-2"
                      >
                        <span className="shrink-0">·</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {preferred.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">우대 사항</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {preferred.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex gap-2"
                      >
                        <span className="shrink-0">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">복리후생</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {benefits.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex gap-2"
                      >
                        <span className="shrink-0">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 사이드바 */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">공고 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: '부서', value: job.department },
                  {
                    label: '급여',
                    value:
                      job.salaryNote ??
                      (job.salaryMin || job.salaryMax
                        ? `${job.salaryMin?.toLocaleString() ?? ''}~${
                            job.salaryMax?.toLocaleString() ?? ''
                          }만원`
                        : '협의'),
                  },
                  { label: '조회수', value: `${job.viewCount}회` },
                  {
                    label: '활성 여부',
                    value: job.isActive ? '활성' : '비활성',
                  },
                ]
                  .filter((row) => row.value)
                  .map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium">{row.value}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* 태그 */}
            {job.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">태그</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
