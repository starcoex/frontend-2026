import React from 'react';
import {
  Camera,
  Wifi,
  CreditCard,
  ShoppingCart,
  Coffee,
  Wrench,
  Fuel,
  Car,
  Check,
} from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
  gradient?: string;
}

const FACILITIES: readonly Facility[] = [
  {
    id: 'fuels-station',
    name: '주유 서비스',
    description: '휘발유, 경유, 프리미엄 연료',
    icon: <Fuel className="w-5 h-5" />,
    available: true,
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'car-wash',
    name: '세차 서비스',
    description: '고압세차, 손세차 서비스',
    icon: <Car className="w-5 h-5" />,
    available: true,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'maintenance',
    name: '정비 서비스',
    description: '기본 점검 및 정비',
    icon: <Wrench className="w-5 h-5" />,
    available: true,
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'convenience',
    name: '편의점',
    description: '간편식품, 음료, 생필품',
    icon: <ShoppingCart className="w-5 h-5" />,
    available: true,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'cafe',
    name: '카페',
    description: '커피, 음료, 간단한 식사',
    icon: <Coffee className="w-5 h-5" />,
    available: true,
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    id: 'wifi',
    name: '무료 Wi-Fi',
    description: '고속 인터넷 서비스',
    icon: <Wifi className="w-5 h-5" />,
    available: true,
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'payment',
    name: '다양한 결제',
    description: '카드, 모바일페이, 현금',
    icon: <CreditCard className="w-5 h-5" />,
    available: true,
    gradient: 'from-pink-500 to-red-500',
  },
  {
    id: 'cctv',
    name: '보안 시설',
    description: '24시간 CCTV 운영',
    icon: <Camera className="w-5 h-5" />,
    available: true,
    gradient: 'from-gray-500 to-slate-500',
  },
] as const;

const FacilityCard: React.FC<{ facility: Facility }> = ({ facility }) => (
  <div
    className={`p-4 rounded-lg border transition-all duration-300 group ${
      facility.available
        ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30 hover:shadow-md'
        : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30'
    }`}
  >
    <div className="flex items-start gap-3">
      <div
        className={`p-2 rounded-full ${
          facility.available
            ? `bg-gradient-to-r ${facility.gradient} text-white`
            : 'bg-red-500 text-white'
        } group-hover:scale-110 transition-transform duration-300`}
      >
        {facility.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-foreground text-sm">
            {facility.name}
          </h4>
          {facility.available ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <div className="w-4 h-4 text-red-500">✕</div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{facility.description}</p>
      </div>
    </div>
  </div>
);

export const FacilitiesSection: React.FC = () => (
  <div>
    <h3 className="text-foreground text-xl lg:text-2xl font-semibold mb-6">
      편의시설
    </h3>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {FACILITIES.map((facility) => (
        <FacilityCard key={facility.id} facility={facility} />
      ))}
    </div>
  </div>
);
