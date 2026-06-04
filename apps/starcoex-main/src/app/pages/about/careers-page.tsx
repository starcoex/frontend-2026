import React, { useEffect } from 'react';
import { AboutLayout } from '@/app/pages/about/components/about-layout';
import { Link } from 'react-router-dom';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useJobs } from '@starcoex-frontend/jobs';

export const CareersPage: React.FC = () => {
  const { openPostings, isLoading, error, fetchJobPostings, getDday } =
    useJobs();

  useEffect(() => {
    fetchJobPostings(true); // onlyOpen = true
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AboutLayout
      title="인재채용"
      subtitle="스타코엑스와 함께 성장할 인재를 찾습니다"
    >
      <div className="space-y-8">
        {/* 헤더 */}
        <section className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Come Grow with Us
          </p>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Jobs
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({isLoading ? '...' : openPostings.length})
              </span>
            </h2>
          </div>
        </section>

        {/* 로딩 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* 에러 */}
        {!isLoading && error && (
          <div className="rounded-xl border bg-destructive/5 border-destructive/20 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* 공고 없을 때 */}
        {!isLoading && !error && openPostings.length === 0 && (
          <div className="rounded-xl border bg-card p-12 text-center space-y-3">
            <p className="text-muted-foreground text-sm">
              현재 진행 중인 채용공고가 없습니다.
            </p>
            <p className="text-xs text-muted-foreground">
              채용 문의:{' '}
              <a
                href="tel:064-713-2002"
                className="text-primary hover:underline"
              >
                064-713-2002
              </a>
            </p>
          </div>
        )}

        {/* 채용 카드 그리드 */}
        {!isLoading && !error && openPostings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {openPostings.map((job) => {
              const dday = getDday(job.endDate);
              const isExpired = dday === '마감';

              return (
                <Link
                  key={job.id}
                  to={`/careers/${job.id}`}
                  className={cn(
                    'flex flex-col gap-3 rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-primary/40',
                    isExpired && 'opacity-50 pointer-events-none'
                  )}
                >
                  {/* D-day 뱃지 */}
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-md',
                        dday === '마감'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary/10 text-primary'
                      )}
                    >
                      {dday}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {job.startDate
                        ? new Date(job.startDate).toLocaleDateString('ko-KR')
                        : ''}
                      {' ~ '}
                      {job.endDate
                        ? new Date(job.endDate).toLocaleDateString('ko-KR')
                        : '상시'}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                    {job.title}
                  </h3>

                  {/* 메타 */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                    )}
                    <span>{EMPLOYMENT_TYPE_LABEL[job.employmentType]}</span>
                    {job.isRemote && (
                      <span className="text-primary font-medium">원격가능</span>
                    )}
                  </div>

                  {/* 태그 */}
                  {job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto pt-1">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* 채용 문의 */}
        <section className="rounded-xl border bg-primary/5 border-primary/20 p-5 space-y-2">
          <p className="text-sm font-semibold">채용 관련 문의</p>
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <a href="tel:064-713-2002" className="text-primary hover:underline">
              📞 064-713-2002
            </a>
            <a
              href="mailto:starcoex@naver.co.kr"
              className="text-primary hover:underline"
            >
              ✉️ starcoex@naver.co.kr
            </a>
          </div>
        </section>
      </div>
    </AboutLayout>
  );
};

// ─── 고용형태 한글 레이블 ──────────────────────────────────────────────────────
const EMPLOYMENT_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: '정규직',
  PART_TIME: '파트타임',
  CONTRACT: '계약직',
  INTERNSHIP: '인턴',
  FREELANCE: '프리랜서',
};
