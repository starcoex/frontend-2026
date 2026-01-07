import React from 'react';
import { motion } from 'motion/react';
import { MapPin, TrendingDown, Bell, CreditCard } from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: FeatureItem[] = [
  {
    icon: <TrendingDown className="w-5 h-5" />,
    title: '실시간 최저가',
    description: '제주도 전체 주유소 가격 비교',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: '내 주변 검색',
    description: '가장 가까운 주유소 찾기',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: '가격 알림',
    description: '원하는 가격에 알림 받기',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: '간편 결제',
    description: '앱에서 바로 결제하기',
    color: 'from-purple-500 to-pink-500',
  },
];

export const FeatureHighlights: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3 mt-8 px-4">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="group relative overflow-hidden rounded-xl bg-background/60 backdrop-blur-sm border p-4 cursor-pointer"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          />

          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-3`}
          >
            {feature.icon}
          </div>

          <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
          <p className="text-xs text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
};
