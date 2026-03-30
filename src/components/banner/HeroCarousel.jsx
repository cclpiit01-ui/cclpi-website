import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// Import ang mga banner slides mo
import BannerOne from './BannerOne';
import BannerTwo from './BannerTwo';

const HeroCarousel = () => {
  return (
    <div className="w-full h-[85vh] md:h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade" // Smooth transition para sa professional look
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        className="w-full h-full"
      >
        <SwiperSlide>
          <BannerOne />
        </SwiperSlide>
        
        <SwiperSlide>
          <BannerTwo />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroCarousel;