"use client";
import { IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/app/components/common/searchBar";
import UserDashboardTable from "@/app/components/common/table/userDashboardTable";
import { useFetch } from "@/app/helpers/hooks";
import {
  fetchAttorneyAllCases,
  getAdminAvailbilityAtUser,
} from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
import { Select } from "antd";
import { useModal } from "@/app/context/modalContext";
import CalendarModal from "../attorney/modal/calendermodal";

const Page = () => {
  const [data, getData, { loading }] = useFetch(fetchAttorneyAllCases, {});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectDate, setselectDate] = useState(dayjs().format("DD/MM/YYYY"));
  const [selectSlot, setSelectSlot] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState(""); // ✅ Case ID to pass into modal

  const i18n = useI18n();
  const [availabilityData, getAvailabilityData, { loadingAdmin }] = useFetch(
    getAdminAvailbilityAtUser,
    {}
  );

  const {
    isAppointmentOpen,
    attorneyDetalis,
    setIsAppointmentOpen,
    setIsCaseDetailsOpen,
  } = useModal();

  const { push } = useRouter();

  // ✅ Fetch availability when modal opens
  useEffect(() => {
    if (isAppointmentOpen) {
      getAvailabilityData();
    }
  }, [isAppointmentOpen]);

  // ✅ Memoize availability data
  const memoizedAvailability = useMemo(
    () => availabilityData?.[0]?.availability || [],
    [availabilityData]
  );

  // ✅ Fetch cases
  useEffect(() => {
    getData({ search: searchQuery, status: statusFilter });
  }, [searchQuery, statusFilter]);

  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;

  const currentLanguage = i18n?.languages?.find(
    (lang) => lang?._id === langFromLocalStorage
  )?.name;
  

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
      text: currentLanguage === "Arabic" ? "اسم المحامي" : "Attorney Name",
      dataField: "attorney_name",
      formatter: (_, d) => <span>{d?.attorney?.name || "N/A"}</span>,
    },
    // {
    //   text: "Appointment Date",
    //   dataField: "select_date",
    //   formatter: (_, d) => (
    //     <span>
    //       {d?.appointment?.select_date
    //         ? dayjs(d?.appointment?.select_date).format("DD MMMM YYYY")
    //         : "N/A"}
    //     </span>
    //   ),
    // },
    // {
    //   text: "Time",
    //   dataField: "slot_time",
    //   formatter: (_, d) => <span>{d?.appointment?.slot_time || "N/A"}</span>,
    // },
{
  text: "Hearing Date",
  dataField: "hearing_date",
  formatter: (_, d) => {
    const hearingDate = d?.hearing_date;
    return (
      <span>
        {hearingDate ? dayjs(hearingDate).format("DD MMMM YYYY") : "N/A"}
      </span>
    );
  },
},

    {
      text: currentLanguage === "Arabic" ? "حالة القضية" : "Case Status",
      dataField: "status",
      formatter: (_, d) => {
        const statusLabels = {
          accept: { en: "Accepted", ar: "مقبول", color: "bg-green-500" },
          pending: {
            en: "Pending",
            ar: "قيد الانتظار",
            color: "bg-yellow-500",
          },
          success: { en: "Success", ar: "نجاح", color: "bg-emerald-600" },
          failed: { en: "Failed", ar: "فشل", color: "bg-red-600" },
          ongoing: { en: "Ongoing", ar: "جارية", color: "bg-blue-500" },
          decline: { en: "Declined", ar: "مرفوض", color: "bg-rose-500" },
          contract_reject: {
            en: "Rejected",
            ar: "مرفوض",
            color: "bg-rose-500",
          },
          invoice_pending: {
            en: "Invoice Pending",
            ar: "الفاتورة معلقة",
            color: "bg-[#ff8080]",
          },
          contract_pending: {
            en: "Pending",
            ar: "قيد الانتظار",
            color: "bg-yellow-500",
          },
        };
        // console.log("====status", d?.status);

        const label = statusLabels[d?.status];
        if (!label) return null;

        return (
          <div
            className={`flex items-center justify-center gap-2 p-4 py-2 text-white rounded-[20px] capitalize ${label.color}`}
          >
            {currentLanguage === "Arabic" ? label.ar : label.en}
          </div>
        );
      },
    },
    {
      text: "Action",
      dataField: "action",
      formatter: (_, d) => (
        <div className="flex items-center justify-end gap-3">
          {/* ✅ Schedule Appointment Button */}
          {d?.status === "accept" && !d?.appointment_id && (
            <button
              className="bg-primary text-white px-5 py-3 rounded-[10px] font-medium text-sm hover:opacity-90 transition"
              onClick={() => {
                setSelectedCaseId(d?._id); // ✅ Save Case ID
                setIsAppointmentOpen(true);
              }}
            >
              {currentLanguage === "Arabic"
                ? "جدولة موعد"
                : "Schedule Appointment"}
            </button>
          )}

          {d?.status === "contract_pending" && (
            <button
              className="bg-primary text-white px-3 py-2 rounded-[10px] font-medium text-sm hover:opacity-90 transition"
              onClick={() => {
                console.log("Schedule Appointment clicked for:", data?._id);
                push(`/user/cases/${d?._id || d?.id}/view-contract`);
              }}
            >
              {currentLanguage === "Arabic" ? "عرض العقد" : "View Contract"}
            </button>
          )}

          {d?.status === "invoice_pending" && (
            <button
              className="bg-primary text-white px-3 py-2 rounded-[10px] font-medium text-sm hover:opacity-90 transition"
              onClick={() => {
                console.log("Schedule Appointment clicked for:", data?._id);
                push(`/user/payment/invoice/${d?._id || d?.id}`);
              }}
            >
              {currentLanguage === "Arabic" ? "دفع الفاتورة" : "Pay Invoice"}
            </button>
          )}

          {/* 👁️ View Icon */}
          <div
            className="grid cursor-pointer place-content-center w-[40px] h-[40px] hover:bg-primary hover:text-white text-[24px] rounded-[10px] border hover:border-primary border-[#E0E0E0]"
            onClick={() => push(`/user/cases/${d?._id || d?.id}`)}
          >
            <IoEyeOutline />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="flex sm:flex-row flex-col justify-between mx-5 my-7 items-center sm:gap-0 gap-6 lg:h-[56px] h-auto">
        <h1 className="dashboard-title">{i18n?.t("My Cases")}</h1>
        <div className="flex gap-4 sm:flex-row flex-col items-center">
          <SearchBar
            placeholder={i18n?.t("Search Cases...")}
            wrapperClassName="sm:w-[293px] w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          <Select
            className="capitalize"
            style={{ width: "120px", height: "56px" }}
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

      {/* Table Section */}
      <div className="px-[24px]">
        <UserDashboardTable
          data={data}
          onReload={getData}
          columns={columns}
          pagination
          loading={loading}
        />
      </div>

      {/* ✅ Calendar Modal always mounted */}
      <CalendarModal
        caseId={selectedCaseId} // ✅ Case ID dynamically passed
        availability={memoizedAvailability}
        data={attorneyDetalis}
        setselectDate={setselectDate}
        selectSlot={selectSlot}
        setSelectSlot={setSelectSlot}
        selectDate={selectDate}
        setIsCaseDetailsOpen={setIsCaseDetailsOpen}
        onBookingSuccess={getData} // ✅ Refresh list on success
      />
    </div>
  );
};

export default Page;

// "use client";
// import { IoEyeOutline } from "react-icons/io5";
// import { FaRegFilePdf } from "react-icons/fa6";
// import { useRouter } from "next/navigation";
// import dayjs from "dayjs";
// import { useEffect, useState } from "react";
// import SearchBar from "@/app/components/common/searchBar";
// import UserDashboardTable from "@/app/components/common/table/userDashboardTable";
// import { useFetch } from "@/app/helpers/hooks";
// import { fetchAttorneyAllCases, getAdminAvailbility, getAdminAvailbilityAtUser } from "@/app/helpers/backend";
// import { useI18n } from "@/app/providers/i18n";
// import { Select } from "antd";
// import { useModal } from "@/app/context/modalContext";
// import CalendarModal from "../attorney/modal/calendermodal";

// const Page = () => {
//   const [data, getData, { loading }] = useFetch(fetchAttorneyAllCases, {});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//     const [selectDate, setselectDate] = useState(dayjs().format('DD/MM/YYYY'));
//     const [selectSlot, setSelectSlot] = useState("");

//     const i18n = useI18n();
//     const [availabilityData, getAvailabilityData, { loadingAdmin }] = useFetch(getAdminAvailbilityAtUser, {});

//     console.log("====3333", availabilityData)

//     const langFromLocalStorage =
//     typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

//     const currentLanguage = i18n?.languages?.find(
//   (lang) => lang?._id === langFromLocalStorage
// )?.name;

//   const {
//     isAppointmentOpen,
//      attorneyDetalis,
//      setIsAppointmentOpen
//   } = useModal();

//   useEffect(() => {
//     getData({ search: searchQuery, status: statusFilter });
//   }, [searchQuery, statusFilter]);
//   const columns = [
//     // { text: "Case Type", dataField: "case_type", formatter: ((_, d) => { return (<span>{d?.appointment?.case_type}</span>) }) },
//     { text: "Reference #", dataField: "reference_id", formatter: ((_, d) => { return (<span>{d?.reference_id}</span>) }) },
//     { text: "Court Name", dataField: "court_name", formatter: ((_, d) => { return (<span>{d?.court_name}</span>) }) },
// //     {
// //   text: currentLanguage === "ar" ? "نوع القضية" : "Case Type",
// //   dataField: "case_type",
// //   formatter: (_, d) => {
// //     const caseType = d?.appointment?.case_type;

// //     // Map English case types to Arabic
// //     const caseTypeMap = {
// //       Civil: "مدني",
// //       Criminal: "جنائي",
// //       Labor: "عمالي",
// //       Commercial: "تجاري",
// //       Family: "أحوال شخصية"
// //     };

// //     // If Arabic selected and caseType exists in map, use Arabic
// //     if (currentLanguage === "Arabic" && caseTypeMap[caseType]) {
// //       return <span>{caseTypeMap[caseType]}</span>;
// //     }

// //     // Default: show the English name
// //     return <span>{caseType || ""}</span>;
// //   }
// // },
//  { text: "Case Type", dataField: "case_type", formatter: ((_, d) => { return (<span>{d?.case_type}</span>) }) },
//     {
//       text: currentLanguage === "Arabic" ? " اسم المحامي" : "Attorney Name", dataField: "attorney_name", formatter: ((_, d) => {
//         return (
//           <span>{d?.attorney?.name || "N/A"}</span>
//         )
//       })
//     },
//     {
//       text: "Appointment Date", dataField: "select_date", formatter: ((_, d) => {
//         return (
//           <span>{d?.appointment?.select_date ? dayjs(d?.appointment?.select_date).format('DD MMMM YYYY') : "N/A"}</span>
//         )
//       })
//     },
//     {
//       text: "Time", dataField: "slot_time", formatter: ((_, d) => {
//         return (
//           <span>{d?.appointment?.slot_time || "N/A"}</span>
//         )
//       })
//     },
//       {
//       text: "Hearing Date", dataField: "hearing_date", formatter: ((_, d) => {
//         return (
//           <span>{dayjs(d?.hearing_date).format('DD MMMM YYYY')}</span>
//         )
//       })
//     },
//     // {
//     //   text: "Case Status", dataField: "status", formatter: ((_, d) => {
//     //     return (
//     //       <div>
//     //         {d?.status === "accept" && (
//     //           <div className="flex items-center gap-2 p-4 py-2 text-white bg-green-500 rounded-[20px] capitalize">
//     //             Accepted
//     //           </div>
//     //         )}
//     //         {d?.status === "pending" && (
//     //           <div className="flex items-center gap-2 p-4 py-2 text-white bg-yellow-500 rounded-[20px] capitalize">
//     //             Pending
//     //           </div>
//     //         )}
//     //         {d?.status === "success" && (
//     //           <div className="flex items-center gap-2 p-4 py-2 text-white bg-emerald-600 rounded-[20px] capitalize">
//     //             Success
//     //           </div>
//     //         )}
//     //         {d?.status === "failed" && (
//     //           <div className="flex items-center gap-2 p-4 py-2 text-white bg-red-600 rounded-[20px] capitalize">
//     //             Failed
//     //           </div>
//     //         )}
//     //         {d?.status === "ongoing" && (
//     //           <div className="flex items-center gap-2 p-4 py-2 text-white bg-blue-500 rounded-[20px] capitalize">
//     //             Ongoing
//     //           </div>
//     //         )}
//     //         {d?.status === "decline" && (
//     //           <div className="flex items-center gap-2 p-4 py-2 text-white bg-rose-500 rounded-[20px] capitalize">
//     //             Declined
//     //           </div>
//     //         )}
//     //       </div>
//     //     )
//     //   })
//     // },
//     {
//   text: currentLanguage === "Arabic" ? "حالة القضية" : "Case Status",
//   dataField: "status",
//   formatter: (_, d) => {
//     const statusLabels = {
//       accept: { en: "Accepted", ar: "مقبول", color: "bg-green-500" },
//       pending: { en: "Pending", ar: "قيد الانتظار", color: "bg-yellow-500" },
//       success: { en: "Success", ar: "نجاح", color: "bg-emerald-600" },
//       failed: { en: "Failed", ar: "فشل", color: "bg-red-600" },
//       ongoing: { en: "Ongoing", ar: "جارية", color: "bg-blue-500" },
//       decline: { en: "Declined", ar: "انخفض", color: "bg-rose-500" },
//     };

//     const status = d?.status;
//     const label = statusLabels[status];

//     if (!label) return null;

//     return (
//       <div
//         className={`flex items-center gap-2 p-4 py-2 text-white rounded-[20px] capitalize ${label.color}`}
//       >
//         {currentLanguage === "Arabic" ? label.ar : label.en}
//       </div>
//     );
//   },
// },
// // ✅ Action column with conditional button
//   {
//     text: "Action",
//     dataField: "action",
//     formatter: (_, d) => {
//       return (
//         <div className="flex items-center gap-3">

//           {/* ✅ Show “Schedule Appointment” button only when status === 'accept' */}
//           {d?.status === "pending" && (
//             <button
//               className="bg-primary text-white px-5 py-3 rounded-[10px] font-medium text-sm hover:opacity-90 transition"
//               onClick={() => {
//                 // 👉 Place your scheduling logic here
//                 console.log("Schedule Appointment clicked for:", d?._id);

//                 setIsAppointmentOpen(true);
//               }}
//             >
//               {currentLanguage === "Arabic" ? "جدولة موعد" : "Schedule Appointment"}
//             </button>
//           )}

//           {/* 👁️ View Icon */}
//           <div
//             className="grid cursor-pointer place-content-center w-[40px] h-[40px] hover:bg-primary hover:text-white text-[24px] rounded-[10px] border hover:border-primary border-[#E0E0E0]"
//             onClick={() => {
//               push(`/user/cases/${d?._id || d?.id}`);
//             }}
//           >
//             <IoEyeOutline />
//           </div>

//         </div>
//       );
//     },
//   },
// ];

//   //   {
//   //     text: "Action",
//   //     dataField: "action",
//   //     formatter: (_, d) => {
//   //       return (
//   //         <div
//   //           className="grid cursor-pointer place-content-center w-[40px] h-[40px] hover:bg-primary hover:text-white text-[24px] rounded-[10px] border hover:border-primary border-[#E0E0E0]"
//   //           onClick={() => {
//   //             push(`/user/cases/${d?._id || d?.id}`);
//   //           }}
//   //         >
//   //           <IoEyeOutline />
//   //         </div>
//   //       );
//   //     },
//   //   },
//   // ];
//   const { push } = useRouter();
//   return (
//     <div>
//       <div className="flex sm:flex-row flex-col justify-between mx-5  my-7 items-center sm:gap-0 gap-6 lg:h-[56px] h-auto">
//         <h1 className="dashboard-title">{i18n?.t("My Cases")}</h1>
//         <div className="flex gap-4 sm:flex-row flex-col  items-center">
//           <SearchBar
//             placeholder={i18n?.t("Search Cases...")}
//             wrapperClassName={"sm:w-[293px] w-full"}
//             className={""}
//             style={{ marginBottom: "-1px" }}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e?.target?.value)}
//           />

//           <Select
//             className="capitalize"
//             style={{ width: "100px", height: "60px" }}
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
//       </div>
//       <hr />
//       <div className=" px-[24px]">
//         <UserDashboardTable data={data} onReload={getData} columns={columns} pagination loading={loading} />
//       </div>

//       {isAppointmentOpen && (
//         <CalendarModal
//           availability={availabilityData || []}
//           data={attorneyDetalis}
//           setselectDate={setselectDate}
//           selectSlot={selectSlot}
//           setSelectSlot={setSelectSlot}
//           // setIsCaseDetailsOpen={setIsCaseDetailsOpen}
//           selectDate={selectDate}
//         />
//       )}
//     </div>
//   );
// };

// export default Page;
