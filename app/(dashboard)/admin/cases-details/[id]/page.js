"use client";
import Button from "@/app/components/common/button";
import {
  getAdminCaseDetails,
  getAllClients,
  getAttorneyCaseDetails,

} from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useI18n } from "@/app/providers/i18n";
import { Buttone } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaRegFilePdf } from "react-icons/fa";

const BookingDetails = ({ params }) => {
  const [data, getData] = useFetch(getAdminCaseDetails);
  const [clients] =
    useFetch(getAllClients);
  useEffect(() => {
    if (params?.id) {
      getData({ _id: params?.id });
    }
  }, [data?._id || data?.id]);

  const selectedClient = clients?.docs?.find(
    (item) => (item?.user?._id || item?.user?.id) === data?.user
  );
  const handleDownloadPDF = (data) => {
    const link = document.createElement("a");
    link.href = data;
    link.download = "assignment.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const i18n = useI18n();
  return (
    <div className=" xl:pb-0 pb-[20px]">
      <div className="flex justify-start border-b-2 md:py-[38px] py-[17px] md:px-10 sm:px-8 px-[22px] ">
        <h1 className="dashboard-title">{i18n?.t("Case Details")}</h1>
      </div>

      <div className="md:px-10 px-5 md:mt-10 mt-6 md:mb-[117px] mb-10">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          {/* 1 */}
          <div>
            <div className="border bg-white rounded-[20px] lg:px-10 px-5 lg:py-10 py-5 min-h-[548px]">
              <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans mb-10">
                {i18n?.t("Client Info")}
              </h1>
              <div className="flex items-center gap-3 mb-8">
                <Image
                  width={100}
                  height={100}
                  className="xl:h-[100px] rounded-full xl:w-[100px] lg:h-[58px] lg:w-[58px] md:w-[69px] md:h-[64px] h-[48px] w-[48px]"
                  src={data?.user?.image || "/images/defaultimg.jpg"}
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
                  { }
                  <span className="text-[#818B8F]">{i18n?.t("Phone")}:</span> {data?.user?.phone_no ? data?.user?.phone_no : 'N/A'}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F]">{i18n?.t("Present Address")}:</span>{" "}
                  {data?.user?.pre_address ? data?.user?.pre_address : 'N/A'}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F]">{i18n?.t("Permanent Address")}:</span>{" "}
                  {data?.user?.per_address ? data?.user?.per_address : 'N/A'}
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
                  {data?.user?.postal_code ? data?.user?.postal_code : 'N/A'}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Country")}:
                  </span>{" "}
                  {data?.user?.country ? data?.user?.country : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          {/* 2 */}
          <div>
            <div className="border bg-white rounded-[20px] lg:px-10 px-5 lg:pt-10 lg:pb-[40px]  py-5 min-h-[548px]">
              <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans md:mb-10 mb-5">
                {i18n?.t("Case Information")}
              </h1>

              <div className=" ">
                <p className="font-medium work-sans mb-[30px]">
                  <span className="text-[#818B8F]">{i18n?.t("Case Type")}:</span>{" "}
                  {data?.case_type ? data?.case_type : 'N/A'}
                </p>
                <p className="font-medium work-sans text-[#818B8F] flex flex-col gap-4 mb-[30px]">
                  {i18n?.t("Case Short Description")}:
                  <br />
                  <span className="text-[#3A3D3F] break-all">
                    {data?.short_description ? data?.short_description : 'N/A'}
                  </span>
                </p>
                <p className="font-medium work-sans flex flex-col gap-4 mb-[30px]">
                  <span className="text-[#818B8F]">{i18n?.t("Case_History")}:</span>{" "}
                  <span className="leading-[27px] break-all">
                    {data?.case_history ? data?.case_history : i18n?.t("N/A")}
                  </span>
                </p>
                <div className="font-medium work-sans flex gap-2 items-center leading-[27px]">
                  <span className="text-[#818B8F]">{i18n?.t("Case Status")}:</span>{" "}
                  <div className="flex items-center gap-2 p-4 py-2 text-white bg-[#22C55E] rounded-[20px]">
                    {data?.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-6">
          <div className="border bg-white rounded-[20px] lg:px-10 px-5 lg:py-[40px] py-5 min-h-[237px] ">
            <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans md:mb-10 mb-5">
              {i18n?.t("Booking Details")}
            </h1>
            <div>
              <>
                <div className="flex flex-col gap-4">
                  <p className="text-sans-500-16 flex gap-1">
                    <span className="text-[#818B8F]">{i18n?.t("Date")}:</span>{" "}
                    {dayjs(data?.select_date).format("DD MMMM YYYY")}
                  </p>
                  <p className="text-sans-500-16 text-[#818B8F] flex gap-1">
                    {i18n?.t("Time Slot")}:
                    <br />
                    <span className="text-[#3A3D3F]">{data?.slot_time}</span>
                  </p>
                  <p className="text-sans-500-16 flex gap-1">
                    <span className="text-[#818B8F] whitespace-nowrap">
                      {i18n?.t("Create Date")}:
                    </span>
                    <span className="">
                      {dayjs(data?.createdAt).format("DD MMMM YYYY")}
                    </span>
                  </p>
                </div>
              </>
            </div>
          </div>

          <div className="border bg-white rounded-[20px] lg:px-10 px-5 lg:py-[40px] py-5 min-h-[237px]">
            <p className="font-medium work-sans ">
              <span className="text-[#818B8F]">{i18n?.t("Evidence")}: </span>
              <div className="flex grid-cols-2 gap-4 mt-3">
                {data?.evidence ? (
                  <div className="lg:pl-0 pl-2 flex flex-wrap gap-2 ">
                    {data?.evidence?.map((i, index) => {
                      return (
                        <Button
                          onClick={() => handleDownloadPDF(i)}
                          key={index}
                          className="border-none text-[#C7A87D] font-medium work-sans flex items-center gap-2 !px-3"
                        >
                          <FaRegFilePdf /> {i18n?.t("Download Pdf")}
                        </Button>
                      );
                    })}
                  </div>
                )
                  : 'N/A'}
              </div>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingDetails;
