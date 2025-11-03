"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, message } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getContractByCaseId, updateCaseRequest } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import Head from "next/head";


const InvoicePage = ({ params }) => {
  const { push } = useRouter();
  const [data, getData] = useFetch(getContractByCaseId);
  const pdfRef = useRef(null);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (params?.id) getData({ caseId: params?.id });
  }, [params?.id]);

  const handlePay = async () => {
    try {
      const res = await updateCaseRequest({
        _id: data?.case?._id,
        status: "ongoing",
      });

      if (res?.error) {
        message.error(res?.msg || res?.message);
      } else {
        message.success(res?.msg || res?.message);
        push("/user/cases");
      }
    } catch {
      message.error("Failed to update status");
    }
  };

  // ✅ Generate PDF (with header, footer, watermark)
  const downloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) {
      console.error("PDF container not found!");
      return;
    }

    // Hide buttons temporarily
    const buttons = document.querySelectorAll("button");
buttons.forEach((btn) => {
  btn.style.visibility = "hidden";
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

    const addWatermark = (pdf) => {
      const wmWidth = 90;
      const wmHeight = 90;
      const wmX = (pdfWidth - wmWidth) / 2;
      const wmY = (pdfHeight - wmHeight) / 2;
      pdf.addImage("/images/watermark1.png", "PNG", wmX, wmY, wmWidth, wmHeight, "", "FAST");
    };

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight * 1.02);
    addWatermark(pdf);

    heightLeft -= pdfHeight;

    while (heightLeft > 10) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight * 1.02);
      addWatermark(pdf);
      heightLeft -= pdfHeight;
    }

    pdf.save(`Invoice_${data?.case?.reference_id || "file"}.pdf`);
buttons.forEach((btn) => {
  btn.style.visibility = "visible";
});
  };

  const invoice = data?.contract;
  const caseData = data?.case;
  

  const firstMilestone = invoice?.contract_milestone?.[0];
  const baseAmount = Number(firstMilestone?.amount || 0);
  const taxAmount = baseAmount * 0.15;
  const totalAmount = baseAmount + taxAmount;
  const balanceDue = (invoice?.contract_milestone || [])
    .slice(1)
    .reduce((sum, m) => sum + Number(m?.amount || 0), 0);

    console.log("=============", data);


  return (
    <>
      <Head>
    <link
      href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
  </Head>
  
    <div style={{ padding: "20px" }}>
      {/* ===== MAIN WRAPPER (A4 layout) ===== */}
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
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
          overflow: "visible",
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
  }}
>
  <img
    src="/images/invoice_header1.svg"
    style={{ height: 80 }}
    alt="Header 1"
  />
  <img
    src="/images/invoice_header.svg"
    style={{ height: 80 }}
    alt="Header 2"
  />
</div>

{/* ===== HEADER DIVIDERS + CENTERED TITLE ===== */}
{/* Top Divider */}
<div
  style={{
    position: "absolute",
    top: "125px",
    left: "50%",
     transform: "translateX(-50%)",
    width: "calc(100% - 160px)", // centered within page
    height: "1.5px",
    backgroundColor: "#B88A44",
  }}
/>

{/* Centered Title + Invoice Number */}
<div
  style={{
    position: "absolute",
    top: "125px",
    left: 0,
    width: "100%",
    height: "95px", // space between both dividers
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#B88A44",
  }}
>
    
  <div
    style={{
      fontSize: "26px",
      fontWeight: 500,
      letterSpacing: "1px",
    }}
  >
    INVOICE
     {/* - <span
  style={{
    fontFamily: "'Tajawal', sans-serif",
    direction: "rtl",
    unicodeBidi: "isolate",
    display: "inline-block",
  }}
>
  فاتورة
</span> */}

  </div>
  <div
    style={{
      fontSize: "14px",
      fontWeight: 400,
      marginTop: "6px",
      letterSpacing: "0.5px",
    }}
  >
    No. # {caseData?.reference_id?.replace(/\D/g, "")}-1
  </div>
</div>

{/* Bottom Divider */}
<div
  style={{
    position: "absolute",
    top: "220px", // perfectly frames the center area
    left: "50%",
     transform: "translateX(-50%)",
    width: "calc(100% - 160px)", // centered within page
    height: "1.5px",
    backgroundColor: "#B88A44",
  }}
/>



{/* ===== FOOTER SECTION ===== */}

{/* Top Divider (centered horizontally) */}
<div
  style={{
    position: "absolute",
    bottom: "258px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "calc(100% - 160px)", // centered within page
    height: "1.5px",
    backgroundColor: "#B88A44",
  }}
/>

{/* Centered Approval Text (bilingual) */}
<div
  style={{
    position: "absolute",
    bottom: "200px",
    left: 0,
    width: "100%",
    height: "55px", // vertical space between the two lines
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#B88A44",
    lineHeight: 1.5,
  }}
>
  {/* Replaced text with image to render properly in PDF */}
  <img
    src="/images/invoice_footer.svg"
    alt="إعتماد الإدارة: أ. حاتم الذيابي"
    style={{
      height: "30px",
      objectFit: "contain",
    }}
  />
</div>


{/* Bottom Divider */}
<div
  style={{
    position: "absolute",
    bottom: "175px",
    left: "40px",
    width: "calc(100% - 80px)",
    height: "2px",
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


{/* ===== FOOTER IMAGE ===== */}
<div
  style={{
    position: "absolute",
    bottom: "90px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    textAlign: "center",
  }}
>
  <img
    src="/images/footer.svg"
    alt="Footer"
    style={{ width: "100%", height: "auto", display: "block" }}
  />
</div>

{/* ===== INVOICE CONTENT ===== */}
<div
  style={{
    position: "relative",
    zIndex: 2,
    marginTop: "50px", // 👈 pushes content below 2nd divider
  }}
>
  {/* Top Section */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
    }}
  >
    <div style={{ flex: 1 }}>
     
    </div>

  </div>

          {/* Date and Case Info */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    color: "#444",
  }}
>
  {/* ===== LEFT SIDE (Date & Time) ===== */}
  <div style={{ textAlign: "left" }}>
    <div>Date: {dayjs(invoice?.createdAt).format("DD MMMM YYYY")}</div>
    <div>Time: {dayjs(invoice?.createdAt).format("hh:mm A")}</div>
  </div>

  {/* ===== RIGHT SIDE (Client Details) ===== */}
  <div style={{ textAlign: "right" }}>
    <div>Client Name: {caseData?.user?.name}</div>
    <div>Case Number: {caseData?.reference_id}</div>
        <div>Mobile #: {caseData?.user?.phone_no}</div>
    <div>Address: {caseData?.user?.per_address}</div>
    <div>Email: {caseData?.user?.email}</div>
  </div>
</div>


          {/* Table Header */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#D8B35D",
              color: "#fff",
              fontWeight: 600,
              padding: "10px 16px",
              borderRadius: 8,
            }}
          >
            <div style={{ flex: 4 }}>Invoice Description</div>
            <div style={{ flex: 1, textAlign: "right" }}>Amount</div>
          </div>

          {/* Row */}
          <div
            style={{
              display: "flex",
              padding: "16px",
              borderBottom: "1px solid #ddd",
              color: "#333",
            }}
          >
            <div style={{ flex: 4 }}>{firstMilestone?.milestone_summary}</div>
            <div style={{ flex: 1, textAlign: "right" }}>SAR {baseAmount.toFixed(2)}</div>
          </div>

          {/* Totals */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <div style={{ width: 320 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                }}
              >
                <span>Tax (15%)</span>
                <span>SAR {taxAmount.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 600,
                  padding: "6px 0",
                }}
              >
                <span>Total</span>
                <span>SAR {totalAmount.toFixed(2)}</span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  background: "#FFF4E6",
                  borderRadius: 6,
                  padding: "8px 10px",
                  fontWeight: 700,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Balance Due</span>
                <span>
                  SAR{" "}
                  {balanceDue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          {/* <div style={{ marginTop: 40 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Terms</div>
            <div style={{ color: "#666" }}>
              Payment should be made within 3 days of invoice generation.
            </div>
          </div> */}
        </div>
      </div>

      {/* ===== ACTION BUTTONS ===== */}
      <div style={{ textAlign: "right", marginTop: 30 }}>
        <Button
          type="default"
          onClick={downloadPDF}
          style={{
            borderRadius: 8,
            borderColor: "#B88A44",
            color: "#B88A44",
            fontWeight: 600,
            marginRight: 10,
          }}
        >
          Download Invoice
        </Button>
        <Button
          type="primary"
          onClick={handlePay}
          style={{
            borderRadius: 8,
            backgroundColor: "#B88A44",
            borderColor: "#B88A44",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Pay Invoice
        </Button>
      </div>
    </div>
    </>
  );
};

export default InvoicePage;













// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Button, Card, Space, Tag, Modal, message } from "antd";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { getContractByCaseId, updateCaseRequest } from "@/app/helpers/backend";
// import { useFetch } from "@/app/helpers/hooks";
// import dayjs from "dayjs";
// import { useRouter } from "next/navigation";


// const InvoicePage  = ({ params }) => {
//   const { push } = useRouter();

//   const [data, getData] = useFetch(getContractByCaseId);
//   useEffect(() => {
//     if (params?.id) {
//       getData({ caseId: params?.id });
//     }
//   }, [data?.id]);

//   console.log("55555555", data);


//     const invoiceRef = useRef(null);
//     const [status, setStatus] = useState("pending");
//     const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

//       const handlePay = async () => {
//     try {
//       const res = await updateCaseRequest({
//         _id: data?.case?._id,
//         status: "ongoing",
//       });

//       if (res?.error) {
//         message.error(res?.msg || res?.message);
//       } else {
//         message.success(res?.msg || res?.message);
//         push('/user/cases');
//       }
//     } catch {
//       message.error("Failed to update status");
//     }
//   };

//     const downloadPDF = async () => {
//         if (!invoiceRef.current) return;
//         // Increase scale for better quality
//         const scale = 2;
//         const invoiceEl = invoiceRef.current;

//         // temporarily increase width for A4 ratio capture if needed
//         const originalWidth = invoiceEl.offsetWidth;

//         const canvas = await html2canvas(invoiceEl, {
//             scale,
//             useCORS: true,
//             allowTaint: true,
//             logging: false,
//         });

//         // A4 in px @ 72dpi: 595 x 842; but we want to keep good resolution
//         const imgData = canvas.toDataURL("image/png");

//         // Create jsPDF in portrait A4
//         const pdf = new jsPDF({
//             orientation: "portrait",
//             unit: "pt",
//             format: "a4",
//         });

//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = pdf.internal.pageSize.getHeight();

//         // Fit image into pdf width while keeping aspect ratio
//         const imgProps = {
//             width: canvas.width,
//             height: canvas.height,
//         };
//         const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
//         const imgWidth = imgProps.width * ratio;
//         const imgHeight = imgProps.height * ratio;
//         const marginX = (pdfWidth - imgWidth) / 2;
//         const marginY = (pdfHeight - imgHeight) / 2;

//         pdf.addImage(imgData, "PNG", marginX, marginY, imgWidth, imgHeight, undefined, "FAST");
//         pdf.save("invoice.pdf");
//     };

//     const showCancelModal = () => {
//         setIsCancelModalVisible(true);
//     };

//     const handleCancel = () => {
//         setIsCancelModalVisible(false);
//     };

//     const handleConfirmCancel = () => {
//         // Handle invoice cancellation logic here
//         setStatus("cancelled");
//         setIsCancelModalVisible(false);
//     };

//     const statusColors = {
//         accept: '#75A26B',   // A shade of green
//         paid: '#E1B65E',
//         pending: '#F7936F',  // A shade of yellow/amber
//         success: '#059669',  // A darker green/emerald
//         failed: '#C20000',   // A shade of red
//         decline: '#C20000',  // A shade of rose/red
//         cancelled: '#C20000', // A shade of red for cancelled
//         // Add a default color for any status not in the list
//         default: '#6B7280'
//     };

//     // ... inside your formatter or component
//     const tagColor = statusColors[status] || statusColors.default;

//     // Custom Cancel Dialog Component
//     const CancelDialog = ({ visible, onCancel, onConfirm }) => {
//         return (
//             <Modal
//                 open={visible}
//                 onCancel={onCancel}
//                 footer={null}
//                 centered
//                 closable={false}
//                 width={400}
//                 style={{ borderRadius: '12px' }}
//                 bodyStyle={{ padding: '0' }}
//             >
//                 <div style={dialogStyles.dialogContainer}>
//                     <div style={dialogStyles.dialogHeader}>
//                         <h3 style={dialogStyles.dialogTitle}>Cancel Invoice</h3>
//                     </div>
//                     <div style={dialogStyles.dialogContent}>
//                         <p style={dialogStyles.dialogMessage}>Are you sure you want to cancel the invoice?</p>
//                     </div>
//                     <div style={dialogStyles.dialogFooter}>
//                         <Button
//                             onClick={onCancel}
//                             style={dialogStyles.noButton}
//                             size="large"
//                             className="dialog-no-button"
//                         >
//                             No
//                         </Button>
//                         <Button
//                             onClick={onConfirm}
//                             type="primary"
//                             style={dialogStyles.yesButton}
//                             size="large"
//                             className="dialog-yes-button"
//                         >
//                             Yes
//                         </Button>
//                     </div>
//                 </div>
//             </Modal>
//         );
//     };

//     return (
//         <div style={styles.pageWrap}>
//             <div style={styles.header}>
//                 <h1 style={styles.h1}>Invoice</h1>
//                 <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     {/* <Tag color={tagColor} style={styles.statusTag}>
//                         {status ? status.charAt(0).toUpperCase() + status.slice(1) : ''}
//                     </Tag> */}
//                 </div>
//             </div>

//             <div style={styles.actionRow}>
//                 <Space>
//                     <Button type="default" onClick={downloadPDF} style={styles.downloadButton} className="download-button">
//                         Download Invoice
//                     </Button>
//                     {/* <Button type="default" onClick={showCancelModal} style={styles.cancelInvoiceButton} className="cancel-invoice-button">
//                         Cancel Invoice
//                     </Button> */}
//                     <Button type="primary" onClick={handlePay} style={styles.payButton} className="pay-button">
//                         Pay Invoice
//                     </Button>
//                 </Space>
//             </div>

//             <div style={styles.container}>
//                 <div ref={invoiceRef} style={styles.invoiceCard}>
//                     {/* Top area */}
//                     <div style={styles.invoiceTop}>
//                         <div style={styles.logoBlock}>
//                             {/* Put your image in public/invoice-logo.png */}
//                             <img
//                                 src="/images/logo.png"
//                                 alt="logo"
//                                 style={{ width: 130, height: "auto", objectFit: "contain" }}
//                                 onError={(e) => {
//                                     // fallback small inline placeholder if image missing
//                                     e.target.onerror = null;
//                                     e.target.src =
//                                         "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='80'%3E%3Crect width='150' height='80' fill='%23f3e6d0'/%3E%3Ctext x='12' y='50' font-size='12' fill='%23977a3a'%3ELogo%3C/text%3E%3C/svg%3E";
//                                 }}
//                             />
//                             <div style={{ height: 18 }} />
//                             <div style={styles.companyText}>Tuwaiq Advocates and Consultants and Notaries</div>
//                         </div>

//                         <div style={styles.invoiceMeta}>
//                             <div style={styles.invoiceTitle}>INVOICE</div>
//                             <div style={styles.invoiceNumber}># {data?.case?.reference_id}-1</div>
//                         </div>
//                     </div>

//                     {/* Main details section */}
//                     <div style={styles.detailsGrid}>
//                         <div>
//                             {/* <div style={styles.billToTitle}>Bill to</div>
//                             <div style={styles.billToName}>{data?.case?.user?.name}</div> */}
//                         </div>

//                         <div style={styles.rightMeta}>
//                             <div style={styles.metaRow}>
//                                 <div style={styles.metaLabel}>Date</div>
//                                 <div style={styles.metaValue}>{dayjs(data?.contract?.createdAt).format('DD MMMM YYYY')}</div>
//                             </div>
//                             {/* <div style={styles.metaRow}>
//                                 <div style={styles.metaLabel}>Due Date</div>
//                                 <div style={styles.metaValue}>28 August 2025</div>
//                             </div> */}
//                             <div style={styles.metaRow}>
//                                 <div style={styles.metaLabel}>Case Number</div>
//                                 <div style={styles.metaValue}>{data?.case?.reference_id}</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Table header */}
//                     <div style={styles.tableHeader}>
//                         <div style={{ flex: 4 }}>Invoice Description</div>
//                         {/* <div style={{ flex: 1, textAlign: "center" }}>Quantity</div>
//                         <div style={{ flex: 1, textAlign: "center" }}>Rate</div> */}
//                         <div style={{ flex: 1, textAlign: "right" }}>Amount</div>
//                     </div>

//                     {/* Table row */}
//                     <div style={styles.tableRow}>
//                         <div style={{ flex: 4 }}>{data?.contract?.contract_milestone?.[0]?.milestone_summary}</div>
//                         {/* <div style={{ flex: 1, textAlign: "center" }}>1</div> */}
//                         {/* <div style={{ flex: 1, textAlign: "center" }}>SAR 25,000</div> */}
//                         <div style={{ flex: 1, textAlign: "right" }}>SAR {data?.contract?.contract_milestone?.[0]?.amount}</div>
//                     </div>

//                     {/* Totals area */}
//                     <div style={styles.totalsRow}>
//                         <div style={{ flex: 1 }} />
//                         <div style={{ width: 320 }}>

                            
//                             <div style={styles.totalLine}>
//   <div style={styles.totalLabel}>Tax (15%)</div>
//   <div style={styles.totalValue}>
//     SAR{" "}
//     {(
//       (data?.contract?.contract_milestone?.[0]?.amount || 0) * 0.15
//     ).toFixed(2)}
//   </div>
// </div>

//                             <div style={styles.totalLine}>
//   <div style={styles.totalLabel}>Total</div>
//   <div style={styles.totalValue}>
//     SAR{" "}
//     {(
//       (data?.contract?.contract_milestone?.[0]?.amount || 0) * 1.15
//     ).toFixed(2)}
//   </div>
// </div>




                            

//                             {/* ✅ Dynamic Balance Due Calculation */}
// {(() => {
//   const milestones = data?.contract?.contract_milestone || [];
//   // Skip index 0 and sum up remaining milestone amounts
//   const balanceDue = milestones
//     .slice(1)
//     .reduce((sum, item) => sum + (parseFloat(item?.amount) || 0), 0);

//   return (
//     <div style={styles.balanceBox}>
//       <div style={styles.balanceLabel}>Balance Due</div>
//       <div style={styles.balanceValue}>
//         SAR {balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//       </div>
//     </div>
//   );
// })()}
//                         </div>
//                     </div>

//                     {/* Terms */}
//                     <div style={styles.termsRow}>
//                         <div style={{ maxWidth: 600 }}>
//                             <div style={styles.termsTitle}>Terms</div>
//                             <div style={styles.termsText}>Payment should be paid with in 3 days of invoice generated.</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Cancel Dialog */}
//             <CancelDialog
//                 visible={isCancelModalVisible}
//                 onCancel={handleCancel}
//                 onConfirm={handleConfirmCancel}
//             />

//             {/* internal styles for close visual match */}
//             <style jsx global>{`
//         body {
//           background: #f9f9f8;
//           font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
//             "Helvetica Neue", Arial;
//         }
        
//         /* Button hover effects */
//         .download-button:hover,
//         .cancel-invoice-button:hover,
//         .dialog-no-button:hover {
//           border-color: #d4a84f !important;
//           color: #7a5f2a !important;
//           background-color: #fdf6e6 !important;
//         }
        
//         .pay-button:hover,
//         .dialog-yes-button:hover {
//           background-color: #bf9538 !important;
//           border-color: #bf9538 !important;
//         }
//       `}</style>
//         </div>
//     );
// };

// const styles = {
//     pageWrap: {
//         padding: 28,
//     },
//     header: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "16px 20px",
//         background: "#fff",
//         borderRadius: 12,
//         border: "1px solid rgba(0,0,0,0.08)",
//         marginBottom: 18,
//     },
//     h1: {
//         margin: 0,
//         fontSize: 36,
//         fontWeight: 600,
//     },
//     statusTag: {
//         padding: "6px 16px",
//         borderRadius: 8,
//         fontWeight: 600,
//     },
//     actionRow: {
//         display: "flex",
//         justifyContent: "flex-end",
//         alignItems: "center",
//         gap: 12,
//         marginTop: 18,
//         marginBottom: 18,
//     },
//     downloadButton: {
//         borderRadius: 22,
//         borderColor: "#e7c77e",
//         background: "#fff",
//         color: "#977a3a",
//         fontWeight: 600,
//         height: 40,
//         padding: "0 20px",
//     },
//     cancelInvoiceButton: {
//         borderRadius: 22,
//         borderColor: "#e7c77e",
//         background: "#fff",
//         color: "#977a3a",
//         fontWeight: 600,
//         height: 40,
//         padding: "0 20px",
//     },
//     payButton: {
//         borderRadius: 22,
//         background: "#d4a84f",
//         borderColor: "#d4a84f",
//         color: "#fff",
//         fontWeight: 600,
//         height: 40,
//         padding: "0 20px",
//     },
//     container: {
//         paddingTop: 8,
//     },
//     invoiceCard: {
//         background: "#fff",
//         borderRadius: 12,
//         border: "1px solid rgba(0,0,0,0.12)",
//         padding: 28,
//         boxSizing: "border-box",
//         // width similar to page area
//         maxWidth: 1000,
//         margin: "0 auto",
//     },
//     invoiceTop: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "flex-start",
//     },
//     logoBlock: {
//         display: "flex",
//         flexDirection: "column",
//         gap: 6,
//     },
//     companyText: {
//         color: "#333",
//         fontSize: 14,
//     },
//     invoiceMeta: {
//         textAlign: "right",
//     },
//     invoiceTitle: {
//         fontSize: 42,
//         fontWeight: 700,
//         letterSpacing: 1,
//         color: "#333",
//     },
//     invoiceNumber: {
//         marginTop: 8,
//         color: "#555",
//     },
//     detailsGrid: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "flex-start",
//         paddingTop: 24,
//         paddingBottom: 18,
//     },
//     billToTitle: {
//         fontWeight: 600,
//         color: "#666",
//         marginBottom: 6,
//     },
//     billToName: {
//         fontSize: 16,
//         color: "#333",
//     },
//     rightMeta: {
//         textAlign: "right",
//         color: "#444",
//     },
//     metaRow: {
//         display: "flex",
//         justifyContent: "space-between",
//         gap: 12,
//         marginBottom: 10,
//     },
//     metaLabel: { color: "#9a9a9a" },
//     metaValue: {
//         minWidth: 120,
//         color: "#333",
//     },
//     tableHeader: {
//         display: "flex",
//         alignItems: "center",
//         background: "#dfb260",
//         color: "#fff",
//         padding: "12px 16px",
//         borderRadius: 8,
//         marginTop: 12,
//         fontWeight: 600,
//     },
//     tableRow: {
//         display: "flex",
//         alignItems: "center",
//         padding: "18px 16px",
//         borderBottom: "1px solid rgba(0,0,0,0.03)",
//         color: "#222",
//     },
//     totalsRow: {
//         display: "flex",
//         justifyContent: "flex-end",
//         marginTop: 16,
//         alignItems: "center",
//     },
//     totalLine: {
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "8px 16px",
//         fontSize: 14,
//     },
//     totalLabel: { color: "#666" },
//     totalValue: {
//         fontWeight: 600,
//         color: "#333",
//     },
//     balanceBox: {
//         marginTop: 8,
//         background: "#fff4e6",
//         borderRadius: 8,
//         padding: "10px 16px",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
//     },
//     balanceLabel: {
//         fontWeight: 700,
//         color: "#333",
//     },
//     balanceValue: {
//         fontWeight: 800,
//         color: "#333",
//     },
//     termsRow: {
//         marginTop: 28,
//     },
//     termsTitle: {
//         fontWeight: 700,
//         marginBottom: 6,
//         color: "#333",
//     },
//     termsText: {
//         color: "#8a8a8a",
//     },
// };

// const dialogStyles = {
//     dialogContainer: {
//         borderRadius: '12px',
//         overflow: 'hidden',
//         background: '#fff',
//     },
//     dialogHeader: {
//         padding: '24px 24px 16px',
//         textAlign: 'left',
//     },
//     dialogTitle: {
//         margin: 0,
//         fontSize: '20px',
//         fontWeight: 600,
//         color: '#1f2937',
//     },
//     dialogContent: {
//         padding: '0 24px 20px',
//         textAlign: 'left',
//     },
//     dialogMessage: {
//         margin: 0,
//         fontSize: '16px',
//         color: '#6b7280',
//         lineHeight: 1.5,
//     },
//     dialogFooter: {
//         padding: '0 24px 24px',
//         display: 'flex',
//         justifyContent: 'flex-end',
//         gap: '12px',
//     },
//     noButton: {
//         borderRadius: '22px',
//         height: '40px',
//         fontWeight: 600,
//         borderColor: '#e7c77e',
//         background: '#fff',
//         color: '#977a3a',
//         padding: '0 24px',
//     },
//     yesButton: {
//         borderRadius: '22px',
//         height: '40px',
//         fontWeight: 600,
//         backgroundColor: '#d4a84f',
//         borderColor: '#d4a84f',
//         color: '#fff',
//         padding: '0 24px',
//     }
// };

// export default InvoicePage;