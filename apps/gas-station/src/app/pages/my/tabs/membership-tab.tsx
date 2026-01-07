import React from 'react';
import { Crown, Check } from 'lucide-react';
import type { User } from '@starcoex-frontend/graphql';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MembershipTabProps {
  user: User | null;
}

export const MembershipTab: React.FC<MembershipTabProps> = ({ user }) => {
  // TODO: 실제 멤버십 데이터 연동
  const currentGrade =
    user?.membership?.currentTierDisplayName ??
    user?.membership?.currentTier ??
    'WELCOME';
  const progress = 70;
  const currentAmount = 70000;
  const nextGradeAmount = 100000;

  const grades = [
    {
      name: 'WELCOME',
      minAmount: 0,
      benefits: ['기본 적립 1%', '생일 쿠폰 제공'],
      color: 'bg-gray-100 text-gray-700',
    },
    {
      name: 'GREEN',
      minAmount: 50000,
      benefits: ['적립 2%', '세차 5% 할인', '생일 쿠폰 제공'],
      color: 'bg-green-100 text-green-700',
    },
    {
      name: 'GOLD',
      minAmount: 100000,
      benefits: [
        '적립 3%',
        '세차 10% 할인',
        '주유 리터당 30원 할인',
        '생일 쿠폰 제공',
      ],
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      name: 'VIP',
      minAmount: 300000,
      benefits: [
        '적립 5%',
        '세차 15% 할인',
        '주유 리터당 50원 할인',
        '전용 라운지 이용',
        '생일 쿠폰 제공',
      ],
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  const currentGradeIndex = grades.findIndex((g) => g.name === currentGrade);
  const currentGradeInfo = grades[currentGradeIndex];
  const nextGradeInfo = grades[currentGradeIndex + 1];

  return (
    <div className="space-y-6">
      {/* 현재 등급 카드 */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-full">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700">나의 등급</p>
                <h2 className="text-3xl font-bold text-orange-900">
                  {currentGrade}
                </h2>
              </div>
            </div>
          </div>

          {/* 다음 등급 진행률 */}
          {nextGradeInfo && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-orange-700">
                  다음 등급: {nextGradeInfo.name}
                </span>
                <span className="font-semibold text-orange-900">
                  {currentAmount.toLocaleString()}원 /{' '}
                  {nextGradeAmount.toLocaleString()}원
                </span>
              </div>
              <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-orange-700 mt-2">
                {(nextGradeAmount - currentAmount).toLocaleString()}원 더
                이용하시면 {nextGradeInfo.name} 등급으로 승급됩니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 현재 혜택 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">나의 혜택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentGradeInfo?.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 등급 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">등급 안내</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grades.map((grade, index) => {
              const isCurrent = grade.name === currentGrade;
              const isPast = index < currentGradeIndex;

              return (
                <div
                  key={grade.name}
                  className={`p-4 rounded-lg border ${
                    isCurrent
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={grade.color}>{grade.name}</Badge>
                      {isCurrent && (
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-300"
                        >
                          현재 등급
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {grade.minAmount > 0
                        ? `${grade.minAmount.toLocaleString()}원 이상`
                        : '기본'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {grade.benefits.slice(0, 2).join(' • ')}
                    {grade.benefits.length > 2 && ' ...'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
