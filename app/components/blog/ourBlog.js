"use client";

import Pagination from "../common/pagination";
import BlogCard from "../common/card/blogCard";
import { fetchBlogsListUser } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/providers/i18n";
const NewsBlog = () => {

const [data, getData] = useFetch(fetchBlogsListUser);
const i18n = useI18n();
const [currentPage, setCurrentPage] = useState(1);
const [blogs, setBlogs] = useState([]);
const [totalPages, setTotalPages] = useState(1);
useEffect(() => {
  if (data) {
    setBlogs(data.docs);
    setTotalPages(data.totalPages);
  }
}, [data]);

const handlePageChange = async (page) => {
  setCurrentPage(page);
  const response = await fetchBlogsListUser({ page, limit: 10 });
  if (!response.error) {
    setBlogs(response.data.docs);
    setTotalPages(response.data.totalPages);
  }
};

  return (
    <div className="  text-black">
      <div className="custom-container  xl:pb-[150px] md:pb-14 pb-[60px] ">
        <div className=" sm:text-start text-center">
          <p className="section-subtitle text-[#D4AF37]">{i18n?.t("News & Blog")}</p>
          <h1 className="section-title">{i18n?.t("Our Latest Blog & News")}</h1>
          <p className="section-description">
            {i18n?.t("Stay informed with our latest blogs and news, featuring expert insights,")}
            <br className="hidden md:inline" />
            {i18n?.t("updates, and valuable legal advice.")}
          </p>
        </div>

        <div className="!pt-[16px]">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[24px]"
          >
            {data?.docs?.map((data, index) => {
              return (
                  <BlogCard data={data} key={index}/>  
              );
            })}
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

export default NewsBlog;
