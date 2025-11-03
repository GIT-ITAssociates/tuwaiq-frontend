"use client";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";

const LawyerCard = ({ data }) => {
  return (
    <Link href={`/team/${data?._id}`}>
    <div
      className="w-full  group  flex flex-col  border  text-center text-[#242628] rounded-[10px]  px-4 pt-4 pb-6 "
      style={{ boxShadow: "0px 0px 20px 0px #0000001A" }}
      >
      <div className="!h-[280px] !w-full">
        <Image width={280} height={280} className="rounded-t-[10px] !w-full !h-full object-cover" src={data?.image ? data?.image : "/default.jpg"} alt="" />
      </div>

      <div>
        <p className="text-lg font-semibold text-[#242628] group-hover:text-[#B68C5A] cursor-pointer mt-[24px]">
          {data?.name}
        </p>
        <p className="text-base font-medium text-textColor h-6">{data?.designation}</p>

        <div className="flex justify-center gap-4 mt-6">
          <Link href={data?.facebook || "#"} target="_blank" className="h-8 w-8 cursor-pointer border border-borderColor rounded-full flex justify-center items-center hover:text-[#B68C5A] hover:border-[#B68C5A] duration-500 transition-all hover:-translate-y-1.5">
            <FaFacebookF />
          </Link>
          <Link href={data?.linkedin || "#"} target="_blank" className="h-8 w-8  cursor-pointer border border-borderColor rounded-full flex justify-center items-center hover:text-[#B68C5A] hover:border-[#B68C5A] duration-500 transition-all hover:-translate-y-1.5">
            <FaLinkedin />
          </Link>
          <Link href={data?.instagram || "#"} target="_blank" className="h-8 w-8  cursor-pointer border border-borderColor rounded-full flex justify-center items-center hover:text-[#B68C5A] hover:border-[#B68C5A] duration-500 transition-all hover:-translate-y-1.5">
            <FaInstagram />
          </Link>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default LawyerCard;