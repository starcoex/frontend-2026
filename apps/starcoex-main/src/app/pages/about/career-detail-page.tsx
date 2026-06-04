import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AboutLayout } from '@/app/pages/about/components/about-layout';
import { cn } from '@/lib/utils';
import { useJobs } from '@starcoex-frontend/jobs';
import { toast } from 'sonner';

// ── 문자열 → 배열 파싱 ────────────────────────────────────────────────────────
function parseLines(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n|·/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── 고용형태 한글 레이블 ──────────────────────────────────────────────────────
const EMPLOYMENT_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: '정규직',
  PART_TIME: '파트타임',
  CONTRACT: '계약직',
  INTERNSHIP: '인턴',
  FREELANCE: '프리랜서',
};

// ── 섹션 래퍼 ─────────────────────────────────────────────────────────────────
const Section: React.FC<{
  icon: string;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <section className="space-y-4">
    <h2 className="flex items-center gap-2 text-base font-bold">
      <span>{icon}</span>
      {title}
    </h2>
    {children}
  </section>
);

// ── 페이지 ────────────────────────────────────────────────────────────────────
export const CareerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fetched, setFetched] = useState(false);
  const {
    selectedJobPosting,
    jobPostings,
    isLoading,
    error,
    fetchJobPosting,
    fetchJobPostings,
    getDday,
  } = useJobs();

  useEffect(() => {
    if (!id) {
      setFetched(true);
      return;
    }
    setFetched(false);
    fetchJobPosting(Number(id)).finally(() => setFetched(true));
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (jobPostings.length === 0) {
      fetchJobPostings(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!fetched || isLoading) {
    return (
      <AboutLayout title="채용공고" subtitle="">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AboutLayout>
    );
  }

  if (error || !selectedJobPosting) {
    return (
      <AboutLayout title="채용공고" subtitle="">
        <div className="text-center py-20 space-y-4">
          <p className="text-muted-foreground">
            {error ?? '존재하지 않는 공고입니다.'}
          </p>
          <Button variant="outline" onClick={() => navigate('/careers')}>
            목록으로
          </Button>
        </div>
      </AboutLayout>
    );
  }

  const job = selectedJobPosting;
  const dday = getDday(job.endDate);
  const requirements = parseLines(job.requirements);
  const preferred = parseLines(job.preferredQualifications);
  const benefits = parseLines(job.benefits);
  const otherJobs = jobPostings
    .filter((j) => j.id !== job.id && j.jobPostingStatus === 'OPEN')
    .slice(0, 4);
  const formatDate = (date?: string | null) =>
    date ? new Date(date).toLocaleDateString('ko-KR') : '';

  return (
    <>
      <AboutLayout title="채용공고" subtitle="">
        <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-start">
          {/* ── 왼쪽: 본문 ── */}
          <div className="space-y-10 min-w-0">
            <section className="space-y-3 pb-6 border-b">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Come Grow with Us
              </p>
              <h1 className="text-2xl font-bold leading-snug">{job.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={cn(
                    'text-xs font-semibold px-2.5 py-1 rounded-md',
                    dday === '마감'
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary/10 text-primary'
                  )}
                >
                  {dday}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(job.startDate)} ~{' '}
                  {formatDate(job.endDate) || '상시'}
                </span>
              </div>
            </section>

            <Section icon="📋" title="조직소개">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </Section>

            {requirements.length > 0 && (
              <Section icon="👤" title="지원자격">
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
              </Section>
            )}

            {preferred.length > 0 && (
              <Section icon="🏅" title="우대사항">
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
              </Section>
            )}

            {benefits.length > 0 && (
              <Section icon="💼" title="복리후생">
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
              </Section>
            )}

            {/* 하단 버튼 */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/careers')}
              >
                목록가기
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate(`/careers/${id}/apply`)} // ✅ 라우팅
              >
                지원하기
              </Button>
            </div>
          </div>

          {/* ── 오른쪽: 사이드바 ── */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success('링크가 복사되었습니다.');
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              {[
                { label: '부서', value: job.department },
                {
                  label: '고용형태',
                  value: EMPLOYMENT_TYPE_LABEL[job.employmentType],
                },
                { label: '근무지역', value: job.location },
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
                { label: '원격근무', value: job.isRemote ? '가능' : '불가' },
                {
                  label: '모집인원',
                  value: job.headcount ? `${job.headcount}명` : '00명',
                },
              ]
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
              <Button
                className="w-full mt-2"
                onClick={() => navigate(`/careers/${id}/apply`)} // ✅ 라우팅
              >
                지원하기
              </Button>
            </div>

            {otherJobs.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground px-1">
                  추천공고 ({otherJobs.length})
                </p>
                {otherJobs.map((other) => (
                  <Link
                    key={other.id}
                    to={`/careers/${other.id}`}
                    className="block rounded-xl border bg-card p-4 hover:border-primary/40 transition-colors space-y-2"
                  >
                    <p className="text-xs font-semibold leading-snug line-clamp-2">
                      {other.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {getDday(other.endDate)}
                      </span>
                      {other.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </AboutLayout>
    </>
  );
};
