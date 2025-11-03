"use client";
import { fetchSinglePage } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { columnFormatter } from "@/app/helpers/utils";
import Image from "next/image";
import { Skeleton } from "antd";

const OurClients = () => {
  const [data, getData, { loading }] = useFetch(fetchSinglePage, { slug: "client_brand" });

  return (
    <div className="custom-container xl:pb-[150px] md:pb-14 pb-[60px] our_client">
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <div className="flex justify-center">
            <div className="w-fit">
              <p className="font-semibold md:text-2xl text-[20px] text-[#242628] border-b-2 border-b-[#B68C5A] h-11">
                {columnFormatter(data?.content?.heading)}
              </p>
            </div>
          </div>
          <div className="mt-[50px] px-2 overflow-hidden">
            <div className="marquee flex gap-10">
              {data?.content?.client_logo?.map((item, index) => (
                <div className="h-[48px] w-[134px] flex-shrink-0" key={index}>
                  <Image
                    height={500}
                    width={1000}
                    src={item}
                    alt=""
                    className="w-full h-full object-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    
    </div>
  );
};

export default OurClients;