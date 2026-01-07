import React, { useState } from 'react';
import {
  Phone,
  Clock,
  Star,
  Copy,
  Check,
  Navigation,
  MapPin,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { supportsTelephone } from '@starcoex-frontend/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { copyToClipboard } from '@/app/utils/contact.utils';

interface ContactInfo {
  address: string;
  phone: string;
}

interface OperatingHours {
  day: string;
  hours: string;
  isToday?: boolean;
  is24Hours?: boolean;
}

const CONTACT_INFO: ContactInfo = {
  address: '제주특별자치도 제주시 연동 123-45',
  phone: '064-713-2002',
} as const;

const OPERATING_HOURS: readonly OperatingHours[] = [
  { day: '월요일', hours: '24시간', is24Hours: true },
  { day: '화요일', hours: '24시간', is24Hours: true },
  { day: '수요일', hours: '24시간', is24Hours: true, isToday: true },
  { day: '목요일', hours: '24시간', is24Hours: true },
  { day: '금요일', hours: '24시간', is24Hours: true },
  { day: '토요일', hours: '24시간', is24Hours: true },
  { day: '일요일', hours: '24시간', is24Hours: true },
] as const;

// const handlePhoneCall = (phone: string): void => {
//   window.location.href = `tel:${phone}`;
// };

const handleNavigation = (address: string): void => {
  const encodedAddress = encodeURIComponent(address);
  window.open(`https://map.naver.com/v5/search/${encodedAddress}`, '_blank');
};

interface PhoneSectionProps {
  phone: string;
}

const PhoneSection: React.FC<PhoneSectionProps> = ({ phone }) => (
  <div className="flex items-start gap-2">
    <Phone className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
    <div className="flex-1 min-w-0 text-left">
      <div className="font-medium text-foreground mb-1">전화번호</div>
      <div className="text-sm text-muted-foreground mb-2">{phone}</div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className={`w-full justify-center ${
                !supportsTelephone() ? 'cursor-not-allowed opacity-60' : ''
              }`}
              onClick={() => {
                if (supportsTelephone()) {
                  window.location.href = `tel:${phone}`;
                }
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              전화걸기
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {supportsTelephone()
              ? `${phone}로 전화걸기`
              : '모바일에서 이용 가능합니다'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
);

interface AddressSectionProps {
  address: string;
  copiedAddress: boolean;
  onCopyAddress: () => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  address,
  copiedAddress,
  onCopyAddress,
}) => (
  <div className="space-y-3">
    <div className="flex items-start gap-2">
      <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0 text-left">
        <div className="font-medium text-foreground mb-1">주소</div>
        <div className="text-sm text-muted-foreground break-words">
          {address}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onCopyAddress}
        className="justify-center"
      >
        {copiedAddress ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            복사됨
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            주소복사
          </>
        )}
      </Button>
      <Button
        size="sm"
        onClick={() => handleNavigation(address)}
        className="justify-center"
      >
        <Navigation className="w-4 h-4 mr-2" />
        길찾기
      </Button>
    </div>
  </div>
);

interface ContactCardProps {
  contactInfo: ContactInfo;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contactInfo }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(contactInfo.address);
    if (success) {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-left">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          연락처 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PhoneSection phone={contactInfo.phone} />
        <AddressSection
          address={contactInfo.address}
          copiedAddress={copiedAddress}
          onCopyAddress={handleCopyAddress}
        />
      </CardContent>
    </Card>
  );
};

const OperatingHoursCard: React.FC<{ hours: readonly OperatingHours[] }> = ({
  hours,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="w-5 h-5" />
        운영시간
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {hours.map((schedule) => (
        <div
          key={schedule.day}
          className={`flex justify-between items-center py-2 px-3 rounded-lg ${
            schedule.isToday ? 'bg-primary/10 border border-primary/20' : ''
          }`}
        >
          <span
            className={`text-sm ${
              schedule.isToday
                ? 'font-semibold text-primary'
                : 'text-muted-foreground'
            }`}
          >
            {schedule.day}
          </span>
          <span
            className={`text-sm font-medium ${
              schedule.isToday ? 'text-primary' : 'text-foreground'
            }`}
          >
            {schedule.hours}
            {schedule.is24Hours && (
              <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                24H
              </span>
            )}
          </span>
        </div>
      ))}

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            현재 영업 중 (24시간 운영)
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ReviewCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Star className="w-5 h-5" />
        고객 리뷰
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-foreground mb-1">4.8</div>
        <div className="flex justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < 5 ? 'text-yellow-500 fill-current' : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">1,234개 리뷰</div>
      </div>

      {/* 평점 항목을 2열로 배치 */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { label: '친절한 서비스', percentage: '98%' },
          { label: '합리적 가격', percentage: '96%' },
          { label: '편리한 위치', percentage: '94%' },
          { label: '깨끗한 시설', percentage: '97%' },
          { label: '빠른 서비스', percentage: '95%' },
          { label: '연료 품질', percentage: '99%' },
        ].map((item) => (
          <div key={item.label} className="flex justify-between">
            <span className="text-muted-foreground truncate">{item.label}</span>
            <span className="text-foreground font-medium">
              {item.percentage}
            </span>
          </div>
        ))}
      </div>

      {/* 베스트 리뷰 1개만 표시 */}
      <div className="mt-4 p-3 bg-muted/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">김**님</span>
        </div>
        <p className="text-xs text-foreground leading-relaxed">
          "강력 고압세척기로 초벌하고 자동세차기 휠세척까지! 차가 완전 새것처럼
          깨끗해요."
        </p>
      </div>
      <div className="p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-0.5">
            {[...Array(4)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
            ))}
            <Star className="w-3 h-3 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">이**님</span>
        </div>
        <p className="text-xs text-foreground leading-relaxed">
          "제주 유일 빠른 손세차! 주유 5분 만에 차가 새것처럼 깨끗해집니다. 정말
          편리해요!"
        </p>
      </div>
    </CardContent>
  </Card>
);

export const ContactSidebar: React.FC = () => {
  return (
    <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
      <ContactCard contactInfo={CONTACT_INFO} />
      <OperatingHoursCard hours={OPERATING_HOURS} />
      {/*<ReviewCard />*/}
    </div>
  );
};
