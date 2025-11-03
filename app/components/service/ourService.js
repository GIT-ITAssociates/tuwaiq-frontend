"use client";

import { useEffect, useState } from "react";
import ServiceCard from "../common/card/serviceCard";
import Pagination from "../common/pagination";
import { useFetch } from "@/app/helpers/hooks";
import { getServiceAll } from "@/app/helpers/backend";
import { Loader } from "../common/loader";
import { Empty } from "antd";
import { useI18n } from "@/app/providers/i18n";

const OurService = () => {
  const i18n = useI18n();
  const [services, getServices, { loading }] = useFetch(getServiceAll, {
    limit: 8,
  });
  const [totalPages, setTotalPages] = useState(services?.totalPages );
  const [currentPage, setCurrentPage] = useState(services?.page );
  const [data, setData] = useState(services);
  useEffect(() => {
    setData(services?.docs);
    setTotalPages(services?.totalPages || 2);
    setCurrentPage(services?.page || 1);
  }, [services]);

  const handlePageChange = async (page) => {
    try {
      await getServices({ page: page, limit: 8 });
      if (!data.error) {
        setData(data?.docs);
        setCurrentPage(data?.page);
        setTotalPages(data?.totalPages);
      }
    } catch (error) {
    }
  };
  
  return (
    <div className=" text-white relative service  xl:mb-[150px] md:mb-14 mb-[60px]">
      <div className="custom-container  ">
        <div className="sm:px-0 px-3 ">
          <div className="sm:text-start text-center">
            <p className="section-subtitle text-[#D4AF37]">{i18n?.t("Service")}</p>

            <h1 className="section-title text-[#021C1B]">{i18n?.t("Our Practice Area")}</h1>
          </div>

          <div className="flex justify-between items-center ">
            <p className="section-description  text-textcolor">
              {i18n?.t("Our legal services protect your rights and deliver results with")}
              <br className="" />
              {i18n?.t("personalized expertise.")}
            </p>
          </div>
        </div>

        <div className="md:mt-[16px] mt-[27px] work-sans ">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : data?.length > 0 ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-[24px]">
              {data?.map((i, index) => {
                return <ServiceCard data={i} key={index} />;
              })}
            </div>
          ) : (
            <Empty description={i18n?.t("No Service")} />
          )}
        </div>
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={parseInt(currentPage) }
            totalPages={parseInt(totalPages) || 2}
            onPageChange={handlePageChange}
            hasPrevPage={services?.hasPrevPage}
            hasNextPage={services?.hasNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default OurService;
