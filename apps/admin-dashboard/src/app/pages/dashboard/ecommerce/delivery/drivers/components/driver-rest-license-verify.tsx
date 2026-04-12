import React, { useRef, useState } from 'react';
import { useDelivery } from '@starcoex-frontend/delivery';
import type { VerifyDriverLicenseInput } from '@starcoex-frontend/delivery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Loader2,
  Upload,
  ScanLine,
  ShieldCheck,
  ShieldX,
  CheckCircle2,
} from 'lucide-react';

// ── REST OCR API 호출 ────────────────────────────────────────────────────────
async function callOcrRestApi(imageBase64: string): Promise<{
  success: boolean;
  result?: {
    name?: string;
    birthY?: string;
    birthM?: string;
    birthD?: string;
    licenNo0?: string;
    licenNo1?: string;
    licenNo2?: string;
    licenNo3?: string;
    ghostNum?: string;
  };
  error?: string;
}> {
  // Base64 → Blob → FormData
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  const byteString = atob(base64Data);
  const mimeMatch = imageBase64.match(/data:(image\/\w+);base64,/);
  const mime = mimeMatch?.[1] ?? 'image/jpeg';
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  const blob = new Blob([ab], { type: mime });

  const formData = new FormData();
  formData.append('image', blob, 'license.jpg');

  const res = await fetch('/driver-license/ocr', {
    method: 'POST',
    credentials: 'include', // 쿠키 기반 인증
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`OCR 요청 실패: ${res.status}`);
  }
  return res.json();
}

// ── 자동 포커스 Input 컴포넌트 ───────────────────────────────────────────────
interface AutoFocusInputProps {
  value: string;
  onChange: (val: string) => void;
  maxLength: number;
  nextRef?: React.RefObject<HTMLInputElement | null>; // ✅ | null 추가
  placeholder?: string;
  className?: string;
  id?: string;
}

function AutoFocusInput({
  value,
  onChange,
  maxLength,
  nextRef,
  placeholder,
  className,
  id,
}: AutoFocusInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    onChange(val);
    if (val.length === maxLength && nextRef?.current) {
      nextRef.current.focus();
    }
  };

  return (
    <Input
      id={id}
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      placeholder={placeholder}
      className={`text-center font-mono ${className ?? ''}`}
      inputMode="numeric"
    />
  );
}

// ── Props ────────────────────────────────────────────────────────────────────
interface Props {
  driverId: number;
  currentLicenseNumber?: string | null;
  onVerified?: (licenseNumber: string) => void;
  preVerifyMode?: boolean;
}

export function DriverRestLicenseVerify({
  driverId,
  currentLicenseNumber,
  onVerified,
  preVerifyMode = false,
}: Props) {
  const { verifyDriverLicense } = useDelivery();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── 생년월일 refs (자동 포커스용) ──
  const birthMRef = useRef<HTMLInputElement>(null);
  const birthDRef = useRef<HTMLInputElement>(null);

  // ── 면허번호 refs ──
  const licen1Ref = useRef<HTMLInputElement>(null);
  const licen2Ref = useRef<HTMLInputElement>(null);
  const licen3Ref = useRef<HTMLInputElement>(null);
  const ghostRef = useRef<HTMLInputElement>(null);

  // ── OCR 상태 ──
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);

  // ── 식별번호 보유 여부 ──────────────────────────────────────────────────────
  // true = 있음(빠름) / false = 없음(느림, 안내 표시)
  const [hasGhostNum, setHasGhostNum] = useState(true);

  // ── 폼 상태 ──
  const [form, setForm] = useState({
    name: '',
    birthY: '',
    birthM: '',
    birthD: '',
    licenNo0: '',
    licenNo1: '',
    licenNo2: '',
    licenNo3: '',
    ghostNum: '',
  });

  // ── 진위 확인 결과 ──
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    verified: boolean;
    message?: string | null;
  } | null>(null);

  const setField = (key: keyof typeof form) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setVerifyResult(null);
  };

  // ── OCR (REST) ───────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast.error('이미지 파일만 업로드 가능합니다. (jpeg, jpg, png, webp)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setIsOcrLoading(true);
    setOcrDone(false);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // ✅ REST API 호출
      const res = await callOcrRestApi(base64);

      if (res.success && res.result) {
        const r = res.result;
        setForm((prev) => ({
          ...prev,
          name: r.name ?? prev.name,
          birthY: r.birthY ?? prev.birthY,
          birthM: r.birthM ?? prev.birthM,
          birthD: r.birthD ?? prev.birthD,
          licenNo0: r.licenNo0 ?? prev.licenNo0,
          licenNo1: r.licenNo1 ?? prev.licenNo1,
          licenNo2: r.licenNo2 ?? prev.licenNo2,
          licenNo3: r.licenNo3 ?? prev.licenNo3,
          ghostNum: r.ghostNum ?? prev.ghostNum,
        }));
        // OCR에서 식별번호가 추출됐으면 자동으로 "있음"으로 설정
        if (r.ghostNum) setHasGhostNum(true);
        setOcrDone(true);
        toast.success('OCR 추출 완료! 내용을 확인 후 진위 확인을 진행하세요.');
      } else {
        toast.error(res.error ?? 'OCR 처리에 실패했습니다.');
      }
    } catch (err) {
      toast.error('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsOcrLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── 진위 확인 ────────────────────────────────────────────────────────────
  const handleVerify = async () => {
    const required = [
      'name',
      'birthY',
      'birthM',
      'birthD',
      'licenNo0',
      'licenNo1',
      'licenNo2',
      'licenNo3',
    ] as const;
    const missing = required.filter((k) => !form[k]?.trim());
    if (missing.length > 0) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (hasGhostNum && !form.ghostNum.trim()) {
      toast.error('식별번호를 입력하거나 "식별번호 없음"으로 변경해주세요.');
      return;
    }

    setIsVerifyLoading(true);
    setVerifyResult(null);

    try {
      const input: VerifyDriverLicenseInput = {
        ...form,
        ghostNum: hasGhostNum ? form.ghostNum : undefined,
        driverId,
      };
      const res = await verifyDriverLicense(input);

      if (res.success && res.data) {
        const { verified, message } = res.data;
        setVerifyResult({ verified, message });
        if (verified) {
          toast.success(message ?? '운전면허 진위 확인이 완료되었습니다.');
          const licenseNumber = `${form.licenNo0}-${form.licenNo1}-${form.licenNo2}-${form.licenNo3}`;
          onVerified?.(licenseNumber);
        } else {
          toast.error(message ?? '운전면허 정보가 일치하지 않습니다.');
        }
      } else {
        toast.error(res.error?.message ?? '진위 확인에 실패했습니다.');
      }
    } finally {
      setIsVerifyLoading(false);
    }
  };

  const licenseNumberDisplay =
    currentLicenseNumber ??
    (form.licenNo0 && form.licenNo1 && form.licenNo2 && form.licenNo3
      ? `${form.licenNo0}-${form.licenNo1}-${form.licenNo2}-${form.licenNo3}`
      : null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              운전면허 진위 확인
            </CardTitle>
            <CardDescription>
              면허증 이미지를 업로드하거나 직접 입력하여 진위를 확인합니다.
            </CardDescription>
          </div>
          {currentLicenseNumber && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              인증 완료
            </Badge>
          )}
        </div>
        {licenseNumberDisplay && (
          <p className="text-muted-foreground font-mono text-sm">
            면허번호: {licenseNumberDisplay}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ── Step 1: OCR 이미지 업로드 ─────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <StepBadge n={1} />
            <p className="text-sm font-semibold">면허증 이미지 업로드 (선택)</p>
          </div>
          <p className="text-muted-foreground text-xs">
            이미지를 업로드하면 정보를 자동으로 추출합니다.
          </p>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isOcrLoading}
              className="w-full"
            >
              {isOcrLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  OCR 처리 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  면허증 이미지 업로드
                </>
              )}
            </Button>
            {ocrDone && (
              <Badge variant="secondary" className="shrink-0 gap-1">
                <ScanLine className="h-3 w-3" />
                OCR 완료
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* ── Step 2: 정보 입력 ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <StepBadge n={2} />
            <p className="text-sm font-semibold">면허 정보 입력</p>
          </div>

          {/* 이름 */}
          <div className="space-y-1.5">
            <Label htmlFor="lic-name">이름 *</Label>
            <Input
              id="lic-name"
              value={form.name}
              onChange={(e) => setField('name')(e.target.value)}
              placeholder="홍길동"
            />
          </div>

          {/* 생년월일 — 자동 포커스 */}
          <div className="space-y-1.5">
            <Label>
              생년월일 *{' '}
              <span className="text-muted-foreground text-xs">
                (연 4자리 → 월 2자리 → 일 2자리 자동 이동)
              </span>
            </Label>
            <div className="flex items-center gap-1.5">
              <AutoFocusInput
                value={form.birthY}
                onChange={setField('birthY')}
                maxLength={4}
                nextRef={birthMRef}
                placeholder="YYYY"
                className="w-24"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                ref={birthMRef}
                value={form.birthM}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setField('birthM')(val);
                  if (val.length === 2) birthDRef.current?.focus();
                }}
                maxLength={2}
                placeholder="MM"
                className="w-16 text-center font-mono"
                inputMode="numeric"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                ref={birthDRef}
                value={form.birthD}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setField('birthD')(val);
                  if (val.length === 2) licen1Ref.current?.focus();
                }}
                maxLength={2}
                placeholder="DD"
                className="w-16 text-center font-mono"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* 면허번호 — 자동 포커스 */}
          <div className="space-y-1.5">
            <Label>
              면허번호 *{' '}
              <span className="text-muted-foreground text-xs">
                (지역 2 → 연도 2 → 일련번호 6 → 종별 2 자동 이동)
              </span>
            </Label>
            <div className="flex items-center gap-1">
              <AutoFocusInput
                value={form.licenNo0}
                onChange={setField('licenNo0')}
                maxLength={2}
                nextRef={licen1Ref}
                placeholder="지역"
                className="w-16"
              />
              <span className="text-muted-foreground shrink-0">-</span>
              <Input
                ref={licen1Ref}
                value={form.licenNo1}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setField('licenNo1')(val);
                  if (val.length === 2) licen2Ref.current?.focus();
                }}
                maxLength={2}
                placeholder="연도"
                className="w-16 text-center font-mono"
                inputMode="numeric"
              />
              <span className="text-muted-foreground shrink-0">-</span>
              <Input
                ref={licen2Ref}
                value={form.licenNo2}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setField('licenNo2')(val);
                  if (val.length === 6) licen3Ref.current?.focus();
                }}
                maxLength={6}
                placeholder="일련번호"
                className="w-28 text-center font-mono"
                inputMode="numeric"
              />
              <span className="text-muted-foreground shrink-0">-</span>
              <Input
                ref={licen3Ref}
                value={form.licenNo3}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setField('licenNo3')(val);
                  // 식별번호 있음이면 ghostRef로 이동
                  if (val.length === 2 && hasGhostNum)
                    ghostRef.current?.focus();
                }}
                maxLength={2}
                placeholder="종별"
                className="w-16 text-center font-mono"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* 식별번호 — 있음/없음 토글 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">식별번호 보유</p>
                <p className="text-muted-foreground text-xs">
                  {hasGhostNum
                    ? '✅ 있음 — 응답이 빠릅니다.'
                    : '⚠️ 없음 — 조회 시간이 다소 걸릴 수 있습니다.'}
                </p>
              </div>
              <Switch
                checked={hasGhostNum}
                onCheckedChange={(v) => {
                  setHasGhostNum(v);
                  if (!v) setField('ghostNum')('');
                  setVerifyResult(null);
                }}
              />
            </div>

            {hasGhostNum && (
              <div className="space-y-1.5">
                <Label htmlFor="lic-ghost">
                  식별번호 *
                  <span className="text-muted-foreground ml-1 text-xs">
                    (면허증 앞면 하단 5~6자리)
                  </span>
                </Label>
                <Input
                  id="lic-ghost"
                  ref={ghostRef}
                  value={form.ghostNum}
                  onChange={(e) =>
                    setField('ghostNum')(
                      e.target.value.toUpperCase().slice(0, 6)
                    )
                  }
                  placeholder="8H1X3Y"
                  className="font-mono uppercase w-40"
                  maxLength={6}
                />
              </div>
            )}

            {!hasGhostNum && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
                식별번호가 없으면 Apick API가 추가 조회를 수행하여 응답이
                <strong> 수초~수십초</strong> 걸릴 수 있습니다. 가능하면 면허증
                앞면 하단의 식별번호를 입력해 주세요.
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* ── Step 3: 진위 확인 ────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <StepBadge n={3} />
            <p className="text-sm font-semibold">진위 확인</p>
          </div>

          <Button
            type="button"
            onClick={handleVerify}
            disabled={isVerifyLoading}
            className="w-full"
          >
            {isVerifyLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                진위 확인 중...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                운전면허 진위 확인
              </>
            )}
          </Button>

          {/* 결과 */}
          {verifyResult && (
            <div
              className={`flex items-start gap-3 rounded-lg border p-4 ${
                verifyResult.verified
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              {verifyResult.verified ? (
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              ) : (
                <ShieldX className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              )}
              <div>
                <p
                  className={`text-sm font-semibold ${
                    verifyResult.verified ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {verifyResult.verified ? '진위 확인 완료' : '진위 확인 실패'}
                </p>
                {verifyResult.message && (
                  <p
                    className={`mt-0.5 text-xs ${
                      verifyResult.verified ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {verifyResult.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="text-muted-foreground text-xs">
            {preVerifyMode
              ? '※ 면허 확인 후 기사 등록 시 자동으로 저장됩니다.'
              : '※ 운전면허 진위 확인은 1시간에 최대 10회 가능합니다.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── 스텝 뱃지 ────────────────────────────────────────────────────────────────
function StepBadge({ n }: { n: number }) {
  return (
    <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
      {n}
    </span>
  );
}
