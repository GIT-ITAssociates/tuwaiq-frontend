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
      text: "Reference #",
      dataField: "reference_id",
      formatter: (_, d) => {
        return <span>{d?.reference_id}</span>;
      },
    },
    {
      text: "Court Name",
      dataField: "court_name",
      formatter: (_, d) => {
        return <span>{d?.court_name}</span>;
      },
    },{
      text: "Case Type",
      dataField: "case_type",
      formatter: (_, d) => {
        return <span>{d?.case_type}</span>;
      },
    },
    {
      text: "Client Name",
      dataField: "client_name",
      formatter: (_, d) => {
        return <span>{d?.user?.name}</span>;
      },
    },
    // {
    //   text: "Appointment Date",
    //   dataField: "hearing_date",
    //   formatter: (_, d) => {
    //     return (
    //       <span>
    //         {dayjs(d?.appointment?.select_date).format("DD MMMM YYYY")}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   text: "Time",
    //   dataField: "slot_time",
    //   formatter: (_, d) => {
    //     return <span>{d?.appointment?.slot_time}</span>;
    //   },
    // },
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
          <SearchBar
            placeholder={i18n?.t("Search Cases...")}
            wrapperClassName={"sm:w-[293px] w-full"}
            className={""}
            style={{ marginBottom: "-1px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          <Select
            className="capitalize"
            style={{ width: "100px", height: "60px" }}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="accept">Accepted</Select.Option>
            <Select.Option value="decline">Declined</Select.Option>
            <Select.Option value="ongoing">Ongoing</Select.Option>
            <Select.Option value="success">Success</Select.Option>
            <Select.Option value="failed">Failed</Select.Option>
          </Select>
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





export const HearingDateInput = ({ d, getData }) => {
  const [date, setDate] = useState("");
  useEffect(() => {
    if (d?.hearing_date) {
      setDate(dayjs(d.hearing_date).format("YYYY-MM-DD"));
    }
  }, [d?.hearing_date]);

  const handleDateChange = async (e) => {
    if (d?.status === "pending" || d?.status === "decline") {
      message.error("Case is not accepted");
      return;
    }
    const selectedDate = e.target.value;
    setDate(selectedDate);

    const data = await updateCaseRequest({
      _id: d._id,
      hearing_date: dayjs(selectedDate).format("YYYY-MM-DD"),
    });

    if (data?.error) {
      message.error(data?.msg || data?.message);
    } else {
      message.success(data?.msg || data?.message);
    }

    getData();
  };

  return (
    <input
      type="date"
      value={date}
      onChange={handleDateChange}
      className="border rounded px-2 py-1 text-sm"
    />
  );
};
