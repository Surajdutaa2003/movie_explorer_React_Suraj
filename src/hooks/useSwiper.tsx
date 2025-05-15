// import { useRef, useCallback } from 'react';
// import SwiperCore from 'swiper';

// interface UseSwiperProps {
//   onMouseEnter?: () => void;
//   onMouseLeave?: () => void;
// }

// const useSwiper = ({ onMouseEnter, onMouseLeave }: UseSwiperProps = {}) => {
//   const swiperRef = useRef<SwiperCore | null>(null);

//   const handleMouseEnter = useCallback(() => {
//     swiperRef.current?.autoplay?.stop();
//     onMouseEnter?.();
//   }, [onMouseEnter]);

//   const handleMouseLeave = useCallback(() => {
//     swiperRef.current?.autoplay?.start();
//     onMouseLeave?.();
//   }, [onMouseLeave]);

//   const setSwiperRef = useCallback((swiper: SwiperCore) => {
//     swiperRef.current = swiper;
//   }, []);

//   return {
//     swiperRef,
//     setSwiperRef,
//     handleMouseEnter,
//     handleMouseLeave
//   };
// };

// export default useSwiper;
// // ss


import { useRef, useCallback, JSX } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

interface SlideItem {
  id?: number | string; // For movies (id: number) or actors (index-based)
  [key: string]: any; // Flexible for movies or actors
}

interface UseSwiperProps<T extends SlideItem> {
  items: T[];
  renderSlide: (item: T) => JSX.Element;
  slidesPerView?: number;
  spaceBetween?: number;
  autoplayDelay?: number;
  loop?: boolean;
  breakpoints?: { [width: number]: { slidesPerView: number } };
  navigationPrefix: string; // Unique prefix for navigation buttons (e.g., 'all', 'trending')
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const useSwiper = <T extends SlideItem>({
  items,
  renderSlide,
  slidesPerView = 2,
  spaceBetween = 10,
  autoplayDelay = 3000,
  loop = true,
  breakpoints = {
    640: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
  },
  navigationPrefix,
  onMouseEnter,
  onMouseLeave,
}: UseSwiperProps<T>) => {
  const swiperRef = useRef<SwiperCore | null>(null);

  const handleMouseEnter = useCallback(() => {
    swiperRef.current?.autoplay?.stop();
    onMouseEnter?.();
  }, [onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    swiperRef.current?.autoplay?.start();
    onMouseLeave?.();
  }, [onMouseLeave]);

  const setSwiperRef = useCallback((swiper: SwiperCore) => {
    swiperRef.current = swiper;
  }, []);

  const SwiperComponent = () => (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Swiper
        onSwiper={setSwiperRef}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        loop={loop && items.length >= slidesPerView}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
        navigation={{
          nextEl: `.custom-next-${navigationPrefix}`,
          prevEl: `.custom-prev-${navigationPrefix}`,
          disabledClass: 'swiper-button-disabled',
          hiddenClass: 'swiper-button-hidden',
        }}
        modules={[Autoplay, Navigation]}
        breakpoints={breakpoints}
        speed={600}
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.id || index}>
            {renderSlide(item)}
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        className={`custom-prev-${navigationPrefix} absolute top-1/2 left-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10`}
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        className={`custom-next-${navigationPrefix} absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-800 bg-white p-2 rounded-full shadow-lg cursor-pointer z-10`}
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );

  return {
    SwiperComponent,
    swiperRef,
    setSwiperRef,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useSwiper;