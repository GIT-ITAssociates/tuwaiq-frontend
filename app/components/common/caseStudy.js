"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import Button from "./button";
import CaseCard from "./card/caseCard";
import { useFetch } from "@/app/helpers/hooks";
import { getCaseStudyAll } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
import { useRouter } from "next/navigation";


const CaseStudy = () => {
  const i18n  = useI18n();
  const [data, getData] = useFetch(getCaseStudyAll);
  const router = useRouter();
  return (
    <div className="case-study text-black">
      <div className="custom-container  xl:pb-[150px] md:pb-14 pb-[60px] ">
        <div className=" text-center sm:text-start">
          <p className="section-subtitle">{i18n?.t("Case Study")}</p>
          <h1 className="section-title text-[#242628]">
            {i18n?.t("Our Recent Case Project.")}
          </h1>
          <p className="section-description">
            {i18n?.t("Learn how we achieve results through expertise, dedication, and tailored")}
            <br className="hidden md:inline" />
            {i18n?.t("solutions to meet client goals.")}
          </p>
        </div>

        <div className="md:pt-[16px]">
          <Swiper
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
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="mySwiper"
          >
            {
              data?.docs?.map((data,index)=>{
                return (
                  <SwiperSlide key={index}>
                  <CaseCard data={data}/>
                  </SwiperSlide>
                )
              })
            }
       </Swiper>
        </div>
        <div className="flex justify-center text-center md:mt-[50px] mt-[27px]">
          <Button onClick={() => router.push("/caseStudy")} >
            {i18n?.t("View All")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseStudy;