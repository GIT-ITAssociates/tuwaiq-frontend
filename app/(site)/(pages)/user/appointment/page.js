"use client";
import { IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import UserDashboardTable from "@/app/components/common/table/userDashboardTable";
import PageTitle from "@/app/components/common/title/pageTitle";
import { useI18n } from "@/app/providers/i18n";
import {
  fetchUserAttorney,
  getAppointmentHistory,
} from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import dayjs from "dayjs";
import { Select } from "antd";
import { useState } from "react";

const UserAppointment = () => {
  const { push } = useRouter();
  const [data, getData, { loading }] = useFetch(getAppointmentHistory);
  const [attorney, getAttorney] = useFetch(fetchUserAttorney, {});
  
  const [statusFilter, setStatusFilter] = useState(""); // default "All"

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    getData({ status: value });
  };

         const i18n = useI18n();

      const langFromLocalStorage =
    typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

    const currentLanguage = i18n?.languages?.find(
  (lang) => lang?._id === langFromLocalStorage
)?.name;


  const columns = [
    { text: "Case Type", dataField: "case_type" },
    {
      text: "Attorney",
      dataField: "attorney",
      formatter: (_, d) => {
        return (
       
            <span>{d?.attorney?.name}</span>
         
        );
      },
    },
    {
  text: currentLanguage === "Arabic" ? "حالة الحجز" : "Booking Status",
  dataField: "status",
  formatter: (_, d) => {
    const bookingStatusLabels = {
      pending: { en: "Pending", ar: "قيد الانتظار", color: "bg-[#EAB308]" },
      confirmed: { en: "Confirmed", ar: "مؤكد", color: "bg-[#6C757D]" },
      completed: { en: "Completed", ar: "مكتمل", color: "bg-[#22C55E]" },
      rejected: { en: "Rejected", ar: "مرفوض", color: "bg-[#F05454]" },
    };

    const status = d?.status;
    const label = bookingStatusLabels[status];

    if (!label) return null;

    return (
      <div className="flex items-center gap-2 text-sm">
        <p
          className={`p-2 capitalize rounded-[50px] text-white flex items-center justify-center ${label.color}`}
        >
          {currentLanguage === "Arabic" ? label.ar : label.en}
        </p>
      </div>
    );
  },
},


    {
      text: "Appointment Date",
      dataField: "select_date",
      formatter: (_, d) => {
        return (
          <div className="flex items-center gap-2">
            <p>{dayjs.utc(d?.select_date).format("DD MMMM YYYY")}</p>
          </div>
        );
      },
    },
       { text: "Time", dataField: "slot_time" },
    {
      text: "Action",
      dataField: "action",
      formatter: (_, d) => {
        return (
          <div
            className="grid cursor-pointer place-content-center w-[40px] h-[40px] hover:bg-primary hover:text-white text-[24px] rounded-[10px] border hover:border-primary border-[#E0E0E0]"
            onClick={() => {
              push(`/user/appointment/${d?.id || d?._id}`);
            }}
          >
            <IoEyeOutline />
          </div>
        );
      },
    },
  ];
  return (
    <div>
     <div className="flex sm:flex-row flex-col mx-5 my-7 justify-between items-center sm:gap-0 gap-6">
      <h1 className="dashboard-title">{i18n?.t("Appointment")}</h1>
      <Select
        className="capitalize"
  style={{ width: "120px" ,height: "60px"}}
        value={statusFilter} 
        onChange={handleStatusChange}
      >
        <Select.Option value="">All</Select.Option>
        <Select.Option value="confirmed">Confirmed</Select.Option>
        <Select.Option value="completed">Completed</Select.Option>
      </Select>
    </div>
      <hr />
      <div className=" px-[24px]">
        <UserDashboardTable
          data={data}
          onReload={getData}
          loading={loading}
          columns={columns}
          pagination
        />{" "}
      </div>
    </div>
  );
};

export default UserAppointment;
