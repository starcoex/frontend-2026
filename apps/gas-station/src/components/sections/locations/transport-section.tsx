import React from 'react';
import { Car, Bus, Bike } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TransportRoute {
  type: 'car' | 'bus' | 'bike';
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  distance: string;
  gradient: string;
  details: string[];
}

interface TransportSectionProps {
  selectedTransport: 'car' | 'bus' | 'bike';
  onTransportSelect: (type: 'car' | 'bus' | 'bike') => void;
}

const TRANSPORT_ROUTES: readonly TransportRoute[] = [
  {
    type: 'car',
    icon: <Car className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />,
    title: '자가용',
    description: '제주국제공항에서 연동로 방면',
    time: '15분',
    distance: '8.5km',
    gradient: 'from-blue-500 to-cyan-500',
    details: [
      '제주국제공항 → 연동로 → 별표주유소',
      '주차 공간: 승용차 30대, 대형차 5대',
      '네비게이션: "제주시 연동 별표주유소" 검색',
    ],
  },
  {
    type: 'bus',
    icon: <Bus className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />,
    title: '대중교통',
    description: '100번, 200번 버스 이용',
    time: '25분',
    distance: '정류장 도보 3분',
    gradient: 'from-green-500 to-emerald-500',
    details: [
      '100번 버스: 제주국제공항 → 연동 → 별표주유소 앞 하차',
      '200번 버스: 제주시청 → 연동로 → 별표주유소 앞 하차',
      '정류장에서 도보 3분 거리',
    ],
  },
  {
    type: 'bike',
    icon: <Bike className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />,
    title: '자전거',
    description: '제주시 자전거도로 이용',
    time: '35분',
    distance: '12km',
    gradient: 'from-orange-500 to-red-500',
    details: [
      '제주시 자전거도로 연동구간 이용',
      '자전거 보관소 완비 (10대)',
      '자전거 공기주입기 무료 제공',
    ],
  },
] as const;

const TransportCard: React.FC<{
  route: TransportRoute;
  isSelected: boolean;
  onSelect: (type: 'car' | 'bus' | 'bike') => void;
}> = ({ route, isSelected, onSelect }) => (
  <div
    className={`p-3 lg:p-4 xl:p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
      isSelected
        ? 'border-primary bg-primary/5 shadow-lg'
        : 'border-border bg-background hover:border-primary/50 hover:bg-accent/50'
    }`}
    onClick={() => onSelect(route.type)}
  >
    {/*
      반응형 레이아웃:
      - 기본(md): 가로 레이아웃 (flex-row)
      - lg(1024px~1096px): 세로 레이아웃 (flex-col)
      - xl(1096px+): 가로 레이아웃 (flex-row)
    */}
    <div className="flex md:flex-row lg:flex-col xl:flex-row items-center lg:items-center gap-2 lg:gap-3 xl:gap-3 mb-2 lg:mb-3 xl:mb-4">
      <div
        className={`p-2 lg:p-2 xl:p-3 rounded-full bg-gradient-to-r ${route.gradient} text-white shrink-0`}
      >
        {route.icon}
      </div>
      <div className="flex-1 lg:text-center xl:text-left min-w-0">
        <h4 className="font-medium lg:font-medium xl:font-semibold text-foreground text-xs lg:text-sm xl:text-base truncate">
          {route.title}
        </h4>
        <div className="text-xs lg:text-xs xl:text-sm text-muted-foreground lg:mt-1 truncate">
          {route.time} • {route.distance}
        </div>
      </div>
    </div>
    <p className="text-xs lg:text-xs xl:text-sm text-muted-foreground lg:text-center xl:text-left lg:leading-snug xl:leading-relaxed line-clamp-2 lg:line-clamp-3">
      {route.description}
    </p>
  </div>
);

const TransportDetail: React.FC<{ selectedRoute: TransportRoute }> = ({
  selectedRoute,
}) => (
  <Card className="mt-4 lg:mt-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-sm lg:text-base xl:text-lg">
        {selectedRoute.title} 상세 안내
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm xl:text-base text-muted-foreground">
        {selectedRoute.details.map((detail, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5 lg:mt-1 text-xs lg:text-sm">
              •
            </span>
            <span className="leading-relaxed">{detail}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const TransportSection: React.FC<TransportSectionProps> = ({
  selectedTransport,
  onTransportSelect,
}) => (
  <div>
    <h3 className="text-foreground text-lg lg:text-xl xl:text-2xl font-medium lg:font-semibold mb-4 lg:mb-6">
      교통 안내
    </h3>
    {/*
      항상 3열로 유지하되, 카드 내부 레이아웃만 변경:
      - md: 3열 가로 레이아웃
      - lg: 3열 세로 레이아웃 (1024px~1096px)
      - xl: 3열 가로 레이아웃 (1096px+)
    */}
    <div className="grid gap-3 lg:gap-2 xl:gap-4 grid-cols-1 md:grid-cols-3">
      {TRANSPORT_ROUTES.map((route) => (
        <TransportCard
          key={route.type}
          route={route}
          isSelected={selectedTransport === route.type}
          onSelect={onTransportSelect}
        />
      ))}
    </div>
    <TransportDetail
      selectedRoute={
        TRANSPORT_ROUTES.find((r) => r.type === selectedTransport)!
      }
    />
  </div>
);
