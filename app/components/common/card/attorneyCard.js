"use client";
import React, { useState } from "react";
import Messsage from "@/app/(site)/(pages)/user/attorney/modal/message";
import { useModal } from "@/app/context/modalContext";
import { useI18n } from "@/app/providers/i18n";
import Image from "next/image";



const AttorneyCard = ({ data }) => {
  const { setIsAppointmentOpen, setAttorneyId, setAttornyDetails,setIsRecommended } = useModal();
const i18n = useI18n();

  const [senderId, setSenderId] = useState("");
  const [open, setOpen] = useState(false);

  const handleBookNow = () => {
    // setAttorneyId(data.id); 
    // setAttornyDetails(data); 
    // setIsAppointmentOpen(true);
    // setIsRecommended(false);

    setSenderId(data?._id);
    setOpen(true);

  };
  
  return (
    <div className="w-full  px-6 py-8 border rounded-[10px] shadow-lg">
      <div className="flex items-center gap-3">
        <div className="rounded-full flex justify-center items-center">
          <Image height={70} width={70} className="h-[70px] w-[70px] rounded-full" src={data?.image ? data?.image : "/images/defaultimg.jpg"} alt="profile image" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg leading-[21px] text-[#242628] work-sans">
            {data?.name}
          </p>
          <p className="font-medium work-sans text-[#818B8F]">
            {data?.designation}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <p className="mb-3 font-medium work-sans">
          {i18n?.t("Experience")} :
          <span className="font-medium work-sans text-[#818B8F]">
            {data?.experience}
          </span>
        </p>
        <p >
  <p className="font-medium mb-2">{i18n?.t("Biography")}:</p>  
  <div
  className="font-medium work-sans break-all text-[#818B8F] h-[52px] "
  dangerouslySetInnerHTML={{
    __html: data && data?.bio
      ? (data?.bio.length > 50 
          ? data?.bio.slice(0, 50) + "..." 
          : data?.bio)
      : i18n?.t("No Information available"),
  }}
/>
</p>


      </div>
      <div className="mt-10 flex justify-between items-center">
        <p className="text-[#B68C5A] font-semibold text-lg work-sans">
          {/* SAR {data?.price} */}
        </p>
        <button
          className="bg-[#B68C5A] hover:bg-[#B68C5A] w-[123px] h-[43px] lg:px-[22px] px-5 py-4 rounded-lg font-medium  text-base flex items-center gap-1 text-white work-sans"
          onClick={handleBookNow}
        >
          {i18n?.t("Chat Now")}
        </button>
        
      </div>

       {/* ✅ Message Modal */}
          <Messsage
            setIsAppointmentOpen={setIsAppointmentOpen}
            open={open}
            setOpen={setOpen}
            data={senderId}
          />
    </div>
  );
};

export default AttorneyCard;