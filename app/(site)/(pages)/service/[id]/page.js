"use client";
import Banner from "@/app/components/common/banner";
import OurServiceDetails from "@/app/components/service/servicedetails";
import { getServiceDetails } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { Empty, Skeleton } from "antd";
import React, { useEffect } from "react";

const Page = ({ params }) => {
  const [data, getData, { loading }] = useFetch(getServiceDetails, {});

  useEffect(() => {
    if (params?.id) {
      getData({ _id: params.id });  
    }
  }, [data?._id]); 

  return (
    <div>
      <Banner title={"Service Details"} />
      {loading ? (
        <SkeletonLoader />
      ) : data?._id ? (
        <OurServiceDetails data={data} />
      ) : (
        <div className="flex justify-center items-center custom-container xl:mb-[150px] md:mb-14 mb-[60px]">
          <Empty description={"No Details Available"} />
        </div>
      )}
    </div>
  );
};

export default Page;

export const SkeletonLoader = () => {
  return (
    <div className="min-h-fit text-white relative">
      <div className="custom-container xl:mb-[150px] md:mb-14 mb-[60px] text-black font-garamond">

        <div className="md:mt-[56px] mt-[28px] lg:mb-14">
          <Skeleton
            active
            title={{ width: "60%" }}
            paragraph={{ rows: 2, width: ["100%", "80%"] }}
          />
        </div>

        <div className="text-[#242628]">
          <div className="lg:mt-0 mt-6">
            <Skeleton active title={{ width: "40%" }} />
          </div>

          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} active paragraph={{ rows: 2 }} className="mt-4" />
          ))}
        </div>

        <div className="lg:mt-14 mt-6">
          <Skeleton active title={{ width: "50%" }} paragraph={{ rows: 3 }} />
        </div>

        <div className="lg:mt-14 mt-6">
          <Skeleton active title={{ width: "50%" }} paragraph={{ rows: 3 }} />
        </div>
      </div>
    </div>
  );
};
