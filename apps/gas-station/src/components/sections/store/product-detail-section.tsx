import { useState } from 'react';
import {
  Star,
  Minus,
  Plus,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// 샘플 이미지 데이터
const images = [
  'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1200&auto=format&fit=crop', // 메인
  'https://images.unsplash.com/photo-1567594684926-e45f9434c384?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520340356584-7c9948871d62?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605515298946-d063f2e92d2d?q=80&w=600&auto=format&fit=crop',
];

export const ProductDetailSection = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState('basic');
  const [openSections, setOpenSections] = useState({
    details: true,
    process: false,
    refund: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* 1. Breadcrumb */}
      <nav className="text-muted-foreground mb-8 flex items-center space-x-2 text-sm">
        <span className="cursor-pointer hover:text-foreground">Home</span>
        <ChevronRight className="h-4 w-4" />
        <span className="cursor-pointer hover:text-foreground">Services</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          Premium No-Touch Wash
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-24">
        {/* 2. Image Gallery (큰 이미지 아래 작은 이미지) */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted">
            <img
              src={images[selectedImage]}
              className="h-full w-full object-cover"
              alt="Service Detail"
            />
          </div>

          {/* Thumbnails (Horizontal) */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative size-20 min-w-[5rem] overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === index
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                <img
                  src={image}
                  className="h-full w-full object-cover"
                  alt={`Thumbnail ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 3. Product Details (세차 서비스 내용으로 변경) */}
        <div className="space-y-8">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-primary bg-primary/10">
                Best Seller
              </Badge>
              <span className="text-sm text-muted-foreground">
                Car Care Service
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              프리미엄 노터치 세차
            </h1>
            <p className="mb-4 text-2xl font-bold text-primary">₩12,000</p>

            {/* Rating */}
            <div className="mb-6 flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= 5
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm font-medium">
                (4.9) • 128 reviews
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-lg">
              도장면 손상 걱정 없는 100% 노터치 방식의 프리미엄 세차입니다.
              초고압수와 스노우폼을 사용하여 묵은 때를 불리고 씻어내며, 하부
              세차까지 포함된 올인원 케어를 경험해보세요.
            </p>
          </div>

          <Separator />

          {/* Options Selection */}
          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">
                추가 옵션 선택
              </label>
              <Select defaultValue="basic" onValueChange={setSelectedOption}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="옵션을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">기본 (추가 없음)</SelectItem>
                  <SelectItem value="wax">물왁스 코팅 (+3,000원)</SelectItem>
                  <SelectItem value="detail">
                    휠/타이어 집중 케어 (+5,000원)
                  </SelectItem>
                  <SelectItem value="full">
                    풀 패키지 (왁스+휠) (+7,000원)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Car Type Selection (Color 대신 차종 선택 등으로 변경) */}
            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">
                차량 크기
              </label>
              <div className="flex gap-3">
                {['경차/소형', '준중형/중형', 'SUV/대형'].map((option) => (
                  <button
                    key={option}
                    className="rounded-md border px-4 py-2.5 text-sm font-medium transition-all hover:border-primary hover:text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Buttons */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">이용권 수량</label>
              <div className="flex w-fit items-center rounded-md border bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-9 w-9"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[3rem] px-3 text-center font-medium">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  className="h-9 w-9"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button className="w-full h-12 text-base" variant="outline">
                장바구니 담기
              </Button>
              <Button className="w-full h-12 text-base">바로 구매하기</Button>
            </div>
            <p className="text-muted-foreground text-center text-sm">
              * 유효기간: 구매일로부터 90일
            </p>
          </div>

          {/* Accordions */}
          <div className="space-y-2 pt-4">
            <Collapsible
              open={openSections.details}
              onOpenChange={() => toggleSection('details')}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between py-4 text-left font-medium hover:text-primary">
                <span>상품 상세 정보</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openSections.details ? 'rotate-180' : ''
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="pb-4">
                <ul className="text-muted-foreground space-y-2 text-sm list-disc pl-4">
                  <li>소요 시간: 약 10~15분</li>
                  <li>
                    포함 사항: 예비 세척, 스노우폼, 고압 헹굼, 하부 세차, 건조
                  </li>
                  <li>독일산 pH 중성 세제 사용</li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
            <Separator />
            {/* 다른 섹션들... (생략 가능) */}
          </div>
        </div>
      </div>

      <Separator className="my-16" />

      {/* 4. Video & Feature Section */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
        <div className="order-2 lg:order-1 space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              완벽한 디테일링을 위한
              <br />
              <span className="text-primary">전문가의 손길</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              영상으로 확인하는 압도적인 세정력. 눈에 보이지 않는 구석구석까지
              강력한 고압수가 침투하여 오염물질을 완벽하게 제거합니다.
              별표주유소만의 독보적인 노하우를 지금 확인해보세요.
            </p>
          </div>

          <div className="space-y-4">
            {[
              '360도 회전 노즐로 사각지대 없는 세척',
              '도장면 보호를 위한 최적의 수압 조절',
              '겨울철 염화칼슘 제거에 탁월한 하부 세차',
              '물기 얼룩을 최소화하는 강력 드라잉',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
            {/* 비디오 태그 (자동 재생, 음소거) */}
            <video
              className="w-full h-full object-cover opacity-90"
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1200&auto=format&fit=crop"
            >
              <source
                src="https://cdn.pixabay.com/video/2024/05/24/213353_large.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      <Separator className="my-16" />

      {/* 5. FAQ & Info Section (좌측 FAQ / 우측 이미지) */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">자주 묻는 질문</h3>
            <p className="text-muted-foreground">
              고객님들이 가장 궁금해하시는 내용을 모았습니다.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: '노터치 세차는 정말 기스가 안 나나요?',
                a: '네, 브러쉬가 닿지 않는 100% 노터치 방식이므로 물리적 마찰에 의한 스크래치가 발생하지 않습니다.',
              },
              {
                q: '세차 소요 시간은 얼마나 걸리나요?',
                a: '코스에 따라 다르지만 평균적으로 10분에서 15분 정도 소요됩니다. 드라잉 시간을 포함하면 조금 더 여유 있게 잡아주세요.',
              },
              {
                q: '하부 세차는 모든 코스에 포함되나요?',
                a: '기본 코스를 제외한 모든 프리미엄 코스에 하부 세차가 기본으로 포함되어 있습니다.',
              },
              {
                q: 'RV나 대형 SUV도 가능한가요?',
                a: '네, 카니발, 스타리아 등 대형 RV 차량도 진입 가능한 넓은 베이를 보유하고 있습니다. (단, 루프박스 장착 차량은 제한될 수 있습니다.)',
              },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-medium text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1605515298946-d063f2e92d2d?q=80&w=800&auto=format&fit=crop"
            alt="Customer Service"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <div className="text-white">
              <h4 className="text-xl font-bold mb-2">고객 지원 센터</h4>
              <p className="opacity-90">
                궁금한 점이 더 있으신가요? 언제든 문의해주세요.
                <br />
                Tel. 1588-0000 (09:00 - 18:00)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Warning Alert */}
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
            <li>
              차량의 도장면 상태가 좋지 않거나(칠 벗겨짐 등), 불법 부착물이 있는
              경우 세차 중 손상이 발생할 수 있으며 이에 대해 책임지지 않습니다.
            </li>
            <li>
              고압수 세척 시 미세한 스월마크가 발생할 수 있으니, 왁스 코팅
              옵션을 통해 도장면을 보호하는 것을 권장합니다.
            </li>
            <li>
              세차장 진입 시 유도요원의 안내를 반드시 따라주시기 바랍니다.
              급정거 및 급출발은 사고의 원인이 됩니다.
            </li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};
