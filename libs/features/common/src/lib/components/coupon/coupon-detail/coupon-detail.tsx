import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ArrowLeft,
  Gift,
  Clock,
  Copy,
  Check,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import { CouponDetailOutput } from '@starcoex-frontend/graphql';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { CouponQRCode } from './coupon-qr-code';
import { Skeleton } from '../../ui';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Separator,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '../../ui';
import { toast } from 'sonner';

interface CouponDetailProps {
  code?: string;
  onBack?: () => void;
  onGift?: (code: string) => void;
}

const couponTypeLabels: Record<string, string> = {
  PREMIUM_WASH: '프리미엄 세차',
  BASIC_WASH: '기본 세차',
  FUEL_DISCOUNT: '주유 할인',
};

export const CouponDetail: React.FC<CouponDetailProps> = ({
  code: codeProp,
  onBack,
  onGift,
}) => {
  const { code: codeParam } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const code = codeProp || codeParam;

  const { fetchCouponDetail, createGiftLink, isLoading } = useLoyalty();
  const [couponData, setCouponData] = useState<CouponDetailOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGifting, setIsGifting] = useState(false);

  useEffect(() => {
    if (code) {
      fetchCouponDetail(code).then((res) => {
        if (res.success && res.data) {
          setCouponData(res.data);
        }
      });
    }
  }, [code, fetchCouponDetail]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/coupons');
    }
  };

  const handleCopyCode = async () => {
    if (couponData?.coupon?.code) {
      await navigator.clipboard.writeText(couponData.coupon.code);
      setCopied(true);
      toast.success('쿠폰 코드가 복사되었습니다');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGift = async () => {
    if (!couponData?.coupon?.code) return;

    setIsGifting(true);
    try {
      const res = await createGiftLink({
        couponCode: couponData.coupon.code,
        message: '선물입니다! 🎁',
      });

      if (res.success && res.data?.giftUrl) {
        await navigator.clipboard.writeText(res.data.giftUrl);
        toast.success('선물 링크가 복사되었습니다! 친구에게 공유하세요.');

        if (onGift) {
          onGift(couponData.coupon.code);
        }
      }
    } catch (error) {
      toast.error('선물 링크 생성에 실패했습니다');
    } finally {
      setIsGifting(false);
    }
  };

  if (isLoading || !couponData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const { coupon, qrData } = couponData;

  if (!coupon) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-medium mb-2">쿠폰을 찾을 수 없습니다</h2>
        <Button variant="outline" onClick={handleBack}>
          돌아가기
        </Button>
      </div>
    );
  }

  const isUsable = coupon.status === 'ACTIVE';
  const isExpiringSoon =
    isUsable &&
    coupon.expiresAt &&
    new Date(coupon.expiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">쿠폰 상세</h1>
      </div>

      {/* 메인 카드 */}
      <Card className="overflow-hidden">
        {/* 상단 컬러 배너 */}
        <div
          className={`h-2 ${
            isUsable
              ? 'bg-gradient-to-r from-primary to-primary/70'
              : 'bg-muted'
          }`}
        />

        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <Badge
              variant={isUsable ? 'default' : 'secondary'}
              className="text-sm"
            >
              {isUsable
                ? '사용 가능'
                : coupon.status === 'USED'
                ? '사용 완료'
                : '만료됨'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {couponTypeLabels[coupon.type] || coupon.type}
          </p>
          <CardTitle className="text-2xl">{coupon.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* QR 코드 */}
          {isUsable && qrData && (
            <div className="flex flex-col items-center">
              <CouponQRCode data={qrData} size={180} />
              <p className="text-xs text-muted-foreground mt-2">
                매장에서 QR코드를 스캔하세요
              </p>
            </div>
          )}

          <Separator />

          {/* 쿠폰 코드 */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">쿠폰 코드</p>
              <p className="font-mono font-bold text-lg">{coupon.code}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyCode}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* 유효기간 */}
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground">유효기간: </span>
              <span
                className={isExpiringSoon ? 'text-orange-500 font-medium' : ''}
              >
                {coupon.expiresAt
                  ? format(new Date(coupon.expiresAt), 'yyyy년 MM월 dd일까지', {
                      locale: ko,
                    })
                  : '무기한'}
              </span>
              {isExpiringSoon && (
                <Badge
                  variant="outline"
                  className="ml-2 text-orange-500 border-orange-500"
                >
                  곧 만료
                </Badge>
              )}
            </div>
          </div>

          {/* 선물 받은 쿠폰 정보 */}
          {coupon.isGifted && coupon.giftedFrom && (
            <div className="flex items-center gap-3 text-sm p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
              <Gift className="h-4 w-4 text-pink-500" />
              <span>
                <span className="font-medium">{coupon.giftedFrom}</span>님이
                선물한 쿠폰입니다
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      {isUsable && (
        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                선물하기
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>쿠폰을 선물하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  선물 링크가 생성되며, 이 쿠폰은 더 이상 사용할 수 없게 됩니다.
                  링크를 받은 사람만 쿠폰을 수령할 수 있습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleGift} disabled={isGifting}>
                  {isGifting ? '생성 중...' : '선물 링크 생성'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};
