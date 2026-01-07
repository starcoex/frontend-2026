import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const STATION_INFO = {
  name: '별표주유소 본점',
  address: '제주특별자치도 제주시 연동 123-45',
} as const;

const handleNavigation = (address: string): void => {
  const encodedAddress = encodeURIComponent(address);
  window.open(`https://map.naver.com/v5/search/${encodedAddress}`, '_blank');
};

const getCurrentOperatingStatus = (): { isOpen: boolean; message: string } => {
  return {
    isOpen: true,
    message: '현재 영업 중 (24시간 운영)',
  };
};

export const MapSection: React.FC = () => (
  <div>
    <h3 className="text-foreground text-xl lg:text-2xl font-semibold mb-6">
      위치 지도
    </h3>
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center relative">
          <div className="text-center space-y-4">
            <MapPin className="w-16 h-16 text-primary mx-auto" />
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {STATION_INFO.name}
              </h4>
              <p className="text-muted-foreground">{STATION_INFO.address}</p>
            </div>
            <Button
              onClick={() => handleNavigation(STATION_INFO.address)}
              className="bg-primary hover:bg-primary/90"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              지도에서 보기
            </Button>
          </div>

          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur rounded-lg p-3 border border-border">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-foreground font-medium">
                {getCurrentOperatingStatus().message}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
