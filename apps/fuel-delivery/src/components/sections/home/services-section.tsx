import React, { useState, useEffect } from 'react';
import {
  Fuel,
  Zap,
  Shield,
  CreditCard,
  Wrench,
  Coffee,
  MapPin,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const ServicesSection: React.FC = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: 'fuels-supply',
      name: '연료 공급',
      description: '고품질 연료와 실시간 가격 모니터링',
      icon: Fuel,
      status: 'operational',
      uptime: '99.9%',
      features: [
        '실시간 가격 업데이트',
        '4종 연료 완비',
        '품질 보증',
        '24시간 운영',
      ],
      color: 'from-blue-500 to-cyan-500',
      metrics: {
        dailyVolume: '15,420L',
        avgPrice: '1,480원',
        satisfaction: '98.5%',
      },
    },
    {
      id: 'smart-payment',
      name: '스마트 결제',
      description: '다양한 결제 수단과 자동 정산 시스템',
      icon: CreditCard,
      status: 'operational',
      uptime: '100%',
      features: ['모바일 페이', '멤버십 카드', '현금/카드', '자동 영수증'],
      color: 'from-purple-500 to-pink-500',
      metrics: {
        transactions: '2,340건',
        avgTime: '45초',
        successRate: '99.8%',
      },
    },
    {
      id: 'maintenance',
      name: '정비 서비스',
      description: '전문 정비사의 차량 점검 및 수리',
      icon: Wrench,
      status: 'busy',
      uptime: '95.2%',
      features: ['엔진 점검', '타이어 교체', '오일 교환', '응급 수리'],
      color: 'from-orange-500 to-red-500',
      metrics: {
        appointments: '45건',
        avgDuration: '2.5시간',
        completion: '92%',
      },
    },
    {
      id: 'convenience',
      name: '편의점',
      description: '24시간 편의시설 및 음료/간식',
      icon: Coffee,
      status: 'operational',
      uptime: '100%',
      features: ['24시간 운영', '신선 식품', '음료/커피', '생활용품'],
      color: 'from-green-500 to-emerald-500',
      metrics: {
        products: '1,250개',
        dailySales: '₩847K',
        footTraffic: '890명',
      },
    },
  ];

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [services.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400';
      case 'busy':
        return 'text-orange-400';
      case 'maintenance':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'OPERATIONAL';
      case 'busy':
        return 'BUSY';
      case 'maintenance':
        return 'MAINTENANCE';
      default:
        return 'UNKNOWN';
    }
  };

  // 활성 서비스의 아이콘 컴포넌트 가져오기
  const ActiveServiceIcon = services[activeService].icon;

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30 neon-border">
            <Zap className="w-4 h-4 mr-1" />
            STATION SERVICES OVERVIEW
          </Badge>
          <h2 className="futuristic text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            통합 서비스 모니터링
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mono">
            실시간 서비스 상태와 성능 메트릭을 한눈에 확인하세요
          </p>
        </div>

        {/* 서비스 그리드 */}
        <div className="data-grid cols-2 lg:cols-4 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isActive = index === activeService;

            return (
              <Card
                key={service.id}
                className={`dashboard-card cursor-pointer transition-all duration-500 ${
                  isActive ? 'live scale-105' : ''
                }`}
                onClick={() => setActiveService(index)}
              >
                <CardContent className="p-6 relative">
                  {/* 상태 표시 */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`status-indicator ${service.status}`}
                      ></div>
                      <span
                        className={`text-xs mono ${getStatusColor(
                          service.status
                        )}`}
                      >
                        {getStatusText(service.status)}
                      </span>
                    </div>
                  </div>

                  {/* 서비스 정보 */}
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {service.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {service.description}
                  </p>

                  {/* 업타임 */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>UPTIME</span>
                      <span className="mono">{service.uptime}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: service.uptime }}
                      ></div>
                    </div>
                  </div>

                  {/* 주요 기능 */}
                  <div className="space-y-1">
                    {service.features.slice(0, 2).map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-xs text-slate-300"
                      >
                        <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 활성 서비스 상세 정보 */}
        <div className="data-card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 서비스 상세 */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-lg bg-gradient-to-r ${services[activeService].color} flex items-center justify-center`}
                >
                  <ActiveServiceIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white futuristic">
                    {services[activeService].name}
                  </h3>
                  <p className="text-slate-400">
                    {services[activeService].description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {services[activeService].features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-slate-300"
                  >
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 메트릭 */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(services[activeService].metrics).map(
                ([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="metric-value text-cyan-400">{value}</div>
                    <div className="metric-label">
                      {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* 하단 시스템 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="data-card text-center">
            <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="metric-value text-blue-400">24</div>
            <div className="metric-label">STATIONS NETWORK</div>
          </div>

          <div className="data-card text-center">
            <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="metric-value text-green-400">99.9%</div>
            <div className="metric-label">SYSTEM UPTIME</div>
          </div>

          <div className="data-card text-center">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="metric-value text-purple-400">REAL-TIME</div>
            <div className="metric-label">DATA SYNC</div>
          </div>
        </div>
      </div>
    </section>
  );
};
