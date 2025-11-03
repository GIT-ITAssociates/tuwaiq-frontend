'use client';
import SearchBar from "@/app/components/common/searchBar";
import AttorneyCard from "@/app/components/common/card/attorneyCard";
import { useFetch } from "@/app/helpers/hooks";
import { fetchUserAttorney } from "@/app/helpers/backend";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/providers/i18n";
const page = () => {
  const [data, getData] = useFetch(fetchUserAttorney);
  const [searchQuery, setSearchQuery] = useState("");
 useEffect(() => {
  getData({ search: searchQuery });
  }, [searchQuery]);

     const i18n = useI18n();

      const langFromLocalStorage =
    typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

    const currentLanguage = i18n?.languages?.find(
  (lang) => lang?._id === langFromLocalStorage
)?.name;

  useEffect(() => {
    getData({ search: searchQuery });
  }, [searchQuery]);

  // const filteredData = data?.attorneys?.filter((attorney) =>
  //   attorney?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  // ) || [];
  
  return (
    <div >
        <div className="flex sm:flex-row flex-col justify-between  items-center mx-5 my-7 sm:gap-0 gap-6 lg:h-[56px] ">
          <h1 className="dashboard-title ">{currentLanguage === "Arabic" ? " المحامون" : "Attorneys"}</h1>
          <div className="flex gap-6 md:flex-row flex-col ">
            <SearchBar onChange={(e) => setSearchQuery(e?.target?.value)} placeholder={currentLanguage === "Arabic" ? "البحث عن المحامي" : "Search Attorney..."} value={searchQuery} wrapperClassName={'sm:w-[293px] w-full'} className={''} style={{marginBottom:"-1px"}}/>
          </div>
        </div>
    <hr />
      <div className="py-[40px] px-[24px] overflow-y-auto max-h-[570px] custom-scrollbar">
            <div className="grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-6 ">
              {data?.map((data, idx) => (
                <AttorneyCard key={idx} data={data} ></AttorneyCard>
              ))}
            </div>
            </div>
        </div>
  
  );
};

export default page;
