"use client";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/common/searchBar";
import UserDashboardTable from "@/app/components/common/table/userDashboardTable";
import { useFetch } from "@/app/helpers/hooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/providers/i18n";
import { fetchAttorneyAllCases, updateCaseRequest } from "@/app/helpers/backend";
import { Select, message } from "antd";


const MyCase = () => {
  const [data, getData, { loading }] = useFetch(fetchAttorneyAllCases, {});
  const handleDownloadPDF = (data) => {
    const link = document.createElement("a");
    link.href = data;
    link.download = "assignment.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const i18n = useI18n();
  useEffect(() => {
    getData({ search: searchQuery });
  }, [searchQuery]);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    getData({ search: searchQuery, status: statusFilter });
  }, [searchQuery, statusFilter]);
  const columns = [
    {
      text: "Case Type",
      dataField: "case_type",
      formatter: (_, d) => {
        return <span>{d?.appointment?.case_type}</span>;
      },
    },
    {
      text: "Client Name",
      dataField: "client_name",
      formatter: (_, d) => {
        return <span>{d?.user?.name}</span>;
      },
    },

    {
      text: "Time",
      dataField: "slot_time",
      formatter: (_, d) => {
        return <span>{d?.appointment?.slot_time}</span>;
      },
    },
    {
      text: "Hearing Date",
      dataField: "hearing_date",
      formatter: (_, d) => <HearingDateInput d={d} getData={getData} />,
    },
    {
      text: "Case Status",
      dataField: "status",
      formatter: (_, d) => {
        return (
          <div>
            {d?.status === "accept" && (
              <div className="flex items-center gap-2 p-4 py-2 text-white bg-green-500 rounded-[20px] capitalize">
                Accepted
              </div>
            )}
            {d?.status === "pending" && (
              <div className="flex items-center gap-2 p-4 py-2 text-white bg-yellow-500 rounded-[20px] capitalize">
                Pending
              </div>
            )}
            {d?.status === "success" && (
              <div className="flex items-center gap-2 p-4 py-2 text-white bg-emerald-600 rounded-[20px] capitalize">
                Success
              </div>
            )}
            {d?.status === "failed" && (
              <div className="flex items-center gap-2 p-4 py-2 text-white bg-red-600 rounded-[20px] capitalize">
                Failed
              </div>
            )}
            {d?.status === "ongoing" && (
              <div className="flex items-center gap-2 p-4 py-2 text-white bg-blue-500 rounded-[20px] capitalize">
                Ongoing
              </div>
            )}
            {d?.status === "decline" && (
              <div className="flex items-center gap-2 p-4 py-2 text-white bg-rose-500 rounded-[20px] capitalize">
                Declined
              </div>
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
              push(`/attorney/cases/${d?._id || d?.id}`);
            }}
          >
            <IoEyeOutline />
          </div>
        );
      },
    },
  ];
  const { push } = useRouter();
  return (
    <div>
      <div className="flex sm:flex-row flex-col justify-between mx-5  my-7 items-center sm:gap-0 gap-6 lg:h-[56px] h-auto">
        <h1 className="dashboard-title">{i18n?.t("My Cases")}</h1>
        <div className="flex gap-4 sm:flex-row flex-col  items-center">
          <Button
            style={{
              backgroundColor: '#E1B65E',
              color: '#fff', // White text for contrast
              borderRadius: '50px', // Pill shape
              height: '40px', // Consistent height
              fontWeight: 'bold',
              fontSize: '14px',
              padding: '0 24px', // Horizontal padding
              border: 'none', // Remove default border
              boxShadow: 'none', // Remove default shadow
            }}
          >
            Create Quotation/Invoice
          </Button>
        </div>
      </div>
      <hr />
      <div className=" px-[24px]">
        <UserDashboardTable
          data={data}
          onReload={getData}
          columns={columns}
          pagination
          loading={loading}
        />
      </div>
    </div>
  );
};

export default MyCase;
