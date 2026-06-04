import React, { useState, useRef } from 'react';
import {
  Loader2,
  Send,
  Plus,
  Trash2,
  CalendarIcon,
  Upload,
  X,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { JobApplication, useJobs } from '@starcoex-frontend/jobs';
import { useMedia } from '@starcoex-frontend/media';
import { useAuth } from '@starcoex-frontend/auth';
import { useAddress } from '@starcoex-frontend/address';
import { toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { JusoApiAddress } from '@starcoex-frontend/graphql';

// ── 스키마 ────────────────────────────────────────────────────────────────────

const educationSchema = z.object({
  educationLevel: z.string().min(1, '학력 구분을 선택해주세요.'),
  schoolName: z.string().min(1, '학교명을 입력해주세요.'),
  major: z.string().optional(),
  graduationStatus: z.string().min(1, '졸업 상태를 선택해주세요.'),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
});

const careerSchema = z.object({
  companyName: z.string().min(1, '회사명을 입력해주세요.'),
  employmentType: z.string().min(1, '고용 형태를 선택해주세요.'),
  startDate: z.date({ message: '입사연월을 입력해주세요.' }),
  endDate: z.date().optional().nullable(),
  isCurrent: z.boolean(),
  department: z.string().optional(),
  position: z.string().optional(),
  jobDescription: z.string().optional(),
  leavingReason: z.string().optional(),
});

const coverLetterSchema = z.object({
  questionNo: z.number(),
  question: z.string().optional(),
  answer: z.string().optional(),
});

const applySchema = z.object({
  nameKo: z.string().min(1, '이름을 입력해주세요.'),
  nameEn: z.string().optional(),
  phone: z.string().min(1, '연락처를 입력해주세요.'),
  emergencyPhone: z.string().optional(),
  availableStartDate: z.date().optional().nullable(),
  applicationChannel: z.string().optional(),
  applicationChannelDetail: z.string().optional(),
  roadAddress: z.string().optional(),
  zipCode: z.string().optional(),
  addressDetail: z.string().optional(),
  educations: z.array(educationSchema).min(1, '학력을 최소 1개 입력해주세요.'),
  careers: z.array(careerSchema).optional(),
  coverLetters: z.array(coverLetterSchema).optional(),
  desiredPosition: z.string().optional(),
  desiredSalary: z.number().optional(),
  currentSalary: z.number().optional(),
  privacyAgreed: z.boolean().refine((v) => v === true, {
    message: '개인정보 처리 방침에 동의해주세요.',
  }),
});

type ApplyFormValues = z.infer<typeof applySchema>;

// ── 상수 ─────────────────────────────────────────────────────────────────────

const EDUCATION_LEVEL_OPTIONS = [
  { value: 'HIGH_SCHOOL', label: '고등학교' },
  { value: 'ASSOCIATE', label: '전문대' },
  { value: 'BACHELOR', label: '학사' },
  { value: 'MASTER', label: '석사' },
  { value: 'DOCTOR', label: '박사' },
];

const GRADUATION_STATUS_OPTIONS = [
  { value: 'GRADUATED', label: '졸업' },
  { value: 'ENROLLED', label: '재학중' },
  { value: 'LEAVE', label: '휴학' },
  { value: 'DROPPED', label: '중퇴' },
  { value: 'EXPECTED', label: '졸업예정' },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'FULL_TIME', label: '정규직' },
  { value: 'PART_TIME', label: '파트타임' },
  { value: 'CONTRACT', label: '계약직' },
  { value: 'INTERNSHIP', label: '인턴' },
  { value: 'FREELANCE', label: '프리랜서' },
];

const APPLICATION_CHANNEL_OPTIONS = [
  { value: 'WEBSITE', label: '홈페이지' },
  { value: 'JOBKOREA', label: '잡코리아' },
  { value: 'SARAMIN', label: '사람인' },
  { value: 'LINKEDIN', label: '링크드인' },
  { value: 'RECRUIT', label: '리쿠르트' },
  { value: 'OTHER', label: '기타' },
];

// 모바일 탭 목록
const MOBILE_TABS = [
  { id: 'personal', label: '기본 인적사항' },
  { id: 'career', label: '경력 정보' },
  { id: 'education', label: '학력 정보' },
  { id: 'cover-letter', label: '자기소개서' },
  { id: 'files', label: '파일 제출' },
  { id: 'treatment', label: '처우 희망' },
];

// 데스크톱 사이드바 목차
const SECTION_NAV = [
  { id: 'personal', label: '기본 인적사항' },
  { id: 'career', label: '경력 정보' },
  { id: 'education', label: '학력 정보' },
  { id: 'cover-letter', label: '자기소개서' },
  { id: 'files', label: '파일 제출' },
  { id: 'treatment', label: '처우 희망' },
];

// ── Props ─────────────────────────────────────────────────────────────────────

export interface JobApplyFormProps {
  jobTitle: string;
  jobPostingId: number;
  /** 수정 모드일 때 기존 지원서 데이터 */
  initialData?: JobApplication;
  onCancel: () => void;
  onSuccess: () => void;
}

// ── 날짜 피커 ─────────────────────────────────────────────────────────────────

const MonthPickerField: React.FC<{
  value: Date | null | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder: string;
  disabled?: boolean;
}> = ({ value, onChange, placeholder, disabled }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal h-9',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
          {value ? format(value, 'yyyy.MM', { locale: ko }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
          locale={ko}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const DatePickerField: React.FC<{
  value: Date | null | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal h-9',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
          {value
            ? format(value, 'yyyy년 MM월 dd일', { locale: ko })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
          locale={ko}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

// ── 섹션 헤더 ─────────────────────────────────────────────────────────────────

const SectionHeader: React.FC<{
  id: string;
  title: string;
  required?: boolean;
  open: boolean;
  onToggle: () => void;
  action?: React.ReactNode;
}> = ({ id, title, required, open, onToggle, action }) => (
  <div className="flex items-center justify-between py-4 border-b">
    <button
      type="button"
      id={id}
      className="flex items-center gap-2 text-lg font-bold hover:text-primary transition-colors"
      onClick={onToggle}
    >
      {title}
      {required && <span className="text-destructive text-sm">*</span>}
      {open ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>
    {action}
  </div>
);

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export const JobApplyForm: React.FC<JobApplyFormProps> = ({
  jobTitle,
  jobPostingId,
  initialData,
  onCancel,
  onSuccess,
}) => {
  const isEditMode = !!initialData;
  const { submitJobApplication, updateJobApplication } = useJobs();
  const { uploadMedia } = useMedia();
  const { currentUser } = useAuth();
  const { smartSearchAddresses, searchResults, clearSearchResults } =
    useAddress();

  // 모바일 활성 탭
  const [activeTab, setActiveTab] = useState('personal');

  const [sections, setSections] = useState({
    personal: true,
    career: true,
    education: true,
    coverLetter: true,
    files: true,
    treatment: false,
  });

  const toggleSection = (key: keyof typeof sections) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; mediaId: number; size: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addressKeyword, setAddressKeyword] = useState('');
  const [addressSearchOpen, setAddressSearchOpen] = useState(false);
  // initialData로 폼 초기값 세팅
  const profile = initialData?.profile;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      nameKo: currentUser?.name ?? '',
      nameEn: '',
      phone: '',
      emergencyPhone: '',
      availableStartDate: profile?.availableStartDate
        ? new Date(profile.availableStartDate)
        : null,
      applicationChannel: profile?.applicationChannel ?? '',
      applicationChannelDetail: profile?.applicationChannelDetail ?? '',
      roadAddress: '',
      zipCode: '',
      addressDetail: '',
      educations:
        profile?.educations && profile.educations.length > 0
          ? profile.educations.map((edu) => ({
              educationLevel: edu.educationLevel,
              schoolName: edu.schoolName,
              major: edu.major ?? '',
              graduationStatus: edu.graduationStatus,
              startDate: edu.startDate ? new Date(edu.startDate) : null,
              endDate: edu.endDate ? new Date(edu.endDate) : null,
            }))
          : [
              {
                educationLevel: '',
                schoolName: '',
                major: '',
                graduationStatus: '',
                startDate: null,
                endDate: null,
              },
            ],
      careers:
        profile?.careers && profile.careers.length > 0
          ? profile.careers.map((c) => ({
              companyName: c.companyName,
              employmentType: c.employmentType,
              startDate: new Date(c.startDate),
              endDate: c.endDate ? new Date(c.endDate) : null,
              isCurrent: c.isCurrent,
              department: c.department ?? '',
              position: c.position ?? '',
              jobDescription: c.jobDescription ?? '',
              leavingReason: c.leavingReason ?? '',
            }))
          : [],
      coverLetters:
        profile?.coverLetters && profile.coverLetters.length > 0
          ? [...profile.coverLetters]
              .sort((a, b) => a.questionNo - b.questionNo)
              .map((cl) => ({
                questionNo: cl.questionNo,
                question: cl.question ?? '',
                answer: cl.answer ?? '',
              }))
          : [
              {
                questionNo: 1,
                question: '지원 동기를 작성해주세요.',
                answer: '',
              },
            ],
      desiredPosition: profile?.treatment?.desiredPosition ?? '',
      desiredSalary: profile?.treatment?.desiredSalary ?? undefined,
      currentSalary: profile?.treatment?.currentSalary ?? undefined,
      privacyAgreed: isEditMode ? true : false, // 수정 모드는 이미 동의됨
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: 'educations' });
  const {
    fields: careerFields,
    append: appendCareer,
    remove: removeCareer,
  } = useFieldArray({ control, name: 'careers' });
  const {
    fields: coverLetterFields,
    append: appendCoverLetter,
    remove: removeCoverLetter,
  } = useFieldArray({ control, name: 'coverLetters' });

  const privacyAgreed = watch('privacyAgreed');
  const applicationChannel = watch('applicationChannel');
  const roadAddress = watch('roadAddress');

  const handleReset = () => {
    reset();
    setUploadedFiles([]);
    setProfileImage(null);
    setAddressKeyword('');
  };

  const handleProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !currentUser) return;
    const files = Array.from(e.target.files);
    setIsUploading(true);
    try {
      const res = await uploadMedia(files, currentUser.id, 'ATTACHMENT');
      if (res.success) {
        toast.success('파일이 업로드되었습니다.');
        const newFiles = files.map((f, i) => ({
          name: f.name,
          mediaId: Date.now() + i,
          size: `${(f.size / 1024 / 1024).toFixed(1)}MB`,
        }));
        setUploadedFiles((prev) => [...prev, ...newFiles]);
      } else {
        toast.error('파일 업로드에 실패했습니다.');
      }
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddressSelect = (address: JusoApiAddress) => {
    setValue('roadAddress', address.roadAddr);
    setValue('zipCode', address.zipNo);
    setAddressKeyword('');
    setAddressSearchOpen(false);
    clearSearchResults();
    toast.success('주소가 선택되었습니다.');
  };

  const handleAddressSearch = async () => {
    if (!addressKeyword.trim()) return;
    await smartSearchAddresses({
      keyword: addressKeyword.trim(),
      currentPage: 1,
      countPerPage: 10,
    });
    setAddressSearchOpen(true);
  };

  const onSubmit = async (values: ApplyFormValues) => {
    try {
      if (isEditMode && initialData) {
        // ─── 수정 모드 ──────────────────────────────────────────────────────
        const res = await updateJobApplication({
          applicationId: initialData.id,
          availableStartDate:
            values.availableStartDate?.toISOString() || undefined,
          applicationChannel: (values.applicationChannel as any) || undefined,
          applicationChannelDetail:
            values.applicationChannelDetail || undefined,
          educations: values.educations.map((edu, idx) => ({
            id: profile?.educations?.[idx]?.id,
            educationLevel: edu.educationLevel,
            schoolName: edu.schoolName,
            major: edu.major || undefined,
            graduationStatus: edu.graduationStatus,
            startDate: edu.startDate?.toISOString() || undefined,
            endDate: edu.endDate?.toISOString() || undefined,
          })),
          careers: values.careers?.map((c, idx) => ({
            id: profile?.careers?.[idx]?.id,
            companyName: c.companyName,
            employmentType: c.employmentType,
            startDate: c.startDate.toISOString(),
            endDate: c.isCurrent ? undefined : c.endDate?.toISOString(),
            isCurrent: c.isCurrent,
            department: c.department || undefined,
            position: c.position || undefined,
            jobDescription: c.jobDescription || undefined,
            leavingReason: c.leavingReason || undefined,
          })),
          coverLetters: values.coverLetters
            ?.filter((cl) => cl.answer)
            .map((cl, idx) => ({
              id: profile?.coverLetters?.[idx]?.id,
              questionNo: cl.questionNo,
              question: cl.question || undefined,
              answer: cl.answer || undefined,
            })),
          treatment:
            values.desiredPosition ||
            values.desiredSalary ||
            values.currentSalary
              ? {
                  desiredPosition: values.desiredPosition || undefined,
                  desiredSalary: values.desiredSalary || undefined,
                  currentSalary: values.currentSalary || undefined,
                }
              : undefined,
          files: uploadedFiles.map((f) => ({
            fileType: 'ATTACHMENT',
            mediaId: f.mediaId,
          })),
        });
        if (res.success) {
          toast.success('지원서가 수정되었습니다.');
          onSuccess();
        } else {
          toast.error((res as any).error?.message ?? '수정에 실패했습니다.');
        }
      } else {
        // ─── 신규 제출 모드 ─────────────────────────────────────────────────
        await submitJobApplication({
          jobPostingId,
          availableStartDate:
            values.availableStartDate?.toISOString() || undefined,
          applicationChannel: (values.applicationChannel as any) || undefined,
          applicationChannelDetail:
            values.applicationChannelDetail || undefined,
          educations: values.educations.map((edu) => ({
            educationLevel: edu.educationLevel,
            schoolName: edu.schoolName,
            major: edu.major || undefined,
            graduationStatus: edu.graduationStatus,
            startDate: edu.startDate?.toISOString() || undefined,
            endDate: edu.endDate?.toISOString() || undefined,
          })),
          careers: values.careers?.map((c) => ({
            companyName: c.companyName,
            employmentType: c.employmentType,
            startDate: c.startDate.toISOString(),
            endDate: c.isCurrent ? undefined : c.endDate?.toISOString(),
            isCurrent: c.isCurrent,
            department: c.department || undefined,
            position: c.position || undefined,
            jobDescription: c.jobDescription || undefined,
            leavingReason: c.leavingReason || undefined,
          })),
          coverLetters: values.coverLetters?.filter((cl) => cl.answer),
          treatment:
            values.desiredPosition ||
            values.desiredSalary ||
            values.currentSalary
              ? {
                  desiredPosition: values.desiredPosition || undefined,
                  desiredSalary: values.desiredSalary || undefined,
                  currentSalary: values.currentSalary || undefined,
                }
              : undefined,
          files: uploadedFiles.map((f) => ({
            fileType: 'ATTACHMENT',
            mediaId: f.mediaId,
          })),
          privacyAgreed: values.privacyAgreed,
        });
        toast.success('지원서가 성공적으로 제출되었습니다! 🎉');
        handleReset();
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err?.message ?? '오류가 발생했습니다.');
    }
  };

  // ── 섹션별 콘텐츠 렌더링 ─────────────────────────────────────────────────────

  const renderPersonal = () => (
    <>
      <SectionHeader
        id="personal"
        title="개인정보"
        required
        open={sections.personal}
        onToggle={() => toggleSection('personal')}
      />
      {sections.personal && (
        <div className="py-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* 사진 등록 */}
            <div className="shrink-0 flex flex-col items-center sm:items-start">
              <div
                className="w-32 h-40 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                onClick={() => profileInputRef.current?.click()}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <User className="w-10 h-10 text-muted-foreground/30" />
                    <p className="text-[11px] text-muted-foreground mt-2 text-center px-2 leading-relaxed">
                      최근 6개월
                      <br />
                      이내 촬영 본
                    </p>
                    <p className="text-[11px] text-destructive/60 mt-1">
                      ※ 1MB 이내
                    </p>
                  </>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-32 mt-2 text-xs"
                onClick={() => profileInputRef.current?.click()}
              >
                사진 등록
              </Button>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImage}
              />
            </div>

            {/* 인적사항 그리드 */}
            <div className="flex-1 space-y-4">
              {/* 모바일: 1열, sm 이상: 3열 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">
                    한글 이름 <span className="text-destructive">*</span>
                  </Label>
                  <Input placeholder="홍길동" {...register('nameKo')} />
                  {errors.nameKo && (
                    <p className="text-xs text-destructive">
                      {errors.nameKo.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">영문 이름</Label>
                  <Input placeholder="Hong Gil Dong" {...register('nameEn')} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">입사 가능일</Label>
                  <DatePickerField
                    value={watch('availableStartDate')}
                    onChange={(d) => setValue('availableStartDate', d ?? null)}
                    placeholder="날짜 선택"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">지원 경로</Label>
                  <Select
                    value={applicationChannel}
                    onValueChange={(v) => setValue('applicationChannel', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_CHANNEL_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {applicationChannel === 'OTHER' && (
                  <div className="space-y-1.5">
                    <Label className="text-sm">지원 경로 상세</Label>
                    <Input
                      placeholder="경로를 입력해주세요."
                      {...register('applicationChannelDetail')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* 연락처 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">
                연락처 <span className="text-destructive">*</span>
              </Label>
              <Input placeholder="010-0000-0000" {...register('phone')} />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">비상연락처</Label>
              <Input
                placeholder="010-0000-0000"
                {...register('emergencyPhone')}
              />
            </div>
          </div>

          {/* 주소 */}
          <div className="space-y-2">
            <Label className="text-sm">주소</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="우편번호 또는 도로명으로 검색"
                  value={addressKeyword}
                  onChange={(e) => setAddressKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddressSearch())
                  }
                />
                {watch('zipCode') && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    ({watch('zipCode')})
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                onClick={handleAddressSearch}
              >
                <MapPin className="w-4 h-4 mr-1" />
                검색
              </Button>
            </div>

            {addressSearchOpen && searchResults.length > 0 && (
              <div className="rounded-lg border bg-card max-h-48 overflow-y-auto shadow-md">
                <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                  <span className="text-xs font-medium">
                    검색 결과 {searchResults.length}건
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setAddressSearchOpen(false);
                      clearSearchResults();
                    }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {searchResults.map((addr, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-muted text-sm border-b last:border-0 transition-colors"
                    onClick={() => handleAddressSelect(addr)}
                  >
                    <p className="font-medium">{addr.roadAddr}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {addr.jibunAddr} · {addr.zipNo}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {roadAddress && (
              <Input
                value={roadAddress}
                readOnly
                className="bg-muted/50 text-muted-foreground"
              />
            )}
            <Input
              placeholder="상세주소 (예: 3층 301호)"
              {...register('addressDetail')}
            />
          </div>
        </div>
      )}
    </>
  );

  const renderCareer = () => (
    <>
      <SectionHeader
        id="career"
        title="직장경력"
        open={sections.career}
        onToggle={() => toggleSection('career')}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSections((p) => ({ ...p, career: true }));
              appendCareer({
                companyName: '',
                employmentType: '',
                startDate: new Date(),
                endDate: null,
                isCurrent: false,
                department: '',
                position: '',
                jobDescription: '',
                leavingReason: '',
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            추가
          </Button>
        }
      />
      {sections.career && (
        <div className="py-6 space-y-4">
          <p className="text-sm text-destructive">
            - 원본 서류로 증빙할 수 있는 사실만을 기반으로 정확하게 작성하여
            주시기 바랍니다.
          </p>
          {careerFields.length === 0 && (
            <div className="text-center py-10 rounded-xl border-2 border-dashed text-muted-foreground">
              <p className="text-sm">경력이 없으면 추가하지 않아도 됩니다.</p>
            </div>
          )}
          {careerFields.map((field, idx) => (
            <div
              key={field.id}
              className="rounded-xl border bg-muted/10 p-4 sm:p-6 space-y-5"
            >
              {/* 모바일: 1열, sm: 2열, lg: 4열 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">
                    직장명 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="회사명"
                    {...register(`careers.${idx}.companyName`)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">고용형태</Label>
                  <Select
                    value={watch(`careers.${idx}.employmentType`)}
                    onValueChange={(v) =>
                      setValue(`careers.${idx}.employmentType`, v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_TYPE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">입사연월일</Label>
                  <MonthPickerField
                    value={watch(`careers.${idx}.startDate`)}
                    onChange={(d) =>
                      setValue(`careers.${idx}.startDate`, d ?? new Date(), {
                        shouldValidate: true,
                      })
                    }
                    placeholder="입사연월"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">퇴사연월일</Label>
                  <MonthPickerField
                    value={watch(`careers.${idx}.endDate`)}
                    onChange={(d) =>
                      setValue(`careers.${idx}.endDate`, d ?? null)
                    }
                    placeholder="퇴사연월"
                    disabled={watch(`careers.${idx}.isCurrent`)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={`cur-${idx}`}
                  checked={watch(`careers.${idx}.isCurrent`)}
                  onCheckedChange={(v) => {
                    setValue(`careers.${idx}.isCurrent`, v === true);
                    if (v) setValue(`careers.${idx}.endDate`, null);
                  }}
                />
                <Label htmlFor={`cur-${idx}`} className="cursor-pointer">
                  재직중
                </Label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">근무부서</Label>
                  <Input
                    placeholder="부서명"
                    {...register(`careers.${idx}.department`)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">최종직위</Label>
                  <Input
                    placeholder="직위"
                    {...register(`careers.${idx}.position`)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">담당업무</Label>
                <Textarea
                  className="resize-none min-h-[120px]"
                  placeholder="담당업무를 입력해주세요."
                  maxLength={1000}
                  {...register(`careers.${idx}.jobDescription`)}
                />
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    {watch(`careers.${idx}.jobDescription`)?.length ?? 0} / 1000
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">종료사유</Label>
                  <Input
                    placeholder="종료사유"
                    {...register(`careers.${idx}.leavingReason`)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeCareer(idx)}
                >
                  <Trash2 className="w-4 h-4 mr-1 text-destructive" />
                  초기화
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    appendCareer({
                      companyName: '',
                      employmentType: '',
                      startDate: new Date(),
                      endDate: null,
                      isCurrent: false,
                      department: '',
                      position: '',
                      jobDescription: '',
                      leavingReason: '',
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderEducation = () => (
    <>
      <SectionHeader
        id="education"
        title="학력 정보"
        required
        open={sections.education}
        onToggle={() => toggleSection('education')}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSections((p) => ({ ...p, education: true }));
              appendEducation({
                educationLevel: '',
                schoolName: '',
                major: '',
                graduationStatus: '',
                startDate: null,
                endDate: null,
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            추가
          </Button>
        }
      />
      {sections.education && (
        <div className="py-6 space-y-4">
          {educationFields.map((field, idx) => (
            <div
              key={field.id}
              className="rounded-xl border bg-muted/10 p-4 sm:p-6 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">
                    학력 구분 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch(`educations.${idx}.educationLevel`)}
                    onValueChange={(v) =>
                      setValue(`educations.${idx}.educationLevel`, v, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_LEVEL_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">
                    학교명 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="학교명"
                    {...register(`educations.${idx}.schoolName`)}
                  />
                  {errors.educations?.[idx]?.schoolName && (
                    <p className="text-xs text-destructive">
                      {errors.educations[idx]?.schoolName?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">전공</Label>
                  <Input
                    placeholder="전공"
                    {...register(`educations.${idx}.major`)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">
                    졸업 상태 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={watch(`educations.${idx}.graduationStatus`)}
                    onValueChange={(v) =>
                      setValue(`educations.${idx}.graduationStatus`, v, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADUATION_STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">입학연월</Label>
                  <MonthPickerField
                    value={watch(`educations.${idx}.startDate`)}
                    onChange={(d) =>
                      setValue(`educations.${idx}.startDate`, d ?? null)
                    }
                    placeholder="입학연월"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">졸업(예정)연월</Label>
                  <MonthPickerField
                    value={watch(`educations.${idx}.endDate`)}
                    onChange={(d) =>
                      setValue(`educations.${idx}.endDate`, d ?? null)
                    }
                    placeholder="졸업연월"
                  />
                </div>
              </div>

              {educationFields.length > 1 && (
                <div className="flex justify-end pt-3 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeEducation(idx)}
                  >
                    <Trash2 className="w-4 h-4 mr-1 text-destructive" />
                    삭제
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderCoverLetter = () => (
    <>
      <SectionHeader
        id="cover-letter"
        title="자기소개서"
        open={sections.coverLetter}
        onToggle={() => toggleSection('coverLetter')}
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSections((p) => ({ ...p, coverLetter: true }));
              appendCoverLetter({
                questionNo: coverLetterFields.length + 1,
                question: '',
                answer: '',
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            문항 추가
          </Button>
        }
      />
      {sections.coverLetter && (
        <div className="py-6 space-y-6">
          {coverLetterFields.map((field, idx) => (
            <div key={field.id} className="space-y-3">
              <div className="flex items-center gap-3">
                <Input
                  className="text-base font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 flex-1"
                  placeholder={`문항 ${idx + 1}: 문항 내용을 입력하세요.`}
                  {...register(`coverLetters.${idx}.question`)}
                />
                {coverLetterFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCoverLetter(idx)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
              <Textarea
                className="resize-none min-h-[200px]"
                placeholder="답변을 입력해주세요. (최대 1000자)"
                maxLength={1000}
                {...register(`coverLetters.${idx}.answer`)}
              />
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {watch(`coverLetters.${idx}.answer`)?.length ?? 0} / 1000
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderFiles = () => (
    <>
      <SectionHeader
        id="files"
        title="파일 제출"
        open={sections.files}
        onToggle={() => toggleSection('files')}
      />
      {sections.files && (
        <div className="py-6 space-y-4">
          <div className="rounded-xl border-2 border-dashed p-8 sm:p-10 text-center space-y-4">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <div className="space-y-1">
              <p className="font-medium">
                이력서, 포트폴리오 등 파일을 첨부하세요
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, DOC, DOCX, HWP, JPG, PNG · 파일당 최대 10MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.hwp,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading || !currentUser}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  파일 선택
                </>
              )}
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              {uploadedFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {file.size}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setUploadedFiles((prev) =>
                        prev.filter((_, fi) => fi !== i)
                      )
                    }
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderTreatment = () => (
    <>
      <SectionHeader
        id="treatment"
        title="처우 희망"
        open={sections.treatment}
        onToggle={() => toggleSection('treatment')}
      />
      {sections.treatment && (
        <div className="py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <Label className="text-sm">희망 직위</Label>
              <Input placeholder="예: 대리" {...register('desiredPosition')} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">희망 연봉 (만원)</Label>
              <Input
                type="number"
                placeholder="예: 3500"
                {...register('desiredSalary', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">직전 연봉 (만원)</Label>
              <Input
                type="number"
                placeholder="예: 3000"
                {...register('currentSalary', { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );

  const SECTION_RENDER_MAP: Record<string, () => React.ReactNode> = {
    personal: renderPersonal,
    career: renderCareer,
    education: renderEducation,
    'cover-letter': renderCoverLetter,
    files: renderFiles,
    treatment: renderTreatment,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── 상단 공고 정보 헤더 ── */}
      {/* ── 상단 헤더 ── */}
      <div className="sticky top-0 z-20 bg-background border-b px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold line-clamp-1">
              {jobTitle}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditMode ? '지원서를 수정해주세요' : '지원서를 작성해주세요'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {isEditMode ? '취소' : '목록으로'}
          </Button>
        </div>
      </div>

      {/* ── 모바일 탭 네비게이션 (md 미만에서만 표시) ── */}
      <div className="md:hidden sticky top-[73px] z-10 bg-background border-b">
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

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── 모바일: 탭별 단일 섹션 ── */}
        <div className="md:hidden px-4 py-6 max-w-2xl mx-auto">
          {SECTION_RENDER_MAP[activeTab]?.()}

          {/* 개인정보 동의 (personal 탭에서만 표시) */}
          {activeTab === 'personal' && (
            <div className="py-8 border-t mt-6">
              <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  수집된 개인정보(이름, 연락처, 학력, 경력 등)는 채용 전형
                  목적으로만 사용되며, 전형 종료 후 즉시 파기됩니다.
                </p>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="apply-privacy-mobile"
                    checked={privacyAgreed}
                    onCheckedChange={(checked) =>
                      setValue('privacyAgreed', checked === true, {
                        shouldValidate: true,
                      })
                    }
                  />
                  <Label
                    htmlFor="apply-privacy-mobile"
                    className="text-base cursor-pointer"
                  >
                    개인정보 처리 방침에 동의합니다{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.privacyAgreed && (
                  <p className="text-sm text-destructive">
                    {errors.privacyAgreed.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 모바일 하단 버튼 */}
          <div className="flex gap-3 pt-6 pb-8">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => toast.info('임시저장 기능은 준비 중입니다.')}
            >
              <Save className="w-4 h-4 mr-2" />
              임시저장
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  제출 중...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  지원서 제출
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ── 데스크톱: 좌측 본문 + 우측 사이드바 ── */}
        <div className="hidden md:flex max-w-7xl mx-auto px-6 py-8 gap-8 items-start">
          {/* 좌측: 폼 본문 */}
          <div className="flex-1 min-w-0 space-y-0">
            {renderPersonal()}
            {renderCareer()}
            {renderEducation()}
            {renderCoverLetter()}
            {renderFiles()}
            {renderTreatment()}

            {/* 개인정보 동의 */}
            <div className="py-8 border-t mt-6">
              <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  수집된 개인정보(이름, 연락처, 학력, 경력 등)는 채용 전형
                  목적으로만 사용되며, 전형 종료 후 즉시 파기됩니다.
                </p>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="apply-privacy"
                    checked={privacyAgreed}
                    onCheckedChange={(checked) =>
                      setValue('privacyAgreed', checked === true, {
                        shouldValidate: true,
                      })
                    }
                  />
                  <Label
                    htmlFor="apply-privacy"
                    className="text-base cursor-pointer"
                  >
                    개인정보 처리 방침에 동의합니다{' '}
                    <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.privacyAgreed && (
                  <p className="text-sm text-destructive">
                    {errors.privacyAgreed.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 우측 사이드바 */}
          <div className="w-56 shrink-0 sticky top-24 space-y-3">
            <div className="rounded-xl border bg-card p-4 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                목차
              </p>
              {SECTION_NAV.map((nav) => (
                <button
                  key={nav.id}
                  type="button"
                  className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    document
                      .getElementById(nav.id)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  {nav.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl border bg-card p-4 space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => toast.info('임시저장 기능은 준비 중입니다.')}
              >
                <Save className="w-4 h-4 mr-2" />
                임시저장
              </Button>
              {/* 데스크톱 제출 버튼 */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditMode ? '수정 중...' : '제출 중...'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {isEditMode ? '지원서 수정' : '지원서 제출'}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground text-sm"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export const JobApplyDialog = JobApplyForm;
export type { JobApplyFormProps as JobApplyDialogProps };
