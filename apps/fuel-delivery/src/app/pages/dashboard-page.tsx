import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Fuel,
  MapPin,
  Activity,
  Zap,
  BarChart3,
  Clock,
  Truck,
  Package,
  Users,
} from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 실시간 시계 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 실시간 난방유 가격 및 재고 데이터 (모의)
  const [fuelData, setFuelData] = useState([
    {
      type: '스탠다드 난방유',
      price: 1070,
      change: -5,
      trend: 'down',
      icon: '🔥',
      color: 'text-orange-400',
      stock: 8500,
      stockLevel: 'high',
    },
    {
      type: '프리미엄 난방유',
      price: 1250,
      change: 3,
      trend: 'up',
      icon: '⭐',
      color: 'text-yellow-400',
      stock: 3200,
      stockLevel: 'medium',
    },
    {
      type: '친환경 바이오 난방유',
      price: 1395,
      change: 0,
      trend: 'stable',
      icon: '🌱',
      color: 'text-green-400',
      stock: 1800,
      stockLevel: 'low',
    },
    {
      type: '등유 (보일러용)',
      price: 1120,
      change: -2,
      trend: 'down',
      icon: '🏠',
      color: 'text-blue-400',
      stock: 4500,
      stockLevel: 'high',
    },
  ]);

  // 배송 서비스 메트릭
  const serviceMetrics = [
    {
      label: '오늘 배송 완료',
      value: '47',
      change: '+12',
      icon: Package,
      color: 'text-green-400',
    },
    {
      label: '배송 중',
      value: '23',
      change: '+5',
      icon: Truck,
      color: 'text-blue-400',
    },
    {
      label: '고객 만족도',
      value: '4.8',
      change: '+0.2',
      icon: Users,
      color: 'text-purple-400',
    },
    {
      label: '평균 배송 시간',
      value: '2.3시간',
      change: '-15분',
      icon: Clock,
      color: 'text-cyan-400',
    },
  ];

  // 배송 지역별 현황
  const deliveryAreas = [
    {
      area: '강남구',
      status: 'active',
      orders: 12,
      avgTime: '2.1시간',
      weather: 'sunny',
      temperature: 24,
    },
    {
      area: '서초구',
      status: 'active',
      orders: 8,
      avgTime: '1.8시간',
      weather: 'cloudy',
      temperature: 22,
    },
    {
      area: '송파구',
      status: 'delayed',
      orders: 15,
      avgTime: '3.2시간',
      weather: 'rainy',
      temperature: 19,
    },
    {
      area: '용산구',
      status: 'active',
      orders: 6,
      avgTime: '2.5시간',
      weather: 'sunny',
      temperature: 23,
    },
    {
      area: '성동구',
      status: 'active',
      orders: 9,
      avgTime: '2.0시간',
      weather: 'cloudy',
      temperature: 21,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'delayed':
        return 'text-orange-400';
      case 'offline':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStockLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny':
        return '☀️';
      case 'cloudy':
        return '☁️';
      case 'rainy':
        return '🌧️';
      default:
        return '🌤️';
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-orange-900 mb-2">
            배송 관제 대시보드
          </h1>
          <div className="flex items-center gap-4 text-orange-600">
            <span>환영합니다, {currentUser?.name || '관리자'}님</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Zap className="w-3 h-3 mr-1" />
              실시간 연동
            </Badge>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-orange-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-800">
              {currentTime.toLocaleTimeString('ko-KR')}
            </div>
            <div className="text-xs text-orange-600">
              {currentTime.toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>
      </div>

      {/* 실시간 난방유 가격 및 재고 */}
      <div>
        <h2 className="text-xl font-semibold text-orange-900 mb-4 flex items-center gap-2">
          <Fuel className="w-5 h-5 text-orange-600" />
          실시간 난방유 가격 및 재고
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fuelData.map((fuel) => (
            <Card
              key={fuel.type}
              className="border-orange-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{fuel.icon}</div>
                  {getTrendIcon(fuel.trend)}
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600 font-medium">
                    {fuel.type}
                  </div>
                  <div className={`text-2xl font-bold ${fuel.color}`}>
                    {fuel.price.toLocaleString()}
                    <span className="text-sm ml-1 text-gray-600">원/L</span>
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      fuel.change > 0
                        ? 'text-green-600'
                        : fuel.change < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {fuel.change > 0 ? '+' : ''}
                    {fuel.change} 원
                  </div>
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <div
                      className={`text-xs font-medium ${getStockLevelColor(
                        fuel.stockLevel
                      )}`}
                    >
                      재고: {fuel.stock.toLocaleString()}L
                    </div>
                    <div className="text-xs text-gray-500">
                      {fuel.stockLevel === 'high'
                        ? '충분'
                        : fuel.stockLevel === 'medium'
                        ? '보통'
                        : '부족'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 배송 서비스 메트릭 */}
      <div>
        <h2 className="text-xl font-semibold text-orange-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-600" />
          배송 서비스 현황
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="border-orange-100 shadow-sm">
                <CardContent className="p-6 text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${metric.color}`} />
                  <div className="text-2xl font-bold text-orange-900 mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {metric.label}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      metric.change.startsWith('+')
                        ? 'text-green-600'
                        : metric.change.startsWith('-')
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {metric.change}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 배송 지역별 현황 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-orange-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            지역별 배송 현황
          </h2>
          <Card className="border-orange-100 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {deliveryAreas.map((area) => (
                  <div
                    key={area.area}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          area.status === 'active'
                            ? 'bg-green-400'
                            : area.status === 'delayed'
                            ? 'bg-orange-400'
                            : 'bg-red-400'
                        }`}
                      ></div>
                      <div>
                        <div className="font-medium text-orange-900 flex items-center gap-2">
                          {area.area}
                          <span className="text-sm">
                            {getWeatherIcon(area.weather)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {area.temperature}°C
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          진행중: {area.orders}건 | 평균: {area.avgTime}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${getStatusColor(
                          area.status
                        )}`}
                      >
                        {area.status === 'active'
                          ? '정상'
                          : area.status === 'delayed'
                          ? '지연'
                          : '중단'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 실시간 배송 알림 */}
        <div>
          <h2 className="text-xl font-semibold text-orange-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-600" />
            실시간 배송 알림
          </h2>
          <Card className="border-orange-100 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  {
                    time: '14:32',
                    type: 'success',
                    message: '강남구 스탠다드 난방유 500L 배송 완료',
                  },
                  {
                    time: '14:28',
                    type: 'info',
                    message: '서초구 프리미엄 난방유 300L 배송 시작',
                  },
                  {
                    time: '14:25',
                    type: 'warning',
                    message: '송파구 교통 체증으로 배송 지연 예상',
                  },
                  {
                    time: '14:20',
                    type: 'success',
                    message: '용산구 바이오 난방유 200L 주문 접수',
                  },
                  {
                    time: '14:15',
                    type: 'info',
                    message: '성동구 신규 고객 등록 완료',
                  },
                  {
                    time: '14:10',
                    type: 'warning',
                    message: '바이오 난방유 재고 부족 알림',
                  },
                ].map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2 rounded hover:bg-orange-25"
                  >
                    <div className="text-xs text-gray-500 font-mono min-w-[40px]">
                      {alert.time}
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        alert.type === 'success'
                          ? 'bg-green-400'
                          : alert.type === 'warning'
                          ? 'bg-orange-400'
                          : 'bg-blue-400'
                      }`}
                    ></div>
                    <div className="text-sm text-gray-700 flex-1">
                      {alert.message}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
