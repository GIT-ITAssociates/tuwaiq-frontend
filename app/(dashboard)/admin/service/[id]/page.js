"use client";
import Service_LawInfo from "@/app/components/service/service_law_info";
import { getServiceDetailsAdmin } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { columnFormatter } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
import Image from "next/image";
import React, { useEffect } from "react";

const page = ({ params }) => {
  const [data, getData, { loading }] = useFetch(getServiceDetailsAdmin, {});
  const i18n = useI18n();
  useEffect(() => {
    if (params?.id) {
      getData({ _id: params.id });
    }
  }, [data?._id]);
  return (
    <div className="min-h-fit  bg-white relative ">
      <div className="  text-black font-ebgaramond p-4 ">
        <Image
          width={1320}
          height={618}
          src={data?.image}
          alt="image"
          className="h-[618px] w-full object-center rounded-[20px]"
        />

        <div className="md:mt-[56px] mt-[28px] lg:mb-14">
          <h1 className="header-1 mb-[10px]">{columnFormatter(data?.name)}</h1>
          <p className="text-base md:leading-[27px] text-[#3A3D3F] ">
            {columnFormatter(data?.description)}
          </p>
        </div>

        <div className="text-[#242628]">
          <div className="lg:mt-0 mt-6">
            <h1 className="semi-header text-[#242628]  ">
              {i18n?.t("Key Areas of Family Law")}:
            </h1>
          </div>

          <div className="md:mt-[40px] mt-[20px]">
            {data?.feature?.map((info, idx) => {
              return (
                <Service_LawInfo
                key={idx}
                info={info}
                number={idx}
                ></Service_LawInfo>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default page;
