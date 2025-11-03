"use client";
import PageTitle from "@/app/components/common/title/pageTitle";
import {
  createCageRequest,
  fetchAttorneyAllCases,
  fetchUserAttorney,
  getAppointmentDetails,
} from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useI18n } from "@/app/providers/i18n";
import { Button, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { CountdownTimer } from "../../dashboard/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
const page = ({ params }) => {
  const [data, getData] = useFetch(getAppointmentDetails, {});
  const completeButtonRef = useRef(null);

  const { push } = useRouter();
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
  const [attorney, getAttorney] = useFetch(fetchUserAttorney, {});
  const i18n = useI18n();

  const now = dayjs();
  const inputDate = dayjs(combinedDateTime?.toISOString());
  useEffect(() => {
    if (params?.id) {
      getData({ _id: params?.id });
    }

  }, [data?._id]);

  const selectedAttorney = attorney?.attorneys?.find(
    (item) => (item?.id || item?._id) === data?.attorney
  );

  const handleDownloadPDF = (data) => {
    const link = document.createElement("a");
    link.href = data;
    link.download = "assignment.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [dummy, setDummy] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setDummy((prev) => !prev);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const [cases, getCases, { loading: caseLoading }] = useFetch(
    fetchAttorneyAllCases,
    {}
  );

  const findCase = cases?.docs?.find((i) => {
    return i.appointment?._id === data?._id;
  });

  return (
    <div>
      <PageTitle>
        <div className="flex sm:flex-row flex-col justify-between items-center sm:gap-0 gap-6">
          <h1 className="dashboard-title">{i18n?.t("Appointment")}</h1>
        </div>
      </PageTitle>
      <div className="md:px-10 px-5 md:mt-10 mt-6 md:mb-[62px] mb-[30px] ">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 ">
          <div>
            <div className="border rounded-[20px] md:px-10 px-5 md:py-10 py-5 h-full">
  {/* ✅ Title changes dynamically */}
  <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans mb-10">
    {selectedAttorney
      ? i18n?.t("Attorney Info")
      : i18n?.t("Appointment Details")}
  </h1>

  <div className="flex flex-col gap-6">
    {/* ✅ Profile Image + Name + Designation */}
    {selectedAttorney && (
      <div className="flex items-center gap-3 mb-8">
        <Image
          width={100}
          height={100}
          className="lg:h-[100px] lg:w-[100px] md:w-[69px] md:h-[64px] h-[48px] w-[48px] rounded-full"
          src={selectedAttorney?.image || "/images/defaultimg.jpg"}
          alt="attorney"
        />
        <div>
          <p className="font-medium text-lg text-[#242628] work-sans">
            {selectedAttorney?.name}
          </p>
          <p className="font-medium capitalize work-sans text-[#818B8F]">
            {selectedAttorney?.designation}
          </p>
        </div>
      </div>
    )}

    {/* ✅ Hide Email, Phone, Qualification, Experience if attorney missing */}
    {selectedAttorney && (
      <>
        <p className="font-medium work-sans break-all">
          <span className="text-[#818B8F]">{i18n?.t("Email")}:</span>{" "}
          {selectedAttorney?.email}
        </p>

        <p className="font-medium work-sans">
          <span className="text-[#818B8F]">{i18n?.t("Phone")}:</span>{" "}
          {selectedAttorney?.phone_no}
        </p>

        <p className="font-medium work-sans">
          <span className="text-[#818B8F] leading-[27px]">
            {i18n?.t("Qualification")}:
          </span>{" "}
          <div
            className="w-full break-all"
            dangerouslySetInnerHTML={{
              __html: selectedAttorney?.certifications,
            }}
          ></div>
        </p>

        <p className="font-medium work-sans">
          <span className="text-[#818B8F]">{i18n?.t("Experience")}:</span>{" "}
          {selectedAttorney?.experience} {i18n?.t("years")}
        </p>
      </>
    )}

    {/* ✅ Always show Booking Status */}
    <div className="font-medium work-sans flex gap-2 items-center">
      <span className="text-[#818B8F]">{i18n?.t("Booking Status")}:</span>{" "}
      <div className="flex items-center gap-2 text-sm">
        {data?.status === "confirmed" && (
          <p className="p-2 capitalize rounded-[50px] text-white bg-[#6C757D] flex items-center justify-center">
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

    {/* ✅ Always show meeting link & countdown logic */}
    {(before10Minutes || isNowWithinTimeRange(combinedDateTime)) && (
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 mt-2">
          <CountdownTimer targetDate={combinedDateTime} />
          <div
            className="w-[50px] h-[50px] cursor-pointer rounded-full bg-white flex items-center justify-center"
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
      </div>
    )}
  </div>
</div>

          </div>

          <div>
            <div className="border rounded-[20px] md:px-10 px-5 md:py-10 py-5 h-full">
              <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans md:mb-10 mb-5">
                {i18n?.t("Case Info")}
              </h1>

              <div className="flex flex-col gap-6">
                <p className="font-medium work-sans capitalize">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Case Type")}:
                  </span>{" "}
                  {data?.case_type}
                </p>
                <p className="font-medium work-sans text-[#818B8F]">
                  {i18n?.t("Case Short Description")}:
                  <br />
                  <p className="text-[#3A3D3F] w-full break-all">
                    {data?.short_description}
                  </p>
                </p>

                <p className="font-medium work-sans text-[#818B8F]">
                  {i18n?.t("Case History")}:
                  <br />
                  <p className="text-[#3A3D3F] w-full break-all">
                    {data?.case_history}
                  </p>
                </p>
                <p className="font-medium work-sans">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Appointment")}:
                  </span>{" "}
                  <span className="work-sans font-semibold ">
                    {dayjs.utc(data?.select_date).format("DD MMMM YYYY")} -{" "}
                    {data?.slot_time}
                  </span>
                </p>
                <p className="font-medium work-sans flex items-center">
                  <span className="text-[#818B8F]">{i18n?.t("Evidence")}:</span>
                  {data?.evidence && (
                    <div className="lg:pl-0 pl-2 ">
                      {data?.evidence?.map((i, index) => {
                        return (
                          <Button
                            onClick={() => handleDownloadPDF(i)}
                            key={index}
                            className="border-none text-[#C7A87D] font-medium work-sans"
                          >
                            <FaRegFilePdf /> {i18n?.t("Download Pdf")}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* {(data?.status === "confirmed" && afterRangeTime && !findCase?._id) && (
          <div
            className={` mt-[50px] ${findCase?._id || data?.status === "completed"
                ? "hidden"
                : "flex gap-5 "
              }`}
          >
            <button
              ref={completeButtonRef}
              className="px-[32px] py-[16px] textpurple-500 sm:text-lg text-sm rounded-[8px] bg-primary text-white whitespace-nowrap"
              onClick={async () => {
                const submitdata = {
                  appintment: data?._id || data?.id,
                };
                const data1 = await createCageRequest(submitdata);
                if (data1?.error) {
                  message.error(data1?.msg || data1?.message);
                } else {
                  message.success(data1?.msg || data1?.message);
                  getData();
                  push("/user/cases");
                }
              }}
            >
              {i18n?.t("Send Case Request")}
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default page;
