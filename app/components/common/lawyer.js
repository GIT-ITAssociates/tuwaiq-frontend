"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import LawyerCard from "./card/lawyerCard";
import { useI18n } from "@/app/providers/i18n";
import { fetchAttorneys } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";

const Lawyer = () => {
  const i18n = useI18n();
    const [data, getData] = useFetch(fetchAttorneys);
  return (
    <div className=" min-h-fit work-sans text-black lawyer">
      <div className="custom-container  xl:pb-[150px] md:pb-14 pb-[60px] ">
        <div className=" text-center">
          <p className="section-subtitle ">{i18n?.t("Team")}</p>
          <h1 className="section-title text-[#242628]">{i18n?.t("The Face Of Justice")}</h1>
          <p className="section-description ">
            {i18n?.t("Meet our dedicated legal team, committed to providing expert advice and")}
            <span className="hidden md:inline">
              <br />
            </span>
            {i18n?.t("achieving the best outcomes for our clients personalized expertise.")}
          </p>
        </div>

        <div className="md:mt-[16px]">
          <Swiper
            slidesPerView={4}
            spaceBetween={24}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              240: {
                slidesPerView: 1,
                spaceBetween: 5,
              },
              320: {
                slidesPerView: 1,
                spaceBetween: 5,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="mySwiper"
          >
            {data?.docs?.map((data, index) => {
              return (
                <SwiperSlide key={index}>
                  <LawyerCard data={data} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Lawyer;