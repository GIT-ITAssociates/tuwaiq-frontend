"use client";

import { useState, useEffect } from "react";
import LawyerCard from "../common/card/lawyerCard";
import Pagination from "../common/pagination";
import { fetchAttorneys } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useI18n } from "@/app/providers/i18n";

const OurTeam = () => {
  const [data, getData] = useFetch(fetchAttorneys);
    const i18n = useI18n();

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
    <div className=" work-sans text-black lawyer">
      <div className="custom-container xl:pb-[150px] md:pb-14 pb-[60px]">
        <div className="text-center">
          <p className="section-subtitle">{i18n?.t("Team")}</p>
          <h1 className="section-title">{i18n?.t("The Face Of Justice")}</h1>
          <p className="section-description">
            {i18n?.t("Meet our dedicated legal team, committed to providing expert advice and")}
            <span className="hidden md:inline">
              <br />
            </span>
            {i18n?.t("achieving the best outcomes for our clients with personalized expertise.")}
          </p>
        </div>

        <div className="pt-[16px]">
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {team.map((lawyer, index) => (
              <LawyerCard data={lawyer} key={index} />
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default OurTeam;