"use client";
import { LuArrowLeftRight } from "react-icons/lu";
import { ImHammer2 } from "react-icons/im";
import { GoLaw } from "react-icons/go";
import Image from "next/image";
import { useFetch } from "@/app/helpers/hooks";
import { getDashboard, userHearing } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import dayjs from "dayjs";
import { Empty, message } from "antd";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(relativeTime);

const UserDashBoard = () => {
  const i18n = useI18n();
  const [data] = useFetch(getDashboard);
  const [hearingdata] = useFetch(userHearing);
  const { push } = useRouter();

  // ✅ Get current language only once at the top level
  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;

  const currentLanguage =
    i18n?.languages?.find((lang) => lang?._id === langFromLocalStorage)?.name ||
    "English";

  // Time calculations
  function convertTo24HourFormat(time12h) {
    if (!time12h) return "00:00";
    time12h = time12h.replace(/(AM|PM)$/i, " $1").trim();
    const [time, modifier] = time12h.split(" ");
    if (!time || !modifier) return "00:00";
    let [hours, minutes] = time.replace(".", ":").split(":").map(Number);
    if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  let combinedDateTime;
  const datePart = hearingdata?.select_date;
  const timePart = convertTo24HourFormat(hearingdata?.slot_time);
  if (datePart && timePart) {
    const dateString = new Date(datePart).toISOString().split("T")[0];
    combinedDateTime = new Date(`${dateString}T${timePart}:00`);
  }

  function isNowWithinTimeRange(fixedTimeStr) {
    const fixedTime = new Date(fixedTimeStr);
    const now = new Date();
    const startTime = new Date(fixedTime.getTime() - 10 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    return now >= startTime && now <= endTime;
  }

  function isBefore10MinutesEarlier(inputTimeStr) {
    const inputTime = new Date(inputTimeStr);
    const tenMinutesEarlier = new Date(inputTime.getTime() - 10 * 60 * 1000);
    const now = new Date();
    return now < tenMinutesEarlier;
  }

  function isPresentTimeWithinRange(fixedTimeStr) {
    const fixedTime = new Date(fixedTimeStr);
    const startTime = new Date(fixedTime.getTime() - 10 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 10 * 60 * 1000);
    return endTime < new Date();
  }

  const before10Minutes = isBefore10MinutesEarlier(combinedDateTime);
  const afterRangeTime = isPresentTimeWithinRange(combinedDateTime);

  // Dummy state to force refresh every 30s
  const [dummy, setDummy] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setDummy((prev) => !prev);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  console.log("================555", data)

  // Dashboard cards with language handling
  const totalCase = {
    title: currentLanguage === "Arabic" ? "إجمالي القضايا" : "Total Cases",
    bgColor: "#0056B3",
    icon: <ImHammer2 />,
    count: data?.data?.appointment?.total_case || 0,
  };

  const pendingCases = {
    title: currentLanguage === "Arabic" ? "قضية معلقة" : "Pending Cases",
    bgColor: "#6C757D",
    icon: <LuArrowLeftRight className="rotate-90" />,
    count: data?.data?.appointment?.pending_case || 0,
  };

  const successAppointment = {
    title: currentLanguage === "Arabic" ? "إجمالي الموعد" : "Total Appointment",
    bgColor: "#1E7E34",
    icon: <GoLaw />,
    count: data?.data?.appointment?.total_appointment || 0,
  };

  return (
    <div>
      <div className="lg:px-10 px-5 pt-10">
        {/* Dashboard cards */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          <DashboardCard {...successAppointment} currentLanguage={currentLanguage} />
          <DashboardCard {...pendingCases} currentLanguage={currentLanguage} />
          <DashboardCard {...totalCase} currentLanguage={currentLanguage} />
        </div>

        {/* Upcoming Appointment + Messages */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-[22px] md:mt-[60px] mt-[50px] lg:pb-[38px] pb-5">
          {/* Appointment */}
          <div>
            <h1 className="font-medium text-2xl mb-6">
              {i18n?.t("Upcoming Appointment")}
            </h1>

            {hearingdata ? (
              <div className="md:h-[280px] flex flex-row sm:flex-nowrap flex-wrap items-center gap-8 bg-primary text-white rounded-[10px] px-2 sm:px-[28px] py-4 sm:py-[28px]">
                <div>
                  <div className="rounded-full sm:w-[60px] sm:h-[60px] h-[60px] w-[60px] flex justify-center items-center bg-white">
                    <ImHammer2 className="text-[34px] rotate-90 text-primary" />
                  </div>
                </div>
                <div className="font-medium w-full">
                  <div className="grid grid-cols-1 gap-2 border-b-[1px] border-gray-300 pb-[16px]">
                    <p className="text-base break-all">
                      {currentLanguage === "Arabic" ? "تاريخ" : "Date:"}{" "}
                      {dayjs.utc(hearingdata?.select_date).format("DD MMMM YYYY")}
                    </p>
                    <p className="text-base break-all">
                      {currentLanguage === "Arabic" ? "محامي:" : "Lawyer:"}{" "}
                      {hearingdata?.attorney?.name}
                    </p>
                    <p className="text-base break-all">
                      {currentLanguage === "Arabic" ? "قضية:" : "Case:"}{" "}
                      {hearingdata?.case_type}
                    </p>
                    <p className="text-base break-all">
                      {currentLanguage === "Arabic" ? "وقت:" : "Time:"}{" "}
                      {hearingdata?.slot_time}
                    </p>
                  </div>
                  {(before10Minutes || isNowWithinTimeRange(combinedDateTime)) && (
                    <div className="w-full">
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <CountdownTimer
                          targetDate={combinedDateTime}
                          currentLanguage={currentLanguage}
                        />
                        <div
                          className="w-[50px] h-[50px] cursor-pointer rounded-full bg-white flex items-center justify-center"
                          onClick={() => {
                            if (afterRangeTime) {
                              message.error("Time is over");
                              return;
                            }
                            if (isNowWithinTimeRange(combinedDateTime)) {
                              push(hearingdata?.meetLink);
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
                            width={45}
                            height={45}
                            alt="meet"
                            className="w-[45px] h-[45px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex md:h-[280px] w-full justify-center border bg-[#EDEEF1] text-[#242628] rounded-[10px] px-[28px] py-[28px]">
                <Empty description={i18n.t("No Upcoming Date")} />
              </div>
            )}
          </div>

          {/* Messages */}
          <div>
            <h1 className="font-medium text-2xl mb-6">{i18n?.t("Recent Message")}</h1>
            {data?.data.message ? (
              <div className="flex w-full md:h-[280px] flex-row sm:flex-nowrap flex-wrap items-center gap-8 bg-[#EDEEF1] text-[#242628] rounded-[10px] px-[28px] py-[28px]">
                <div>
                  <div className="rounded-full sm:h-[80px] sm:w-[80px] h-[60px] w-[60px] flex justify-center items-center">
                    <Image
                      width={80}
                      height={80}
                      className="sm:h-[80px] sm:w-[80px] h-[60px] w-[60px] rounded-full"
                      src={data?.data?.message?.from?.image}
                      alt="user"
                    />
                  </div>
                </div>
                <div className="font-medium text-lg">
                  <p className="font-semibold text-lg">{data?.data?.message?.from?.name}</p>
                  <p className="text-textColor">
                    {currentLanguage === "Arabic" ? "أرسل لك رسالة" : "Send you a message"}
                  </p>
                  <p className="text-[#818B8F]">
                    {dayjs(data?.data?.message?.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="md:h-[280px] flex w-full justify-center border bg-[#EDEEF1] text-[#242628] rounded-[10px] px-[28px] py-[28px]">
                <Empty description={i18n.t("No Message")} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashBoard;

// export const DashboardCard = ({ bgColor, icon, title, number, currentLanguage }) => {

//   console.log("=============", number)
//   return (
//     <div className="w-full h-[132px] p-6 border rounded-[10px] shadow-lg">
//       <div className="flex items-center gap-3">
//         <div
//           className="rounded-full text-[24px] h-10 w-10 flex justify-center items-center text-white"
//           style={{ backgroundColor: bgColor }}
//         >
//           {icon}
//         </div>
//         <p className="font-medium text-[#242628] whitespace-nowrap">{title}</p>
//       </div>
//       <p className="case-numbers ml-10" style={{ color: bgColor }}>
//         {number}
//       </p>
//     </div>
//   );
// };

export const DashboardCard = ({ bgColor, icon, title, count }) => {
  return (
    <div className="w-full h-[132px] p-6 border rounded-[10px] shadow-lg">
      <div className="flex items-center gap-3">
        <div
          className="rounded-full text-[24px] h-10 w-10 flex justify-center items-center text-white"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </div>
        <p className="font-medium text-[#242628] whitespace-nowrap">{title}</p>
      </div>
      <p className="case-numbers ml-10" style={{ color: bgColor }}>
        {count}
      </p>
    </div>
  );
};


export function CountdownTimer({ targetDate, currentLanguage }) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(targetDate);
      const diff = end - now;

      if (diff > 0) {
        const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0");
        const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0");
        const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
        const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        clearInterval(interval);
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex text-xl font-mono text-orange-800">
      {isExpired ? (
        <span className="text-orange-800 font-semibold capitalize">
          {currentLanguage === "Arabic" ? "انضم الآن" : "Join Now"}
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
