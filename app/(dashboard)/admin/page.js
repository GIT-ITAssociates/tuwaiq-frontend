"use client";
import { Card, Empty, Progress } from "antd";
import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";
import { BsFilesAlt } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi2";
import { LiaUsersSolid } from "react-icons/lia";
import { FaWallet, FaAddressBook } from "react-icons/fa";
import { useFetch } from "@/app/helpers/hooks";
import { getAdminDashboard } from "@/app/helpers/backend";
import { useUser } from "@/app/context/userContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GiFiles } from "react-icons/gi";
import Image from "next/image";
import { useI18n } from "@/app/providers/i18n";

const DonutChart = dynamic(() => import("../components/Dashboard/chart").then(mod => mod.default));
const ProfitChart = dynamic(() => import("../components/Dashboard/chart").then(mod => mod.ProfitChart));
const RevenueAnalyticsChart = dynamic(() => import("../components/Dashboard/chart").then(mod => mod.RevenueAnalyticsChart));
dayjs.extend(relativeTime);

export const DashboardCard = ({
  icon: Icon,
  title,
  number,
  wallet,
}) => {
  return (
    <Card>
      <div>
        <div className="flex gap-2">
          <div
            className={`h-[40px] w-[40px] rounded-full bg-[#b68c5a] grid place-content-center text-white  text-[20px]`}
          >
            <Icon />
          </div>
          <div>
            <h6 className="text-base font-sans  text-[#242628] font-medium">{title}</h6>
            <h2 className="text-[#8C9097] text-[24px] font-sans font-bold">
              {wallet && "SAR "}
              {number}
            </h2>
          </div>
        </div>
      </div>
    </Card>
  );
};

const page = () => {
  const [data] = useFetch(getAdminDashboard);
  const { user } = useUser();
  const i18n = useI18n();

            const langFromLocalStorage =
    typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

    const currentLanguage = i18n?.languages?.find(
  (lang) => lang?._id === langFromLocalStorage
)?.name;


  return (
    <div className="px-2 text-[#242628] ">
      <div>
        <h1 className="text-[18px] font-bold text-[#242628] font-sans">
          {i18n.t('Welcome back')}, {user?.name} !
        </h1>
        <p className="text-[#8C9097] text-xs font-sans mb-4">
{currentLanguage === "Arabic" 
  ? "تتبع نشاط المبيعات والصفقات والعملاء المحتملين هنا" 
  : "Track your sales activity, leads and deals here"}
        </p>
      </div>
      <div className="grid 2xl:grid-cols-3 grid-cols-1 gap-4">
        <div className="w-full col-span-1 admin-progress">
          {/* <div
            className=" w-full  rounded-lg mb-4"
            style={{
              backgroundImage: "url('/images/measure.png')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="bg-primary bg-opacity-80 h-full w-full p-5 flex justify-between items-center rounded-lg">
              <div className="flex flex-col gap-2">
                <h1 className="text-[18px] font-bold text-white font-sans">
                 {i18n.t('Your target is')}  {data?.case_analytics?.success_cases<100?"Incomplete":"Complete"}
                </h1>
                <p className="text-white text-xs font-sans ">
                  {i18n.t('You have completed')}{" "}
                  { (data?.case_analytics?.success_cases  || 0).toFixed(1) }{"%"}{" "}
                  {i18n.t('of the given target, you can also check your status')}.
                </p>
                <Link
                  href="/"
                  className="text-white text-xs font-sans hover:underline"
                >
                  {i18n.t('Click here')}
                </Link>
              </div>
              <Progress
                type="circle"
                percent={
                  (
                    data?.case_analytics?.success_cases || 0
                  ).toFixed(1)
                }
                size={80}
                strokeColor="white"
                circleTextColor="white"
               className="custom-progress"
              />
            </div>
          </div> 
          <div className=" bg-white rounded-lg w-full  mb-4 pb-5">
            <div className="px-5 py-5">
              <h1 className="admin-title  text-[15px] font-bold text-[#242628] font-sans ">
                {i18n.t('Top Deals')}
              </h1>
            </div>
            {
              data?.top_deals ? (<div className="flex flex-col gap-4  px-2 overflow-y-auto h-[220px] custom-scrollbar">
                {data?.top_deals?.map((i, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex gap-3 items-center">
                        <Image
                          height={100}
                          width={100}
                          src={i?.user?.image || "/images/defaultimg.jpg"}
                          alt="image"
                          className="h-[28px] w-[28px] rounded-full"
                        />
                        <div>
                          <h1 className="text-xs mb-2 font-bold text-[#242628] font-sans">
                            {i?.user?.name}
                          </h1>
                          <p className="text-[#8C9097] text-xs font-sans text-[12px]">
                            {i?.user?.email}
                          </p>
                        </div>
                      </div>
                      <Link href={`/admin/cases-details/${i?.case}`} className="text-xs font-bold text-primary hover:underline font-sans">
                        {i18n.t('View details')}
                      </Link>
                    </div>
                  );
                })}
              </div>) : (
                <div className="flex flex-col items-center justify-center gap-4 overflow-y-auto h-[220px] custom-scrollbar px-2">
                  <Empty description={i18n.t("No Deals")} />
                </div>
              )
            }

          </div>

          <div className="bg-white rounded-lg 2xl:h-[266px] h-[276px] 2xl:mb-4">
            <div className="p-5">
              <h1 className="admin-title  text-[15px] font-bold text-[#242628] font-sans ">
                {i18n.t('Profit Earned')}
              </h1>
            </div>
            <ProfitChart data={data?.profit_earned} />
          </div>
          */}
        </div>


        <div className="2xl:col-span-2 ">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mb-4">
            <DashboardCard
              icon={HiUserGroup}
              title={i18n.t("Total Attorney")}
              colorCode={"#C7A87D"}
              number={data?.total_attorneys || 0}
            />
            <DashboardCard
              icon={LiaUsersSolid}
              title={i18n.t("Total Clients")}
              colorCode={"#C7A87D"}
              number={data?.total_clients || 0}
            />
            <DashboardCard
              icon={GiFiles}
              title={i18n.t("Total Cases")}
              colorCode={"#C7A87D"}
              number={data?.total_cases || 0}

            />
            <DashboardCard
              icon={FaAddressBook}
              title={i18n.t("Ongoing Cases")}
              colorCode={"#C7A87D"}
              number={data?.ongoing_cases || 0}

            />
            <DashboardCard
              icon={BsFilesAlt}
              title={i18n.t("Success Cases")}
              colorCode={"#C7A87D"}
              number={data?.success_cases || 0}

            />
            <DashboardCard
              icon={FaWallet}
              title={i18n.t("Wallet")}
              colorCode={"#C7A87D"}
              number={data?.total_balance || 0}
              wallet={true}

            />
          </div>
          <div className="grid xl:grid-cols-3 grid-cols-1 gap-4  mb-4">
            <div className="bg-white rounded-lg xl:col-span-2 h-full">
              <div className="p-5">
                <h1 className="admin-title  text-[15px] font-bold text-[#242628] font-sans ">
                  {i18n.t('Revenue Analytics')}
                </h1>
              </div>
              <RevenueAnalyticsChart data={data?.monthly_appointments} />
            </div>
            <div className="col-span-1 h-full">
              <div className="bg-white rounded-lg p-5">
                <div className="">
                  <h1 className="admin-title  text-[15px] font-bold text-[#242628] font-sans ">
{currentLanguage === "Arabic" ? "تحليلات القضايا" : "Case Analytics"}
                  </h1>
                </div>
                <DonutChart data={data?.case_analytics} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 ">
        <div className=" bg-white rounded-lg w-full  md:mb-0 mb-4 pb-4">
          <div className="px-5 py-5">
            <h1 className="admin-title  text-[15px] font-bold text-[#242628] font-sans ">
              {i18n.t('Top Clients')}
            </h1>
          </div>
          {
            data?.top_clients ? (<div className="flex flex-col gap-4  px-2  overflow-y-auto h-[250px] custom-scrollbar">
              {data?.top_clients?.map((i, index) => {
                return (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <Image
                        height={100}
                        width={100}
                        src={i?.user?.image || "/images/defaultimg.jpg"}
                        alt="image"
                        className="h-[28px] w-[28px] rounded-full"
                      />
                      <div>
                        <h1 className="text-xs mb-2 font-bold text-[#242628] font-sans">
                          {i?.user?.name}
                        </h1>
                        <p className="text-[#8C9097] text-xs font-sans text-[12px]">
                          {i?.user?.email}
                        </p>
                      </div>
                    </div>
                    <h3 className="text-primary font-semibold text-xs">${i?.payment?.amount}</h3>
                  </div>
                );
              })}
            </div>) : (<div className="flex flex-col items-center justify-center gap-4 overflow-y-auto h-[250px] custom-scrollbar px-2">
              <Empty description={i18n.t("No Clients")} />
            </div>)
          }

        </div>
        <div className=" bg-white rounded-lg w-full  md:mb-0   mb-4 pb-4">
          <div className="px-5 py-5">
            <h1 className="admin-title  text-[15px] font-bold text-[#242628] font-sans ">
              {i18n.t('Upcoming Cases')}
            </h1>
          </div>
          {
            data?.upcoming_cases ? (<div className="flex flex-col gap-4   overflow-y-auto h-[250px] custom-scrollbar px-2">
              {data?.upcoming_cases?.map((i, index) => {
                return (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <Image
                        height={100}
                        width={100}
                        src={i?.user?.image || "/images/defaultimg.jpg"}
                        alt="image"
                        className="h-[28px] w-[28px] rounded-full"
                      />
                      <div>
                        <h1 className="text-xs mb-2 font-bold text-[#242628] font-sans">
                          {i?.user?.name}
                        </h1>
                        <p className="text-[#8C9097] text-xs font-sans text-[12px]">
                          {i?.user?.email}
                        </p>
                      </div>
                    </div>
                    <Link href={`/admin/our-cases/${i?._id || i?.id}`} className="text-xs font-bold text-primary hover:underline font-sans">
{currentLanguage === "Arabic" ? "عرض التفاصيل" : "View details"}
                    </Link>
                  </div>
                );
              })}
            </div>) : (
              <div className="flex flex-col items-center justify-center gap-4 overflow-y-auto h-[250px] custom-scrollbar px-2">
                <Empty description={i18n.t("No Upcoming Cases")} />
              </div>
            )
          }

        </div>
        <div className=" bg-white rounded-lg w-full  md:mb-0  mb-4 pb-4">
          <div className="px-5 py-5">
            <h1 className="admin-title  text-[15px] font-bold text-[#242628] font-sans ">
              {i18n.t('Messages')}
            </h1>
          </div>
          {
            data?.top_messages ? (<div className="flex flex-col gap-4 overflow-y-auto h-[250px] custom-scrollbar px-2">
              {data?.top_messages?.map((i, index) => {
                return (

                  <div key={index} className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <Image
                        height={100}
                        width={100}
                        src={i?.from?.image || "/images/defaultimg.jpg"}
                        alt="image"
                        className="h-[28px] w-[28px] rounded-full"
                      />
                      <div>
                        <h1 className="text-xs mb-2 font-bold text-[#242628] font-sans">
                          {i?.from?.name}
                        </h1>
                        <p className="text-[#8C9097] text-xs font-sans text-[12px]">
                          {dayjs(i?.createdAt)?.fromNow()}
                        </p>
                      </div>
                    </div>
                    <Link href="/admin/message" className="text-xs font-bold text-primary hover:underline font-sans">
{currentLanguage === "Arabic" ? "عرض التفاصيل" : "View details"}
                    </Link>
                  </div>
                );
              })}
            </div>) : (
              <div className="flex flex-col items-center justify-center gap-4 overflow-y-auto h-[250px] custom-scrollbar px-2">
                <Empty description={i18n.t("No Messages")} />
              </div>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default page;


