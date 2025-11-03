"use client";
import { useEffect, useState } from "react";
import CaseCard from "../common/card/caseCard";
import Pagination from "../common/pagination";
import { useFetch } from "@/app/helpers/hooks";
import { getCaseStudyAll } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";

const OurCase = () => {
  const [data, getData] = useFetch(getCaseStudyAll);
  const i18n = useI18n()
  const [currentPage, setCurrentPage] = useState(1);
  const [team, setTeam] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (data) {
      setTeam(data?.docs || []);
      setCurrentPage(data?.page || 1);
      setTotalPages(data?.totalPages || 1);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setTeam(data?.docs || []);
      setCurrentPage(data?.page || 1); 
      setTotalPages(data?.totalPages || 1); 
    }
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page); 
    getData({ page }); 
  };
  return (
    <div className="case-study text-black">
      <div className="custom-container  xl:pb-[150px] md:pb-14 pb-[60px] ">
        <div className=" text-center sm:text-start">
          <p className="section-subtitle">{i18n?.t('Case Study')}</p>
          <h1 className="section-title text-[#242628]">
            {i18n?.t('Our Recent Case Project.')}
          </h1>
          <p className="section-description">
            {i18n?.t('Learn how we achieve results through expertise, dedication, and tailored')}
            <br className="hidden md:inline" />
            {i18n?.t('solutions to meet client goals.')}
          </p>
        </div>

        <div className="pt-[16px]">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {
              data?.docs?.map((data,index)=>{
                return (
              
                  <CaseCard data={data} key={index}/>
             
                )
              })
            }
       </div>
        </div>
        <div className="flex justify-center mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      </div>
    </div>
  );
};

export default OurCase;
