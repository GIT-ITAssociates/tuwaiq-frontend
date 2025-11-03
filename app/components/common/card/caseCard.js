"use client";
import { RxBorderSolid } from "react-icons/rx";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";
import { columnFormatter } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
const CaseCard = ({ data }) => {
  const i18n = useI18n();
  
  return (
    <div
      className="w-full bg-white border border-[#E0E0E0] text-black group rounded-[10px] lg:pb-[30px] md:pb-[19px] pb-[17px] overflow-hidden"
      style={{
        boxShadow: "0px 4px 25px 0px #00000014",
      }}
    >
      <div className="w-full h-[254px] overflow-hidden">
        <Image width={424} height={254} src={data?.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-125 duration-500" />
      </div>
      <div className="lg:px-6 px-3 text-start  flex flex-col items-start ">
        <p className="font-medium my-[24px] lg:h-[62px] md:h-[48px] h-[62px]  lg:text-lg text-base text-[#242628] lg:leading-[30px] text-ellipsis line-clamp-2">
          {columnFormatter(data?.title)}
        </p>
        <p className=" lg:text-base w-full break-all text-sm mb-[40px]  h-[62px] text-[#3A3D3F] lg:leading-7 text-ellipsis line-clamp-2">
          {columnFormatter(data?.description)}
        </p>

        <Link
          className="flex group hover:bg-[#B68C5A] duration-300 uppercase transition-all text-[18px] h-[48px] leading-[28px] font-medium font-sans hover:text-white items-center gap-[10px] px-[24px] py-[18px] border rounded-[4px] hover:border-[#B68C5A] border-[#E0E0E0]"
          href={`/caseStudy/${data?._id}`}
        >
          {i18n?.t("Read More")} <RxBorderSolid className="rotate-90 text-[16px]" />{" "}
          <BsArrowRight className="text-[18px]" />
        </Link>
      </div>
    </div>
  );
};

export default CaseCard;
