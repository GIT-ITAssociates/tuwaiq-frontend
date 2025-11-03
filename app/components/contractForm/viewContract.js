"use client";
import React, { useState, useEffect, useRef } from "react";
import { Col, Form, Input, Row, Typography, message } from "antd";
import { useI18n } from "@/app/providers/i18n";
import Button from "@/app/components/common/button";
import { createNewContract } from "@/app/helpers/backend";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useUser } from "@/app/context/userContext";

const ViewContractForm = ({
  variant = "create",
  userName,
  caseID,
  data,
  referenceID,
  handleAccept,
  handleDecline,
}) => {
  const i18n = useI18n();
  const isViewMode = variant === "view";
  const [summary, setSummary] = useState("");
  const { push } = useRouter();
  const [form] = Form.useForm();
  const pdfRef = useRef(null);
  const { user } = useUser();

  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
  const currentLanguage =
    i18n?.languages?.find((lang) => lang?._id === langFromLocalStorage)?.name ||
    "English";

  const [milestones, setMilestones] = useState(
    Array(5).fill({ description: "", amount: "", percentage: "" })
  );

  // ✅ Load Contract Data
  useEffect(() => {
    if (isViewMode && data?.contract_milestone?.length) {
      setMilestones(
        data.contract_milestone.map((m) => ({
          description: m.milestone_summary,
          amount: m.amount,
          percentage: m.percentage,
          status: m.status,
        }))
      );
    }
  }, [data, isViewMode]);

  useEffect(() => {
    if (isViewMode && data?.contract_summary) {
      form.setFieldsValue({ notes: data.contract_summary });
      setSummary(data.contract_summary);
    }
  }, [data, isViewMode]);

  const handleChange = (index, field, value) => {
    if (isViewMode) return;
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const totalAmount = isViewMode
    ? data?.total_amount || 0
    : milestones.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const calculatePercentage = (amount) => {
    if (isViewMode || !totalAmount || !amount) return "";
    const percent = ((amount / totalAmount) * 100).toFixed(1);
    return `${percent}%`;
  };

  const handleSubmit = async () => {
    const filled = milestones
      .filter((m) => m.description && m.amount)
      .map((m) => ({
        milestone_summary: m.description,
        amount: m.amount,
        percentage: ((m.amount / totalAmount) * 100).toFixed(1),
        status: "pending",
      }));

    const payload = {
      case_id: caseID,
      contract_summary: summary,
      contract_milestone: filled,
      total_amount: totalAmount.toString(),
    };

    const { data: response, error, msg } = await createNewContract(payload);
    if (error) {
      message.error(msg || "Something went wrong");
    } else {
      message.success(msg || "Request sent successfully");
      push("/admin/our-cases");
    }
  };

  // ✅ Generate PDF (fix for input clipping + visible watermark)
const downloadPDF = async () => {
  const input = pdfRef.current;
  if (!input) {
    console.error("PDF container not found!");
    return;
  }

  // Hide all buttons temporarily
  const buttons = document.querySelectorAll("button");
  buttons.forEach((btn) => (btn.style.display = "none"));

  // Replace inputs and textareas with text divs for clean capture
  const inputs = input.querySelectorAll("input, textarea");
  const replaced = [];
  inputs.forEach((el) => {
    const text = document.createElement("div");
    text.innerText = el.value || el.textContent || "";
    text.style.cssText = `
      border: 1px solid #707070;
      border-radius: 6px;
      padding: 6px 10px;
      min-height: ${el.offsetHeight}px;
      line-height: 1.4;
      font-size: 14px;
      color: #000;
      background: #fff;
      width: ${el.offsetWidth}px;
      overflow-wrap: break-word;
    `;
    el.parentNode.insertBefore(text, el);
    el.style.display = "none";
    replaced.push({ el, text });
  });

  await new Promise((r) => setTimeout(r, 300));

  const canvas = await html2canvas(input, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // ✅ Add centered watermark
  const addWatermark = (pdf) => {
    const wmWidth = 90; // watermark size
    const wmHeight = 90;
    const wmX = (pdfWidth - wmWidth) / 2;
    const wmY = (pdfHeight - wmHeight) / 2;
    pdf.addImage("/images/watermark1.png", "PNG", wmX, wmY, wmWidth, wmHeight, "", "FAST");
  };

  // ✅ Draw first page (content + watermark layered correctly)
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight * 1.02);
  addWatermark(pdf);

  heightLeft -= pdfHeight;

  // ✅ Add extra pages if needed
  while (heightLeft > 10) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight * 1.02);
    addWatermark(pdf);
    heightLeft -= pdfHeight;
  }

  pdf.save(`Contract_${data?.case?._id || "file"}.pdf`);

  // Restore replaced elements
  replaced.forEach(({ el, text }) => {
    text.remove();
    el.style.display = "";
  });

  // Restore buttons
  buttons.forEach((btn) => (btn.style.display = "block"));
};



  return (
    <>
      {/* ===== MAIN CONTRACT WRAPPER ===== */}
      <div
        ref={pdfRef}
        style={{
          position: "relative",
          backgroundColor: "#fff",
          borderRadius: "20px",
          width: "794px",
          minHeight: "1123px",
          padding: "220px 70px 160px 70px",
          margin: "0 auto",
          overflow: "visible",
          boxShadow: isViewMode ? "0 0 8px rgba(0,0,0,0.1)" : "none",
          transformOrigin: "top center",
        }}
      >
        {/* ===== HEADER ===== */}
        <div
          style={{
            position: "absolute",
            top: "25px",
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 70px",
            zIndex: 10,
          }}
        >
          <img src="/images/header3.svg" style={{ height: 70 }} alt="Header 1" />
          <img src="/images/header1.svg" style={{ height: 90 }} alt="Header 2" />
          <img src="/images/header2.svg" style={{ height: 70 }} alt="Header 3" />
        </div>

        {/* ===== HEADER LINES ===== */}
        <div
          style={{
            position: "absolute",
            top: "145px",
            left: "40px",
            width: "calc(100% - 80px)",
            height: "3px",
            backgroundColor: "#B88A44",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "155px",
            left: "40px",
            width: "calc(100% - 80px)",
            height: "10px",
            backgroundColor: "#B88A44",
          }}
        />

        {/* ===== WATERMARK ===== */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "380px",
            height: "380px",
            backgroundImage: "url('/images/watermark.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            opacity: 0.1,
            zIndex: 1,
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }}
        />

        {/* ===== FOOTER LINES ===== */}
        <div
          style={{
            position: "absolute",
            bottom: "178px",
            left: "40px",
            width: "calc(100% - 80px)",
            height: "3px",
            backgroundColor: "#B88A44",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "160px",
            left: "40px",
            width: "calc(100% - 80px)",
            height: "10px",
            backgroundColor: "#B88A44",
          }}
        />

        {/* ===== FOOTER IMAGE (auto height) ===== */}
        <div
          style={{
            position: "absolute",
            bottom: "90px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            zIndex: 5,
            textAlign: "center",
          }}
        >
          <img
            src="/images/footer.svg"
            alt="Footer"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
            marginBottom: "40px",
            position: "relative",
            zIndex: 2,
            gap: "180px",
          }}
        >
          <div
            style={{
              flex: 1,
              border: "1px solid #707070",
              borderRadius: "8px",
              padding: "16px 20px",
              fontWeight: 600,
              color: "#374151",
              lineHeight: 1.6,
              minHeight: "90px",
            }}
          >
            <div>Client Name: {userName || "Client"}</div>
            <div>Case ID: {referenceID || "N/A"}</div>
          </div>

          <div
            style={{
              width: "160px",
              border: "1px solid #707070",
              borderRadius: "8px",
              padding: "16px 20px",
              fontWeight: 600,
              color: "#1f2937",
              fontSize: "22px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "90px",
            }}
          >
            Contract
          </div>
        </div>

        {/* ===== CONTRACT FORM ===== */}
        <Form form={form} onFinish={handleSubmit} style={{ zIndex: 2, position: "relative" }}>
          <Typography.Text strong className="text-[#4a5568] block mb-2">
            Contract Summary
          </Typography.Text>

          <Form.Item name="notes" style={{ marginBottom: "60px" }}>
            <Input.TextArea
              value={summary}
              onChange={(e) => !isViewMode && setSummary(e.target.value)}
              readOnly={isViewMode}
              autoSize={{ minRows: 5 }}
              placeholder="Write your contract summary"
              className="border border-[#707070] rounded-md"
            />
          </Form.Item>

          {/* ===== MILESTONES ===== */}
          <div className="rounded-[10px] overflow-hidden">
            <div className="grid grid-cols-12 bg-[#D8B35D] text-white font-normal text-xl px-6 py-2 rounded-[10px]">
              <div className="col-span-7">Case Milestones</div>
              <div className="col-span-3 text-center">Amount</div>
              <div className="col-span-2 text-center">Percentage</div>
            </div>

            <div className="bg-white">
              {milestones.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 px-0"
                  style={{
                    alignItems: "center",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <div className="col-span-7 pr-2">
                    <Input.TextArea
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleChange(index, "description", e.target.value)}
                      readOnly={isViewMode}
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      className="border border-[#707070] rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="col-span-3 px-2">
                    <Input
                      placeholder="SAR"
                      type="text"
                      value={item.amount}
                      onChange={(e) => handleChange(index, "amount", e.target.value)}
                      readOnly={isViewMode}
                      className="border border-[#707070] rounded-md text-right px-3 py-2"
                    />
                  </div>

                  <div
                    className="col-span-2 text-center"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      minHeight: "40px",
                    }}
                  >
                    {isViewMode
                      ? `${item.percentage}%`
                      : calculatePercentage(parseFloat(item.amount) || 0)}
                  </div>
                </div>
              ))}
            </div>

            {/* ===== TOTAL ===== */}
            <div className="flex flex-wrap justify-end items-center gap-3 px-6 py-4 rounded-b-[10px]">
              <span className="text-lg text-gray-700">Total Amount</span>
              <Input
                value={`${totalAmount.toLocaleString()}`}
                readOnly
                className="w-48 text-right text-lg border border-[#707070] rounded-md bg-white"
              />
            </div>
          </div>
        </Form>
      </div>

      {/* ===== ACTION BUTTON ===== */}
      <Row justify="end" style={{ marginTop: 28 }} className="p-5">
        <Col>
          <button
            type="button"
            className="bg-primary text-white px-4 py-2 rounded-[8px] font-medium text-sm hover:opacity-90 transition"
            onClick={downloadPDF}
          >
            {currentLanguage === "Arabic" ? "تحميل العقد" : "Download Contract"}
          </button>
        </Col>
      </Row>
    </>
  );
};

export default ViewContractForm;










// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { Col, Form, Input, Row, Typography, message } from "antd";
// import { useI18n } from "@/app/providers/i18n";
// import Button from "@/app/components/common/button";
// import { createNewContract } from "@/app/helpers/backend";
// import { useRouter } from "next/navigation";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { useUser } from "@/app/context/userContext";

// const ViewContractForm = ({
//   variant = "create",
//   userName,
//   caseID,
//   data,
//   referenceID,
//   handleAccept,
//   handleDecline,
// }) => {
//   const i18n = useI18n();
//   const isViewMode = variant === "view";
//   const [summary, setSummary] = useState("");
//   const { push } = useRouter();
//   const [form] = Form.useForm();
//   const pdfRef = useRef(null);
//   const { user } = useUser();

//   const langFromLocalStorage =
//     typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
//   const currentLanguage =
//     i18n?.languages?.find((lang) => lang?._id === langFromLocalStorage)?.name ||
//     "English";

//   const [milestones, setMilestones] = useState(
//     Array(5).fill({ description: "", amount: "", percentage: "" })
//   );

//   // ✅ Load Contract Data
//   useEffect(() => {
//     if (isViewMode && data?.contract_milestone?.length) {
//       setMilestones(
//         data.contract_milestone.map((m) => ({
//           description: m.milestone_summary,
//           amount: m.amount,
//           percentage: m.percentage,
//           status: m.status,
//         }))
//       );
//     }
//   }, [data, isViewMode]);

//   useEffect(() => {
//     if (isViewMode && data?.contract_summary) {
//       form.setFieldsValue({ notes: data.contract_summary });
//       setSummary(data.contract_summary);
//     }
//   }, [data, isViewMode]);

//   const handleChange = (index, field, value) => {
//     if (isViewMode) return;
//     const updated = [...milestones];
//     updated[index] = { ...updated[index], [field]: value };
//     setMilestones(updated);
//   };

//   const totalAmount = isViewMode
//     ? data?.total_amount || 0
//     : milestones.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

//   const calculatePercentage = (amount) => {
//     if (isViewMode || !totalAmount || !amount) return "";
//     const percent = ((amount / totalAmount) * 100).toFixed(1);
//     return `${percent}%`;
//   };

//   const handleSubmit = async () => {
//     const filled = milestones
//       .filter((m) => m.description && m.amount)
//       .map((m) => ({
//         milestone_summary: m.description,
//         amount: m.amount,
//         percentage: ((m.amount / totalAmount) * 100).toFixed(1),
//         status: "pending",
//       }));

//     const payload = {
//       case_id: caseID,
//       contract_summary: summary,
//       contract_milestone: filled,
//       total_amount: totalAmount.toString(),
//     };

//     const { data: response, error, msg } = await createNewContract(payload);
//     if (error) {
//       message.error(msg || "Something went wrong");
//     } else {
//       message.success(msg || "Request sent successfully");
//       push("/admin/our-cases");
//     }
//   };
// const downloadPDF = async () => {
//   const input = pdfRef.current;
//   if (!input) return;

//   // 1️⃣ Add a temporary invisible buffer div at the bottom
//   const bufferDiv = document.createElement("div");
//   bufferDiv.style.height = "40px"; // ensures bottom capture
//   bufferDiv.style.background = "transparent";
//   input.appendChild(bufferDiv);

//   await new Promise((r) => setTimeout(r, 400));

//   const canvas = await html2canvas(input, {
//     scale: 2,
//     useCORS: true,
//     backgroundColor: "#ffffff",
//     scrollX: 0,
//     scrollY: -window.scrollY,
//     windowWidth: input.scrollWidth,
//     windowHeight: input.scrollHeight + 60, // 2️⃣ extra bottom buffer
//     logging: false,
//   });

//   // Remove buffer div so it doesn't affect layout later
//   input.removeChild(bufferDiv);

//   const imgData = canvas.toDataURL("image/png");
//   const pdf = new jsPDF("p", "mm", "a4");

//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = pdf.internal.pageSize.getHeight();
//   const imgWidth = pdfWidth;
//   const imgHeight = (canvas.height * pdfWidth) / canvas.width;

//   let heightLeft = imgHeight;
//   let position = -2; // 3️⃣ slight upward shift to prevent cut

//   const addWatermark = (pdf) => {
//     pdf.addImage("/images/watermark1.png", "PNG", 60, 120, 90, 90, "", "FAST");
//   };

//   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight * 1.015);
//   addWatermark(pdf);

//   heightLeft -= pdfHeight;

//   while (heightLeft > 10) {
//     position -= pdfHeight;
//     pdf.addPage();
//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight * 1.015);
//     addWatermark(pdf);
//     heightLeft -= pdfHeight;
//   }

//   pdf.save(`Contract_${data?.case?._id || "file"}.pdf`);
// };


//   return (
//     <>
//       {/* ===== MAIN CONTRACT WRAPPER ===== */}
//       <div
//         ref={pdfRef}
//         style={{
//           position: "relative",
//           backgroundColor: "#fff",
//           borderRadius: "20px",
//           width: "794px",
//           minHeight: "1123px",
//           padding: "220px 70px 160px 70px",
//           margin: "0 auto",
//           overflow: "visible",
//           boxShadow: isViewMode ? "0 0 8px rgba(0,0,0,0.1)" : "none",
//           transformOrigin: "top center",
//         }}
//       >
//         {/* ===== HEADER (3 SVG IMAGES) ===== */}
//         <div
//           style={{
//             position: "absolute",
//             top: "25px",
//             left: 0,
//             width: "100%",
//             display: "flex",
//             justifyContent: "space-between",
//             padding: "0 70px",
//             zIndex: 10,
//           }}
//         >
//           <img src="/images/header3.svg" style={{ height: 70 }} alt="Header 1" />
//           <img src="/images/header1.svg" style={{ height: 90 }} alt="Header 2" />
//           <img src="/images/header2.svg" style={{ height: 70 }} alt="Header 3" />
//         </div>

//         {/* ===== HEADER LINES ===== */}
//         <div
//           style={{
//             position: "absolute",
//             top: "145px",
//             left: "40px",
//             width: "calc(100% - 80px)",
//             height: "3px",
//             backgroundColor: "#B88A44",
//             zIndex: 5,
//           }}
//         />
//         <div
//           style={{
//             position: "absolute",
//             top: "155px",
//             left: "40px",
//             width: "calc(100% - 80px)",
//             height: "10px",
//             backgroundColor: "#B88A44",
//             zIndex: 5,
//           }}
//         />

//         {/* ===== WATERMARK ===== */}
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: "380px",
//             height: "380px",
//             backgroundImage: "url('/images/watermark.svg')",
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//             backgroundSize: "contain",
//             opacity: 0.1,
//             zIndex: 1,
//             mixBlendMode: "multiply",
//             pointerEvents: "none",
//           }}
//         />

//         {/* ===== FOOTER LINES ===== */}
//         <div
//           style={{
//             position: "absolute",
//             bottom: "178px",
//             left: "40px",
//             width: "calc(100% - 80px)",
//             height: "3px",
//             backgroundColor: "#B88A44",
//             zIndex: 5,
//           }}
//         />
//         <div
//           style={{
//             position: "absolute",
//             bottom: "160px",
//             left: "40px",
//             width: "calc(100% - 80px)",
//             height: "10px",
//             backgroundColor: "#B88A44",
//             zIndex: 5,
//           }}
//         />

//         {/* ===== FOOTER IMAGE ===== */}
//         {/* <div
//           style={{
//             position: "absolute",
//             bottom: "90px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             width: "80%",
//             height: "100px",
//             background: "url('/images/footer.svg') center bottom / contain no-repeat",
//             zIndex: 5,
//           }}
//         /> */}

//         <div
//   style={{
//     position: "absolute",
//     bottom: "90px",
//     left: "50%",
//     transform: "translateX(-50%)",
//     width: "90%",
//     aspectRatio: "6 / 1", // adjust based on your image ratio
//     background: "url('/images/footer.svg') center bottom / contain no-repeat",
//     zIndex: 5,
//   }}
// />


//         {/* ===== MAIN CONTENT ===== */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "100px",
//             marginBottom: "40px",
//             position: "relative",
//             zIndex: 2,
//             gap: "180px",
//           }}
//         >
//           <div
//             style={{
//               flex: 1,
//               border: "1px solid #707070",
//               borderRadius: "8px",
//               padding: "16px 20px",
//               fontWeight: 600,
//               color: "#374151",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               textAlign: "left",
//               lineHeight: 1.6,
//               minHeight: "90px",
//             }}
//           >
//             <div>Client Name: {userName || "Client"}</div>
//             <div>Case ID: {referenceID || "N/A"}</div>
//           </div>

//           <div
//             style={{
//               width: "160px",
//               border: "1px solid #707070",
//               borderRadius: "8px",
//               padding: "16px 20px",
//               fontWeight: 600,
//               color: "#1f2937",
//               fontSize: "22px",
//               textAlign: "center",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               minHeight: "90px",
//             }}
//           >
//             Contract
//           </div>
//         </div>

//         <Form
//           form={form}
//           className="mt-[40px]"
//           onFinish={handleSubmit}
//           style={{ position: "relative", zIndex: 2 }}
//         >
//           <Typography.Text
//             strong
//             className="text-[#4a5568] block mb-2"
//             style={{ marginBottom: "12px" }}
//           >
//             Contract Summary
//           </Typography.Text>

//           <Form.Item name="notes" style={{ marginBottom: "60px" }}>
//             <Input.TextArea
//               name="notes"
//               value={summary}
//               onChange={(e) => !isViewMode && setSummary(e.target.value)}
//               readOnly={isViewMode}
//               autoSize={{ minRows: 5 }}
//               placeholder="Write your contract summary"
//               className="border border-[#707070] rounded-md"
//             />
//           </Form.Item>

//           {/* ===== MILESTONES ===== */}
//           <div className="rounded-[10px] overflow-hidden">
//             <div className="grid grid-cols-12 bg-[#D8B35D] text-white font-normal text-xl px-6 py-2 rounded-[10px]">
//               <div className="col-span-7">Case Milestones</div>
//               <div className="col-span-3 text-center">Amount</div>
//               <div className="col-span-2 text-center">Percentage</div>
//             </div>

//             {/* ===== FIXED INPUT SECTION ===== */}
//             <div className="bg-white">
//               {milestones.map((item, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-12 px-0"
//                   style={{
//                     alignItems: "center",
//                     paddingTop: "8px",
//                     paddingBottom: "8px",
//                     boxSizing: "border-box",
//                   }}
//                 >
//                   <div className="col-span-7 pr-2">
//                     <Input.TextArea
//                       placeholder="Description"
//                       value={item.description}
//                       onChange={(e) =>
//                         handleChange(index, "description", e.target.value)
//                       }
//                       readOnly={isViewMode}
//                       autoSize={{ minRows: 1, maxRows: 3 }}
//                       className="border border-[#707070] rounded-md px-3 py-2"
//                       style={{
//                         width: "100%",
//                         fontSize: "14px",
//                         lineHeight: "1.6",
//                         boxSizing: "border-box",
//                       }}
//                     />
//                   </div>

//                   <div className="col-span-3 px-2">
//                     <Input
//                       placeholder="SAR"
//                       type="text"
//                       value={item.amount}
//                       onChange={(e) =>
//                         handleChange(index, "amount", e.target.value)
//                       }
//                       readOnly={isViewMode}
//                       className="border border-[#707070] rounded-md text-right px-3 py-2"
//                       style={{
//                         width: "100%",
//                         fontSize: "14px",
//                         lineHeight: "1.6",
//                         boxSizing: "border-box",
//                       }}
//                     />
//                   </div>

//                   <div
//                     className="col-span-2 text-center"
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: "14px",
//                       lineHeight: "1.6",
//                       minHeight: "40px",
//                     }}
//                   >
//                     {isViewMode
//                       ? `${item.percentage}%`
//                       : calculatePercentage(parseFloat(item.amount) || 0)}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* ===== TOTAL ===== */}
//             <div className="flex flex-wrap justify-end items-center gap-3 px-6 py-4 rounded-b-[10px]">
//               <span className="text-lg text-gray-700">Total Amount</span>
//               <Input
//                 value={`${totalAmount.toLocaleString()}`}
//                 readOnly
//                 className="w-48 text-right text-lg border border-[#707070] rounded-md bg-white"
//               />
//             </div>
//           </div>
//         </Form>
//       </div>

//       {/* ===== ACTION BUTTONS ===== */}
//       {data?.case?.status === "pending_contract" && user?.role !== "admin" ? (
//         <>
//           {isViewMode ? (
//             <Row justify="end" gutter={12} style={{ marginTop: 28 }} className="p-5">
//               <Col>
//                 <button
//                   type="button"
//                   className="pill-btn ghost border lg:px-8 text-textMain md:px-4 h-fit py-2 px-2 rounded-[8px] text-sm text-[#C7A87D] border-[#C7A87D]"
//                   onClick={handleDecline}
//                 >
//                   Decline
//                 </button>
//               </Col>
//               <Col>
//                 <Button onClick={handleAccept}>{i18n?.t("Accept")}</Button>
//               </Col>
//             </Row>
//           ) : (
//             <Row justify="end" gutter={12} style={{ marginTop: 28 }} className="p-5">
//               <Col>
//                 <button
//                   type="button"
//                   className="pill-btn ghost border lg:px-8 text-textMain md:px-4 h-fit py-2 px-2 rounded-[8px] text-sm text-[#C7A87D] border-[#C7A87D]"
//                   onClick={handleDecline}
//                 >
//                   Decline
//                 </button>
//               </Col>
//               <Col>
//                 <Button type="submit">{i18n?.t("Submit")}</Button>
//               </Col>
//             </Row>
//           )}
//         </>
//       ) : (
//         <Row justify="end" style={{ marginTop: 28 }} className="p-5">
//           <Col>
//             <button
//               type="button"
//               className="bg-primary text-white px-4 py-2 rounded-[8px] font-medium text-sm hover:opacity-90 transition"
//               onClick={downloadPDF}
//             >
//               {currentLanguage === "Arabic"
//                 ? "تحميل العقد"
//                 : "Download Contract"}
//             </button>
//           </Col>
//         </Row>
//       )}
//     </>
//   );
// };

// export default ViewContractForm;




// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { Col, Form, Input, Row, Typography, message } from "antd";
// import { useI18n } from "@/app/providers/i18n";
// import Button from "@/app/components/common/button";
// import { createNewContract } from "@/app/helpers/backend";
// import { useRouter } from "next/navigation";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { useUser } from "@/app/context/userContext";

// const ViewContractForm = ({
//   variant = "create",
//   userName,
//   caseID,
//   data,
//   referenceID,
//   handleAccept,
//   handleDecline,
// }) => {
//   const i18n = useI18n();
//   const isViewMode = variant === "view";
//   const [summary, setSummary] = useState("");
//   const { push } = useRouter();
//   const [form] = Form.useForm();
//   const pdfRef = useRef(null);
//   const { user } = useUser();

//   const langFromLocalStorage =
//     typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
//   const currentLanguage =
//     i18n?.languages?.find((lang) => lang?._id === langFromLocalStorage)?.name ||
//     "English";

//   const [milestones, setMilestones] = useState(
//     Array(5).fill({ description: "", amount: "", percentage: "" })
//   );

//   useEffect(() => {
//     if (isViewMode && data?.contract_milestone?.length) {
//       setMilestones(
//         data.contract_milestone.map((m) => ({
//           description: m.milestone_summary,
//           amount: m.amount,
//           percentage: m.percentage,
//           status: m.status,
//         }))
//       );
//     }
//   }, [data, isViewMode]);

//   useEffect(() => {
//     if (isViewMode && data?.contract_summary) {
//       form.setFieldsValue({ notes: data.contract_summary });
//       setSummary(data.contract_summary);
//     }
//   }, [data, isViewMode]);

//   const handleChange = (index, field, value) => {
//     if (isViewMode) return;
//     const updated = [...milestones];
//     updated[index] = { ...updated[index], [field]: value };
//     setMilestones(updated);
//   };

//   const totalAmount = isViewMode
//     ? data?.total_amount || 0
//     : milestones.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

//   const calculatePercentage = (amount) => {
//     if (isViewMode || !totalAmount || !amount) return "";
//     const percent = ((amount / totalAmount) * 100).toFixed(1);
//     return `${percent}%`;
//   };

//   const handleSubmit = async () => {
//     const filled = milestones
//       .filter((m) => m.description && m.amount)
//       .map((m) => ({
//         milestone_summary: m.description,
//         amount: m.amount,
//         percentage: ((m.amount / totalAmount) * 100).toFixed(1),
//         status: "pending",
//       }));

//     const payload = {
//       case_id: caseID,
//       contract_summary: summary,
//       contract_milestone: filled,
//       total_amount: totalAmount.toString(),
//     };

//     const { data: response, error, msg } = await createNewContract(payload);
//     if (error) {
//       message.error(msg || "Something went wrong");
//     } else {
//       message.success(msg || "Request sent successfully");
//       push("/admin/our-cases");
//     }
//   };

//   // ✅ Clean download without duplicating headers/footers
//   const downloadPDF = async () => {
//     const input = pdfRef.current;
//     if (!input) return;

//     // Hide preview header/footer/watermark before capture
//     const hiddenElements = input.querySelectorAll(".hide-in-pdf");
//     hiddenElements.forEach((el) => (el.style.display = "none"));

//     await new Promise((r) => setTimeout(r, 200));

//     const canvas = await html2canvas(input, {
//       scale: 2,
//       useCORS: true,
//       backgroundColor: "#ffffff",
//       scrollX: 0,
//       scrollY: 0,
//       windowWidth: input.scrollWidth,
//     });

//     // Re-show them after capture
//     hiddenElements.forEach((el) => (el.style.display = ""));

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");

//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();

//     const imgWidth = pdfWidth;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//     let heightLeft = imgHeight;
//     let position = 0;
//     let pageNumber = 0;

//     while (heightLeft > 0) {
//       pageNumber += 1;

//       if (pageNumber > 1) pdf.addPage();

//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST");

//       // Add header/footer/watermark for each page
//       pdf.addImage("/images/header3.png", "PNG", 15, 10, 40, 20);
//       pdf.addImage("/images/header1.png", "PNG", 85, 5, 40, 25);
//       pdf.addImage("/images/header2.png", "PNG", 155, 10, 40, 20);

//       pdf.setDrawColor(184, 138, 68);
//       pdf.setLineWidth(0.5);
//       pdf.line(15, 40, 195, 40);
//       pdf.setLineWidth(2.5);
//       pdf.line(15, 43, 195, 43);

//       pdf.setLineWidth(2.5);
//       pdf.line(15, 270, 195, 270);
//       pdf.setLineWidth(0.5);
//       pdf.line(15, 273, 195, 273);

//       pdf.addImage("/images/footer11.png", "PNG", 20, 275, 170, 15);
//       pdf.addImage("/images/watermark1.png", "PNG", 60, 120, 90, 90, "", "FAST");

//       heightLeft -= pdfHeight;
//       position -= pdfHeight;
//     }

//     pdf.save(`Contract_${data?.case?._id || "file"}.pdf`);
//   };

//   return (
//     <>
//       {/* ===== MAIN CONTRACT WRAPPER ===== */}
//       <div
//         ref={pdfRef}
//         style={{
//           position: "relative",
//           backgroundColor: "#fff",
//           borderRadius: "20px",
//           width: "794px",
//           minHeight: "1123px",
//           padding: "220px 70px 160px 70px",
//           margin: "0 auto",
//           overflow: "visible",
//           boxShadow: isViewMode ? "0 0 8px rgba(0,0,0,0.1)" : "none",
//           transformOrigin: "top center",
//         }}
//       >
//         {/* ===== HEADER (Hidden in PDF) ===== */}
//         <div
//           className="hide-in-pdf"
//           style={{
//             position: "absolute",
//             top: "25px",
//             left: 0,
//             width: "100%",
//             display: "flex",
//             justifyContent: "space-between",
//             padding: "0 70px",
//             zIndex: 10,
//           }}
//         >
//           <img src="/images/header13.png" style={{ height: 70 }} alt="Header 1" />
//           <img src="/images/header11.png" style={{ height: 90 }} alt="Header 2" />
//           <img src="/images/header12.png" style={{ height: 70 }} alt="Header 3" />
//         </div>

//         {/* HEADER DIVIDERS */}
//         <div
//           className="hide-in-pdf"
//           style={{
//             position: "absolute",
//             top: "145px",
//             left: "40px",
//             width: "calc(100% - 80px)",
//             height: "3px",
//             backgroundColor: "#B88A44",
//             zIndex: 5,
//           }}
//         />
//         <div
//           className="hide-in-pdf"
//           style={{
//             position: "absolute",
//             top: "155px",
//             left: "40px",
//             width: "calc(100% - 80px)",
//             height: "10px",
//             backgroundColor: "#B88A44",
//             zIndex: 5,
//           }}
//         />

//         {/* WATERMARK */}
//         <div
//           className="hide-in-pdf"
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: "380px",
//             height: "380px",
//             backgroundImage: "url('/images/watermark1.png')",
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//             backgroundSize: "contain",
//             opacity: 0.08,
//             zIndex: 1,
//             mixBlendMode: "multiply",
//             pointerEvents: "none",
//           }}
//         />

//         {/* FOOTER LINES */}
//         <div
//           className="hide-in-pdf"
//           style={{
//             position: "absolute",
//             bottom: "178px",
//             left: "40px",
//             width: "calc(100% - 80px)",
//             height: "3px",
//             backgroundColor: "#B88A44",
//             zIndex: 5,
//           }}
//         />
//         <div
//           className="hide-in-pdf"
//           style={{
//             position: "absolute",
//             bottom: "160px",
//             left: "40px",
//             width: "calc(100% - 80px)",
//             height: "10px",
//             backgroundColor: "#B88A44",
//             zIndex: 5,
//           }}
//         />

//         {/* FOOTER IMAGE */}
//         <div
//           className="hide-in-pdf"
//           style={{
//             position: "absolute",
//             bottom: "90px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             width: "90%",
//             height: "100px",
//             background: "url('/images/footer11.png') center bottom / contain no-repeat",
//             zIndex: 5,
//           }}
//         />

//         {/* ===== CONTENT ===== */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "100px",
//             marginBottom: "40px",
//             position: "relative",
//             zIndex: 2,
//             gap: "180px",
//           }}
//         >
//           <div
//             style={{
//               flex: 1,
//               border: "1px solid #707070",
//               borderRadius: "8px",
//               padding: "16px 20px",
//               fontWeight: 600,
//               color: "#374151",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               textAlign: "left",
//               lineHeight: 1.6,
//               minHeight: "90px",
//             }}
//           >
//             <div>Client Name: {userName || "Client"}</div>
//             <div>Case ID: {referenceID || "N/A"}</div>
//           </div>

//           <div
//             style={{
//               width: "160px",
//               border: "1px solid #707070",
//               borderRadius: "8px",
//               padding: "16px 20px",
//               fontWeight: 600,
//               color: "#1f2937",
//               fontSize: "22px",
//               textAlign: "center",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               minHeight: "90px",
//             }}
//           >
//             Contract
//           </div>
//         </div>

//         {/* CONTRACT SUMMARY */}
//         <Form
//           form={form}
//           className="mt-[40px]"
//           onFinish={handleSubmit}
//           style={{ position: "relative", zIndex: 2 }}
//         >
//           <Typography.Text
//             strong
//             className="text-[#4a5568] block mb-2"
//             style={{ marginBottom: "12px" }}
//           >
//             Contract Summary
//           </Typography.Text>

//           <Form.Item name="notes" style={{ marginBottom: "60px" }}>
//             <Input.TextArea
//               name="notes"
//               value={summary}
//               onChange={(e) => !isViewMode && setSummary(e.target.value)}
//               readOnly={isViewMode}
//               autoSize={{ minRows: 5 }}
//               placeholder="Write your contract summary"
//               className="border border-[#707070] rounded-md"
//               style={{
//                 whiteSpace: "pre-wrap",
//                 wordBreak: "break-word",
//                 overflowWrap: "break-word",
//               }}
//             />
//           </Form.Item>

//           {/* MILESTONES */}
//           <div className="rounded-[10px] overflow-hidden">
//             <div className="grid grid-cols-12 bg-[#D8B35D] text-white font-normal text-xl px-6 py-2 rounded-[10px]">
//               <div className="col-span-7">Case Milestones</div>
//               <div className="col-span-3 text-center">Amount</div>
//               <div className="col-span-2 text-center">Percentage</div>
//             </div>

//             <div className="bg-white">
//               {milestones.map((item, index) => (
//                 <div key={index} className="grid grid-cols-12 py-2 px-0">
//                   <div className="col-span-7">
//                     <Input
//                       placeholder="Description of Milestone"
//                       value={item.description}
//                       onChange={(e) =>
//                         handleChange(index, "description", e.target.value)
//                       }
//                       readOnly={isViewMode}
//                       className="border border-[#707070] rounded-md px-3 py-2"
//                     />
//                   </div>

//                   <div className="col-span-3 px-3">
//                     <Input
//                       placeholder="SAR"
//                       type="text"
//                       value={item.amount}
//                       onChange={(e) =>
//                         handleChange(index, "amount", e.target.value)
//                       }
//                       readOnly={isViewMode}
//                       className="border border-[#707070] rounded-md text-right px-3 py-2"
//                     />
//                   </div>

//                   <div className="col-span-2 text-center">
//                     {isViewMode
//                       ? `${item.percentage}%`
//                       : calculatePercentage(parseFloat(item.amount) || 0)}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* TOTAL */}
//             <div className="flex flex-wrap justify-end items-center gap-3 px-6 py-4 rounded-b-[10px]">
//               <span className="text-lg text-gray-700">Total Amount</span>
//               <Input
//                 value={`${totalAmount.toLocaleString()}`}
//                 readOnly
//                 className="w-48 text-right text-lg border border-[#707070] rounded-md bg-white"
//               />
//             </div>
//           </div>
//         </Form>
//       </div>

//       {/* ACTION BUTTON */}
//       <Row justify="end" style={{ marginTop: 28 }} className="p-5">
//         <Col>
//           <button
//             type="button"
//             className="bg-primary text-white px-4 py-2 rounded-[8px] font-medium text-sm hover:opacity-90 transition"
//             onClick={downloadPDF}
//           >
//             {currentLanguage === "Arabic" ? "تحميل العقد" : "Download Contract"}
//           </button>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default ViewContractForm;
