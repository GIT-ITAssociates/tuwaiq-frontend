 "use client";
import Service_LawInfo from "./service_law_info";
import Image from "next/image";
import { columnFormatter } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
const OurServiceDetails = ({data}) => {
const i18n=useI18n();
return (
    <div className="min-h-fit  text-white relative">
      <div className="custom-container xl:mb-[150px] md:mb-14 mb-[60px]  text-black eb-garamond">
        <Image width={1320} height={618} src={data?.image} alt="image" className="lg:h-[618px] sm:h-[540px] h-[310px] w-full object-center rounded-[20px]"/>

        <div className="md:mt-[56px] mt-[28px] lg:mb-14">
          <h1 className="header-1 mb-[10px] text-[#242628]">
            {columnFormatter(data?.name)}
          </h1>
          <p className="text-base md:leading-[27px] text-[#3A3D3F] w-full break-all ">
           {columnFormatter(data?.description)}
          </p>
        </div>

        <div className="text-[#242628]">
          <div className="lg:mt-0 mt-6">
            <h1 className="semi-header text-[#242628]  ">
             {i18n.t('Key Areas of Family Law:')} 
            </h1>
          </div>
 
          <div>
            {
               data?.feature?.map((info, idx) => <Service_LawInfo
               key={idx}
               info={info}
               number={idx}
               ></Service_LawInfo>)
            }
          </div>
         </div>
        <div className="lg:mt-14 mt-6 w-full break-all "dangerouslySetInnerHTML={{ __html: columnFormatter(data?.other_description) }}>
        </div>
        </div>
    </div>
  );
};

export default OurServiceDetails;


