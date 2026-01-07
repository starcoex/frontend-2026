import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Clock, MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('');

  return (
    <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 간단명료한 헤드라인 */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-orange-500 text-white">
              🚛 당일 배송 서비스
            </Badge>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              난방유 주문하면
              <span className="text-orange-600"> 당일 배송</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              전화 주문도 가능 • 정기 배송 할인 • 안전한 직배송
            </p>
          </div>

          {/* 빠른 주문 카드 */}
          <Card className="mb-8 border-2 border-orange-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                📞 지금 바로 주문하세요
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 전화 주문 */}
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Phone className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">전화 주문</h3>
                  <p className="text-2xl font-bold text-orange-600 mb-2">
                    1588-9999
                  </p>
                  <p className="text-sm text-gray-600">
                    평일 08:00-18:00
                    <br />
                    주말 09:00-16:00
                  </p>
                </div>

                {/* 온라인 주문 */}
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Truck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">온라인 주문</h3>
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 mb-2"
                    onClick={() => navigate('/order')}
                  >
                    주문하기
                  </Button>
                  <p className="text-sm text-gray-600">
                    24시간 접수 가능
                    <br />
                    정기 배송 추가 할인
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 핵심 정보 - 간단하게 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">당일 배송</h3>
              <p className="text-sm text-gray-600">
                오후 2시 전 주문시
                <br />
                당일 배송 가능
              </p>
            </div>

            <div className="p-4">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">배송 지역</h3>
              <p className="text-sm text-gray-600">
                서울/경기 일부
                <br />
                <Button variant="link" size="sm" className="p-0 h-auto">
                  지역 확인하기
                </Button>
              </p>
            </div>

            <div className="p-4">
              <span className="text-2xl mb-2 block">💰</span>
              <h3 className="font-semibold mb-1">무료 배송</h3>
              <p className="text-sm text-gray-600">
                10만원 이상 주문시
                <br />
                배송비 무료
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
