"use client";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { LiaAngleRightSolid, LiaAngleLeftSolid } from "react-icons/lia";
import Link from "next/link";
import ServiceCard from "./card/serviceCard";
import Image from "next/image";
import { getServiceAll } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useI18n } from "@/app/providers/i18n";

const Service = () => {
  let swiperRef = useRef(null);
  const i18n = useI18n();
    const [services, getServices, { loading }] = useFetch(getServiceAll,{});
    const [data, setData] = useState(services);
    useEffect(() => {
      setData(services?.docs);
    }, [services]);
  
  return (
    <div className="bg-gradient-to-r from-[#0C0C15] to-[#3F4069] min-h-fit work-sans text-white relative service  xl:mb-[150px] md:mb-14 mb-[60px]">
      <div className="hidden 2xl:block absolute top-0">
        <Image  width={246} height={336} className="opacity-[10%]" src="/images/practiceDesign.png" alt="..."/>
      </div>
      <div className="hidden 2xl:block absolute bottom-0">
      <Image  width={2829.07} height={606} className="" src={"/images/practice-round-design.png"} alt="..." />
      </div>

      <div className="custom-container md:py-[62px] pt-[29px] pb-[38px] ">
        <div className="sm:px-0 px-3 ">
          <div className="sm:text-start text-center">
            <p className="section-subtitle">{i18n?.t("Service")}</p>

            <h1 className="section-title text-white">{i18n?.t("Our Practice Area")}</h1>
          </div>

          <div className="flex justify-between items-center">
            <p className="section-description" style={{ color: "white" }}>
              {i18n?.t("Our legal services protect your rights and deliver results with")}
              <br className="" />
              {i18n?.t("personalized expertise.")}
            </p>
            <div className="hidden md:block">
              <div className="flex items-center gap-5">
                <div
                  onClick={() => swiperRef.current.slidePrev()}
                  className="w-[50px] h-[50px] rounded-full border group hover:border-[#B68C5A] flex justify-center items-center cursor-pointer duration-300 transition-all"
                >
                  <LiaAngleLeftSolid className="text-white text-[24px] group-hover:text-primary duration-300 transition-all" />{" "}
                </div>
                <div
                  onClick={() => swiperRef.current.slideNext()}
                  className="w-[50px] h-[50px] rounded-full border group hover:border-[#B68C5A] flex justify-center items-center cursor-pointer duration-300 transition-all"
                >
                  <LiaAngleRightSolid className="text-white text-[24px] group-hover:text-primary duration-300 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:mt-[16px] work-sans ">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
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
              425: {
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
            }}
            className="mySwiper"
          >
            {data?.map((i, index) => {
              return (
                <SwiperSlide key={index}>
                  {" "}
                  <ServiceCard data={i} />{" "}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="md:hidden block mt-6">
          <div className="flex justify-center items-center gap-5">
            <div
              onClick={() => swiperRef.current.slidePrev()}
              className="w-[50px] h-[50px] rounded-full border group hover:border-[#B68C5A] flex justify-center items-center cursor-pointer"
            >
              <LiaAngleLeftSolid className="text-white text-[24px] group-hover:text-primary " />
            </div>
            <div
              onClick={() => swiperRef.current.slideNext()}
              className="w-[50px] h-[50px] rounded-full border group hover:border-[#B68C5A] flex justify-center items-center cursor-pointer duration-300 transition-all"
            >
              <LiaAngleRightSolid className="text-white text-[24px] group-hover:text-primary duration-300 transition-all" />
            </div>
          </div>
        </div>
        <div className="flex md:justify-end justify-center md:pt-[50px] pt-[38px] cursor-pointer duration-300 transition-all">
          <Link
            className="px-[32px] py-[16px] bg-primary text-white font-medium text-[18px] leading-[24px] font-sans rounded-[8px] duration-300 transition-all"
            href="/service"
            style={{ zIndex: "150" }}
          >
            {i18n?.t("See all Service")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Service;
