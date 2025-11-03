"use client";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useFetch } from "@/app/helpers/hooks";
import {
  fetchAttorneyAllCases,
  // updateCageRequest,
  getAttorney,
  assignAttorney,
  updateCaseRequest,
} from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
import Table from "@/app/components/common/table/table";
import { Card, Select, message } from "antd";
import { VscLaw } from "react-icons/vsc";

import { IoEyeOutline } from "react-icons/io5";
const Page = () => {
  const [data, getData, { loading }] = useFetch(fetchAttorneyAllCases, {});
  const [attorneyData, getAttorneyData, { loading: attorneyLoading }] =
    useFetch(getAttorney, {});

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const i18n = useI18n();
  const { push } = useRouter();

  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;

  const currentLanguage = i18n?.languages?.find(
    (lang) => lang?._id === langFromLocalStorage
  )?.name;

  useEffect(() => {
    getData({ search: searchQuery, status: statusFilter });
    getAttorneyData();
  }, [searchQuery, statusFilter]);

  const attorneysList = Array.isArray(attorneyData?.docs)
    ? attorneyData.docs
    : [];

  const columns = [
    {
      text: "Reference #",
      dataField: "reference_id",
      formatter: (_, d) => <span>{d?.reference_id}</span>,
    },
     {
      text: "Court Name",
      dataField: "court_name",
      formatter: (_, d) => <span>{d?.court_name}</span>,
    },
     {
      text: "Case Type",
      dataField: "case_type",
      formatter: (_, d) => <span>{d?.case_type}</span>,
    },
    {
      text: currentLanguage === "Arabic" ? "اسم المحامي" : "Attorney",
      dataField: "attorney_name",
      formatter: (_, d) => {
        const caseId = d?._id || d?.id;

        // Show dropdown only when case is accepted
        if (d?.status === "ongoing" && !d?.attorney_id) {
          return (
            <AssignAttorneyCell
              caseId={caseId}
              attorneys={attorneysList}
              assignedAttorney={d?.attorney}
              onAssigned={async () => {
                await getData({ search: searchQuery, status: statusFilter });
              }}
              i18n={i18n}
            />
          );
        }

        // If attorney assigned but case not in accept, still show name in same design
        if (d?.attorney?.name) {
          return (
            <AssignedAttorneyView
              name={d?.attorney?.name}
              i18n={i18n}
            />
          );
        }

        return <span>-</span>;
      },
    },
    {
      text: "Client Name",
      dataField: "user_name",
      formatter: (_, d) => <span>{d?.user?.name}</span>,
    },
// {
//   text: "Appointment Date",
//   dataField: "appointment_date",
//   formatter: (_, d) => {
//     const date = d?.appointment?.select_date;
//     return (
//       <span>
//         {date ? dayjs(date).format("DD MMMM YYYY") : "N/A"}
//       </span>
//     );
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
        const isEditable = !["pending", "decline"].includes(d?.status);
        const handleChange = async (e) => {
          const newStatus = e;
          try {
            const res = await updateCaseRequest({
              _id: d._id,
              status: newStatus,
            });
            if (res?.error) {
              message.error(res?.msg || res?.message);
            } else {
              message.success(res?.msg || res?.message);
            }
            getData();
          } catch {
            message.error("Failed to update status");
          }
        };

return (
  <div>
    {["pending", "ongoing"].includes(d?.status) ? (
      // ✅ Editable dropdown for Pending / Ongoing
      <Select
        value={d?.status}
        onChange={handleChange}
        className={`status-select ${d?.status?.toLowerCase()}`}
        popupClassName="status-select-dropdown"
        popupMatchSelectWidth={false}
        suffixIcon={<span style={{ color: "#fff", fontSize: 12 }}>▼</span>} // White dropdown icon
      >
        {d?.status === "pending" && (
          <>
            <Select.Option value="accept">Accepted</Select.Option>
            <Select.Option value="decline">Declined</Select.Option>
          </>
        )}

        {d?.status === "ongoing" && (
          <>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="failed">Failed</Select.Option>
          </>
        )}
      </Select>
    ) : (
      // ✅ Static colored pill for non-editable statuses
      <div className={`status-pill ${d?.status?.toLowerCase()}`}>
        {d?.status === "accept"
          ? "Accepted"
          : d?.status === "contract_pending"
          ? "Contract Pending"
          : d?.status === "invoice_pending"
          ? "Invoice Pending"
          : d?.status === "decline"
          ? "Declined"
          : d?.status === "completed"
          ? "Completed"
          : d?.status === "failed"
          ? "Failed"
          : d?.status}
      </div>
    )}

    <style jsx global>{`
      /* ✅ Shared styling for dropdown (pill-like) */
      .status-select .ant-select-selector {
        border: none !important;
        border-radius: 10px !important;
        color: white !important;
        text-align: center !important;
        font-weight: 500 !important;
        height: 38px !important;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 24px !important;
        box-shadow: none !important;
      }

      .status-select .ant-select-selection-item {
        color: white !important;
        font-size: 15px !important;
        text-transform: capitalize;
      }

      /* ✅ Dropdown colors for editable statuses */
      .status-select.pending .ant-select-selector {
        background-color: #e6b800 !important; /* Yellowish for Pending */
      }

      .status-select.ongoing .ant-select-selector {
        background-color: #007bff !important; /* Blue for Ongoing */
      }

      /* ✅ Dropdown options styling */
      .status-select-dropdown .ant-select-item-option-content {
        text-align: center !important;
        text-transform: capitalize;
      }

      /* ✅ Static Status Pills */
      .status-pill {
        color: #fff;
        border-radius: 10px;
        padding: 8px 24px;
        font-weight: 500;
        font-size: 15px;
        text-align: center;
        text-transform: capitalize;
        display: inline-block;
        min-width: 120px;
      }

      /* 🎨 Colors for Non-Editable Statuses */
      .status-pill.accept {
        background-color: #75a26b; /* Green */
      }

      .status-pill.contract_pending {
        background-color: #75a26b; /* Green */
      }

      .status-pill.invoice_pending {
        background-color: #f79b74; /* Orange */
      }

      .status-pill.decline {
        background-color: #d9534f; /* Red */
      }

      .status-pill.completed {
        background-color: #28a745; /* Bright green */
      }

      .status-pill.failed {
        background-color: #b52b2b; /* Dark red */
      }
    `}</style>
  </div>
);



      },
    },
  ];


  return (
    <div>
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div className="!flex gap-4 items-center">
            <VscLaw className="text-3xl text-primary" />
            <h1 className="text-xl !text-primary !font-work capitalize font-semibold">
              {i18n?.t(currentLanguage === "Arabic" ? "قضايانا" : "Our Cases")}
            </h1>
          </div>

          <Select
            className="capitalize"
            style={{ width: "150px" }}
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
      </Card>

      <Table
        data={data}
        onReload={getData}
        columns={columns}
        pagination
        loading={loading || attorneyLoading}
        onView={(row) => {
          const id = row?._id || row?.id;
          if (id) push(`/admin/our-cases/${id}`);
        }}
        onSendContract={(data) => {
          push(`/admin/our-cases/${data?._id || data?.id}/send-contract`);
        }}
      />

      {/* Scoped dropdown styles */}
      <style jsx global>{`
        .assign-attorney-select .ant-select-selector {
          background: #fbf5e8 !important;
          border: 1px solid #a67c3b !important;
          border-radius: 9999px !important;
          height: 40px !important;
          display: flex !important;
          align-items: center !important;
          box-shadow: none !important;
        }

        .assign-attorney-select .ant-select-selection-item,
        .assign-attorney-select .ant-select-selection-placeholder {
          color: #000 !important;
          font-weight: 500 !important;
          font-size: 15px !important;
        }

        .assign-attorney-select .ant-select-arrow {
          color: #000 !important;
          inset-inline-end: 12px !important;
        }

        .assign-attorney-dropdown .ant-select-item-option {
          font-weight: 500;
        }

        .assign-attorney-dropdown .ant-select-item-option-selected {
          background: #f3e8d2 !important;
        }

        .assigned-attorney-view {
          background: #fbf5e8;
          border: 1px solid #a67c3b;
          border-radius: 9999px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          font-size: 15px;
          color: #000;
          min-width: 180px;
        }
      `}</style>
    </div>
  );
};

export default Page;

/* ---------- Assign Attorney Dropdown ---------- */
const AssignAttorneyCell = ({ caseId, attorneys, assignedAttorney, onAssigned, i18n }) => {
  const [assigning, setAssigning] = useState(false);

  // If already assigned, render non-clickable view
  if (assignedAttorney?.name) {
    return <AssignedAttorneyView name={assignedAttorney.name} i18n={i18n} />;
  }

  const options = (attorneys || []).map((a) => ({
    label: a?.name,
    value: a?._id,
  }));

  const handleSelect = async (attorneyId) => {
    if (!attorneyId || !caseId) return;
    try {
      setAssigning(true);
      const res = await assignAttorney({
        case_id: String(caseId),
        attorney_id: String(attorneyId),
      });
      if (res?.error) {
        message.error(res?.msg || res?.message || "Failed to assign attorney");
      } else {
        message.success(res?.msg || res?.message || "Attorney assigned successfully");
        await onAssigned?.();
      }
    } catch {
      message.error("Failed to assign attorney");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Select
      placeholder={i18n?.t("Assign Attorney")}
      options={options}
      onChange={handleSelect}
      loading={assigning}
      suffixIcon={<span style={{ fontSize: 14, color: "#000" }}>▾</span>}
      popupMatchSelectWidth={220}
      className="assign-attorney-select"
      popupClassName="assign-attorney-dropdown"
      styles={{
        selector: {
          background: "#FBF5E8",
          borderRadius: 9999,
          border: "1px solid #A67C3B",
        },
      }}
    />
  );
};

/* ---------- Assigned Attorney (Non-clickable) ---------- */
const AssignedAttorneyView = ({ name }) => {
  return <div className="assigned-attorney-view">{name}</div>;
};

/* ---------- Hearing Date Input ---------- */
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

    const res = await updateCaseRequest({
      _id: d._id,
      hearing_date: dayjs(selectedDate).format("YYYY-MM-DD"),
    });

    if (res?.error) {
      message.error(res?.msg || res?.message);
    } else {
      message.success(res?.msg || res?.message);
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








// "use client";
// import { FaRegFilePdf } from "react-icons/fa6";
// import { useRouter } from "next/navigation";
// import dayjs from "dayjs";
// import { useEffect, useState } from "react";
// import { useFetch } from "@/app/helpers/hooks";
// import {
//   fetchAttorneyAllCases,
//   updateCageRequest,
//   getAttorney
// } from "@/app/helpers/backend";
// import { useI18n } from "@/app/providers/i18n";
// import Table from "@/app/components/common/table/table";
// import { Card, Select, message } from "antd";
// import { VscLaw } from "react-icons/vsc";
// const Page = () => {
//   const [data, getData, { loading }] = useFetch(fetchAttorneyAllCases, {});



//   const [attorneyData, getAttorneyData, { loading: attorneyLoading }] = useFetch(getAttorney, {});
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const i18n = useI18n();
//   const [statusFilter, setStatusFilter] = useState("");

//             const langFromLocalStorage =
//     typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

//     const currentLanguage = i18n?.languages?.find(
//   (lang) => lang?._id === langFromLocalStorage
// )?.name;

//   useEffect(() => {
//     getData({ search: searchQuery, status: statusFilter });
//     getAttorneyData();
//   }, [searchQuery, statusFilter]);

//   const columns = [
//     {
//       text: "Case Type",
//       dataField: "case_type",
//       formatter: (_, d) => {
//         return <span>{d?.appointment?.case_type}</span>;
//       },
//     },
//    {
//   text: currentLanguage === "Arabic" ? "اسم المحامي" : "Attorney Name",
//   dataField: "attorney_name",
//   formatter: (_, d) => {
//     return <span>{d?.attorney?.name}</span>;
//   },
// },
//     {
//       text: "Client Name",
//       dataField: "user_name",
//       formatter: (_, d) => {
//         return <span>{d?.user?.name}</span>;
//       },
//     },
//     {
//       text: "Appointment Date",
//       dataField: "appointment_date",
//       formatter: (_, d) => {
//         return (
//           <span>
//             {dayjs(d?.appointment?.select_date).format("DD MMMM YYYY")}
//           </span>
//         );
//       },
//     },
//     {
//       text: "Hearing Date",
//       dataField: "hearing_date",
//       formatter: (_, d) => <HearingDateInput d={d} getData={getData} />,
//     },
//     {
//       text: "Case Status",
//       dataField: "status",
//       formatter: (_, d) => {
//         const isEditable = !["pending", "decline"].includes(d?.status);
//         const handleChange = async (e) => {
//           const newStatus = e;
//           try {
//             const data = await updateCageRequest({
//               _id: d._id,
//               status: newStatus,
//             });
//             if (data?.error) {
//               message.error(data?.msg || data?.message);
//             } else {
//               message.success(data?.msg || data?.message);
//             }

//             getData();
//           } catch (err) {
//             message.error("Failed to update status", err);
//           }
//         };

//         return (
//           <div>
//             {isEditable ? (
//               <Select
//                 value={d?.status}
//                 onChange={handleChange}
//                 className="capitalize"
//               >
//                 <Select.Option value={d?.status} selected>
//                   {d?.status === "accept" ? "Accepted" : d?.status}
//                 </Select.Option>
//                 <Select.Option value="ongoing">Ongoing</Select.Option>
//                 <Select.Option value="success">Success</Select.Option>
//                 <Select.Option value="failed">Failed</Select.Option>
//               </Select>
//             ) : (
//               <Select
//                 className="capitalize"
//                 style={{}}
//                 value={d?.status}
//                 onChange={(e) => {
//                   message.error("Case has been already declined");
//                 }}
//               >
//                 <Select.Option value={d?.status} selected>
//                   {d?.status === "decline" ? "Declined" : d?.status}
//                 </Select.Option>
//                 <Select.Option value="ongoing">Ongoing</Select.Option>
//                 <Select.Option value="success">Success</Select.Option>
//                 <Select.Option value="failed">Failed</Select.Option>
//               </Select>
//             )}
//           </div>
//         );
//       },
//     },
//   ];
//   const { push } = useRouter();



//   return (
//     <div>
//       <Card className=" mb-4 ">
//         <div className="flex items-center justify-between">
//           <div className="!flex gap-4 items-center">
//             <VscLaw className="text-3xl text-primary" />
//             <h1 className="text-xl !text-primary !font-work capitalize font-semibold">
// {i18n?.t(currentLanguage === "Arabic" ? "قضايانا" : "Our Cases")}
//             </h1>
//           </div>

//           <Select
//             className="capitalize"
//             style={{ width: "150px" }}
//             value={statusFilter}
//             onChange={(value) => setStatusFilter(value)}
//           >
//             <Select.Option value="">All</Select.Option>
//             <Select.Option value="pending">Pending</Select.Option>
//             <Select.Option value="accept">Accepted</Select.Option>
//             <Select.Option value="decline">Declined</Select.Option>
//             <Select.Option value="ongoing">Ongoing</Select.Option>
//             <Select.Option value="success">Success</Select.Option>
//             <Select.Option value="failed">Failed</Select.Option>
//           </Select>
//         </div>
//       </Card>
//       <Table
//         data={data}
//         onReload={getData}
//         columns={columns}
//         pagination
//         loading={loading}
//         onView={(data) => {
//           push(`/admin/our-cases/${data?._id || data?.id}`);
//         }}
//       />
//     </div>
//   );
// };

// export default Page;

// export const HearingDateInput = ({ d, getData }) => {
//   const [date, setDate] = useState("");
//   useEffect(() => {
//     if (d?.hearing_date) {
//       setDate(dayjs(d.hearing_date).format("YYYY-MM-DD"));
//     }
//   }, [d?.hearing_date]);

//   const handleDateChange = async (e) => {
//     if (d?.status === "pending" || d?.status === "decline") {
//       message.error("Case is not accepted");
//       return;
//     }
//     const selectedDate = e.target.value;
//     setDate(selectedDate);

//     const data = await updateCageRequest({
//       _id: d._id,
//       hearing_date: dayjs(selectedDate).format("YYYY-MM-DD"),
//     });

//     if (data?.error) {
//       message.error(data?.msg || data?.message);
//     } else {
//       message.success(data?.msg || data?.message);
//     }

//     getData();
//   };

//   return (
//     <input
//       type="date"
//       value={date}
//       onChange={handleDateChange}
//       className="border rounded px-2 py-1 text-sm"
//     />
//   );
// };
