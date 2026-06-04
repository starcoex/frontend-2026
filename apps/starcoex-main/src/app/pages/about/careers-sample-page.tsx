import React from 'react';
import { AboutLayout } from '@/app/pages/about/components/about-layout';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  field: string;
  level: string;
  location: string;
  tags: string[];
  startDate: string;
  endDate: string;
  description: string;
  tasks: { group: string; items: string[] }[];
  requirements: string[];
  preferred: string[];
  process: string[];
  benefits: string[];
  notice: string[];
}

export const JOB_POSTINGS: JobPosting[] = [
  {
    id: 'gas-station-manager',
    title: '별표주유소 운영 관리자',
    department: '운영',
    field: '서비스/운영',
    level: '정규직',
    location: '제주',
    tags: ['#서비스/운영', '#주유소', '#제주', '#정규직'],
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    description:
      '별표주유소의 일상 운영 및 고객 서비스를 총괄하는 역할입니다. 직원 관리, 재고 관리, 고객 응대 등의 업무를 담당합니다.',
    tasks: [
      {
        group: '주유소 운영 관리',
        items: [
          '일일 운영 현황 관리 및 보고',
          '연료 재고 관리 및 발주',
          '안전 규정 준수 관리',
        ],
      },
      {
        group: '고객 서비스',
        items: [
          '고객 불만 접수 및 처리',
          '멤버십 회원 관리',
          '서비스 품질 개선',
        ],
      },
    ],
    requirements: ['유사 업종 1년 이상 경력자', '운전면허 보유자'],
    preferred: [
      '주유소 또는 편의점 관리 경험자',
      '고객 서비스 관련 자격증 보유자',
    ],
    process: ['서류 접수', '서류 전형', '면접 전형', '최종 합격'],
    benefits: [
      '4대보험 가입',
      '유류비 지원(월 60리터)',
      '건강검진 지원',
      '명절 상여금',
    ],
    notice: [
      '허위 기재 시 합격이 취소될 수 있습니다.',
      '채용 일정은 상황에 따라 변경될 수 있습니다.',
    ],
  },
  {
    id: 'car-wash-technician',
    title: '제라게 세차 전문 기술자',
    department: '세차',
    field: '기술/서비스',
    level: '정규직',
    location: '제주',
    tags: ['#기술/서비스', '#세차', '#제주', '#정규직'],
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    description:
      '제라게 셀프세차장의 차량 세차 및 디테일링 서비스를 담당합니다. 고객 차량의 상태를 점검하고 최적의 세차 서비스를 제공합니다.',
    tasks: [
      {
        group: '세차 서비스',
        items: [
          '차량 세차 및 광택 서비스',
          '실내 청소 및 방향제 서비스',
          '세차 장비 관리 및 유지보수',
        ],
      },
    ],
    requirements: ['성실하고 책임감 있는 분', '운전면허 보유자'],
    preferred: ['세차 또는 자동차 관련 경력자', '고객 서비스 마인드 보유자'],
    process: ['서류 접수', '면접 전형', '최종 합격'],
    benefits: ['4대보험 가입', '유류비 지원', '교육 훈련 지원'],
    notice: ['채용 일정은 상황에 따라 변경될 수 있습니다.'],
  },
];

// D-day 계산
function getDday(endDate: string): string {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return '마감';
  if (diff === 0) return 'D-day';
  return `D-${diff}`;
}

export const CareersPage: React.FC = () => {
  const activePostings = JOB_POSTINGS;

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
                ({activePostings.length})
              </span>
            </h2>
          </div>
        </section>

        {/* 공고 없을 때 */}
        {activePostings.length === 0 && (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activePostings.map((job) => {
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
                    {job.startDate} ~ {job.endDate}
                  </span>
                </div>

                {/* 제목 */}
                <h3 className="font-semibold text-sm leading-snug line-clamp-2">
                  {job.title}
                </h3>

                {/* 메타 */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                  <span>{job.level}</span>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1 mt-auto pt-1">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

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
