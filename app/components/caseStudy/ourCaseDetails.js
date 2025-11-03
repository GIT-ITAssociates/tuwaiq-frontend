
"use client";

import Image from "next/image";
import { columnFormatter } from "@/app/helpers/utils";
const OurCaseDetails = ({ data }) => {



  return (
    <div className="min-h-fit work-sans text-white relative">
      <div className="custom-container mb-[60px] text-black">
        <Image width={1320} height={618} src={data?.image} alt="case" />

        <div className="md:mt-[56px] mt-[28px] md:mb-14 lg:mb-[56px] ">
          <h1 className="header-1 mb-[10px]  md:mb-[1.5rem] lg:mb-[56px] w-full break-all text-[#242628]">
            {columnFormatter(data?.title)}
          </h1>
          <p className="text-base md:leading-[27px] w-full break-all text-[#3A3D3F] ">
            {columnFormatter(data?.short_description)}
          </p>
          <p className="text-base md:leading-[27px] text-[#3A3D3F] mt-6">
       {columnFormatter(data?.description)}
          </p>
          <p dangerouslySetInnerHTML={{ __html: columnFormatter(data?.feature)}} className="text-base md:leading-[27px] w-full break-all text-[#3A3D3F] mt-6"/>
       
        </div>

        <div>
          
        </div>
      </div>
    </div>
  );
};

export default OurCaseDetails;
