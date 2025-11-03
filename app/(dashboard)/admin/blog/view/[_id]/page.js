"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { columnFormatter } from "@/app/helpers/utils";
import { useFetch } from "@/app/helpers/hooks";
import { fetchBlog } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
import PageTitle from "@/app/components/common/title/title";

const AdminBlogView = ({ params }) => {
  const [data, getData] = useFetch(fetchBlog, {}, false);
  const i18n = useI18n();

  useEffect(() => {
    getData({ _id: params._id });
  }, [params._id]);

  return (
    <div>
      <section className="border rounded-md p-4 bg-white shadow-md">
        <PageTitle title={"Blog Details"} />
        <div className="container mx-auto block py-10">
          <div className="lg:pr-10 px-5">
            <div className="">
              {data?.image && (
                <div className="w-full py-5">
                  <Image
                    width={1000}
                    height={1000}
                    className="w-full  rounded-md h-[600px] object-cover"
                    src={data?.image}
                    alt=""
                  />
                </div>
              )}

              <div className="">
                <h1 className=" font-bold text-2xl py-2">
                  {columnFormatter(data?.title)}
                </h1>
                <p className="paragraph_1 my-2">
                  {columnFormatter(data?.short_description)}
                </p>
                <div
                  className="py-5 paragraph_1 text-secondary_text"
                  dangerouslySetInnerHTML={{
                    __html: columnFormatter(data?.details),
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex xl:items-center items-start">
                  <h1 className="paragraph_1">{i18n.t("Tags")}:</h1>
                  <div className="ps-5">
                    <span className="font-semibold px-3 header_7 flex flex-wrap">
                      {data?.tags?.map((item) => (
                        <span className="whitespace-pre" key={item?._id}>
                          #{columnFormatter(item?.name)}{" "}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminBlogView;
