import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Settings,
  Shield,
  History,
} from 'lucide-react';
import { APP_CONFIG } from '../../config/app.config';
import { useAuth } from '@starcoex-frontend/auth';
import { PageHead } from '@starcoex-frontend/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (!currentUser) {
    navigate('/auth/login');
    return null;
  }

  const membershipInfo = {
    level: 'VIP',
    joinDate: '2024.01.15',
    totalVisits: 28,
    savings: 45600,
  };

  const recentActivities = [
    {
      id: 1,
      type: 'refuel',
      title: '주유 완료',
      description: '서울 강남점 - 휘발유 40L',
      date: '2024.08.12',
      amount: '64,000원',
    },
    {
      id: 2,
      type: 'reservation',
      title: '세차 예약',
      description: '경기 수원점 - 프리미엄 세차',
      date: '2024.08.10',
      amount: '25,000원',
    },
    {
      id: 3,
      type: 'point',
      title: '포인트 적립',
      description: '주유 포인트 적립',
      date: '2024.08.08',
      amount: '+1,280P',
    },
  ];

  return (
    <>
      <PageHead
        title="내 정보 - 별표주유소"
        description="별표주유소 회원 정보 및 이용 내역을 확인하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/profile`}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* 프로필 헤더 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {currentUser.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold mb-2">
                    {currentUser.name}님
                  </h1>
                  <p className="text-muted-foreground mb-3">
                    {currentUser.email}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-600"
                    >
                      {membershipInfo.level} 회원
                    </Badge>
                    <Badge variant="outline">포털 연결됨 🔗</Badge>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/profile/edit')}
                  variant="outline"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  정보 수정
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 회원 정보 */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    기본 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">이메일</p>
                        <p className="font-medium">{currentUser.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">휴대폰</p>
                        <p className="font-medium">
                          {currentUser.phoneNumber || '미등록'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">가입일</p>
                        <p className="font-medium">{membershipInfo.joinDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          회원등급
                        </p>
                        <p className="font-medium text-blue-600">
                          {membershipInfo.level} 회원
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 최근 활동 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      최근 활동
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/profile/history')}
                    >
                      전체 보기
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            {activity.type === 'refuel' && '⛽'}
                            {activity.type === 'reservation' && '🚗'}
                            {activity.type === 'point' && '🏆'}
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{activity.amount}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 멤버십 혜택 */}
              <Card>
                <CardHeader>
                  <CardTitle>멤버십 혜택</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {membershipInfo.totalVisits}회
                    </div>
                    <p className="text-sm text-muted-foreground">
                      총 방문 횟수
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {membershipInfo.savings.toLocaleString()}원
                    </div>
                    <p className="text-sm text-muted-foreground">
                      총 절약 금액
                    </p>
                  </div>

                  <Button className="w-full" variant="outline">
                    포인트 내역 보기
                  </Button>
                </CardContent>
              </Card>

              {/* 빠른 메뉴 */}
              <Card>
                <CardHeader>
                  <CardTitle>빠른 메뉴</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate('/profile/reservations')}
                  >
                    📅 예약 관리
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate('/profile/favorites')}
                  >
                    ❤️ 즐겨찾는 주유소
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate('/profile/notifications')}
                  >
                    🔔 알림 설정
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate('/profile/support')}
                  >
                    📞 고객 지원
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
