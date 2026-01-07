import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Gift,
  Mail,
  Link2,
  Copy,
  Check,
  Send,
  MessageSquare,
} from 'lucide-react';
import { RewardCoupon } from '@starcoex-frontend/graphql';
import { useLoyalty } from '@starcoex-frontend/loyalty';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Textarea,
  Label,
  Input,
} from '../../ui';
import { toast } from 'sonner';

interface CouponGiftFormProps {
  coupon?: RewardCoupon;
  onBack?: () => void;
  onSuccess?: () => void;
}

type GiftMethod = 'email' | 'link';

export const CouponGiftForm: React.FC<CouponGiftFormProps> = ({
  coupon: preselectedCoupon,
  onBack,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const { coupons, giftCoupon, createGiftLink, isLoading } = useLoyalty();

  // 사용 가능한 쿠폰만 필터링
  const availableCoupons = coupons.filter((c) => c.status === 'ACTIVE');

  const [giftMethod, setGiftMethod] = useState<GiftMethod>('link');
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>(
    preselectedCoupon?.code || ''
  );
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedCoupon =
    preselectedCoupon ||
    availableCoupons.find((c) => c.code === selectedCouponCode);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/coupons');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCouponCode) {
      toast.error('선물할 쿠폰을 선택해주세요');
      return;
    }

    if (giftMethod === 'email' && !recipientEmail) {
      toast.error('받는 사람 이메일을 입력해주세요');
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmGift = async () => {
    if (!selectedCouponCode) return;

    try {
      if (giftMethod === 'email') {
        // 이메일로 선물
        const res = await giftCoupon({
          couponCode: selectedCouponCode,
          recipientEmail,
          message: message || undefined,
        });

        if (res.success) {
          toast.success('쿠폰이 선물되었습니다! 📧');
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/coupons');
          }
        }
      } else {
        // 링크 생성
        const res = await createGiftLink({
          couponCode: selectedCouponCode,
          message: message || undefined,
        });

        if (res.success && res.data?.giftUrl) {
          setGeneratedLink(res.data.giftUrl);
          toast.success('선물 링크가 생성되었습니다! 🎁');
        }
      }
    } catch (error) {
      toast.error('선물하기에 실패했습니다');
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const handleCopyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success('링크가 복사되었습니다');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLink = async () => {
    if (generatedLink && navigator.share) {
      try {
        await navigator.share({
          title: '쿠폰 선물',
          text: message || '선물이 도착했어요! 🎁',
          url: generatedLink,
        });
      } catch (error) {
        // 사용자가 공유를 취소한 경우
      }
    } else {
      handleCopyLink();
    }
  };

  // 링크 생성 완료 화면
  if (generatedLink) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">선물 링크 생성 완료</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>선물 준비 완료!</CardTitle>
            <CardDescription>아래 링크를 친구에게 공유하세요</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 선물할 쿠폰 정보 */}
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">선물 쿠폰</p>
              <p className="font-semibold">{selectedCoupon?.name}</p>
            </div>

            {/* 생성된 링크 */}
            <div className="flex items-center gap-2">
              <Input
                value={generatedLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={handleCopyLink}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* 공유 버튼 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4 mr-2" />
                링크 복사
              </Button>
              <Button className="flex-1" onClick={handleShareLink}>
                <Send className="h-4 w-4 mr-2" />
                공유하기
              </Button>
            </div>

            {/* 안내 */}
            <p className="text-xs text-muted-foreground text-center">
              링크를 받은 사람만 쿠폰을 수령할 수 있습니다.
              <br />
              링크는 쿠폰 유효기간까지 사용 가능합니다.
            </p>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full" onClick={handleBack}>
          쿠폰함으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">쿠폰 선물하기</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 쿠폰 선택 */}
        {!preselectedCoupon && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">선물할 쿠폰 선택</CardTitle>
            </CardHeader>
            <CardContent>
              {availableCoupons.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  선물 가능한 쿠폰이 없습니다
                </p>
              ) : (
                <Select
                  value={selectedCouponCode}
                  onValueChange={setSelectedCouponCode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="쿠폰을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCoupons.map((coupon) => (
                      <SelectItem key={coupon.code} value={coupon.code}>
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4" />
                          <span>{coupon.name}</span>
                          <span className="text-muted-foreground text-xs">
                            ({coupon.code})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
        )}

        {/* 선택된 쿠폰 표시 */}
        {selectedCoupon && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedCoupon.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCoupon.code}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 선물 방법 선택 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">선물 방법</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={giftMethod}
              onValueChange={(v) => setGiftMethod(v as GiftMethod)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  링크 생성
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  이메일 전송
                </TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  선물 링크를 생성하여 카카오톡, 문자 등으로 직접 공유할 수
                  있습니다.
                </p>
              </TabsContent>

              <TabsContent value="email" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">받는 사람 이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="friend@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 메시지 입력 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              선물 메시지 (선택)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="받는 분께 전할 메시지를 입력하세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {message.length}/200
            </p>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!selectedCouponCode || isLoading}
        >
          <Gift className="h-4 w-4 mr-2" />
          {giftMethod === 'link' ? '선물 링크 생성' : '이메일로 선물하기'}
        </Button>
      </form>

      {/* 확인 다이얼로그 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>쿠폰을 선물하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                {selectedCoupon?.name}
              </span>
              을(를) 선물하면 더 이상 본인이 사용할 수 없습니다.
              {giftMethod === 'email' && (
                <>
                  <br />
                  <span className="font-medium text-foreground">
                    {recipientEmail}
                  </span>
                  (으)로 선물 안내 이메일이 발송됩니다.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGift} disabled={isLoading}>
              {isLoading ? '처리 중...' : '선물하기'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
