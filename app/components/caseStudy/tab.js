"use client";
import { useState } from "react";
import { columnFormatter } from "@/app/helpers/utils";

const Tabs = ({ data }) => {
  let [activeTab, setActiveTab] = useState("problems");
  const tab = [
    { name: "problems" },
    { name: "challenges" },
    { name: "next_hearing" },
    { name: "solved" },
    { name: "solved_result" },
  ];

  const filterData = activeTab === "problems" ? data?.solved : data?.[activeTab];
  return (
    <div className="custom-container xl:mb-[150px] md:mb-14 mb-[60px] xl:px-5 md:px-8 sm:px-4 px-2 work-sans">
      <div className="flex overflow-x-auto gap-4 work-sans">
        {tab?.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(tab?.name)}
            className={`tab-btn capitalize ${
              activeTab === tab?.name
                ? "bg-[#B68C5A] text-white"
                : "bg-white text-black border-b-0 border-x border-t"
            }`}
          >
            {tab?.name}
          </button>
        ))}
      </div>
      <div className="rounded-b-[20px] border md:px-[40px] md:py-[40px] px-5 py-5">
        <div>
          <h1 className="font-ebgramond font-medium w-full break-all lg:text-2xl md:text-[21px] text-[20px] leading-[31px] flex items-center gap-1 md:mb-6 mb-3">
            {columnFormatter(filterData?.title)}
          </h1>
          <p className="md:pb-[40px] pb-5 w-full break-all">{columnFormatter(filterData?.description)}</p>
          {filterData?.points?.map((item, index) => (
            <div className="pl-2 mb-4" key={index}>
              <h1 className="font-ebgramond font-medium lg:text-2xl md:text-[21px] text-[20px] leading-[31px] flex items-center gap-1 md:mb-6 mb-3">
                {index + 1}. {item.title}:
              </h1>
              <ul className="list-disc pl-6 space-y-2 work-sans text-base w-full break-all">
                {item?.details?.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tabs;