import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { Play, Droplets, Wind, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  { label: '온수 고압 예비세정', color: 'bg-cyan-500' },
  { label: '버블도포', color: 'bg-blue-500' },
  { label: '양모미트 핸드워시', color: 'bg-cyan-600' },
  { label: '에어 건조', color: 'bg-sky-500' },
  { label: '극세사 마무리', color: 'bg-blue-600' },
] as const;

// 실제 작업 사진으로 교체하세요
// public/images/wash-process/ 폴더에 넣어두면 됩니다
const GALLERY_ITEMS = [
  {
    id: 'main',
    src: '/images/wash-process/main-wash.webp',
    alt: '별표 외부 손세차 작업 현장',
    badge: '별표 손세차',
    badgeColor: 'bg-green-500',
    span: 'col-span-2 row-span-2', // 메인 이미지 크게
  },
  {
    id: 'bubble',
    src: '/images/wash-process/bubble.webp',
    alt: '풍성한 버블도포',
    badge: '버블도포',
    badgeColor: 'bg-cyan-500',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'rinse',
    src: '/images/wash-process/high-pressure.webp',
    alt: '온수 고압 세척',
    badge: '고압세척',
    badgeColor: 'bg-blue-500',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'tyre',
    src: '/images/wash-process/tyre-dressing.webp',
    alt: '타이어 드레싱',
    badge: '타이어 드레싱',
    badgeColor: 'bg-orange-500',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'finish',
    src: '/images/wash-process/finish.webp',
    alt: '극세사 마무리',
    badge: '마무리',
    badgeColor: 'bg-purple-500',
    span: 'col-span-1 row-span-1',
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

// ─── 재생 버튼 오버레이 ───────────────────────────────────────────────────────

function VideoOverlay({ onPlay }: { onPlay: () => void }) {
  return (
    <motion.button
      className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-10 group"
      onClick={onPlay}
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
      aria-label="세차 영상 재생"
    >
      <motion.div
        className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Play className="w-6 h-6 text-cyan-600 ml-1" fill="currentColor" />
      </motion.div>
      <span className="absolute bottom-6 text-white font-mono text-xs tracking-wider">
        세차 과정 영상 보기
      </span>
    </motion.button>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export function CarWashPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // web-preview.tsx 동일 스크롤 드리븐 애니메이션
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'start 35%'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.4, 1]);

  return (
    <section className="py-20 md:py-28 overflow-x-clip">
      <div className="container">
        {/* ── 헤더 — web-preview.tsx 패턴 동일 */}
        <div className="mb-12 gap-4 md:mb-20 md:flex md:items-end md:justify-between">
          <div>
            <motion.span
              className="text-cyan-500 mb-4 block font-mono text-xs font-medium tracking-wider uppercase"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              작업 현장
            </motion.span>
            <motion.h2
              className="text-4xl leading-none tracking-tighter font-extrabold md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
              손으로 직접,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                매 차량 동일하게
              </span>
            </motion.h2>
            <motion.p
              className="text-muted-foreground mt-4 max-w-lg text-lg leading-relaxed"
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              기계가 아닌 전문 디테일러의 손으로. 온수 고압부터 극세사
              마무리까지 5단계 공정.
            </motion.p>
          </div>

          {/* 우측: 공정 뱃지 — web-preview의 PLATFORMS 뱃지 패턴 */}
          <motion.div
            className="mt-8 md:mt-0"
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
          >
            <p className="text-muted-foreground mb-2 font-mono text-[0.625rem] tracking-wider uppercase md:text-right">
              5단계 세차 공정
            </p>
            <div className="flex flex-wrap gap-1.5 md:justify-end">
              {PROCESS_STEPS.map((step) => (
                <Badge
                  key={step.label}
                  variant="outline"
                  className="text-xs border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300"
                >
                  {step.label}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── 메인 이미지/영상 — web-preview.tsx 스크롤 드리븐 진입 패턴 */}
      <div className="container">
        <div style={{ perspective: '2000px' }}>
          <motion.div
            ref={ref}
            style={{ y, opacity, scale, rotateX }}
            className="relative"
          >
            {/* 글로우 효과 */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-32 -z-10"
              style={{ scale: glowScale, opacity: glowOpacity }}
            >
              <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-[120px] will-change-transform" />
            </motion.div>

            {/* ── 메인 작업 영상 or 이미지 그리드 */}
            <div
              className="ring-foreground/[0.06] relative overflow-hidden rounded-2xl ring-1"
              style={{
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.02), 0 4px 8px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.06), 0 48px 96px rgba(0,0,0,0.08)',
              }}
            >
              {/* 상단 하이라이트 선 */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
              />

              {/* 메인 영상 — YouTube 숏츠 or 직접 촬영 영상 */}
              <div className="relative aspect-video bg-gray-900">
                {videoPlaying ? (
                  // 실제 영상 URL로 교체하세요
                  <iframe
                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=0&rel=0"
                    className="w-full h-full"
                    allow="autoplay; fullscreen"
                    title="제라게 카케어 세차 과정"
                  />
                ) : (
                  <>
                    {/* 썸네일 이미지 */}
                    <img
                      src="/images/wash-process/video-thumbnail.webp"
                      alt="제라게 카케어 세차 과정 영상"
                      className="w-full h-full object-cover"
                    />
                    <VideoOverlay onPlay={() => setVideoPlaying(true)} />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── 하단 작업 사진 4컷 그리드 */}
        <motion.div
          className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          {[
            {
              src: '/images/wash-process/bubble.webp',
              label: '버블도포',
              icon: <Droplets className="w-3 h-3" />,
            },
            {
              src: '/images/wash-process/high-pressure.webp',
              label: '온수고압',
              icon: <Wind className="w-3 h-3" />,
            },
            {
              src: '/images/wash-process/tyre-dressing.webp',
              label: '타이어드레싱',
              icon: <Star className="w-3 h-3" />,
            },
            {
              src: '/images/wash-process/finish.webp',
              label: '마무리',
              icon: <Droplets className="w-3 h-3" />,
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-muted"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              custom={i}
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-cyan-400">{item.icon}</span>
                <span className="text-white font-mono text-[10px] font-medium tracking-wider">
                  {item.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── 인스타그램 연결 안내 */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
        >
          <div className="h-px flex-1 bg-border" />
          <a
            href="https://www.instagram.com/jeju_zeragae"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            더 많은 작업 사진 보기 @jeju_zeragae
          </a>
          <div className="h-px flex-1 bg-border" />
        </motion.div>
      </div>
    </section>
  );
}
