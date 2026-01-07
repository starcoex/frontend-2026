import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const StationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // 주유소 데이터
  const stations = [
    {
      id: 1,
      name: '별표주유소 강남점',
      address: '서울시 강남구 테헤란로 123',
      region: 'seoul',
      status: 'operational',
      distance: '1.2km',
      rating: 4.8,
      phone: '02-1234-5678',
      hours: '24시간',
      services: ['세차', '정비', '편의점'],
      fuels: {
        gasoline: { price: 1580, available: true },
        diesel: { price: 1450, available: true },
        lpg: { price: 980, available: true },
        kerosene: { price: 1200, available: false },
      },
      utilization: 78,
      lastUpdate: '2분 전',
    },
    {
      id: 2,
      name: '별표주유소 서초점',
      address: '서울시 서초구 강남대로 456',
      region: 'seoul',
      status: 'operational',
      distance: '2.1km',
      rating: 4.9,
      phone: '02-2345-6789',
      hours: '06:00-22:00',
      services: ['세차', '편의점'],
      fuels: {
        gasoline: { price: 1575, available: true },
        diesel: { price: 1445, available: true },
        lpg: { price: 975, available: true },
        kerosene: { price: 1195, available: true },
      },
      utilization: 92,
      lastUpdate: '1분 전',
    },
    {
      id: 3,
      name: '별표주유소 홍대점',
      address: '서울시 마포구 홍익로 789',
      region: 'seoul',
      status: 'maintenance',
      distance: '3.5km',
      rating: 4.7,
      phone: '02-3456-7890',
      hours: '점검 중',
      services: ['세차', '정비', '편의점', '카페'],
      fuels: {
        gasoline: { price: 1585, available: false },
        diesel: { price: 1455, available: false },
        lpg: { price: 985, available: false },
        kerosene: { price: 1205, available: false },
      },
      utilization: 0,
      lastUpdate: '30분 전',
    },
    {
      id: 4,
      name: '별표주유소 잠실점',
      address: '서울시 송파구 올림픽로 321',
      region: 'seoul',
      status: 'operational',
      distance: '4.2km',
      rating: 4.6,
      phone: '02-4567-8901',
      hours: '24시간',
      services: ['정비', '편의점'],
      fuels: {
        gasoline: { price: 1582, available: true },
        diesel: { price: 1452, available: true },
        lpg: { price: 982, available: true },
        kerosene: { price: 1202, available: true },
      },
      utilization: 65,
      lastUpdate: '3분 전',
    },
    {
      id: 5,
      name: '별표주유소 판교점',
      address: '경기도 성남시 분당구 판교로 654',
      region: 'gyeonggi',
      status: 'operational',
      distance: '8.7km',
      rating: 4.8,
      phone: '031-5678-9012',
      hours: '24시간',
      services: ['세차', '정비', '편의점', '전기차충전'],
      fuels: {
        gasoline: { price: 1575, available: true },
        diesel: { price: 1445, available: true },
        lpg: { price: 975, available: true },
        kerosene: { price: 1195, available: true },
      },
      utilization: 84,
      lastUpdate: '1분 전',
    },
  ];

  const regions = [
    { value: 'all', label: '전체 지역' },
    { value: 'seoul', label: '서울' },
    { value: 'gyeonggi', label: '경기' },
    { value: 'incheon', label: '인천' },
  ];

  const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'operational', label: '운영중' },
    { value: 'maintenance', label: '점검중' },
    { value: 'offline', label: '오프라인' },
  ];

  const filteredStations = stations.filter((station) => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion =
      selectedRegion === 'all' || station.region === selectedRegion;
    const matchesStatus =
      selectedStatus === 'all' || station.status === selectedStatus;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400';
      case 'maintenance':
        return 'text-orange-400';
      case 'offline':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return '운영중';
      case 'maintenance':
        return '점검중';
      case 'offline':
        return '오프라인';
      default:
        return '알 수 없음';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'text-red-400';
    if (utilization >= 60) return 'text-orange-400';
    if (utilization >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-white futuristic mb-2">
          주유소 찾기
        </h1>
        <p className="text-slate-400">
          실시간 운영 상황과 연료 가격을 확인하고 가까운 주유소를 찾아보세요
        </p>
      </div>

      {/* 필터 */}
      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="주유소명 또는 주소로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800/50 border-slate-600 text-white"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm"
              >
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="status-indicator operational"></div>
              <span>
                운영중:{' '}
                {stations.filter((s) => s.status === 'operational').length}개
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-indicator busy"></div>
              <span>
                점검중:{' '}
                {stations.filter((s) => s.status === 'maintenance').length}개
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주유소 목록 */}
      <div className="space-y-4">
        {filteredStations.length === 0 ? (
          <Card className="dashboard-card">
            <CardContent className="p-12 text-center">
              <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-slate-400">
                검색 조건을 변경하거나 다른 지역을 선택해보세요
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredStations.map((station) => (
            <Card
              key={station.id}
              className="dashboard-card hover:border-cyan-500/30 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* 기본 정보 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {station.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MapPin className="w-4 h-4" />
                          {station.address}
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-600"
                          >
                            {station.distance}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${getStatusColor(
                            station.status
                          )}`}
                        >
                          {getStatusText(station.status)}
                        </div>
                        <div className="text-xs text-slate-400 mono">
                          {station.lastUpdate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">{station.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{station.hours}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{station.phone}</span>
                      </div>
                    </div>

                    {/* 서비스 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {station.services.map((service) => (
                        <Badge
                          key={service}
                          variant="outline"
                          className="text-xs border-slate-600 text-slate-300"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>

                    {/* 이용률 */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">현재 이용률</span>
                        <span
                          className={`font-medium ${getUtilizationColor(
                            station.utilization
                          )}`}
                        >
                          {station.utilization}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${station.utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* 연료 가격 */}
                  <div className="lg:w-80">
                    <h4 className="text-sm font-medium text-white mb-3">
                      연료 가격
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(station.fuels).map(
                        ([fuelType, fuel]: [string, any]) => {
                          const fuelInfo = {
                            gasoline: {
                              name: '휘발유',
                              icon: '⛽',
                              color: 'text-red-400',
                            },
                            diesel: {
                              name: '경유',
                              icon: '🚛',
                              color: 'text-green-400',
                            },
                            lpg: {
                              name: 'LPG',
                              icon: '🔥',
                              color: 'text-purple-400',
                            },
                            kerosene: {
                              name: '등유',
                              icon: '🏠',
                              color: 'text-orange-400',
                            },
                          }[fuelType];

                          return (
                            <div
                              key={fuelType}
                              className={`p-3 rounded-lg border ${
                                fuel.available
                                  ? 'bg-slate-800/30 border-slate-700/30'
                                  : 'bg-slate-800/10 border-slate-700/10 opacity-50'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">
                                  {fuelInfo?.icon}
                                </span>
                                <span className="text-xs text-slate-300">
                                  {fuelInfo?.name}
                                </span>
                              </div>
                              {fuel.available ? (
                                <div
                                  className={`text-lg font-bold mono ${fuelInfo?.color}`}
                                >
                                  {fuel.price.toLocaleString()}₩
                                </div>
                              ) : (
                                <div className="text-sm text-slate-500">
                                  품절
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        길찾기
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-800/50"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 검색 결과 요약 */}
      {filteredStations.length > 0 && (
        <div className="text-center text-slate-400 mono">
          총 {filteredStations.length}개의 주유소를 찾았습니다
        </div>
      )}
    </div>
  );
};
