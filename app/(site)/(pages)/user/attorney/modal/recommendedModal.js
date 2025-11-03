"use client";
import React from "react";
import { Modal, Button } from "antd";
import { IoClose } from "react-icons/io5";
import { useModal } from "@/app/context/modalContext";
import { useFetch } from "@/app/helpers/hooks";
import { fetchUserAttorney } from "@/app/helpers/backend";
import AttorneyCard from "@/app/components/common/card/attorneyCard";

const RecommendAttorney = () => {
  const { isRecommended, setIsRecommended }=useModal();
  const [data, getData] = useFetch(fetchUserAttorney);

  return (
    <Modal
      visible={isRecommended}
      onCancel={() => setIsRecommended(false)}
      footer={null}
      closeIcon={false}
      style={{ position: "relative", zIndex: "200" }}
      width="800px"
    >
      <div className="w-full mx-auto bg-white rounded-[20px] p-[10px] relative client">
        <button
          className="w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute sm:right-0 right-[2px] top-[2px] sm:top-0 inline-flex justify-center items-center"
          onClick={() => setIsRecommended(false)}
        >
          <IoClose
            size={20}
            className="text-[#242628] text-[12px] cursor-pointer"
          />
        </button>
        <h3 className="font-medium leading-[23.46px] text-[20px] pb-[24px] text-[#191930] font-ebgramond">
          Recommended Attorney
        </h3>
        <div className="flex lg:flex-row flex-col gap-4  ">
        {data?.attorneys?.slice(0,2)?.map((data, idx) => (
                <AttorneyCard key={idx} data={data} ></AttorneyCard>
              ))}
        </div>
  
      </div>
    </Modal>
  );
};

export default RecommendAttorney;