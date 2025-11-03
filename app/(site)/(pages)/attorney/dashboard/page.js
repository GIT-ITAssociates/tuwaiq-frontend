"use client";
import dynamic from "next/dynamic";
const RadialBarChart = dynamic(() =>
  import("./chat").then((mod) => mod.RadialBarChart)
);
import { Empty, Flex, message, Progress } from "antd";
import { ImHammer2 } from "react-icons/im";
import { GoLaw } from "react-icons/go";
import { TbPointFilled } from "react-icons/tb";
import { TbHammer } from "react-icons/tb";
import { useFetch } from "@/app/helpers/hooks";
import { attorneyHearing, getAttorneyDashboard } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
import dayjs from "dayjs";
import { CountdownTimer } from "../../user/dashboard/page";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(relativeTime);
const AttorneyDashBoard = () => {
  const i18n = useI18n();
  const { push } = useRouter();
  if (typeof window === "undefined") {
    return null;
  }
  const [dashboard] = useFetch(
    getAttorneyDashboard,
    {}
  );
  
        const langFromLocalStorage =
    typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

    const currentLanguage = i18n?.languages?.find(
  (lang) => lang?._id === langFromLocalStorage
)?.name;

  const [hearingdata] = useFetch(attorneyHearing);
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
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  const datePart = hearingdata?.select_date;
  const timePart = convertTo24HourFormat(hearingdata?.slot_time);
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


  function isBefore10MinutesEarlier(inputTimeStr) {
    const inputTime = new Date(inputTimeStr);
    const tenMinutesEarlier = new Date(inputTime.getTime() - 10 * 60 * 1000);
    const now = new Date();
    return now < tenMinutesEarlier;
  }

  const before10Minutes = isBefore10MinutesEarlier(combinedDateTime);
  function isPresentTimeWithinRange(fixedTimeStr) {
    const fixedTime = new Date(fixedTimeStr);
    const startTime = new Date(fixedTime.getTime() - 10 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 10 * 60 * 1000);
    const now2 = new Date();
    return endTime < new Date();
  }

  const afterRangeTime = isPresentTimeWithinRange(combinedDateTime);
  const [dummy, setDummy] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setDummy((prev) => !prev);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // const totalPercentage = parseFloat(
  //   parseFloat(
  //     dashboard?.caseOverview[0]?.statuses[0]?.percentage +
  //       dashboard?.caseOverview[0]?.statuses[1]?.percentage || 0
  //   ).toFixed(2)
  // );
  // const successPercentage = parseFloat(
  //   parseFloat(
  //     dashboard?.caseOverview[0]?.statuses?.find(
  //       (i) => i?.status === "completed"
  //     )?.percentage || 0
  //   ).toFixed(2)
  // );

  // const ongoingPercentage = parseFloat(
  //   parseFloat(
  //     dashboard?.caseOverview[0]?.statuses?.find(
  //       (i) => i?.status === "confirmed"
  //     )?.percentage || 0
  //   ).toFixed(2)
  // );


  return (
    <div className="  xl:pb-0 pb-[20px] ">
      <h1 className="dashboard-title md:py-[38px] py-[17px] md:px-12 sm:px-8 px-[22px] border-b-2">
        {i18n?.t("Dashboard")}
      </h1>
      <div className="lg:px-10 px-5 mt-10 mb-10">
        <div className="2xl:flex gap-6 flex-row grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 ">
          <DashboardCard
            title={i18n.t("Success Cases")}
            number={dashboard?.successCases || 0}
            bgColor="#4CAF50"
            icon={<TbHammer className="-rotate-90 text-[24px]" />}
          />
          <DashboardCard
title={currentLanguage === "Arabic" ? "إجمالي المواعيد" : "Total Appointments"}
            number={dashboard?.totalAppointments || 0}
            bgColor="#E29400"
            icon={<ImHammer2 className="rotate-90 text-[24px]" />}
          />
          <DashboardCard
            title={i18n.t("Total Cases")}
            number={dashboard?.totalCases || 0}
            bgColor="#2196F3"
            icon={<GoLaw />}
          />
        </div>

        <div className="mt-6 grid  sm:grid-cols-2 grid-cols-1    gap-6">
          <div className=" border rounded-[10px] shadow-lg sm:h-full h-[276px]  relative overflow-hidden  ">
            <div className="px-[24px] pt-[24px]">
              <p className="font-sans text-base font-medium text-[#242628] ">
                {i18n?.t("Case Overview")}
              </p>
              {/* "caseOverview": [
            {
                "total": 2,
                "pending": {
                    "count": 0,
                    "percentage": 0
                },
                "success": {
                    "count": 0,
                    "percentage": 0
                },
                "ongoing": {
                    "count": 1,
                    "percentage": 50
                }
            }
        ] */}
              <div className="flex justify-between pt-[16px] items-center">
                {(() => {


                  return (
                    <>
                      <div className="flex gap-[2px]">
                        <TbPointFilled className="text-base font-medium text-[#E29400] mt-[1px]" />
                        <div className="flex flex-col">
                          <p className="text-base font-semibold text-[#E29400] font-sans">
                            {dashboard?.caseOverview[0]?.pending?.percentage?.toFixed(2)}%
                          </p>
                          <p className="text-xs font-medium text-[#818B8F]">
                            {i18n.t('Pending')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-[2px]">
                        <TbPointFilled className="text-base font-medium text-[#4CAF50] mt-[1px]" />
                        <div className="flex flex-col">
                          <p className="text-base font-semibold text-[#4CAF50] font-sans">
                            {dashboard?.caseOverview[0]?.success?.percentage?.toFixed(2)}%
                          </p>
                          <p className="text-xs font-medium text-[#818B8F]">
{currentLanguage === "Arabic" ? "ناجح" : "Success"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-[2px]">
                        <TbPointFilled className="text-base font-medium text-[#2196F3] mt-[1px]" />
                        <div className="flex flex-col">
                          <p className="text-base font-semibold text-[#2196F3] font-sans">
                            {dashboard?.caseOverview[0]?.ongoing?.percentage?.toFixed(2)}%
                          </p>
                          <p className="text-xs font-medium text-[#818B8F]">
{currentLanguage === "Arabic" ? "جاري التنفيذ" : "Ongoing"}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            <RadialBarChart
              data={[dashboard?.caseOverview[0]?.pending?.percentage || 0, dashboard?.caseOverview[0]?.success?.percentage || 0, dashboard?.caseOverview[0]?.ongoing?.percentage || 0]}
            />
          </div>

          <div className="border px-4 py-6  rounded-[10px] shadow-lg w-full ">
            <div className="flex md:flex-nowrap flex-wrap gap-2   justify-between w-full">
              {" "}
              <p className="font-sans text-base font-medium mb-4 text-[#242628]">
                {i18n?.t("Upcoming Appointment")}
              </p>
              {(isNowWithinTimeRange(combinedDateTime) || before10Minutes) && (
                <CountdownTimer targetDate={combinedDateTime} />
              )}
            </div>
            {hearingdata ? (
              <div>
                <div className="mb-4">
                  <p className="text-[28px] leading-[36.54px] font-ebgramond text-[#039AB7] flex flex-col gap-[8px] font-bold">
                    {dayjs.utc(hearingdata?.select_date).format("DD")}
                    <span className="text-base font-sans text-[#818B8F] font-medium">
                      {dayjs.utc(hearingdata?.select_date).format("MMMM")}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="font-sans text-base font-medium mb-3 text-[#242628]">
                      {i18n.t('Case Description')}
                    </p>
                    <p className="font-sans text-sm text-[#3A3D3F] break-all line-clamp-2">
                      {hearingdata?.short_description}
                    </p>
                  </div>
                  {(isNowWithinTimeRange(combinedDateTime) || before10Minutes) && (
                    <div className="flex gap-2 mt-2">
                      <div
                        className={`w-[40px] h-[40px] rounded-full bg-white  flex items-center justify-center`}
                      >
                        <Image
                          src={"/images/meet.png"}
                          width={500}
                          height={200}
                          alt="meet"
                          className="w-[30px] h-[30px] opacity-100"
                        />{" "}
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium  text-[#242628]">
                          {i18n.t('Google Meet')}
                        </p>

                        <p
                          onClick={() => {
                            if (afterRangeTime) {
                              message.error(i18n.t("Time is over"));
                              return;
                            }
                            if (isNowWithinTimeRange(combinedDateTime)) {
                              push(hearingdata?.meetLink);
                              return;
                            }
                            if (before10Minutes) {
                              message.warning("You can join before 10 minutes")
                              return;
                            }
                          }}
                          className="font-sans text-xs font-medium cursor-pointer text-[#242628]"
                        >
                          https://meet.google.com
                        </p>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 h-[200px]  px-2">
                <Empty description={i18n.t("No Upcoming Appointment")} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="xl:col-span-3 sm:col-span-6 col-span-12 border px-4 py-4 rounded-[10px] shadow-lg h-[276px]">
            <p className="font-sans text-base font-medium text-[#242628] mb-4">
              {i18n?.t("Clients")}
            </p>
            {dashboard?.totalClients?.length > 0 ? (
              <div className="overflow-y-auto max-h-[200px] custom-scrollbar">
                <div className="flex flex-col gap-4">
                  {dashboard?.totalClients?.map((client, idx) => (
                    <Clients_progress key={idx} client={client} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 overflow-y-auto h-[200px] custom-scrollbar px-2">
                <Empty description={i18n.t("No Clients")} />
              </div>
            )}
          </div>

          <div className="xl:col-span-3 sm:col-span-6 col-span-12 border px-4 py-4 rounded-[10px] shadow-lg h-[276px] ">
            <p className="font-sans text-base font-medium text-[#242628] mb-4">
              {i18n?.t("Next Appointment's")}
            </p>
            {dashboard?.nextAppointments?.length > 0 ? (
              <div className="overflow-y-auto max-h-[200px] custom-scrollbar">
                <div className="flex flex-col gap-4 ">
                  {dashboard?.nextAppointments?.map(
                    (singleAppointment, idx) => (
                      <NextAppointment
                        key={idx}
                        singleAppointment={singleAppointment}
                      />
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 overflow-y-auto h-[200px] custom-scrollbar px-2">
                <Empty description={i18n.t("No Appointments")} />
              </div>
            )}
          </div>

          <div className="xl:col-span-6 col-span-12 px-4 py-4 border rounded-[10px] shadow-lg h-[276px]">
            <p className="font-sans text-base font-medium text-[#242628] mb-[28px]">
              {i18n?.t("Message")}
            </p>
            {dashboard?.unreadMessages?.length > 0 ? (
              <div className="overflow-y-auto max-h-[200px] custom-scrollbar">
                <div className="flex flex-col gap-4 ">
                  {dashboard?.unreadMessages?.map((i, idx) => (
                    <SingleMessage key={idx} data={i} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 overflow-y-auto h-[200px] custom-scrollbar px-2">
                <Empty description={i18n.t("No Messages")} />
              </div>
            )}
          </div>
        </div>
      </div>
      { }
    </div>
  );
};

export default AttorneyDashBoard;

export const DashboardCard = ({ bgColor, icon, title, number }) => {
  const i18n = useI18n();
  return (
    <div className="w-full">
      <div className="w-full h-[132px] p-5 border rounded-[10px] shadow-lg">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full !text-[24px] h-10 w-10 p-2 flex justify-center items-center text-white`}
            style={{ backgroundColor: bgColor }}
          >
            {icon}
          </div>
          <p className="font-medium text-wrap text-[#242628] work-sans whitespace-nowrap">
            {i18n?.t(title)}
          </p>
        </div>
        <p className={`case-numbers  ml-10`} style={{ color: bgColor }}>
          {number}
        </p>
      </div>
    </div>
  );
};

export const Clients_progress = ({ client }) => {
  let { name, image, caseCount } = client;
  const i18n = useI18n();
  const totalCases = 500;
  const progressPercent = totalCases
    ? Math.ceil((caseCount / totalCases) * 100)
    : 0;

  return (
    <div className="flex gap-[8px] items-center w-full">
      <Image className="h-10 w-10 rounded-full" width={100} height={100} src={image || '/images/defaultimg.jpg'} alt={name} />
      <div className="w-full">
        <Flex vertical gap="small" className="w-full">
          <Progress
            percent={progressPercent}
            size="small"
            className="w-full"
            showInfo={false}
          />
        </Flex>
        <p className="text-sans-500-14 text-[#818B8F]">
          {client?.caseCount} {i18n.t('Cases')}
        </p>
      </div>
    </div>
  );
};

const NextAppointment = ({ singleAppointment }) => {
  return (
    <Link href={`/attorney/cases/${singleAppointment?._id}`}>
      <div className="flex gap-[8px] items-center w-full cursor-pointer">
        <Image height={100} width={100}
          className="h-10 w-10 rounded-full"
          src={singleAppointment?.user?.image || "/images/defaultimg.jpg"}
          alt={singleAppointment?.user?.name}
        />
        <div className="w-full">
          <p className="text-base text-[#242628] font-medium font-sans">
            {singleAppointment?.user?.name}
          </p>
          <p className="text-xs font-medium font-sans text-[#818B8F]">
            {singleAppointment?.case_type}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const SingleMessage = ({ data }) => {
  const i18n = useI18n();
  return (
    <Link href={`/attorney/message`}>
      <div className="flex gap-[8px] items-center w-full">
        <Image height={100} width={100}
          className="h-10 w-10 rounded-full"
          src={data?.from?.image || "/images/defaultimg.jpg"}
          alt={data?.from?.name}
        />
        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-base text-[#242628] font-medium font-sans">
              {data?.from?.name}
            </p>
            <p className="text-xs font-medium font-sans text-[#818B8F]">
              {i18n?.t('Send you a message')}
            </p>
          </div>
          <div>
            <p>{dayjs(data?.from?.name)?.fromNow()}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
