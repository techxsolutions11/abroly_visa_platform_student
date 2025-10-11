import React from 'react'
import ReactCountryFlag from 'react-country-flag';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const HomePageFlags = () => {


  const countryCodes = ['IN', 'US', 'GB', 'CA', 'AU', 'DE', 'FR', 'BR', 'JP', 'CN', 'RU', 'MX', 'ZA', 'IT', 'ES', 'NL', 'KR', 'AE', 'SG'];


  return (
    <div>

      <h1 className='text-3xl text-center pb-4'>Countries we serve</h1>
      <Swiper
        modules={[Navigation, Autoplay]} 
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoHeight={true}
        // navigation={true}
        className="swiper-container"
        autoplay={{
          delay: 2500, 
          disableOnInteraction: false, 
        }}
        breakpoints={{
          0: { // For extra small screens (e.g., mobile)
            slidesPerView: 1,
          },
          640: { // For screens larger than 640px (e.g., tablets and up)
            slidesPerView: 5, // 2 slides for wider screens
          }
        }}
      >
        {countryCodes.map((item: any, index: number) => (
          <SwiperSlide key={index} className="swiper-slide w-auto h-auto p-1">
            <ReactCountryFlag
              countryCode={item}
              svg={true}
              style={{ width: "20em", height: "auto" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>


    </div>
  )
}

export default HomePageFlags