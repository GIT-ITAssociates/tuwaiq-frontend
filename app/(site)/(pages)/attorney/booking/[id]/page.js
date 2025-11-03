"use client";
import {
  createCageRequest,
  fetchAttorneyAllCases,
  getAllClients,
  getBookingdetails,
  updateAppointmentStatus,
  updateBookingStatus,
} from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useI18n } from "@/app/providers/i18n";
import { Button, message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { CountdownTimer } from "../../../user/dashboard/page";
import Image from "next/image";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const BookingDetails = ({ params }) => {



  const { push } = useRouter();
  const completeButtonRef = useRef(null);
  const [data, getData, { loading }] = useFetch(getBookingdetails);

  //Meet Time Functionality
  let combinedDateTime;
  function convertTo24HourFormat(time12h) {
    if (!time12h) {
      return "00:00";
    }

    time12h = time12h.replace(/(AM|PM)$/i, " $1").trim();

    const [time, modifier] = time12h.split(" ");
    if (!time || !modifier) return "00:00";

    let [hours, minutes] = time.replace(".", ":").split(":").map(Number);

    if (modifier.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  const datePart = data?.select_date;
  const timePart = convertTo24HourFormat(data?.slot_time);

  if (!datePart || !timePart) {
  } else {
    const dateString = new Date(datePart).toISOString().split("T")[0];

    const combinedString = `${dateString}T${timePart}:00`;
    combinedDateTime = new Date(combinedString);
  }

  function isNowWithinTimeRange(fixedTimeStr) {
    const fixedTime = new Date(fixedTimeStr);
    const now = new Date();

    const startTime = new Date(fixedTime.getTime() - 10 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);


    return now >= startTime && now <= endTime;
  }

  function isPresentTimeWithinRange(fixedTimeStr) {
    const fixedTime = new Date(fixedTimeStr);
    const startTime = new Date(fixedTime.getTime() - 10 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 10 * 60 * 1000);
    const now2 = new Date();
    return endTime < new Date();
  }

  const afterRangeTime = isPresentTimeWithinRange(combinedDateTime);

  function isBefore10MinutesEarlier(inputTimeStr) {
    const inputTime = new Date(inputTimeStr);

    const tenMinutesEarlier = new Date(inputTime.getTime() - 10 * 60 * 1000);

    const now = new Date();

    return now < tenMinutesEarlier;
  }

  const before10Minutes = isBefore10MinutesEarlier(combinedDateTime);
  const [clients, getClients, { loading: clientLoading }] =
    useFetch(getAllClients);

  useEffect(() => {
    if (params?.id) {
      getData({ _id: params?.id });
    }
  }, [data?._id]);

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

  const [dummy, setDummy] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setDummy((prev) => !prev);
    }, 30000);

    return () => clearInterval(interval);
  }, []);


  //Button Functionality
  const [cases, getCases, { loading: caseLoading }] = useFetch(fetchAttorneyAllCases, {});
  const findCase = cases?.docs?.find((i) => {
    return i.appointment?._id === params?.id;
  });




      console.log("===============", data?.meetLink)



  return (
    <div className=" xl:pb-0 pb-[20px]">
      <div className="flex justify-start border-b-2 md:py-[38px] py-[17px] md:px-10 sm:px-8 px-[22px] ">
        <h1 className="dashboard-title">{i18n?.t("Booking")}</h1>
      </div>

      <div className="md:px-10 px-5 md:mt-10 mt-6 md:mb-[117px] mb-10">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          <div>
            <div className="border rounded-[20px] lg:px-10 px-5 lg:py-10 py-5 h-full">
              <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans mb-10">
                {i18n?.t("Client Info")}
              </h1>
              <div className="flex items-center gap-3 mb-8">
                <Image
                  height={100}
                  width={100}
                  className="xl:h-[100px] rounded-full xl:w-[100px] lg:h-[58px] lg:w-[58px] md:w-[69px] md:h-[64px] h-[48px] w-[48px]"
                  src={selectedClient?.user?.image || "/images/defaultimg.jpg"}
                  alt=""
                />
                <div className="">
                  <p className="font-medium text-lg text-[#242628] work-sans">
                    {selectedClient?.user?.name}
                  </p>
                  <p className="font-medium work-sans text-[#818B8F] break-all">
                    {selectedClient?.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sans-500-16 whitespace-nowrap">
                  <span className="text-[#818B8F]">{i18n?.t("Phone")}:</span>{" "}
                  {selectedClient?.user?.phone_no}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Present Address")}:
                  </span>{" "}
                  {selectedClient?.user?.pre_address}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Permanent Address")}:
                  </span>{" "}
                  {selectedClient?.user?.per_address}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Date Of Birth")}:
                  </span>{" "}
                  {dayjs(selectedClient?.user?.dob).format("DD MMM YYYY")}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Postal Code")}:
                  </span>{" "}
                  {selectedClient?.user?.postal_code}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Country")}:
                  </span>{" "}
                  {selectedClient?.user?.country}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="border rounded-[20px] lg:px-10 px-5 lg:pt-10 lg:pb-[40px]  py-5 h-full">
              <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans md:mb-10 mb-5">
                {i18n?.t("Case Information")}
              </h1>

              <div className=" ">
                <p className="font-medium work-sans mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Case Type")}:
                  </span>{" "}
                  {data?.case_type}
                </p>
                <p className="font-medium work-sans text-[#818B8F] flex flex-col gap-4 mb-[30px]">
                  {i18n?.t("Case Short Description")}:
                  <br />
                  <span className="text-[#3A3D3F] break-all">
                    {data?.short_description}
                  </span>
                </p>
                <p className="font-medium work-sans flex flex-col gap-4 mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Case_History")}:
                  </span>{" "}
                  <span className="leading-[27px] break-all">
                    {data?.case_history}
                  </span>
                </p>
                <div className="font-medium work-sans flex gap-2 items-center leading-[27px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Booking Status")}:
                  </span>{" "}
                  <div className="flex items-center gap-2">

                    {data?.status === "confirmed" && (
                      <p className="p-2 capitalize rounded-[50px] text-white bg-gray-400 flex items-center justify-center">
                        {data?.status}
                      </p>
                    )}
                    {data?.status === "completed" && (
                      <p className="p-2 capitalize rounded-[50px] text-white bg-[#22C55E] flex items-center justify-center">
                        {data?.status}
                      </p>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Booking Detail & Evidence */}

        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-6">
          {/* 1 */}
          <div className="border rounded-[20px] lg:px-10 px-5 lg:py-[40px] py-5 min-h-[237px] ">
            <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans md:mb-10 mb-5">
              {i18n?.t("Booking Details")}
            </h1>
            <div>
              <>
                <div className="flex flex-col gap-4">
                  <p className="text-sans-500-16 flex gap-1">
                    <span className="text-[#818B8F]">{i18n?.t("Date")}:</span>{" "}
                    {dayjs.utc(data?.select_date).format("DD MMMM YYYY")}
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
            <div className="w-full">
              {(isNowWithinTimeRange(combinedDateTime) || before10Minutes) && (
                <div className="flex items-center justify-between gap-2 mt-2">
                  <CountdownTimer targetDate={combinedDateTime} />
                  <div
                    className={`w-[50px] h-[50px] cursor-pointer rounded-full bg-white flex items-center justify-center`}
                    onClick={() => {
                      if (afterRangeTime) {
                        message.error("Time is over");
                        return;
                      }
                      if (isNowWithinTimeRange(combinedDateTime)) {
                        push(data?.meetLink);
                        return;
                      }
                      if (before10Minutes) {
                        message.warning("You can join before 10 minutes");
                        return;
                      }
                    }}
                  >
                    <Image
                      src={"/images/meet.png"}
                      width={500}
                      height={200}
                      alt="meet"
                      className="w-[45px] h-[45px] opacity-100"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2 */}
          <div className="border rounded-[20px] lg:px-10 px-5 lg:py-[40px] py-5 min-h-[237px]">
            <p className="font-medium work-sans flex flex-col  ">
              <span className="text-[#818B8F]">{i18n?.t("Evidence")}</span>
              {data?.evidence && (
                <div className="flex flex-wrap  gap-4 mt-3">
                  {data?.evidence?.map((i, index) => {
                    return (
                      <div key={index} className="flex items-center text-[#242628] text-base">
                        <span>{index + 1}.</span>
                        <Button
                          onClick={() => handleDownloadPDF(i)}
                          className="border-none text-[#C7A87D] font-medium work-sans"
                        >
                          <FaRegFilePdf /> {i18n?.t("Download Pdf")}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </p>
          </div>
        </div>
        {(data?.status === "confirmed" && afterRangeTime && !findCase?._id) && (
          <div className={` mt-[50px] ${(findCase?._id || data?.status === "completed") ? "hidden" : "flex gap-5 "}`}>
            <button
              ref={completeButtonRef}
              className="sm:w-[150px] sm:h-14 w-[89px] h-11 textpurple-500 sm:text-lg text-sm rounded-[8px] bg-[#EDEDED] whitespace-nowrap"
              onClick={async () => {
                if (data?.status === "confirmed" && afterRangeTime) {
                  updateAppointmentStatus({ appintment: data?._id || data?.id, status: 'completed' })
                  const submitdata = {
                    _id: data?._id || data?.id,
                    status: 'completed'
                  };
                  const data1 = await updateAppointmentStatus(submitdata);
                  if (data1?.error) {
                    message.error(data1?.msg || data1?.message);
                  } else {
                    message.success(data1?.msg || data1?.message);
                    getData();
                    push("/attorney/booking");
                  }
                } else {
                  message.warning(
                    i18n.t("You can complete after the meeting time")
                  );
                }
              }}
            >
              {i18n?.t("Complete")}
            </button>
            <button
              ref={completeButtonRef}
              className="px-[32px] py-[16px] textpurple-500 sm:text-lg text-sm rounded-[8px] bg-primary text-white whitespace-nowrap"
              onClick={async () => {
                if (data?.status === "confirmed" && afterRangeTime) {
                  const submitdata2 = {
                    _id: data?._id || data?.id,
                    status: 'completed'
                  };
                  const data2 = await updateAppointmentStatus(submitdata2);
                  if (data2?.error) {
                    message.error(data2?.msg || data2?.message);
                  } else {
                    message.success(data2?.msg || data2?.message);
                    getData();
                    const submitdata = {
                      appintment: data?._id || data?.id,
                    };
                    const data1 = await createCageRequest(submitdata);
                    if (data1?.error) {
                      message.error(data1?.msg || data1?.message);
                    } else {
                      message.success(data1?.msg || data1?.message);
                      getData();
                      push("/attorney/cases");
                    }
                  }

                }
                else {
                  message.warning(
                    i18n.t("You can complete after the meeting time")
                  );
                }
              }}
            >
              {i18n?.t("Send Case Request")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
