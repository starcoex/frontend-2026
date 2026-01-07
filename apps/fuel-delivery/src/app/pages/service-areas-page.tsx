import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Truck, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ServiceAreasPage: React.FC = () => {
  const navigate = useNavigate();

  const serviceAreas = [
    {
      region: '서울 전 지역',
      districts: ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구'],
      deliveryTime: '당일 배송',
      status: 'available',
      minOrder: 200,
    },
    {
      region: '경기 북부',
      districts: ['고양시', '파주시', '의정부시', '양주시', '동두천시'],
      deliveryTime: '1-2일 배송',
      status: 'available',
      minOrder: 300,
    },
    {
      region: '경기 남부',
      districts: ['수원시', '성남시', '안양시', '부천시', '광명시', '과천시'],
      deliveryTime: '당일 배송',
      status: 'available',
      minOrder: 200,
    },
    {
      region: '인천 전 지역',
      districts: ['부평구', '계양구', '서구', '남동구', '연수구'],
      deliveryTime: '1-2일 배송',
      status: 'available',
      minOrder: 300,
    },
    {
      region: '충청권',
      districts: ['대전', '천안', '청주', '아산', '세종시'],
      deliveryTime: '2-3일 배송',
      status: 'expanding',
      minOrder: 500,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">서비스 중</Badge>;
      case 'expanding':
        return <Badge className="bg-blue-100 text-blue-800">확대 예정</Badge>;
      default:
        return <Badge variant="secondary">준비 중</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>배송 지역 안내 - 난방유 배달 서비스</title>
        <meta
          name="description"
          content="난방유 배달 가능 지역을 확인하세요. 서울, 경기, 인천 전 지역 당일 배송 가능합니다."
        />
      </Helmet>

      <div className="py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-900 mb-4">
            🚛 배송 지역 안내
          </h1>
          <p className="text-orange-600 max-w-2xl mx-auto">
            난방유 배달 서비스가 가능한 지역을 확인하세요.
            <br />
            지속적으로 서비스 지역을 확대해 나가고 있습니다.
          </p>
        </div>

        {/* 서비스 지역 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {serviceAreas.map((area, index) => (
            <Card
              key={index}
              className="border-2 border-orange-200 hover:border-orange-300 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">
                      {area.region}
                    </h3>
                    {getStatusBadge(area.status)}
                  </div>
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      서비스 지역:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {area.districts.map((district, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {district}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{area.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-orange-500" />
                      <span>최소 {area.minOrder}L</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 서비스 확대 안내 */}
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-orange-900 mb-4">
              📍 서비스 지역 확대 중
            </h3>
            <p className="text-orange-700 mb-6">
              고객님의 지역이 서비스 대상이 아니신가요?
              <br />
              지속적으로 서비스 지역을 확대하고 있으니 조금만 기다려주세요!
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/contact')}
                className="bg-orange-600 hover:bg-orange-700 mr-3"
              >
                <MapPin className="w-4 h-4 mr-2" />
                지역 확대 요청하기
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('tel:1588-9999')}
                className="border-orange-300 text-orange-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                전화로 문의하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 배송 안내 */}
        <div className="mt-8 bg-white rounded-lg border border-orange-200 p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-4">
            🚛 배송 안내사항
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">배송 시간</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• 평일: 오전 9시 ~ 오후 6시</li>
                <li>• 토요일: 오전 9시 ~ 오후 3시</li>
                <li>• 일요일/공휴일: 배송 휴무</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">배송 조건</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• 최소 주문량: 200L 이상</li>
                <li>• 배송비: 지역별 차등 적용</li>
                <li>• 저장탱크 용량 사전 확인 필요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
