"use client";
import { getClientDetails } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useI18n } from "@/app/providers/i18n";
import { Button } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect } from "react";
import { FaRegFilePdf } from "react-icons/fa";

const ClientDetails = ({ params }) => {
  const [data, getData, { loading }] = useFetch(getClientDetails, {});
  useEffect(() => {
    if (params?.id) {
      getData({ _id: params?.id });
    }
  }, [data?._id || data?.id]);

  const handleDownloadPDF = (data) => {
    const link = document.createElement("a");
    link.href = data;
    link.download = "downloaded_file.pdf";
    link.click();
  }

  const i18n = useI18n();
  return (
    <div className="  xl:pb-0 ">
      <div className="flex justify-start border-b-2 md:py-[38px] py-[17px] big-mid:px-10 sm:px-8 px-[22px] ">
        <h1 className="dashboard-title">{i18n?.t("Client's")}</h1>
      </div>

      <div className="md:px-10 px-5 md:mt-10 mt-6 md:mb-10 ">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mb-10">
          <div className="border rounded-[20px] lg:px-10 px-5 lg:py-10 py-5 min-h-[548px]">
            <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans mb-10">
              {i18n?.t("Client Info")}
            </h1>
            <div className="flex items-center gap-3 mb-8">
              <Image
                width={100}
                height={100}
                className="xl:h-[100px] xl:w-[100px] lg:h-[58px] lg:w-[58px] md:w-[69px] md:h-[64px] h-[48px] w-[48px] rounded-full"
                src={data?.user?.image || '/images/defaultimg.jpg'}
                alt=""
              />
              <div className="">
                <p className="font-medium text-lg text-[#242628] work-sans">
                  {data?.user?.name}
                </p>
                <p className="font-medium work-sans text-[#818B8F] break-all">
                  {data?.user?.email}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sans-500-16 whitespace-nowrap">
                <span className="text-[#818B8F]">{i18n?.t("Phone")}:</span> {data?.user.phone_no}
              </p>
              <p className="text-sans-500-16">
                <span className="text-[#818B8F]">{i18n?.t("Present Address")}:</span>{" "}
                {data?.user?.pre_address}
              </p>
              <p className="text-sans-500-16">
                <span className="text-[#818B8F]">{i18n?.t("Permanent Address")}:</span>{" "}
                {data?.user?.per_address}
              </p>
              <p className="text-sans-500-16">
                <span className="text-[#818B8F] leading-[27px]">
                  {i18n?.t("Date Of Birth")}:
                </span>{" "}
                {dayjs(data?.user?.dob).format("DD MMM YYYY")}
              </p>
              <p className="text-sans-500-16">
                <span className="text-[#818B8F] leading-[27px]">
                  {i18n?.t("Postal Code")}:
                </span>{" "}
                {data?.user?.postal_code}
              </p>
              <p className="text-sans-500-16">
                <span className="text-[#818B8F] leading-[27px]">{i18n?.t("Country")}:</span>{" "}
                {data?.user?.country}
              </p>
            </div>
          </div>
          <div className="border rounded-[20px] lg:px-10 px-5 lg:pt-10 lg:pb-[40px]  py-5 min-h-[548px]">
            <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans md:mb-10 mb-5">
              {i18n?.t("Case Information")}
            </h1>

            <div className=" ">
              <p className="font-medium work-sans mb-[30px]">
                <span className="text-[#818B8F]">{i18n?.t("Case Type")}:</span>{" "}
                {data?.case_type}
              </p>
              <p className="font-medium work-sans text-[#818B8F] flex flex-col gap-4 mb-[30px]">
                {i18n?.t("Case Short Description")}:
                <br />
                <span className="text-[#3A3D3F]">
                  {data?.short_description}
                </span>
              </p>
              <p className="font-medium work-sans flex flex-col gap-4 ">
                <span className="text-[#818B8F]">{i18n?.t("Case_History")}:</span>{" "}
                <span className="leading-[27px]">
                  {data?.case_history}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-[20px] lg:px-10 px-5 lg:py-10 py-5 min-h-[237px]">
          <p className=" work-sans ">
            <span className="text-[#242628] text-2xl font-medium ">{i18n?.t("Evidence")}: </span>
            <div className="grid grid-cols-2 mt-6 ">
              {data?.evidence && (
                <div className="lg:pl-0 pl-2 flex flex-wrap gap-2 ">
                  {data?.evidence?.map((i, index) => {
                    return (
                      <div className="flex items-center">
                        <span className="text-[#242628] font-medium text-base">{index + 1}.</span>
                        <Button
                          onClick={() => handleDownloadPDF(i)}
                          key={index}
                          className="border-none text-[#C7A87D] font-medium work-sans"
                        >
                          <FaRegFilePdf /> {i18n?.t("Download Pdf")}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
