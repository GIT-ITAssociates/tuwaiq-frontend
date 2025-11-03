import { columnFormatter } from "@/app/helpers/utils";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

const ServiceCard = ({ data }) => {
  return (
    <div className="relative serviceCard group">
      <div
        className="border border-opacity-[50%] h-[340px] max-w-[312px] sm:mx-0 mx-auto duration-700 transition-all bg-white group hover:border-[#B68C5A] hover:bg-[#B68C5A]  space-y-6 text-black flex flex-col justify-between items-center p-4 text-center  rounded-[10px] hover:text-white relative"
        style={{ boxShadow: "0px 0px 20px 0px #0000001A" }}
      >
        <Image
          height={100}
          width={100}
          className="absolute bottom-0 right-0 group-hover:hidden duration-700 transition-all"
          src="/images/practice-design.png"
          alt=""
        />
        <Image
          height={100}
          width={100}
          className="absolute bottom-0 right-0 group-hover:block  duration-700 transition-all"
          src="/images/practiceStyleWhite.png"
          alt=""
        />
        <div className="flex-none md:w-[60px] md:h-[60px] w-11 h-11 rounded-full bg-red-100 flex justify-center items-center">
          <Image
            width={50}
            height={50}
            className="md:w-11 md:h-11 w-7 h-7"
            src={data?.icon}
            alt=""
          />
        </div>
        <p className="text-xl font-semibold text-[#242628] duration-300 transition-all group-hover:text-white line-clamp-1">
          {columnFormatter(data?.name)}
        </p>
        <p className="text-base line-clamp-3 !mb-[14px] text-[#3A3D3F] group-hover:text-white duration-300 transition-all">
          {columnFormatter(data?.description)}
        </p>
        <Link href={`/service/${data?._id}`}>
          <div className="h-10 w-10  rounded-full bg-[#F9EAF3] hover:bg-white  flex justify-center items-center  duration-700 transition-all cursor-pointer">
            <FaArrowRight className="text-primary text-[20px]"></FaArrowRight>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
