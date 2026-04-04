import React, { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Star,
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useCart } from '@starcoex-frontend/cart';

// ── 타입 ──────────────────────────────────────────────────────────────────────

interface ServiceOption {
  value: string;
  label: string;
  extraPrice: number;
}

interface CarSize {
  value: string;
  label: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface ServiceDetail {
  id: string;
  category: string;
  name: string;
  price: number;
  badge?: string;
  rating: number;
  reviewCount: number;
  description: string;
  validity: string;
  images: string[];
  options: ServiceOption[];
  carSizes: CarSize[];
  details: string[];
  process: string[];
  faqs: FaqItem[];
  videoUrl?: string;
  videoPoster?: string;
  features: string[];
  cautions: string[];
}

// ── 목업 데이터 (실제로는 API 호출로 대체) ───────────────────────────────────

const SERVICE_MOCK: ServiceDetail = {
  id: 'wash-1',
  category: '세차 서비스',
  name: '프리미엄 노터치 세차',
  price: 12000,
  badge: 'Best Seller',
  rating: 4.9,
  reviewCount: 128,
  description:
    '도장면 손상 걱정 없는 100% 노터치 방식의 프리미엄 세차입니다. 초고압수와 스노우폼을 사용하여 묵은 때를 불리고 씻어내며, 하부 세차까지 포함된 올인원 케어를 경험해보세요.',
  validity: '구매일로부터 90일',
  images: [
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567594684926-e45f9434c384?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520340356584-7c9948871d62?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605515298946-d063f2e92d2d?q=80&w=600&auto=format&fit=crop',
  ],
  options: [
    { value: 'basic', label: '기본 (추가 없음)', extraPrice: 0 },
    { value: 'wax', label: '물왁스 코팅', extraPrice: 3000 },
    { value: 'detail', label: '휠/타이어 집중 케어', extraPrice: 5000 },
    { value: 'full', label: '풀 패키지 (왁스+휠)', extraPrice: 7000 },
  ],
  carSizes: [
    { value: 'small', label: '경차/소형' },
    { value: 'medium', label: '준중형/중형' },
    { value: 'large', label: 'SUV/대형' },
  ],
  details: [
    '소요 시간: 약 10~15분',
    '포함 사항: 예비 세척, 스노우폼, 고압 헹굼, 하부 세차, 건조',
    '독일산 pH 중성 세제 사용',
  ],
  process: [
    '예비 세척으로 큰 이물질 제거',
    '스노우폼 도포 후 불리기',
    '초고압수 전체 세척',
    '하부 고압 세척',
    '강력 에어 드라잉',
  ],
  faqs: [
    {
      q: '노터치 세차는 정말 기스가 안 나나요?',
      a: '네, 브러쉬가 닿지 않는 100% 노터치 방식이므로 물리적 마찰에 의한 스크래치가 발생하지 않습니다.',
    },
    {
      q: '세차 소요 시간은 얼마나 걸리나요?',
      a: '코스에 따라 다르지만 평균적으로 10분에서 15분 정도 소요됩니다.',
    },
    {
      q: '하부 세차는 모든 코스에 포함되나요?',
      a: '기본 코스를 제외한 모든 프리미엄 코스에 하부 세차가 기본으로 포함되어 있습니다.',
    },
    {
      q: 'RV나 대형 SUV도 가능한가요?',
      a: '네, 카니발, 스타리아 등 대형 RV 차량도 진입 가능한 넓은 베이를 보유하고 있습니다.',
    },
  ],
  features: [
    '360도 회전 노즐로 사각지대 없는 세척',
    '도장면 보호를 위한 최적의 수압 조절',
    '겨울철 염화칼슘 제거에 탁월한 하부 세차',
    '물기 얼룩을 최소화하는 강력 드라잉',
  ],
  cautions: [
    '차량 도장면 상태가 좋지 않거나 불법 부착물이 있는 경우 손상이 발생할 수 있습니다.',
    '고압수 세척 시 미세한 스월마크가 발생할 수 있으니 왁스 코팅 옵션을 권장합니다.',
    '세차장 진입 시 유도요원의 안내를 반드시 따라주시기 바랍니다.',
  ],
  videoUrl: 'https://cdn.pixabay.com/video/2024/05/24/213353_large.mp4',
  videoPoster:
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1200&auto=format&fit=crop',
};

// ── 가격 포맷 ──────────────────────────────────────────────────────────────────

function formatMoney(value: number) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 실제 구현 시 id로 API 호출, 현재는 목업 사용
  const service = SERVICE_MOCK;

  const { addToCart, isLoading } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>('basic');
  const [selectedCarSize, setSelectedCarSize] = useState<string>('');
  const [openSections, setOpenSections] = useState({
    details: true,
    process: false,
    refund: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 선택된 옵션의 추가 금액
  const selectedOptionData = service.options.find(
    (o) => o.value === selectedOption
  );
  const finalPrice =
    (service.price + (selectedOptionData?.extraPrice ?? 0)) * quantity;

  // ── 장바구니 담기 ────────────────────────────────────────────────────────────

  const handleAddToCart = useCallback(async () => {
    const res = await addToCart({
      productId: service.id,
      quantity,
      metadata: {
        option: selectedOption,
        optionLabel: selectedOptionData?.label ?? '',
        carSize: selectedCarSize,
        extraPrice: selectedOptionData?.extraPrice ?? 0,
      },
    });

    if (res.success) {
      toast.success(`${service.name}을(를) 장바구니에 담았습니다.`, {
        action: {
          label: '장바구니 보기',
          onClick: () => navigate('/cart'),
        },
      });
    }
  }, [
    addToCart,
    service,
    quantity,
    selectedOption,
    selectedOptionData,
    selectedCarSize,
    navigate,
  ]);

  // ── 바로 구매 ────────────────────────────────────────────────────────────────

  const handleBuyNow = useCallback(async () => {
    const res = await addToCart({
      productId: service.id,
      quantity,
      metadata: {
        option: selectedOption,
        optionLabel: selectedOptionData?.label ?? '',
        carSize: selectedCarSize,
        extraPrice: selectedOptionData?.extraPrice ?? 0,
      },
    });

    if (res.success) {
      navigate('/cart');
    }
  }, [
    addToCart,
    service,
    quantity,
    selectedOption,
    selectedOptionData,
    selectedCarSize,
    navigate,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-muted-foreground mb-8 flex items-center space-x-2 text-sm">
        <Link to="/" className="hover:text-foreground transition-colors">
          홈
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          to="/services"
          className="hover:text-foreground transition-colors"
        >
          세차 서비스
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{service.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-24">
        {/* 이미지 갤러리 */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted">
            <img
              src={service.images[selectedImage]}
              alt={service.name}
              className="h-full w-full object-cover transition-opacity duration-300"
            />
          </div>

          {/* 썸네일 */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {service.images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImage(i)}
                className={cn(
                  'relative size-20 min-w-[5rem] flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                  selectedImage === i
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-primary/50'
                )}
              >
                <img
                  src={src}
                  alt={`썸네일 ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              {service.badge && (
                <Badge
                  variant="secondary"
                  className="text-primary bg-primary/10"
                >
                  {service.badge}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {service.category}
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              {service.name}
            </h1>

            <p className="mb-4 text-2xl font-bold text-primary">
              {formatMoney(service.price)}
            </p>

            {/* 별점 */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < Math.floor(service.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm font-medium">
                ({service.rating}) · {service.reviewCount}개 리뷰
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          </div>

          <Separator />

          {/* 옵션 선택 */}
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                추가 옵션 선택
              </label>
              <Select value={selectedOption} onValueChange={setSelectedOption}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="옵션을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {service.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                      {opt.extraPrice > 0 && (
                        <span className="text-muted-foreground ml-1">
                          (+{formatMoney(opt.extraPrice)})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 차량 크기 */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                차량 크기
              </label>
              <div className="flex gap-3 flex-wrap">
                {service.carSizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setSelectedCarSize(size.value)}
                    className={cn(
                      'rounded-md border px-4 py-2.5 text-sm font-medium transition-all',
                      'hover:border-primary hover:text-primary',
                      'focus:outline-none focus:ring-2 focus:ring-primary/20',
                      selectedCarSize === size.value
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-border'
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 수량 + 최종 금액 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">이용권 수량</label>
              <div className="flex items-center rounded-md border bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[3rem] px-3 text-center font-medium">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 최종 금액 표시 */}
            {(selectedOptionData?.extraPrice ?? 0) > 0 || quantity > 1 ? (
              <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
                <span className="text-sm text-muted-foreground">최종 금액</span>
                <span className="text-lg font-bold text-primary">
                  {formatMoney(finalPrice)}
                </span>
              </div>
            ) : null}

            {/* 버튼 그룹 */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full h-12 text-base gap-2"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                장바구니 담기
              </Button>
              <Button
                className="w-full h-12 text-base gap-2"
                onClick={handleBuyNow}
                disabled={isLoading}
              >
                <CreditCard className="h-4 w-4" />
                바로 구매하기
              </Button>
            </div>

            <p className="text-muted-foreground text-center text-sm">
              * 유효기간: {service.validity}
            </p>
          </div>

          {/* 상세 정보 아코디언 */}
          <div className="space-y-1 pt-2 border-t">
            {[
              {
                key: 'details' as const,
                label: '상품 상세 정보',
                content: (
                  <ul className="text-muted-foreground space-y-2 text-sm list-disc pl-4">
                    {service.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                ),
              },
              {
                key: 'process' as const,
                label: '세차 프로세스',
                content: (
                  <ol className="text-muted-foreground space-y-2 text-sm list-decimal pl-4">
                    {service.process.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ol>
                ),
              },
              {
                key: 'refund' as const,
                label: '환불 정책',
                content: (
                  <p className="text-muted-foreground text-sm">
                    유효기간 내 미사용 이용권은 전액 환불 가능합니다. 사용
                    후에는 환불이 불가합니다.
                  </p>
                ),
              },
            ].map(({ key, label, content }) => (
              <Collapsible
                key={key}
                open={openSections[key]}
                onOpenChange={() => toggleSection(key)}
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between py-4 text-left font-medium hover:text-primary transition-colors">
                  <span>{label}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 transition-transform',
                      openSections[key] && 'rotate-180'
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="pb-4">
                  {content}
                </CollapsibleContent>
                <Separator />
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      {/* 영상 + 특징 섹션 */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
        <div className="order-2 lg:order-1 space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              완벽한 디테일링을 위한
              <br />
              <span className="text-primary">전문가의 손길</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              영상으로 확인하는 압도적인 세정력. 눈에 보이지 않는 구석구석까지
              강력한 고압수가 침투하여 오염물질을 완벽하게 제거합니다.
            </p>
          </div>
          <div className="space-y-3">
            {service.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
            <video
              className="w-full h-full object-cover opacity-90"
              autoPlay
              muted
              loop
              playsInline
              poster={service.videoPoster}
            >
              {service.videoUrl && (
                <source src={service.videoUrl} type="video/mp4" />
              )}
            </video>
          </div>
        </div>
      </div>

      <Separator className="my-16" />

      {/* FAQ + 이미지 섹션 */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">자주 묻는 질문</h3>
            <p className="text-muted-foreground">
              고객님들이 가장 궁금해하시는 내용을 모았습니다.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {service.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="relative min-h-[400px] rounded-2xl overflow-hidden">
          <img
            src={service.images[service.images.length - 1]}
            alt="고객 지원"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <div className="text-white">
              <h4 className="text-xl font-bold mb-2">고객 지원 센터</h4>
              <p className="opacity-90 text-sm">
                궁금한 점이 더 있으신가요?
                <br />
                Tel. 064-713-2002 (09:00 - 18:00)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <Alert
        variant="destructive"
        className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
      >
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg font-bold ml-2">
          주의사항 및 안내
        </AlertTitle>
        <AlertDescription className="mt-2 ml-2 text-sm leading-relaxed">
          <ul className="list-disc pl-4 space-y-1">
            {service.cautions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};
