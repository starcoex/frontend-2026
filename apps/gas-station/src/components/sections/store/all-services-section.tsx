import { useState } from 'react';
import { Search, ShoppingCart, CreditCard, Star, Eye } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ... (데이터 및 인터페이스는 기존과 동일)
interface ServiceItem {
  id: string;
  category: '세차 서비스' | '옵션 서비스';
  name: string;
  description: string;
  price: number;
  image: string;
  best?: boolean;
}

const services: ServiceItem[] = [
  {
    id: 'wash-1',
    category: '세차 서비스',
    name: '프리미엄 노터치 세차',
    description: '스크래치 없는 완벽한 고압수 세척',
    price: 12000,
    image:
      'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=600&auto=format&fit=crop',
    best: true,
  },
  {
    id: 'wash-2',
    category: '세차 서비스',
    name: '버블 폼 세차',
    description: '쫀쫀한 거품으로 오염물 불리기',
    price: 15000,
    image:
      'https://images.unsplash.com/photo-1567594684926-e45f9434c384?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'wash-3',
    category: '세차 서비스',
    name: '하부 세차 패키지',
    description: '염화칼슘 완벽 제거, 부식 방지',
    price: 18000,
    image:
      'https://images.unsplash.com/photo-1520340356584-7c9948871d62?q=80&w=600&auto=format&fit=crop',
    best: true,
  },
  {
    id: 'opt-1',
    category: '옵션 서비스',
    name: '유리막 코팅 (왁스)',
    description: '비오는 날 발수 효과와 광택 유지',
    price: 10000,
    image:
      'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'opt-2',
    category: '옵션 서비스',
    name: '실내 연막 살균',
    description: '에어컨 냄새 제거 및 세균 박멸',
    price: 8000,
    image:
      'https://images.unsplash.com/photo-1605515298946-d063f2e92d2d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'opt-3',
    category: '옵션 서비스',
    name: '타이어 광택',
    description: '새 타이어처럼 반짝이는 마무리',
    price: 5000,
    image:
      'https://images.unsplash.com/photo-1584652868574-0669f4292976?q=80&w=600&auto=format&fit=crop',
  },
];

const categories = ['All', '세차 서비스', '옵션 서비스'];

export const AllServicesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* 상단 타이틀 영역 */}
        <div className="flex flex-col gap-6 mb-14 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Select Your Service
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed mx-auto md:mx-0">
            별표주유소의 프리미엄 카케어 서비스를 만나보세요.
            <br className="hidden md:block" />
            기본 세차부터 디테일링 옵션까지, 내 차에 필요한 모든 것이 준비되어
            있습니다.
          </p>
        </div>

        {/* 필터 및 검색 영역 */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full md:w-auto"
          >
            <TabsList className="bg-muted/50 h-auto p-1 gap-2 w-full md:w-auto justify-start overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={cn(
                    'rounded-full px-6 py-2.5 text-sm font-medium transition-all',
                    'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm'
                  )}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-[300px]">
            <Input
              className="pl-10 h-12 rounded-full bg-background border-border hover:border-primary/50 focus:border-primary transition-colors"
              placeholder="서비스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="text-muted-foreground absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="size-5" />
            </div>
          </div>
        </div>

        {/* 서비스 그리드 목록 */}
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:shadow-lg hover:border-primary/20"
            >
              {/* 이미지 영역 (링크로 변경) */}
              <a
                href={`/services/${service.id}`} // 상세 페이지 링크 연결
                className="relative block aspect-[4/3] overflow-hidden bg-muted cursor-pointer group/image"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover/image:scale-110"
                />

                {/* 호버 시 나타나는 오버레이 */}
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100 flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-white/90 text-black px-4 py-2 rounded-full font-semibold transform translate-y-4 transition-transform duration-300 group-hover/image:translate-y-0">
                    <Eye className="size-4" />
                    자세히 보기
                  </div>
                </div>

                {service.best && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-md">
                      BEST CHOICE
                    </Badge>
                  </div>
                )}
              </a>

              {/* 컨텐츠 영역 */}
              <div className="flex flex-1 flex-col p-6">
                {/* 카테고리 */}
                <div className="mb-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                    {service.category}
                  </span>
                </div>

                {/* 별점 5개 표기 */}
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  <a href={`/services/${service.id}`}>{service.name}</a>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {service.description}
                </p>

                <Separator className="bg-border mb-4" />

                <div className="flex items-end justify-between mb-6">
                  <div className="text-2xl font-bold text-primary">
                    {service.price.toLocaleString()}원
                  </div>
                </div>

                {/* 하단 버튼 그룹 */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary"
                  >
                    <ShoppingCart className="size-4" />
                    담기
                  </Button>
                  <Button className="w-full gap-2">
                    <CreditCard className="size-4" />
                    구매
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
