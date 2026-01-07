import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Gift, PartyPopper } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Badge,
} from '../ui';
import confetti from 'canvas-confetti';

interface WelcomeRewardsModalProps {
  open: boolean;
  onClose: () => void;
  welcomeStars?: number;
  welcomeCouponName?: string;
  userName?: string;
}

export const WelcomeRewardsModal: React.FC<WelcomeRewardsModalProps> = ({
  open,
  onClose,
  welcomeStars = 5,
  welcomeCouponName = '프리미엄 세차권',
  userName,
}) => {
  const navigate = useNavigate();

  // 모달 열릴 때 confetti 효과
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 300);
    }
  }, [open]);

  const handleViewCoupons = () => {
    onClose();
    navigate('/dashboard/coupons');
  };

  const handleClose = () => {
    onClose();
    navigate('/dashboard');
  };

  const starsToNextCoupon = 12 - welcomeStars;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          {/* 축하 아이콘 */}
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4">
            <PartyPopper className="h-10 w-10 text-green-600" />
          </div>

          <DialogTitle className="text-2xl">
            {userName ? `${userName}님, ` : ''}환영합니다!
          </DialogTitle>
          <DialogDescription className="text-base">
            별표주유소 가입을 축하드려요!
            <br />
            특별한 웰컴 혜택을 준비했습니다.
          </DialogDescription>
        </DialogHeader>

        {/* 혜택 카드들 */}
        <div className="space-y-4 my-6">
          {/* 웰컴 쿠폰 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-800 dark:text-green-200">
                  웰컴 쿠폰
                </span>
                <Badge className="bg-green-600 text-xs">NEW</Badge>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                {welcomeCouponName} 1장
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-green-500" />
          </div>

          {/* 웰컴 별 */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
              <Star className="h-6 w-6 text-white fill-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-800 dark:text-amber-200">
                  웰컴 별
                </span>
                <Badge
                  variant="outline"
                  className="border-amber-500 text-amber-600 text-xs"
                >
                  +{welcomeStars}
                </Badge>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {starsToNextCoupon}개만 더 모으면 쿠폰 교환!
              </p>
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          <strong>Tip:</strong> 주유 1만원당 별 1개, 세차는 2배 적립!
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button className="w-full" size="lg" onClick={handleViewCoupons}>
            <Gift className="h-4 w-4 mr-2" />내 쿠폰 확인하기
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleClose}>
            나중에 볼게요
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
