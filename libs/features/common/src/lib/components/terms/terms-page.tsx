import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Shield,
  FileText,
  MapPin,
  MessageSquare,
  Lock, // ★ 추가
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  ScrollArea,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui';
import {
  type SiteTermsConfig,
  type TermsContent,
  type TermsType,
} from './terms-data';
import { Link } from 'react-router-dom';

// ─── 타입 아이콘 매핑 ─────────────────────────────────────────────────────────

const TERMS_ICONS: Record<TermsType, React.ElementType> = {
  service: FileText,
  privacy: Shield,
  location: MapPin,
  sms: MessageSquare,
  security: Lock, // ★ 추가
};

const TERMS_COLORS: Record<TermsType, string> = {
  service: 'bg-muted/30 border-border',
  privacy: 'bg-muted/30 border-border',
  location: 'bg-muted/30 border-border',
  sms: 'bg-muted/30 border-border',
  security: 'bg-muted/30 border-border',
};

const TERMS_BADGE_COLORS: Record<TermsType, string> = {
  service: 'bg-secondary text-secondary-foreground',
  privacy: 'bg-secondary text-secondary-foreground',
  location: 'bg-secondary text-secondary-foreground',
  sms: 'bg-secondary text-secondary-foreground',
  security: 'bg-secondary text-secondary-foreground', // ★ 추가
};

// ─── 단일 약관 아코디언 ───────────────────────────────────────────────────────

interface TermsCardProps {
  terms: TermsContent;
}

function TermsCard({ terms }: TermsCardProps) {
  const [open, setOpen] = useState(false);
  const Icon = TERMS_ICONS[terms.type];

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className={`border ${TERMS_COLORS[terms.type]}`}>
        <CollapsibleTrigger asChild>
          {/* ★ CardHeader 내 텍스트 색상 명시 — 배경색 상속 방지 */}
          <CardHeader className="cursor-pointer select-none hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 flex-shrink-0 text-foreground" />
                <div>
                  <CardTitle className="text-base text-foreground">
                    {terms.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5 text-muted-foreground">
                    버전 {terms.version} · 최종 업데이트: {terms.updatedAt}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`text-xs ${TERMS_BADGE_COLORS[terms.type]}`}
                >
                  {terms.required ? '필수' : '선택'}
                </Badge>
                {open ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Separator className="mb-4" />
            {/* ★ bg-white/80 → bg-card 으로 변경, pre 글자색도 토큰 사용 */}
            <ScrollArea className="h-72 w-full rounded-md border bg-card p-4">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground">
                {terms.content}
              </pre>
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ─── 메인 약관 페이지 컴포넌트 ───────────────────────────────────────────────

interface TermsPageProps {
  config: SiteTermsConfig;
  /** 현재 보여줄 특정 약관 타입 (없으면 전체 표시) */
  activeType?: TermsType;
}

export function TermsPage({ config, activeType }: TermsPageProps) {
  const filteredTerms = activeType
    ? config.terms.filter((t) => t.type === activeType)
    : config.terms;

  return (
    <div className="container max-w-3xl py-12 px-4 md:px-6">
      {/* 헤더 */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {activeType
            ? config.terms.find((t) => t.type === activeType)?.title ??
              '약관 및 정책'
            : '약관 및 정책'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {config.company.legalName} · 대표 {config.company.ceo}
        </p>
      </div>

      {/* 사업자 정보 카드 */}
      <Card className="mb-8 bg-muted/40">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">사업자 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
            <div className="flex gap-2">
              <dt className="text-muted-foreground w-24 flex-shrink-0">
                상호/법인명
              </dt>
              <dd className="font-medium">{config.company.legalName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground w-24 flex-shrink-0">
                대표자
              </dt>
              <dd className="font-medium">{config.company.ceo}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground w-24 flex-shrink-0">
                사업자번호
              </dt>
              <dd className="font-medium">{config.company.bizNumber}</dd>
            </div>
            {config.company.corpRegNumber && (
              <div className="flex gap-2">
                <dt className="text-muted-foreground w-24 flex-shrink-0">
                  법인등록번호
                </dt>
                <dd className="font-medium">{config.company.corpRegNumber}</dd>
              </div>
            )}
            <div className="flex gap-2 sm:col-span-2">
              <dt className="text-muted-foreground w-24 flex-shrink-0">주소</dt>
              <dd className="font-medium">{config.company.address}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground w-24 flex-shrink-0">
                이메일
              </dt>
              <dd className="font-medium">{config.company.email}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* 약관 목록 탭 링크 (전체 표시 시) */}
      {!activeType && (
        <div className="flex flex-wrap gap-2 mb-6">
          {config.terms.map((t) => {
            const Icon = TERMS_ICONS[t.type];
            return (
              <Link
                key={t.type}
                to={`?type=${t.type}`}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-accent ${
                  TERMS_COLORS[t.type]
                }`}
              >
                <Icon className="w-3 h-3" />
                {t.title}
              </Link>
            );
          })}
        </div>
      )}

      {/* 약관 아코디언 목록 */}
      <div className="space-y-4">
        {filteredTerms.map((terms) => (
          <TermsCard key={terms.type} terms={terms} />
        ))}
      </div>
    </div>
  );
}
