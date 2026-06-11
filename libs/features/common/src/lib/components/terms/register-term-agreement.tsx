import { useState } from 'react';
import {
  Button,
  Checkbox,
  ScrollArea,
  Separator,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Badge,
} from '../ui';
import { ChevronRight, MapPin, Lock } from 'lucide-react';
import { SITE_TERMS_CONFIG, type TermsType } from './terms-data';

// ─── 약관 보기 다이얼로그 ──────────────────────────────────────────────────────

function TermsViewDialog({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground gap-0.5"
        >
          내용 보기
          <ChevronRight className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>
        {/* ★ bg-white → bg-card, 글자색 → text-foreground */}
        <ScrollArea className="h-80 w-full rounded-md border bg-card p-4">
          <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground">
            {content}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ─── 메인 동의 컴포넌트 ───────────────────────────────────────────────────────

type AgreementState = Partial<Record<TermsType, boolean>>;

interface RegisterTermsAgreementProps {
  siteKey: 'MAIN' | 'STAROIL' | 'DELIVERY' | 'ZERAGAE' | 'ADMIN';
  onAgreementChange?: (
    allRequiredAgreed: boolean,
    state: AgreementState
  ) => void;
}

export function RegisterTermsAgreement({
  siteKey,
  onAgreementChange,
}: RegisterTermsAgreementProps) {
  const config = SITE_TERMS_CONFIG[siteKey];
  const [agreements, setAgreements] = useState<AgreementState>(() =>
    Object.fromEntries(config.terms.map((t) => [t.type, false]))
  );

  const requiredTypes = config.terms
    .filter((t) => t.required)
    .map((t) => t.type);

  const allRequiredAgreed = requiredTypes.every((type) => !!agreements[type]);
  const allAgreed =
    allRequiredAgreed && config.terms.every((t) => !!agreements[t.type]);

  const handleAllChange = (checked: boolean) => {
    const next = Object.fromEntries(config.terms.map((t) => [t.type, checked]));
    setAgreements(next);
    onAgreementChange?.(checked, next);
  };

  const handleSingleChange = (type: TermsType, checked: boolean) => {
    const next = { ...agreements, [type]: checked };
    setAgreements(next);
    const allReq = requiredTypes.every((t) => !!next[t]);
    onAgreementChange?.(allReq, next);
  };

  return (
    <div className="space-y-3 rounded-xl border p-4 bg-card">
      <h3 className="text-sm font-semibold">약관 동의</h3>

      {/* 전체 동의 */}
      <div className="flex items-center space-x-2 rounded-lg bg-muted/50 px-3 py-2">
        <Checkbox
          id="all-agree"
          checked={allAgreed}
          onCheckedChange={(checked) => handleAllChange(!!checked)}
        />
        <label
          htmlFor="all-agree"
          className="text-sm font-medium cursor-pointer select-none flex-1"
        >
          전체 약관에 동의합니다.
        </label>
      </div>

      <Separator />

      {/* 개별 동의 */}
      <div className="space-y-3">
        {config.terms.map((terms) => (
          <div
            key={terms.type}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              {/* ★ 위치정보 약관은 시각적으로 강조 */}
              {terms.type === 'location' && (
                <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              )}
              {terms.type === 'security' && ( // ★ 추가
                <Lock className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
              )}
              <Checkbox
                id={`agree-${terms.type}`}
                checked={!!agreements[terms.type]}
                onCheckedChange={(checked) =>
                  handleSingleChange(terms.type, !!checked)
                }
              />
              <label
                htmlFor={`agree-${terms.type}`}
                className="text-sm cursor-pointer select-none leading-tight"
              >
                <Badge
                  variant="outline"
                  className={`mr-1.5 text-[10px] px-1 py-0 ${
                    terms.required
                      ? 'border-red-300 text-red-600'
                      : 'border-muted-foreground/40 text-muted-foreground'
                  }`}
                >
                  {terms.required ? '필수' : '선택'}
                </Badge>
                {terms.title}
              </label>
            </div>
            <TermsViewDialog title={terms.title} content={terms.content} />
          </div>
        ))}
      </div>

      {/* 사업자 표시 */}
      <p className="text-[10px] text-muted-foreground pt-1">
        개인정보 처리 주체: {config.company.legalName} (대표:{' '}
        {config.company.ceo} · 사업자번호: {config.company.bizNumber})
      </p>
    </div>
  );
}
