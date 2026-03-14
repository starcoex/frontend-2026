import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ImageIcon } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ProductImageGalleryProps {
  imageUrls: string[];
  productName?: string;
}

export default function ProductImageGallery({
  imageUrls,
  productName = '제품 이미지',
}: ProductImageGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  if (imageUrls.length === 0) {
    return (
      <div className="sticky top-20 flex aspect-square w-full items-center justify-center rounded-lg border bg-muted">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon className="size-12 opacity-40" />
          <p className="text-sm">이미지 없음</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-20 space-y-4">
      <Swiper
        style={
          {
            '--swiper-navigation-color': 'var(--primary)',
            '--swiper-pagination-color': 'var(--primary)',
          } as React.CSSProperties
        }
        loop={imageUrls.length > 1}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {imageUrls.map((url, key) => (
          <SwiperSlide key={key}>
            <img
              src={url}
              className="aspect-3/2 w-full rounded-lg object-contain lg:aspect-square"
              width={300}
              height={300}
              alt={`${productName} ${key + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {imageUrls.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={imageUrls.length > 1}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper mt-2"
        >
          {imageUrls.map((url, key) => (
            <SwiperSlide key={key} className="group">
              <figure className="group-[.swiper-slide-thumb-active]:border-primary overflow-hidden rounded-lg border opacity-70 group-[.swiper-slide-thumb-active]:opacity-100!">
                <img
                  className="aspect-square w-full object-contain"
                  src={url}
                  width={300}
                  height={300}
                  alt={`${productName} 썸네일 ${key + 1}`}
                />
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
