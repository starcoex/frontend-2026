import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Gift, PartyPopper, AlertTriangle, Loader2 } from 'lucide-react';
import { GiftLinkInfoOutput } from '@starcoex-frontend/graphql';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import { Card, CardContent, Button } from '../../ui';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export const CouponGiftClaim: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { fetchGiftLinkInfo, claimGift, isLoading } = useLoyalty();
  const [giftInfo, setGiftInfo] = useState<GiftLinkInfoOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (token) {
      fetchGiftLinkInfo(token).then((res) => {
        if (res.success && res.data) {
          setGiftInfo(res.data);
        } else {
          setError('유효하지 않은 선물 링크입니다');
        }
      });
    }
  }, [token, fetchGiftLinkInfo]);

  const handleClaim = async () => {
    if (!token) return;

    try {
      const res = await claimGift({ giftToken: token });

      if (res.success) {
        setClaimed(true);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
        });
        toast.success('선물을 받았습니다! 🎉');
      } else {
        toast.error('선물 수령에 실패했습니다');
      }
    } catch (err) {
      toast.error('선물 수령에 실패했습니다');
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">잘못된 접근입니다</h2>
        <p className="text-muted-foreground mb-6">
          선물 링크가 올바르지 않습니다.
        </p>
        <Button onClick={() => navigate('/')}>홈으로</Button>
      </div>
    );
  }

  if (isLoading && !giftInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">선물 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !giftInfo?.isValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">선물을 받을 수 없습니다</h2>
        <p className="text-muted-foreground mb-6">
          {error || '이미 수령했거나 만료된 선물입니다.'}
        </p>
        <Button onClick={() => navigate('/')}>홈으로</Button>
      </div>
    );
  }

  if (claimed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
          <PartyPopper className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">선물을 받았어요!</h2>
        <p className="text-muted-foreground mb-8">
          쿠폰이 내 쿠폰함에 추가되었습니다.
        </p>
        <Button onClick={() => navigate('/coupons')}>내 쿠폰 보기</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white text-center">
          <Gift className="h-12 w-12 mx-auto mb-3" />
          <h1 className="text-2xl font-bold">선물이 도착했어요!</h1>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* 쿠폰 정보 */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">받은 쿠폰</p>
            <h2 className="text-xl font-bold mt-1">{giftInfo.couponName}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {giftInfo.couponType}
            </p>
          </div>

          {/* 메시지 */}
          {giftInfo.senderMessage && (
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm italic">"{giftInfo.senderMessage}"</p>
            </div>
          )}

          {/* 유효기간 */}
          {giftInfo.expiresAt && (
            <p className="text-sm text-muted-foreground text-center">
              유효기간:{' '}
              {format(new Date(giftInfo.expiresAt), 'yyyy년 MM월 dd일까지', {
                locale: ko,
              })}
            </p>
          )}

          {/* 수령 버튼 */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleClaim}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                수령 중...
              </>
            ) : (
              '선물 받기'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
