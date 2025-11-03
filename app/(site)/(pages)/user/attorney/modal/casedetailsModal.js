// "use client";
// import React, { useState } from "react";
// import { Form, Grid, Modal, Select, Spin } from "antd";
// import { IoClose } from "react-icons/io5";
// import UploadFileComponent from "@/app/components/common/form/pdfUpload";
// import { useFetch } from "@/app/helpers/hooks";
// import { fetchSpecialization, pdfFileUpload } from "@/app/helpers/backend";
// import { useI18n } from "@/app/providers/i18n";

// const CaseDetailsModal = ({
//   isCaseDetaiOpen,
//   setIsCaseDetailsOpen,
//   setCaseDetailsValue,
//   setIsPaymentModal,
//   setIsAppointmentOpen
// }) => {
//   const { useBreakpoint } = Grid;
//   const screens = useBreakpoint();
//   const getModalWidth = () => {
//     if (screens.xxl) {
//       return 892;
//     } else if (screens.xl) {
//       return 710;
//     } else if (screens.lg) {
//       return 700;
//     } else if (screens.md) {
//       return 600;
//     } else if (screens.sm) {
//       return 500;
//     } else {
//       return "100%";
//     }
//   };
//   const i18n = useI18n();
//   const [data] = useFetch(fetchSpecialization, {});
//   const [fileList, setFileList] = useState([]);

//   const [loading2, setLoading2] = useState(false);
//   const handleFinish = async (values) => {
//     setLoading2(true);
//     let evidenceList = [];

//     if (values?.evidence?.fileList?.length > 0) {
//       for (const file of values.evidence.fileList) {
//         if (file?.originFileObj) {
//           const { error, data } = await pdfFileUpload({
//             files: file.originFileObj,
//           });
//           evidenceList?.push(data);
//         }
//       }
//     }

//     if (values) {
//       setCaseDetailsValue({
//         ...values,
//         evidence: evidenceList,
//         case_type: values?.case_type,
//         short_description: values?.short_description,
//         case_history: values?.case_history,
//       });
//       setIsCaseDetailsOpen(false);
//       setIsPaymentModal(true);
//       setLoading2(false);
//       setIsAppointmentOpen(false);
//     }
//   };
//   if (loading2) {
//     return <Spin fullscreen />;
//   }
//   return (
//     <Modal
//       className="!bg-transparent"
//       footer={null}
//       closeIcon={false}
//       open={isCaseDetaiOpen}
//       onCancel={() => setIsCaseDetailsOpen(false)}
//       style={{ position: "relative", zIndex: "200" }}
//       width={getModalWidth()}
//     >
//       <div className="lg:max-w-[872px] w-full mx-auto bg-white rounded-[20px] p-[10px] relative ">
//         <button
//           className="w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute sm:top-0 top-[2px] right-[2px]  sm:right-0 inline-flex justify-center items-center"
//           onClick={() => {
//             setIsCaseDetailsOpen(false);
//           }}
//         >
//           <IoClose
//             size={20}
//             className="text-[#242628] text-[12px] cursor-pointer"
//           />
//         </button>

//         <h3 className="font-medium leading-[23.46px] text-[20px] pb-[24px] text-[#191930] font-ebgramond ">
//           {i18n?.t("Case Detail's")}
//         </h3>
//         <Form onFinish={handleFinish} layout="vertical">


//           <Form.Item
//             label={
//               <p className="text-base font-medium text-[#242628] mb-[12px]">
//                 {i18n?.t("Case Type")}
//               </p>
//             }
//             name="case_type"
//             rules={[{ required: true, message: i18n?.t("Please select a case type") }]}
//           >
//             <Select
//               placeholder={i18n.t("Select Case Type")}
//               allowClear
//               showSearch
//               className={"h-[50px]"}
//             >
//               {data?.docs?.map((cat) => (
//                 <Select.Option key={cat?.name} value={cat?.name}>
//                   {cat?.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="short_description"
//             label={
//               <p className="text-base font-medium text-[#242628] mb-[12px]">
//                 {i18n?.t("Case Short Description")}
//               </p>
//             }
//             rules={[{ required: true, message: i18n?.t("Please enter description") }]}
//           >
//             <textarea
//               maxLength={500}
//               minLength={10}
//               type="text"
//               className="w-full placeholder:text-base placeholder:font-normal  px-4 py-2 lg:h-[180px] md:h-[180px] h-[4rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
//               placeholder={i18n?.t("This case involves Party A and Party B, concerning the alleged murder of Victim's Name.")}
//               required
//             />
//           </Form.Item>
//           <Form.Item
//             name="case_history"
//             label={
//               <p className="text-base font-medium text-[#242628] mb-[12px]">
//                 {i18n?.t("Case History")}
//               </p>
//             }
//             rules={[{ required: true, message: i18n?.t("Please enter case_history") }]}
//           >
//             <textarea
//               type="text"

//               className="w-full placeholder:text-base placeholder:font-normal  px-4 py-2 lg:h-[180px] md:h-[180px] h-[4rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
//               placeholder={i18n?.t("This case involves Party A and Party B, concerning the alleged murder of Victim's Name.")}
//             />
//           </Form.Item>

//           <div className="mb-2">
//             <UploadFileComponent
//               className={"p-[8px]"}
//               max={1}
//               name="evidence"
//               fileList={fileList}
//               setFileList={setFileList}
//               rules={[{ required: true, message: i18n?.t("Please upload pdf") }]}
//               label={
//                 <p className="text-base font-medium text-[#242628] mb-[12px]">
//                   {i18n?.t("Evidence")}{" "}
//                 </p>
//               }
//             />
//           </div>
//           <button

//             type="submit"
//             className={`border-2 bg-primary  button text-white hover:bg-transparent hover:text-primary border-primary lg:px-8 text-textMain !font-poppins md:px-4 h-fit py-4 px-4 whitespace-pre rounded-[8px] transition-all !font-medium duration-300 ease-in-out sm:text-base capitalize text-sm `}
//           >
//             {i18n?.t("Continue")}
//           </button>
//         </Form>
//       </div>
//     </Modal>
//   );
// };

// export default CaseDetailsModal;
"use client";
import React, { useState } from "react";
import { Form, Grid, Modal, Select, message } from "antd";
import { IoClose } from "react-icons/io5";
import UploadFileComponent from "@/app/components/common/form/pdfUpload";
import { useFetch } from "@/app/helpers/hooks";
import { fetchSpecialization, uploadMultiplePDFs } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
import { createNewCase } from "@/app/helpers/backend";


const courtList = [
  { name: "Supreme Court" },
  { name: "Courts of Appeal" },
  { name: "Courts of First Instance (General Courts)" },
  { name: "Administrative Courts" },
    { name: "Labor Courts" },
    { name: "Commercial Courts" },
    { name: "Criminal Courts" },
];


const CaseDetailsModal = ({
  isCaseDetaiOpen,
  setIsCaseDetailsOpen,
  setCaseDetailsValue,
  setIsPaymentModal,
  setIsAppointmentOpen,
}) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const i18n = useI18n();

  const [fileList, setFileList] = useState([]);
  // const [data] = useFetch(fetchSpecialization, {});
  const [data] = useFetch(fetchSpecialization, { limit: 200 });

  const [loading, setLoading] = useState(false);

  const getModalWidth = () => {
    if (screens.xxl) return 892;
    if (screens.xl) return 710;
    if (screens.lg) return 700;
    if (screens.md) return 600;
    if (screens.sm) return 500;
    return "100%";
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      // Extract selected files
      const selectedFiles = (values?.evidence ?? [])
        .map((f) => f.originFileObj || f)
        .filter(Boolean);

      let uploadedEvidence = [];

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("pdfs", file);
        });

        try {
          const { error, data } = await uploadMultiplePDFs(formData);

          if (error) {
            if (error?.response?.status === 413) {
              message.error(i18n?.t("File size too large. Please upload smaller files."));
            } else {
              message.error(error?.message || i18n?.t("Failed to upload PDFs. Please try again."));
            }
            return; // ⛔ Stop here, keep modal open
          }


          uploadedEvidence = data ?? [];
        } catch (err) {
          if (err?.response?.status === 413) {
            message.error(i18n?.t("File size too large. Please upload smaller files."));
          } else {
            message.error(err?.message || i18n?.t("Something went wrong. Please try again."));
          }
          return; // ⛔ Stop here
        }
      }

      
try {
  // // ✅ Prepare formData
  // const formData = new FormData();

  //           console.log("=======222", uploadedEvidence)


  // // Add all fields to formData
  // formData.append("evidence", uploadedEvidence);
  // formData.append("court_name", values?.court_name);
  // formData.append("case_type", values?.case_type);
  // formData.append("short_description", values?.short_description);
  // formData.append("case_history", values?.case_history);

  // // Add any other fields from your values object
  // Object.keys(values).forEach((key) => {
  //   if (!["evidence", "court_name", "case_type", "short_description", "case_history"].includes(key)) {
  //     formData.append(key, values[key]);
  //   }
  // });

  // ✅ Prepare formData
const formData = new FormData();

// Add array values properly
if (Array.isArray(uploadedEvidence)) {
  uploadedEvidence.forEach((item) => {
    formData.append("evidence[]", item);
  });
} else if (uploadedEvidence) {
  formData.append("evidence", uploadedEvidence);
}

// Add other fields
formData.append("court_name", values?.court_name);
formData.append("case_type", values?.case_type);
formData.append("short_description", values?.short_description);
formData.append("case_history", values?.case_history);

// Add any other fields
Object.keys(values).forEach((key) => {
  if (!["evidence", "court_name", "case_type", "short_description", "case_history"].includes(key)) {
    formData.append(key, values[key]);
  }
});

console.log(
  "FormData contents:",
  Array.from(formData.entries())
);



  // ✅ API call
  let { data, error, msg } = await createNewCase(formData);
  console.log(":rocket: ~ data, error, msg:", data, error, msg);

  if (!!error) {
    message.error(msg || "Something went wrong");
    return;
  } else {
    message.success(msg || "Request sent successfully");
  }
} catch (error) {
  setIsPaymentModal(false);
  console.error("Error creating new case:", error);
}




      setIsCaseDetailsOpen(false); // close only if no error

        // ✅ Save in local state before calling API
  // setCaseDetailsValue({
  //   ...values,
  //   evidence: uploadedEvidence,
  //   case_type: values?.case_type,
  //   short_description: values?.short_description,
  //   case_history: values?.case_history,
  // });
      // setIsPaymentModal(true);
      // setIsAppointmentOpen(false);
    } catch (err) {
      console.error("Error in handleFinish:", err);
      message.error(err?.message || i18n?.t("Unexpected error, please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="!bg-transparent"
      footer={null}
      closeIcon={false}
      open={isCaseDetaiOpen}
      onCancel={() => setIsCaseDetailsOpen(false)}
      style={{ position: "relative", zIndex: "200" }}
      width={getModalWidth()}
      maskClosable={false}
    >
      <div className="lg:max-w-[872px] w-full mx-auto bg-white rounded-[20px] p-[10px] relative">
        <button
          className="w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute sm:top-0 top-[2px] right-[2px] sm:right-0 inline-flex justify-center items-center"
          onClick={() => setIsCaseDetailsOpen(false)}
          type="button"
        >
          <IoClose size={20} className="text-[#242628] text-[12px] cursor-pointer" />
        </button>

        <h3 className="font-large leading-[23.46px] text-[26px] pb-[24px] text-[#191930]">
          {i18n?.t("Register a Case")}
        </h3>

        <Form onFinish={handleFinish} layout="vertical" preserve={true}>

        <Form.Item
  label={
    <p className="text-base font-medium text-[#242628] mb-[12px]">
      {i18n?.t("Court Selection")}
    </p>
  }
  name="court_name"
  rules={[
    { required: true, message: i18n?.t("Please select a court name") },
  ]}
>
  <Select
    placeholder={i18n.t("Select Court")}
    allowClear
    showSearch
    className="h-[50px]"
  >
    {courtList.map((court) => (
      <Select.Option key={court.name} value={court.name}>
        {court.name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>



          <Form.Item
            label={<p className="text-base font-medium text-[#242628] mb-[12px]">{i18n?.t("Case Type")}</p>}
            name="case_type"
            rules={[{ required: true, message: i18n?.t("Please select a case type") }]}
          >
            <Select
              placeholder={i18n.t("Select Case Type")}
              allowClear
              showSearch
              className="h-[50px]"
            >
              {data?.docs?.map((cat) => (
                <Select.Option key={cat?.name} value={cat?.name}>
                  {cat?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="short_description"
            label={<p className="text-base font-medium text-[#242628] mb-[12px]">{i18n?.t("Case Description")}</p>}
            rules={[{ required: true, message: i18n?.t("Please enter description") }]}
          >
            <textarea
              maxLength={500}
              minLength={10}
              className="w-full placeholder:text-base px-4 py-2 lg:h-[180px] md:h-[180px] h-[4rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={i18n?.t("This case involves Party A and Party B, concerning the alleged murder of Victim's Name.")}
              required
            />
          </Form.Item>

          <Form.Item
            name="case_history"
            label={<p className="text-base font-medium text-[#242628] mb-[12px]">{i18n?.t("Case History")}</p>}
            rules={[{ required: true, message: i18n?.t("Please enter case_history") }]}
          >
            <textarea
              className="w-full placeholder:text-base px-4 py-2 lg:h-[180px] md:h-[180px] h-[4rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={i18n?.t("This case involves Party A and Party B, concerning the alleged murder of Victim's Name.")}
            />
          </Form.Item>

          <div className="mb-2">
            <UploadFileComponent
              className="p-[8px]"
              max={5}
              name="evidence"
              fileList={fileList}
              setFileList={setFileList}
              rules={[{ required: true, message: i18n?.t("Please upload pdf") }]}
              label={<p className="text-base font-medium text-[#242628] mb-[12px]">{i18n?.t("Documents")}</p>}
            />
          </div>

<button
  type="submit"
  disabled={loading}
  className={`border-2 bg-primary text-white border-primary w-[80%] mx-auto mt-10 block py-4 rounded-[8px] transition-all font-medium sm:text-base text-sm ${
    loading
      ? "opacity-50 cursor-not-allowed"
      : "hover:bg-transparent hover:text-primary"
  }`}
>
  {loading ? i18n?.t("Uploading...") : i18n?.t("Submit Request")}
</button>

        </Form>
      </div>
    </Modal>
  );
};

export default CaseDetailsModal;
