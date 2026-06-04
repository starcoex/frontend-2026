import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, Receipt, MapPin, Radio } from 'lucide-react';
import { PageHead } from '@starcoex-frontend/common';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_CONFIG } from '@/app/config/app.config';
import {
  SERVICE_TIERS,
  ServiceTier,
  ServiceTierCards,
} from '@/components/service-tier-cards';
import { ADDON_OPTIONS, AddonSelector } from '@/components/addon-selector';
import { VehicleInfo, VehicleInputForm } from '@/components/vehicel-input-form';
import { useAuth } from '@starcoex-frontend/auth';
import { useQueue } from '@starcoex-frontend/queue';
import { useGuestQueueModal } from '@/hooks/use-guest-queue-modal';
import { GuestInfoDialog } from '@/components/queue/guest-info-dialog';
import { useStoreQueue } from '@/hooks/use-store-queue';
import { cn } from '@/lib/utils';

// ─── 요금 계산 ────────────────────────────────────────────────────────────────

const BASE_PRICES: Record<ServiceTier, number> = {
  basic: 8000,
  star: 12000,
  sparkle: 18000,
};

const calcTierPrice = (tier: ServiceTier | null, rate: number) =>
  tier ? Math.round(BASE_PRICES[tier] * rate) : 0;

const calcAddonPrice = (selectedIds: string[]) =>
  ADDON_OPTIONS.filter((a) => selectedIds.includes(a.id)).reduce(
    (sum, a) => sum + a.price,
    0
  );

// ─── 지점 선택 ────────────────────────────────────────────────────────────────

interface StoreSelectorProps {
  selectedStoreId: number;
  onSelect: (id: number) => void;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
  selectedStoreId,
  onSelect,
}) => {
  const { storeMeta, getStatsById } = useStoreQueue();
  if (storeMeta.length === 0) return null;

  return (
    <div>
      <p className="text-muted-foreground font-mono text-[0.625rem] font-medium tracking-wider uppercase mb-3">
        지점 선택
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {storeMeta.map((store) => {
          const stats = getStatsById(store.storeId);
          const isSelected = selectedStoreId === store.storeId;
          const isOpen = stats?.isOpen ?? false;
          const waitingCount = stats?.waitingCount ?? 0;

          return (
            <motion.button
              key={store.storeId}
              onClick={() => onSelect(store.storeId)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={cn(
                'w-full text-left rounded-xl border-2 p-4 transition-all duration-200',
                isSelected
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
                  : 'border-border bg-card hover:border-cyan-300 dark:hover:border-cyan-700'
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {isOpen && (
                    <Radio className="w-3 h-3 text-cyan-500 animate-pulse shrink-0" />
                  )}
                  <span className="font-semibold text-sm text-foreground">
                    {store.label}
                  </span>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                    isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-border'
                  )}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {!isOpen ? (
                <span className="text-xs text-muted-foreground">운영 종료</span>
              ) : waitingCount === 0 ? (
                <Badge
                  variant="outline"
                  className="text-xs border-green-500/40 text-green-600 dark:text-green-400 bg-green-500/10"
                >
                  🟢 즉시 입장 가능
                </Badge>
              ) : (
                <span className="text-xs text-amber-500 font-medium">
                  대기 {waitingCount}대 · 약 {stats?.estimatedWaitMin}분
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3 inline mr-1" />
        지점 상세 정보는{' '}
        <Link
          to={APP_CONFIG.routes.stores}
          className="text-cyan-500 hover:text-cyan-400 underline underline-offset-2"
        >
          지점 찾기
        </Link>
        에서 확인하세요.
      </p>
    </div>
  );
};

// ─── 주문 요약 ────────────────────────────────────────────────────────────────

interface OrderSummaryProps {
  selectedTier: ServiceTier | null;
  selectedAddons: string[];
  vehicle: VehicleInfo | null;
  tierPrice: number;
  addonPrice: number;
  totalPrice: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedTier,
  selectedAddons,
  vehicle,
  tierPrice,
  addonPrice,
  totalPrice,
}) => {
  const tierInfo = SERVICE_TIERS.find((t) => t.id === selectedTier);
  const selectedAddonItems = ADDON_OPTIONS.filter((a) =>
    selectedAddons.includes(a.id)
  );
  if (!selectedTier) return null;

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3 pt-4 px-5">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Receipt className="w-4 h-4 text-muted-foreground" />
          주문 요약
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-4 space-y-2">
        {tierInfo && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {tierInfo.emoji} {tierInfo.label}
            </span>
            <span className="font-medium">₩{tierPrice.toLocaleString()}</span>
          </div>
        )}
        {vehicle && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>차종 ({vehicle.modelName})</span>
            <Badge variant="secondary" className="text-xs">
              ×{vehicle.priceRate.toFixed(1)}
            </Badge>
          </div>
        )}
        {selectedAddonItems.map((addon) => (
          <div
            key={addon.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">
              {addon.emoji} {addon.name}
            </span>
            <span className="font-medium">
              +₩{addon.price.toLocaleString()}
            </span>
          </div>
        ))}
        <Separator />
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">합계</span>
          <span className="text-xl font-bold text-foreground">
            ₩{totalPrice.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export const SpeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { isAuthenticated, currentUser } = useAuth();
  const { createQueueSession, createGuestQueueSession } = useQueue();
  const guestModal = useGuestQueueModal();

  const [selectedStoreId, setSelectedStoreId] = useState<number>(
    Number(searchParams.get('storeId') ?? 0)
  );
  const [selectedTier, setSelectedTier] = useState<ServiceTier | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);

  const priceRate = vehicle?.priceRate ?? 1.0;
  const tierPrice = calcTierPrice(selectedTier, priceRate);
  const addonPrice = calcAddonPrice(selectedAddons);
  const totalPrice = tierPrice + addonPrice;

  const handleAddonToggle = (id: string) =>
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const handlePayment = async () => {
    if (!selectedStoreId) {
      toast.error('지점을 먼저 선택해 주세요.');
      return;
    }
    if (!selectedTier) {
      toast.error('세차 코스를 먼저 선택해 주세요.');
      return;
    }

    if (isAuthenticated && currentUser) {
      const res = await createQueueSession({
        storeId: selectedStoreId,
        serviceId: 1,
        walkInId: 1,
        userId: currentUser.id,
      });
      if (res.success) {
        toast.success(
          `대기 등록 완료! 티켓: ${res.data?.session?.ticketNumber}`
        );
        navigate(`/queue-status?ticket=${res.data?.session?.redisTicketId}`);
      } else {
        toast.error(res.error?.message ?? '접수에 실패했습니다.');
      }
    } else {
      const guestInfo = await guestModal.prompt();
      if (!guestInfo) return;
      const res = await createGuestQueueSession({
        storeId: selectedStoreId,
        serviceId: 1,
        walkInId: 1,
        guestName: guestInfo.guestName,
        guestPhone: guestInfo.guestPhone,
        guestVehicleNumber: guestInfo.guestVehicleNumber,
      });
      if (res.success) {
        toast.success(
          `대기 등록 완료! 티켓: ${res.data?.session?.ticketNumber}`
        );
        navigate(`/queue-status?ticket=${res.data?.session?.redisTicketId}`);
      } else {
        toast.error(res.error?.message ?? '접수에 실패했습니다.');
      }
    }
  };

  return (
    <>
      <PageHead
        title={`${APP_CONFIG.seo.pages.booking.title} - ${APP_CONFIG.seo.siteName}`}
        description={APP_CONFIG.seo.pages.booking.description}
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/speed`}
        robots="noindex"
      />

      {/*
        ✅ about-page 패턴과 동일:
           - 내부 sticky 헤더 완전 제거
           - py-20 으로 Navbar 아래에서 자연스럽게 시작
           - 뒤로가기 버튼은 콘텐츠 상단에 인라인으로 배치
      */}
      <div className="min-h-screen bg-background py-20 pb-36">
        <div className="container max-w-2xl mx-auto px-4 space-y-8">
          {/* 뒤로가기 + 페이지 제목 — 인라인 배치 */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-2xl leading-none tracking-tight text-foreground">
                ⚡ 스피드 존
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                10분 외부 손세차 · 예약 없이 즉시 접수
              </p>
            </div>
            {totalPrice > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Badge
                  variant="outline"
                  className="border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 font-bold"
                >
                  ₩{totalPrice.toLocaleString()}
                </Badge>
              </motion.div>
            )}
          </div>

          <Separator />

          {/* 1. 지점 선택 */}
          <motion.div
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <StoreSelector
              selectedStoreId={selectedStoreId}
              onSelect={setSelectedStoreId}
            />
          </motion.div>

          <Separator />

          {/* 2. 세차 코스 선택 */}
          <ServiceTierCards
            selectedTier={selectedTier}
            vehiclePriceRate={priceRate}
            onSelect={setSelectedTier}
          />

          <Separator />

          {/* 3. 애드온 선택 */}
          <AddonSelector
            selectedAddons={selectedAddons}
            onToggle={handleAddonToggle}
          />

          <Separator />

          {/* 4. 차량 확인 */}
          <VehicleInputForm onVehicleFound={setVehicle} />

          <Separator />

          {/* 5. 주문 요약 */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <OrderSummary
              selectedTier={selectedTier}
              selectedAddons={selectedAddons}
              vehicle={vehicle}
              tierPrice={tierPrice}
              addonPrice={addonPrice}
              totalPrice={totalPrice}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Sticky 결제 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                {!selectedStoreId
                  ? '지점을 먼저 선택해 주세요'
                  : selectedTier
                  ? `${
                      SERVICE_TIERS.find((t) => t.id === selectedTier)?.label
                    }${
                      selectedAddons.length > 0
                        ? ` + 애드온 ${selectedAddons.length}개`
                        : ''
                    }`
                  : '세차 코스를 선택해 주세요'}
              </p>
              <motion.p
                key={totalPrice}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-foreground"
              >
                ₩{totalPrice > 0 ? totalPrice.toLocaleString() : '—'}
              </motion.p>
            </div>
            <Button
              size="lg"
              onClick={handlePayment}
              disabled={!selectedTier || !selectedStoreId}
              className={
                selectedTier && selectedStoreId
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 shadow-lg shadow-cyan-500/20'
                  : 'bg-muted text-muted-foreground cursor-not-allowed px-8'
              }
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              결제 & 대기 등록
            </Button>
          </div>
        </div>
      </div>

      <GuestInfoDialog
        open={guestModal.isOpen}
        onConfirm={guestModal.confirm}
        onCancel={guestModal.cancel}
      />
    </>
  );
};
