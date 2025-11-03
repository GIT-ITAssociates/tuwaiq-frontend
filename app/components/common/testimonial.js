"use client";
import { MdChevronLeft } from "react-icons/md";
import { MdChevronRight } from "react-icons/md";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import TestimonialCard from "./card/testimonialCard";
import Image from "next/image";
import { allTestimonial } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useI18n } from "@/app/providers/i18n";

const Testimonial = () => {
  const [data] = useFetch(allTestimonial);
  let sliderRef = useRef(null);
  const i18n = useI18n();

  return (
    <div className="bg-gradient-to-r from-[#0C0C15] to-[#3F4069] min-h-fit work-sans text-white relative z-40 testimonial  xl:mb-[150px] md:mb-14 mb-[60px]">
      <div className="hidden 2xl:block absolute bottom-0">
        <Image
          className="opacity-[10%]"
          src={"/images/testi-left.png"}
          width={268} height={336}
          alt="..."
        />
      </div>
      <div className="hidden 2xl:block absolute right-0">
        <Image
          className="opacity-[10%]"
          width={268} height={336}

          src={"/images/testi-right.png"}
          alt="..."
        />{" "}
      </div>

      <div className="custom-container lg:py-[130px] md:py-[80px] py-[29px] ">
        <div className="flex flex-col md:flex-row w-full lg:gap-[47px] md:gap-7 gap-5">
          <div className="w-full md:w-2/3  font-sans md:order-1 order-2">
            <Swiper
              onSwiper={(swiper) => (sliderRef.current = swiper)}
              slidesPerView={4}
              spaceBetween={24}
              pagination={{
                clickable: true,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 5,
                },
                500: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
              }}
              className="mySwiper"
            >
              {data?.docs?.map((data, index) => {
                return (
                  <SwiperSlide key={index}>
                    <TestimonialCard data={data} />
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="md:hidden block mt-[20px]">
              <div className="flex md:justify-start justify-center gap-4">
                <div
                  onClick={() => sliderRef.current.slidePrev()}
                  className="cursor-pointer w-[50px] h-[50px] rounded-full border bg-white hover:bg-primary hover:border-primary flex justify-center items-center duration-300 transition-all"
                >
                  <MdChevronLeft className="hover:text-white text-black text-2xl duration-300 transition-all" />
                </div>
                <div
                  onClick={() => sliderRef.current.slideNext()}
                  className="cursor-pointer w-[50px] h-[50px] rounded-full border bg-white hover:bg-primary hover:border-primary flex justify-center items-center duration-300 transition-all"
                >
                  <MdChevronRight className="hover:text-white text-black text-2xl duration-300 transition-all" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center flex-col  md:text-start text-center md:order-2 order-1">
            <p className="section-subtitle">{i18n?.t("Testimonials")}</p>

            <h1 className="section-title " style={{ paddingTop: "2px" }}>
              {i18n?.t("What Our Client Say")}
              <span className="text-[#D4AF37]"> {i18n?.t("About Us")}</span>
            </h1>

            <p
              className="section-description"
              style={{ color: "white", paddingTop: "2px" }}
            >
              {i18n?.t("Our clients' words reflect trust, expertise, and exceptional results.")}
            </p>
            <div className="hidden md:block mt-[-4px]">
              <div className="flex md:justify-start justify-center gap-4">
                <div
                  onClick={() => sliderRef.current.slidePrev()}
                  className="cursor-pointer w-[50px] h-[50px] rounded-full border group bg-white hover:bg-primary hover:border-primary flex justify-center items-center duration-300 transition-all"
                >
                  <MdChevronLeft className="group-hover:text-white text-black text-2xl duration-300 transition-all" />
                </div>
                <div
                  onClick={() => sliderRef.current.slideNext()}
                  className="cursor-pointer w-[50px] h-[50px] group rounded-full border bg-white hover:bg-primary hover:border-primary flex justify-center items-center duration-300 transition-all"
                >
                  <MdChevronRight className="group-hover:text-white text-black text-2xl  duration-300 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
