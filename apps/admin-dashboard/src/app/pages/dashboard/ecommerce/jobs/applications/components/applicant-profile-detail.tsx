import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type {
  ApplicantProfile,
  JobApplicationStatusHistory,
} from '@starcoex-frontend/jobs';
import {
  JOB_APPLICATION_STATUS_MAP,
  type JobApplicationStatusValue,
} from '@/app/pages/dashboard/ecommerce/jobs/data/job-data';
import React from 'react';

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

interface ApplicantProfileDetailProps {
  profile: ApplicantProfile;
  statusHistories?: JobApplicationStatusHistory[];
  statusNote?: string | null;
}

export const ApplicantProfileDetail: React.FC<ApplicantProfileDetailProps> = ({
  profile,
  statusHistories,
  statusNote,
}) => (
  <div className="space-y-4">
    {/* 기본 정보 */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
      {profile.availableStartDate && (
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">입사 가능일</p>
          <p className="font-medium">
            {format(new Date(profile.availableStartDate), 'yyyy.MM.dd', {
              locale: ko,
            })}
          </p>
        </div>
      )}
      {profile.applicationChannel && (
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
      {profile.treatment?.desiredSalary != null && (
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">희망 연봉</p>
          <p className="font-medium">
            {profile.treatment.desiredSalary.toLocaleString()}만원
          </p>
        </div>
      )}
      {profile.treatment?.currentSalary != null && (
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">직전 연봉</p>
          <p className="font-medium">
            {profile.treatment.currentSalary.toLocaleString()}만원
          </p>
        </div>
      )}
    </div>

    {/* 학력 */}
    {profile.educations && profile.educations.length > 0 && (
      <>
        <Separator />
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" /> 학력
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.educations.map((edu) => (
              <div
                key={edu.id}
                className="rounded-lg bg-background border px-3 py-2 text-sm space-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{edu.schoolName}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {EDUCATION_LEVEL_LABEL[edu.educationLevel] ??
                      edu.educationLevel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {edu.major && `${edu.major} · `}
                  {GRADUATION_STATUS_LABEL[edu.graduationStatus] ??
                    edu.graduationStatus}
                  {edu.gpa != null && ` · ${edu.gpa}/${edu.gpaMax ?? 4.5}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </>
    )}

    {/* 경력 */}
    {profile.careers && profile.careers.length > 0 && (
      <>
        <Separator />
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> 경력
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.careers.map((career) => (
              <div
                key={career.id}
                className="rounded-lg bg-background border px-3 py-2 text-sm space-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{career.companyName}</span>
                  {career.isCurrent && (
                    <Badge variant="secondary" className="text-[10px]">
                      재직중
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {career.position && `${career.position}`}
                  {career.department && ` · ${career.department}`}
                </p>
                <p className="text-xs text-muted-foreground">
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
            ))}
          </div>
        </div>
      </>
    )}

    {/* 자격증 */}
    {profile.certificates && profile.certificates.length > 0 && (
      <>
        <Separator />
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> 자격증
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.certificates.map((cert) => (
              <Badge key={cert.id} variant="outline" className="text-xs">
                {cert.name}
                {cert.grade && ` (${cert.grade})`}
              </Badge>
            ))}
          </div>
        </div>
      </>
    )}

    {/* 자기소개서 */}
    {profile.coverLetters && profile.coverLetters.length > 0 && (
      <>
        <Separator />
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> 자기소개서
          </p>
          <div className="space-y-2">
            {[...profile.coverLetters]
              .sort((a, b) => a.questionNo - b.questionNo)
              .map((cl) => (
                <div key={cl.id} className="space-y-1">
                  {cl.question && (
                    <p className="text-xs font-medium">
                      Q{cl.questionNo}. {cl.question}
                    </p>
                  )}
                  {cl.answer && (
                    <p className="text-xs text-muted-foreground whitespace-pre-line rounded-lg bg-muted/40 p-2 leading-relaxed">
                      {cl.answer}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </>
    )}

    {/* 상태 이력 + 담당자 메모 */}
    {((statusHistories && statusHistories.length > 0) || statusNote) && (
      <>
        <Separator />
        <div className="flex flex-wrap gap-4">
          {statusHistories && statusHistories.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> 상태 이력
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[...statusHistories]
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((h) => (
                    <Badge key={h.id} variant="outline" className="text-[10px]">
                      {JOB_APPLICATION_STATUS_MAP[
                        h.toStatus as JobApplicationStatusValue
                      ]?.label ?? h.toStatus}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
          {statusNote && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                담당자 메모
              </p>
              <p className="text-xs leading-relaxed rounded-lg bg-muted/40 px-2 py-1">
                {statusNote}
              </p>
            </div>
          )}
        </div>
      </>
    )}
  </div>
);
