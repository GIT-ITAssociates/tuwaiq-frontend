"use client";
import dayjs from "dayjs";
import SearchBar from "../common/searchBar";
import { FaAngleDoubleRight } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { CiUser } from "react-icons/ci";
import Image from "next/image";
import { blogCategoryList, fetchTagsList } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { columnFormatter } from "@/app/helpers/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/providers/i18n";
import { Skeleton } from "antd";

const Details = ({ data, alldata, getAllData, loading }) => {
  const [categorie, getCategories] = useFetch(blogCategoryList);
  const i18n = useI18n();
  const [tag, getTag] = useFetch(fetchTagsList);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    getAllData({ search: searchQuery });
  }, [searchQuery]);

  const filteredData = alldata?.docs || [];

  return (
    <div className="custom-container xl:mb-[150px] md:mb-14 mb-[60px]">
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-[32px]">
        <div className="col-span-1 xl:w-[393px] w-full">
          <SearchBar
            wrapperClassName={"xl:w-[393px] w-full"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          <div className="mb-[40px]">
            <h2 className="header-2">{i18n?.t("Recent Post")}</h2>
            <div className="py-[40px] px-[24px] border border-[#E0E0E0] rounded-lg mb-[40px]">
              <div className="flex flex-col h-[286px] overflow-y-auto scroll-container">
                {loading ? (
                  <Skeleton active />
                ) : (
                  filteredData?.map((i, index) => (
                    <div
                      key={index}
                      onClick={() => router.push(`/blog/view/${i?._id}`)}
                      className="min-h-[96px] py-[16px] border-b last:border-b-0 border-[#E0E0E0] flex gap-[12px] items-center cursor-pointer"
                    >
                      <Image
                        src={i?.image}
                        alt="post-thumbnail"
                        width={80}
                        height={80}
                        className="h-full w-[80px] rounded-[10px]"
                      />
                      <div>
                        <p className="font-medium line-clamp-2 min-h-[54px] capitalize">
                          {columnFormatter(i?.title)}
                        </p>
                        <p className="text-xs font-medium">
                          <span className="text-[#3A3D3F]">{i18n?.t("Date")}: </span>
                          <span className="text-[#D4AF37]">
                            {dayjs(i?.createdAt).format("MMMM DD, YYYY")}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="mb-[40px]">
            <h2 className="header-2">{i18n?.t("Categories")}</h2>
            <div className="py-[40px] px-[24px] border border-[#E0E0E0] rounded-lg mb-[40px]">
              <div className="flex flex-col h-[245px] overflow-y-auto scroll-container">
                {loading ? (
                  <Skeleton active />
                ) : (
                  categorie?.docs?.map((i, index) => (
                    <div
                      key={index}
                      className=" pt-[24px] !pb-[14px] flex justify-between border-b last:border-b-0 border-[#E0E0E0]  text-[#242628] group group-hover:text-primary cursor-pointer duration-300 transition-all"
                    >
                      <p className="text-[16px] font-medium leading-[18.77px] line-clamp-1 h-[20px] group-hover:text-primary capitalize duration-300 transition-all">
                        {columnFormatter(i?.name)}
                      </p>
                      <FaAngleDoubleRight className="!text-[20px] group-hover:text-primary duration-300 transition-all" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="mb-[40px]">
            <h2 className="header-2">{i18n?.t("Popular Tags")}</h2>
            <div className="py-[40px] px-[24px] border border-[#E0E0E0] rounded-lg mb-[40px]">
              <div className="flex flex-wrap gap-[6px]">
                {loading ? (
                  <Skeleton active />
                ) : (
                  tag?.docs?.map((i, index) => (
                    <button
                      key={index}
                      className="bg-primary text-white px-[12px] py-[4px] cursor-pointer capitalize rounded"
                    >
                      {columnFormatter(i?.name)}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 col-span-1 ">
          {loading ? (
            <Skeleton active />
          ) : (
            <>
              <Image width={895} height={444} src={data?.image} className="w-full md:h-[444px] h-[280px] rounded-[20px] object-cover mb-[24px]" alt="blog" />
              <div className="text-[#808080] flex flex-wrap gap-[16px] pb-[16px] mb-[40px]  border-b border-b-[#E0E0E0] ">
                <div className="flex gap-[12px] items-center border-e w-fit border-[#808080]">
                  <div className="w-[24px] h-[24px] flex justify-center items-center"><SlCalender className="text-lg font-bold" /></div>
                  <p className=" pe-[16px]">{dayjs(data?.createdAt).format("MMMM DD, YYYY")}</p>
                </div>
                <div className="flex gap-[12px] items-center border-e w-fit border-[#808080] ">
                  <div className="w-[24px] h-[24px] flex justify-center items-center"><CiUser className="text-lg font-bold" /></div>
                  <p className=" pe-[16px]">{i18n?.t("Admin")}</p>
                </div>
                <div className="flex gap-[12px] items-center border-0 w-fit border-[#808080]">
                  <p className=" pe-[16px]">{columnFormatter(data?.category?.name)}</p>
                </div>
              </div>
              <div>
                <h2 className="blog-header text-[28px]  text-[#242628] font-medium leading-[36.54px] text-left decoration-slice break-all mb-[24px]">
                  {columnFormatter(data?.title)}
                </h2>
                <div className="text-textColor  font-normal mb-[40px] w-full break-all" dangerouslySetInnerHTML={{
                  __html: columnFormatter(data?.details),
                }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;