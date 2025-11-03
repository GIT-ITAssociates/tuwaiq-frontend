"use client";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/common/searchBar";
import UserDashboardTable from "@/app/components/common/table/userDashboardTable";
import { useFetch } from "@/app/helpers/hooks";
import { getAdminAppointment, getBookingAppointment } from "@/app/helpers/backend";
import dayjs from "dayjs";
import { useI18n } from "@/app/providers/i18n";
import { useEffect, useState } from "react";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import { Select } from "antd";

dayjs.extend(utc);
const Booking = () => {
  const { push } = useRouter();
  const [booking, getBooking, { loading }] = useFetch(getAdminAppointment);
  const i18n = useI18n();
  const handleDownloadPDF = (data) => {
    const link = document.createElement("a");
    link.href = data;
    link.download = "assignment.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getBooking({ search: searchQuery });
  }, [searchQuery]);
  const [statusFilter, setStatusFilter] = useState(""); // default "All"

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    getBooking({ status: value });
  };
  const columns = [
    {
      text: "Client Name",
      dataField: "attorney",
      formatter: (_, d) => {
        return (
          <div className="flex  flex-col gap-2 items-center">
            <Image
              height={100}
              width={100}
              src={d?.user?.image || "/images/defaultimg.jpg"}
              alt="image"
              className="w-[50px] h-[50px] object-center rounded-full"
            />
            <span>{d?.user?.name}</span>
          </div>
        );
      },
    },
    { text: "Case Type", dataField: "case_type" },

    {
      text: "Appointment Date",
      dataField: "select_date",
      formatter: (_, d) => {
        return <span>{dayjs.utc(d?.select_date).format("DD MMM , YYYY")}</span>;
      },
    },
    { text: "Time", dataField: "slot_time" },
    {
      text: "Status",
      dataField: "status",
      formatter: (_, d) => {
        return (
          <div className="flex items-center gap-2">
            {d?.status === "confirmed" && (
              <p className="p-2 capitalize rounded-[50px] text-white bg-gray-400 flex items-center justify-center">
                {d?.status}
              </p>
            )}
            {d?.status === "completed" && (
              <p className="p-2 capitalize rounded-[50px] text-white bg-[#22C55E] flex items-center justify-center">
                {d?.status}
              </p>
            )}
          </div>
        );
      },
    },
    {
      text: "Action",
      dataField: "action",

      formatter: (_, d) => {
        return (
          <div
            className="grid cursor-pointer place-content-center w-[40px] h-[40px] hover:bg-primary hover:text-white text-[24px] rounded-[10px] border hover:border-primary border-[#E0E0E0]"
            onClick={() => {
              push(`/admin/booking/${d?._id || d?.id}`);
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
      <div className="flex sm:flex-row flex-col justify-between  items-center mx-5  my-7 sm:gap-0 gap-6 lg:h-[56px] h-auto">
        <h1 className="dashboard-title">{i18n?.t("Booking")}</h1>
        <div className="flex gap-4 sm:flex-row flex-col  items-center">
          <SearchBar
            placeholder={"Search Here..."}
            wrapperClassName={"sm:w-[293px] w-full"}
            className={""}
            style={{ marginBottom: "-1px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          <Select
            className="capitalize"
            style={{ width: "120px", height: "60px" }}
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="confirmed">Confirmed</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
          </Select>
        </div>
      </div>
      <hr />
      <div className=" px-[24px]">
        <UserDashboardTable
          data={booking}
          onReload={getBooking}
          columns={columns}
          pagination
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Booking;
