import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

interface CustomSwiperProps {
  items: any[];
  renderItem: (item: any) => React.ReactNode;
  sectionName: string;
  slidesPerView?: number;
  spaceBetween?: number;
  autoplayDelay?: number;
}

const CustomSwiper: React.FC<CustomSwiperProps> = ({
  items,
  renderItem,
  sectionName,
  slidesPerView = 2,
  spaceBetween = 10,
  autoplayDelay = 3000,
}) => {
  const swiperRef = useRef<SwiperCore | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay?.start()}
    >
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        loop={items.length >= 2}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
        navigation={{
          nextEl: `.custom-next-${sectionName}`,
          prevEl: `.custom-prev-${sectionName}`,
        }}
        modules={[Autoplay, Navigation]}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        speed={600}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>{renderItem(item)}</SwiperSlide>
        ))}
      </Swiper>
      <button
        className={`custom-prev-${sectionName} absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10`}
      >
        ←
      </button>
      <button
        className={`custom-next-${sectionName} absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10`}
      >
        →
      </button>
    </div>
  );
};

export default CustomSwiper;