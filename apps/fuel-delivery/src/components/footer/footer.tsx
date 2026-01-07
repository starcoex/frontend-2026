import React from 'react';
import { Link } from 'react-router-dom';
import {
  Fuel,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  MapPin,
  Zap,
  Shield,
  Activity,
} from 'lucide-react';
import { APP_CONFIG } from '@/app/config/app.config';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: '서비스 소개', href: '/services' },
    { name: '주유소 찾기', href: '/fuels' },
    { name: '실시간 유가', href: '/prices' },
    { name: '이용약관', href: '/terms' },
    { name: '개인정보처리방침', href: '/privacy' },
    { name: '고객센터', href: '/support' },
  ];

  const otherServices = [
    {
      name: '세차 서비스',
      url: 'https://car-wash.starcoex.com',
      icon: '🚗',
    },
    {
      name: '난방유 배달',
      url: 'https://fuel-delivery.starcoex.com',
      icon: '🚛',
    },
    {
      name: '포털 홈',
      url: 'https://starcoex.com',
      icon: '🏠',
    },
  ];

  const systemStats = [
    {
      label: 'UPTIME',
      value: '99.9%',
      icon: Activity,
      color: 'text-green-400',
    },
    { label: 'STATIONS', value: '24', icon: MapPin, color: 'text-blue-400' },
    {
      label: 'SECURITY',
      value: 'HIGH',
      icon: Shield,
      color: 'text-purple-400',
    },
    { label: 'STATUS', value: 'ONLINE', icon: Zap, color: 'text-cyan-400' },
  ];

  const handlePortalLink = () => {
    window.open('https://starcoex.com', '_blank');
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-700/50 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        {/* 상단 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* 브랜드 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center neon-border">
                <Fuel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white futuristic">
                  별표주유소
                </h3>
                <div className="text-xs text-cyan-400 mono">
                  REAL-TIME DASHBOARD
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {APP_CONFIG.app.description}
            </p>

            {/* 시스템 상태 */}
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="status-indicator operational"></div>
                <span className="text-xs text-green-400 mono">
                  SYSTEM OPERATIONAL
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* 포털 연결 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePortalLink}
              className="border-slate-600 text-slate-300 hover:bg-slate-800/50 w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              스타코엑스 포털
            </Button>
          </div>

          {/* 서비스 메뉴 */}
          <div>
            <h4 className="font-semibold text-white mb-4 futuristic">서비스</h4>
            <ul className="space-y-3">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-cyan-400 transition-colors flex items-center gap-2"
                  >
                    <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-4 p-2 bg-slate-800/30 rounded border border-slate-700/30">
              <div className="text-xs text-slate-400 mb-1">QUICK ACCESS</div>
              <Link
                to="/dashboard"
                className="text-sm text-cyan-400 hover:text-cyan-300 mono"
              >
                → DASHBOARD
              </Link>
            </div>
          </div>

          {/* 연결된 서비스 */}
          <div>
            <h4 className="font-semibold text-white mb-4 futuristic">
              연결된 서비스
            </h4>
            <div className="space-y-3">
              {otherServices.map((service) => (
                <button
                  key={service.name}
                  onClick={() => window.open(service.url, '_blank')}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors w-full text-left p-2 rounded hover:bg-slate-800/50"
                >
                  <span className="text-lg">{service.icon}</span>
                  {service.name}
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs text-slate-500 mono">
              * 포털 계정으로 자동 연결
            </div>
          </div>

          {/* 고객 지원 & 시스템 정보 */}
          <div>
            <h4 className="font-semibold text-white mb-4 futuristic">
              지원 센터
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>1588-FUEL (3835)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>support@starcoex.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>24/7 MONITORING</span>
              </div>
            </div>

            {/* 시스템 메트릭 */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {systemStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="text-center p-2 bg-slate-800/30 rounded border border-slate-700/30"
                  >
                    <Icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                    <div className={`text-xs font-bold mono ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-slate-700/50 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* 저작권 */}
            <div className="text-sm text-slate-400 text-center md:text-left">
              <p className="mono">
                © {currentYear} STARCOEX GAS STATION SYSTEM. ALL RIGHTS
                RESERVED.
              </p>
              <p className="mt-1 text-xs">
                Powered by STARCOEX Hybrid Platform • Real-time Monitoring
                System
              </p>
            </div>

            {/* 앱 정보 */}
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <Badge
                variant="outline"
                className="border-slate-600 text-slate-400 mono"
              >
                v{APP_CONFIG.app.version}
              </Badge>
              <Badge
                variant="outline"
                className="border-cyan-500/30 text-cyan-400"
              >
                {APP_CONFIG.app.theme.toUpperCase()}
              </Badge>
              <div className="flex items-center gap-1">
                <div className="status-indicator operational"></div>
                <span className="text-xs mono">OPERATIONAL</span>
              </div>
            </div>
          </div>

          {/* 하단 링크 */}
          <div className="mt-4 pt-4 border-t border-slate-800/50">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
              {footerLinks.slice(3).map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link
                    to={link.href}
                    className="hover:text-slate-300 transition-colors"
                  >
                    {link.name}
                  </Link>
                  {index < footerLinks.slice(3).length - 1 && (
                    <span className="text-slate-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 홀로그램 효과 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
    </footer>
  );
};
