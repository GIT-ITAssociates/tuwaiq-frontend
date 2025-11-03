"use client";
import PageTitle from "@/app/components/common/title/title";
import {
  fetchAttorneyAllCases,
  fetchCaseDetail,
  updateCaseRequest,
} from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useI18n } from "@/app/providers/i18n";
import { Button, Card, message } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { VscLaw } from "react-icons/vsc";
import { useRouter } from "next/navigation";


const CaseDetails = ({ params }) => {


  const { push } = useRouter();
  // const [data, getData] = useFetch(fetchAttorneyAllCases);
  const [data, getData] = useFetch(fetchCaseDetail);
  useEffect(() => {
    if (params?.id) {
      getData({ _id: params?.id });
    }
  }, [data?._id || data?.id]);
  const i18n = useI18n();
  const handleSubmit = async () => {
    try {
      let res = await updateCaseRequest({ _id: data?._id, status: "accept" });
      if (res?.error) {
        message.error(res?.msg || res?.message);
      } else {
        message.success(res?.msg || res?.message);
      }
      getData();
    } catch (error) {
    }
  };

    const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
    const currentLanguage =
    i18n?.languages?.find((lang) => lang?._id === langFromLocalStorage)?.name ||
    "English";

  return (
    <div>
      <Card className=" mb-4 ">
        <div className="flex justify-between items-center ">
          <div className="!flex gap-4 items-center">
            <VscLaw className="text-3xl text-primary" />
            <h1 className="text-xl !text-primary !font-work capitalize font-semibold">
              {i18n?.t("Our Cases")}
            </h1>
          </div>
          {data?.hearing_date && (
            <div className="flex gap-2 items-center">
              <div className="text-xl !text-textColor !font-work capitalize font-semibold">
                Upcoming Hearing :
              </div>
              <CountdownTimer targetDate={data?.hearing_date} />
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          <div>
            <div className="border rounded-[20px] lg:px-10 px-5 lg:py-10 py-5 h-full">
              <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans mb-10">
                {i18n?.t("Attorney Info")}
              </h1>
              <div className="flex items-center gap-3 mb-8">
                <Image
                  width={100}
                  height={100}
                  className="xl:h-[100px] rounded-full xl:w-[100px] lg:h-[58px] lg:w-[58px] md:w-[69px] md:h-[64px] h-[48px] w-[48px]"
                  src={data?.attorney?.image || "/images/defaultimg.jpg"}
                  alt=""
                />
                <div className="">
                  <p className="font-medium text-lg text-[#242628] work-sans">
                    {data?.attorney?.name}
                  </p>
                  <p className="font-medium work-sans text-[#818B8F] break-all">
                    {data?.attorney?.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sans-500-16 whitespace-nowrap">
                  {}
                  <span className="text-[#818B8F]">
                    {i18n?.t("Phone")}:
                  </span>{" "}
                  {data?.attorney?.phone_no ? data?.attorney?.phone_no : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Present Address")}:
                  </span>{" "}
                  {data?.attorney?.pre_address
                    ? data?.attorney?.pre_address
                    : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Permanent Address")}:
                  </span>{" "}
                  {data?.attorney?.per_address
                    ? data?.attorney?.per_address
                    : "N/A"}
                </p>
<p className="text-sans-500-16">
  <span className="text-[#818B8F] leading-[27px]">
    {i18n?.t("Date Of Birth")}:
  </span>{" "}
  {data?.attorney?.dob
    ? dayjs(data?.attorney?.dob).format("DD MMM YYYY")
    : "N/A"}
</p>

                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Postal Code")}:
                  </span>{" "}
                  {data?.attorney?.postal_code
                    ? data?.attorney?.postal_code
                    : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Country")}:
                  </span>{" "}
                  {data?.attorney?.country ? data?.attorney?.country : "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="border rounded-[20px] lg:px-10 px-5 lg:py-10 py-5 h-full">
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
                  {}
                  <span className="text-[#818B8F]">
                    {i18n?.t("Phone")}:
                  </span>{" "}
                  {data?.user?.phone_no ? data?.user?.phone_no : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Present Address")}:
                  </span>{" "}
                  {data?.user?.pre_address ? data?.user?.pre_address : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Permanent Address")}:
                  </span>{" "}
                  {data?.user?.per_address ? data?.user?.per_address : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Postal Code")}:
                  </span>{" "}
                  {data?.user?.postal_code ? data?.user?.postal_code : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Country")}:
                  </span>{" "}
                  {data?.user?.country ? data?.user?.country : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-6">
          <div>
            <div className="border rounded-[20px] lg:px-10 px-5 lg:pt-10 lg:pb-[40px]  py-5 h-full">
              <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans md:mb-10 mb-5">
                {i18n?.t("Case Information")}
              </h1>

              <div className=" ">
                <p className="font-medium work-sans mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Reference #")}:
                  </span>{" "}
                  {data?.reference_id
                    ? data?.reference_id
                    : "N/A"}
                </p>
                                <p className="font-medium work-sans mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Court Name")}:
                  </span>{" "}
                  {data?.court_name
                    ? data?.court_name
                    : "N/A"}
                </p>
                                <p className="font-medium work-sans mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Case Type")}:
                  </span>{" "}
                  {data?.case_type
                    ? data?.case_type
                    : "N/A"}
                </p>
                <p className="font-medium work-sans text-[#818B8F] flex flex-col gap-2 !mb-[30px] ">
                  {i18n?.t("Case Short Description")}:
                  <br />
                  <span className="text-[#3A3D3F] break-all">
                    {data?.short_description
                      ? data?.short_description
                      : "N/A"}
                  </span>
                </p>
                <p className="font-medium work-sans flex flex-col gap-2 mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Case_History")}:
                  </span>{" "}
                  <span className="leading-[27px] break-all">
                    {data?.case_history
                      ? data?.case_history
                      : i18n?.t("N/A")}
                  </span>
                </p>

                <div className="font-medium work-sans flex gap-2 items-center leading-[27px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Case Status")}:
                  </span>{" "}
                  {data?.status === "accept" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-green-500 rounded-[20px] capitalize">
                      Accepted
                    </div>
                  )}
                  {data?.status === "pending" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-yellow-500 rounded-[20px] capitalize">
                      Pending
                    </div>
                  )}
                  {data?.status === "success" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-emerald-600 rounded-[20px] capitalize">
                      Success
                    </div>
                  )}
                  {data?.status === "failed" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-red-600 rounded-[20px] capitalize">
                      Failed
                    </div>
                  )}
                  {data?.status === "ongoing" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-blue-500 rounded-[20px] capitalize">
                      Ongoing
                    </div>
                  )}
                  {data?.status === "decline" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-rose-500 rounded-[20px] capitalize">
                      Declined
                    </div>
                  )}
                </div>

                                
{data?.status != "pending" && data?.status != "accept" && (
  <div className="flex justify-end w-full mt-8">
    <button
      className="bg-primary text-white px-3 py-2 rounded-[10px] font-medium text-sm hover:opacity-90 transition"
      onClick={() => {
        console.log("Schedule Appointment clicked for:", data?._id);
        push(`/admin/our-cases/${data?._id || data?.id}/view-contract`);
      }}
    >
      {currentLanguage === "Arabic" ? "عرض العقد" : "View Contract"}
    </button>
  </div>
)}
              </div>
            </div>
          </div>
          <div className="border rounded-[20px] lg:px-10 px-5 lg:py-[40px] py-5 min-h-[237px]">
            <p className="font-medium work-sans flex flex-col gap-6">
              <span className="text-[#818B8F]">{i18n?.t("Documents")}:</span>
              <span>
                {data?.evidence ? (
                  <div className="lg:pl-0 pl-2 flex flex-wrap gap-3 cursor-not-allowed">
                    {data?.evidence?.map((i, index) => {
                      return (
                        <p className="border-none text-[#C7A87D] font-medium work-sans flex gap-1 items-center">
                        {index+1}. {" "} <FaRegFilePdf /> {i18n?.t("Download Pdf")}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  "N/A"
                )}
              </span>
            </p>
          </div>
        </div>

        
                {/* Case Notes Section */}
                <div className="border rounded-[20px] lg:px-10 px-5 lg:py-[40px] py-5 min-h-[237px] mt-6">
                  <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans mb-10">
                    {i18n?.t("Case Notes")}
                  </h1>
        
                  {/* Notes list */}
                  {Array.isArray(data?.notes) && data?.notes.length > 0 ? (
                    <div className="flex flex-col gap-6">
                      {data?.notes.map((noteItem, idx) => (
                        <div
                          key={noteItem?._id || idx}
                          className="border border-gray-200 rounded-[12px] p-4 bg-[#FAFAFA] shadow-sm"
                        >
                          <p className="text-[#3A3D3F] text-[15px] font-medium mb-2">
                            {noteItem?.title || "N/A"}
                          </p>
        
                          <div className="flex justify-between items-center text-sm text-[#818B8F] mt-2">
                            {noteItem?.document ? (
                              <a
                                href={noteItem.document}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline font-medium hover:text-[#C7A87D]"
                              >
                                {i18n?.t("View Attachment")}
                              </a>
                            ) : (
                              <span className="italic text-gray-400">
                                {/* {i18n?.t("No attachment")} */}
                              </span>
                            )}
        
                            <span>
                              {noteItem?.createdAt
                                ? dayjs(noteItem.createdAt).format("DD MMM YYYY")
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#818B8F] text-base font-medium">
                      {i18n?.t("Currently no note added.")}
                    </p>
                  )}
                </div>
        

      </Card>
    </div>
  );
};

export default CaseDetails;

export function CountdownTimer({ targetDate }) {
  const i18n = useI18n();
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [status, setStatus] = useState("countdown"); // countdown | today | closed

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(targetDate);

      // Get only the date portion in UTC for both
      const nowDateUTC = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      );
      const endDateUTC = new Date(
        Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())
      );

      if (endDateUTC < nowDateUTC) {
        clearInterval(interval);
        setStatus("closed");
      } else if (endDateUTC.getTime() === nowDateUTC.getTime()) {
        clearInterval(interval);
        setStatus("today");
      } else {
        const diff = end - now;
        if (diff > 0) {
          const days = String(
            Math.floor(diff / (1000 * 60 * 60 * 24))
          ).padStart(2, "0");
          const hours = String(
            Math.floor((diff / (1000 * 60 * 60)) % 24)
          ).padStart(2, "0");
          const minutes = String(
            Math.floor((diff / (1000 * 60)) % 60)
          ).padStart(2, "0");
          const seconds = String(Math.floor((diff / 1000) % 60)).padStart(
            2,
            "0"
          );

          setTimeLeft({ days, hours, minutes, seconds });
          setStatus("countdown");
        } else {
          clearInterval(interval);
          setStatus("closed");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex text-xl font-mono text-orange-800">
      {status === "closed" ? (
        <span className="text-orange-800 font-semibold capitalize">
          {i18n.t("Closed")}
        </span>
      ) : status === "today" ? (
        <span className="text-orange-800 font-semibold capitalize">
          {i18n.t("Today")}
        </span>
      ) : (
        <>
          <span>{timeLeft.days}</span>:<span>{timeLeft.hours}</span>:
          <span>{timeLeft.minutes}</span>:<span>{timeLeft.seconds}</span>
        </>
      )}
    </div>
  );
}
