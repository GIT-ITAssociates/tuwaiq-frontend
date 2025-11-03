"use client";
import { fetchCaseDetail, updateCaseRequest } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useI18n } from "@/app/providers/i18n";
import { Button, message } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { useRouter } from "next/navigation";


const BookingDetails = ({ params }) => {
    const { push } = useRouter();


  const [data, getData] = useFetch(fetchCaseDetail);
  useEffect(() => {
    if (params?.id) {
      getData({ _id: params?.id });
    }
  }, [data?._id || data?.id]);

  const handleDownloadPDF = (data) => {
    const link = document.createElement("a");
    link.href = data;
    link.download = "assignment.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const i18n = useI18n();
  const handleSubmit = async () => {
    try {
      let res = await updateCaseRequest({ _id: data?._id, status: "accept" });
      if (res?.error) {
        message.error(res?.msg || res?.message);
      } else {
        message.success(res?.msg || res?.message);
      }
      getData();
    } catch (error) {
    }
  };


  const [date, setDate] = useState("");
  useEffect(() => {
    if (data?.hearing_date) {
      setDate(dayjs(data.hearing_date).format("DD MMM YYYY"));
    }
  }, [data?.hearing_date]);

    const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
    const currentLanguage =
    i18n?.languages?.find((lang) => lang?._id === langFromLocalStorage)?.name ||
    "English";


  return (
    <div className=" xl:pb-0 pb-[20px]">
      <div className="flex justify-start border-b-2 md:py-[38px] py-[17px] md:px-10 sm:px-8 px-[22px] ">
        <h1 className="dashboard-title">{i18n?.t("Case Details")}</h1>
      </div>

      <div className="md:px-10 px-5 md:mt-10 mt-6 md:mb-[100px] mb-10">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          <div>
            {/* <div className="border rounded-[20px] lg:px-10 px-5 lg:py-10 py-5 h-full">
              <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans mb-10">
                {i18n?.t("Attorney Info")}
              </h1>
              <div className="flex items-center gap-3 mb-8">
                <Image
                  width={100}
                  height={100}
                  className="xl:h-[100px] rounded-full xl:w-[100px] lg:h-[58px] lg:w-[58px] md:w-[69px] md:h-[64px] h-[48px] w-[48px]"
                  src={data?.attorney?.image || "/images/defaultimg.jpg"}
                  alt=""
                />
                <div className="">
                  <p className="font-medium text-lg text-[#242628] work-sans">
                    {data?.attorney?.name}
                  </p>
                  <p className="font-medium work-sans text-[#818B8F] break-all">
                    {data?.attorney?.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sans-500-16 whitespace-nowrap">
                  { }
                  <span className="text-[#818B8F]">
                    {i18n?.t("Phone")}:
                  </span>{" "}
                  {data?.attorney?.phone_no ? data?.attorney?.phone_no : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Present Address")}:
                  </span>{" "}
                  {data?.attorney?.pre_address
                    ? data?.attorney?.pre_address
                    : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Permanent Address")}:
                  </span>{" "}
                  {data?.attorney?.per_address
                    ? data?.attorney?.per_address
                    : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Date Of Birth")}:
                  </span>{" "}
                  {dayjs(data?.attorney?.dob).format("DD MMM YYYY")}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Postal Code")}:
                  </span>{" "}
                  {data?.attorney?.postal_code
                    ? data?.attorney?.postal_code
                    : "N/A"}
                </p>
                <p className="text-sans-500-16">
                  <span className="text-[#818B8F] leading-[27px]">
                    {i18n?.t("Country")}:
                  </span>{" "}
                  {data?.attorney?.country ? data?.attorney?.country : "N/A"}
                </p>
              </div>
            </div> */}
            <div className="border rounded-[20px] lg:px-10 px-5 lg:py-10 py-5 h-full">
  <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans mb-10">
    {i18n?.t("Attorney Info")}
  </h1>

  {/* ✅ Check if attorney exists */}
  {data?.attorney ? (
    <>
      <div className="flex items-center gap-3 mb-8">
        <Image
          width={100}
          height={100}
          className="xl:h-[100px] rounded-full xl:w-[100px] lg:h-[58px] lg:w-[58px] md:w-[69px] md:h-[64px] h-[48px] w-[48px]"
          src={data?.attorney?.image || "/images/defaultimg.jpg"}
          alt="Attorney Profile"
        />
        <div>
          <p className="font-medium text-lg text-[#242628] work-sans">
            {data?.attorney?.name}
          </p>
          <p className="font-medium work-sans text-[#818B8F] break-all">
            {data?.attorney?.email || "N/A"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sans-500-16 whitespace-nowrap">
          <span className="text-[#818B8F]">{i18n?.t("Phone")}:</span>{" "}
          {data?.attorney?.phone_no || "N/A"}
        </p>

        <p className="text-sans-500-16">
          <span className="text-[#818B8F]">{i18n?.t("Present Address")}:</span>{" "}
          {data?.attorney?.pre_address || "N/A"}
        </p>

        <p className="text-sans-500-16">
          <span className="text-[#818B8F]">{i18n?.t("Permanent Address")}:</span>{" "}
          {data?.attorney?.per_address || "N/A"}
        </p>

        <p className="text-sans-500-16">
          <span className="text-[#818B8F] leading-[27px]">
            {i18n?.t("Date Of Birth")}:
          </span>{" "}
          {data?.attorney?.dob
            ? dayjs(data?.attorney?.dob).format("DD MMM YYYY")
            : "N/A"}
        </p>

        <p className="text-sans-500-16">
          <span className="text-[#818B8F] leading-[27px]">
            {i18n?.t("Postal Code")}:
          </span>{" "}
          {data?.attorney?.postal_code || "N/A"}
        </p>

        <p className="text-sans-500-16">
          <span className="text-[#818B8F] leading-[27px]">
            {i18n?.t("Country")}:
          </span>{" "}
          {data?.attorney?.country || "N/A"}
        </p>
      </div>
    </>
  ) : (
    // ✅ No Attorney Assigned
    <div className="flex flex-col items-center justify-center text-center py-8">
      <p className="text-[#818B8F] text-[16px] font-medium">
        {i18n?.t("Currently no Attorney assigned to this case")}
      </p>
    </div>
  )}
</div>

          </div>
          <div>
            <div className="border rounded-[20px] lg:px-10 px-5 lg:pt-10 lg:pb-[40px]  py-5 h-full">
              <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans md:mb-10 mb-5">
                {i18n?.t("Case Information")}
              </h1>

              <div className=" ">
                <p className="font-medium work-sans mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Reference #")}:
                  </span>{" "}
                  {data?.reference_id
                    ? data?.reference_id
                    : "N/A"}
                </p>
                <p className="font-medium work-sans mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Court Name")}:
                  </span>{" "}
                  {data?.court_name
                    ? data?.court_name
                    : "N/A"}
                </p>
                <p className="font-medium work-sans mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Case Type")}:
                  </span>{" "}
                  {data?.case_type
                    ? data?.case_type
                    : "N/A"}
                </p>
                <p className="font-medium work-sans mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Hearing Date")}:
                  </span>{" "}
                  {date
                    ? date
                    : "N/A"}
                </p>
                <p className="font-medium work-sans text-[#818B8F] flex flex-col gap-4 mb-[30px]">
                  {i18n?.t("Case Short Description")}:
                  <br />
                  <span className="text-[#3A3D3F] break-all">
                    {data?.short_description
                      ? data?.short_description
                      : "N/A"}
                  </span>
                </p>
                <p className="font-medium work-sans flex flex-col gap-4 mb-[30px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Case_History")}:
                  </span>{" "}
                  <span className="leading-[27px] break-all">
                    {data?.case_history
                      ? data?.case_history
                      : i18n?.t("N/A")}
                  </span>
                </p>
                <div className="font-medium work-sans flex gap-2 items-center leading-[27px]">
                  <span className="text-[#818B8F]">
                    {i18n?.t("Case Status")}:
                  </span>{" "}
                  {data?.status === "accept" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-green-500 rounded-[20px] capitalize">
                      Accepted
                    </div>
                  )}
                  {data?.status === "pending" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-yellow-500 rounded-[20px] capitalize">
                      Pending
                    </div>
                  )}
                  {data?.status === "success" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-emerald-600 rounded-[20px] capitalize">
                      Success
                    </div>
                  )}
                  {data?.status === "failed" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-red-600 rounded-[20px] capitalize">
                      Failed
                    </div>
                  )}
                  {data?.status === "ongoing" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-blue-500 rounded-[20px] capitalize">
                      Ongoing
                    </div>
                  )}
                  {data?.status === "decline" && (
                    <div className="flex items-center gap-2 p-4 py-2 text-white bg-rose-500 rounded-[20px] capitalize">
                      Declined
                    </div>
                  )}
                </div>

                
{data?.status !== "pending" && data?.status !== "accept" && (
  <div className="flex justify-end w-full mt-8">
    <button
      className="bg-primary text-white px-3 py-2 rounded-[10px] font-medium text-sm hover:opacity-90 transition"
      onClick={() => {
        console.log("Schedule Appointment clicked for:", data?._id);
        if (data?.status === "contract_pending") {
          push(`/user/cases/${data?._id}/view-contract`);
        } else {
          push(`/user/cases/${data?._id}/contract-detail`);
        }
      }}
    >
      {currentLanguage === "Arabic" ? "عرض العقد" : "View Contract"}
    </button>
  </div>
)}



              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-6">
{/* <div className="border rounded-[20px] lg:px-10 px-5 lg:py-[40px] py-5 min-h-[237px]">
  <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans md:mb-10 mb-5">
    {i18n?.t("Booking Details")}
  </h1>

  {data?.appointment && Object.keys(data?.appointment || {}).length > 0 ? (
    <div className="flex flex-col gap-4">
      <p className="text-sans-500-16 flex gap-1">
        <span className="text-[#818B8F]">{i18n?.t("Date")}:</span>{" "}
        {data?.appointment?.select_date
          ? dayjs(data?.appointment?.select_date).format("DD MMMM YYYY")
          : "N/A"}
      </p>

      <p className="text-sans-500-16 text-[#818B8F] flex gap-1">
        {i18n?.t("Time Slot")}:
        <br />
        <span className="text-[#3A3D3F]">
          {data?.appointment?.slot_time || "N/A"}
        </span>
      </p>

      <p className="text-sans-500-16 flex gap-1">
        <span className="text-[#818B8F] whitespace-nowrap">
          {i18n?.t("Create Date")}:
        </span>
        <span>
          {data?.createdAt
            ? dayjs(data?.createdAt).format("DD MMMM YYYY")
            : "N/A"}
        </span>
      </p>
    </div>
  ) : (
    <p className="text-[#818B8F] text-base font-medium">
      {i18n?.t("Currently no booking scheduled")}
    </p>
  )}
</div> */}


          <div className="border rounded-[20px] lg:px-10 px-5 lg:py-[40px] py-5 min-h-[237px]">
            <p className="font-medium work-sans flex ">
              <span className="text-[#818B8F]">{i18n?.t("Documents")}:</span>
              {data?.evidence ? (
                <div className="lg:pl-0 pl-2 flex flex-wrap gap-2 ">
                  {data?.evidence?.map((i, index) => {
                    return (
                      <Button
                        onClick={() => handleDownloadPDF(i)}
                        key={index}
                        className="border-none text-[#C7A87D] font-medium work-sans"
                      >
                        <FaRegFilePdf /> {i18n?.t("Download Pdf")}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                "N/A"
              )}
            </p>
          </div>
        </div>

        
        {/* Case Notes Section */}
        <div className="border rounded-[20px] lg:px-10 px-5 lg:py-[40px] py-5 min-h-[237px] mt-6">
          <h1 className="font-medium text-2xl leading-[28px] text-[#242628] work-sans mb-10">
            {i18n?.t("Case Notes")}
          </h1>

          {/* Notes list */}
          {Array.isArray(data?.notes) && data?.notes.length > 0 ? (
            <div className="flex flex-col gap-6">
              {data?.notes.map((noteItem, idx) => (
                <div
                  key={noteItem?._id || idx}
                  className="border border-gray-200 rounded-[12px] p-4 bg-[#FAFAFA] shadow-sm"
                >
                  <p className="text-[#3A3D3F] text-[15px] font-medium mb-2">
                    {noteItem?.title || "N/A"}
                  </p>

                  <div className="flex justify-between items-center text-sm text-[#818B8F] mt-2">
                    {noteItem?.document ? (
                      <a
                        href={noteItem.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline font-medium hover:text-[#C7A87D]"
                      >
                        {i18n?.t("View Attachment")}
                      </a>
                    ) : (
                      <span className="italic text-gray-400">
                        {/* {i18n?.t("No attachment")} */}
                      </span>
                    )}

                    <span>
                      {noteItem?.createdAt
                        ? dayjs(noteItem.createdAt).format("DD MMM YYYY")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#818B8F] text-base font-medium">
              {i18n?.t("Currently no note added.")}
            </p>
          )}

          {/* 🔽 Attachment preview ABOVE the input */}
          {/* {imagePreview && (
            <div className="w-full mt-6">
              <img
                src={imagePreview}
                alt="attachment-preview"
                className="w-20 h-20 object-cover rounded-md border"
              />
            </div>
          )}
          {!imagePreview && selectedPdfFile && (
            <div className="w-full mt-6">
              <span className="inline-flex items-center gap-2 text-sm bg-gray-100 border px-3 py-2 rounded">
                <FaRegFilePdf />
                {i18n?.t("PDF file attached")}
              </span>
            </div>
          )} */}

          {/* Add New Note Form */}
          {/* <form
            onSubmit={handleSendNotes}
            className="flex items-center sm:gap-3 gap-2 border-t border-gray-300 sm:p-4 p-2 bg-white rounded-lg mt-6"
          >
            <input
              required
              type="text"
              placeholder={i18n?.t("Write a new note here...")}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              type="button"
              onClick={() => {
                setAttachMode("image");
                setImageModal(true);
              }}
              className="flex items-center justify-center sm:w-10 sm:h-10 sm:bg-gray-100 hover:bg-gray-200 text-primary rounded-lg focus:outline-none"
            >
              <FaRegImages className="md:text-xl text-base" />
            </button>

            <button
              type="button"
              onClick={() => {
                setAttachMode("pdf");
                setImageModal(true);
              }}
              className="flex items-center justify-center sm:w-10 sm:h-10 sm:bg-gray-100 hover:bg-gray-200 text-primary rounded-lg focus:outline-none"
            >
              <FiPaperclip className="md:text-xl text-base" />
            </button>

            <button
              type="submit"
              disabled={isSending}
              className={`flex items-center justify-center sm:w-24 h-10 rounded-lg ${
                isSending
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "sm:bg-primary sm:text-white text-primary hover:bg-primary-dark"
              }`}
            >
              {isSending ? i18n?.t("Sending…") : <FiSend className="md:text-xl text-lg" />}
            </button>
          </form> */}

          {/* Modal to pick file (no remove UI inside) */}
          {/* <Modal
            open={imageModal}
            onCancel={() => setImageModal(false)}
            maskClosable={false}
            footer={null}
          >
            <Form
              form={imageForm}
              onValuesChange={(changed, all) => {
                // If user picked image
                const img = all?.image?.[0]?.originFileObj;
                if (img) {
                  setAttachMode("image");
                  setSelectedImageFile(img);
                  setImagePreview(URL.createObjectURL(img));
                  // clear PDF selections
                  setSelectedPdfFile(null);
                  setFileList([]);
                  imageForm.resetFields(["pdf"]);
                }

                // If user picked PDF
                const pdfObj = all?.pdf?.file?.originFileObj;
                if (pdfObj) {
                  setAttachMode("pdf");
                  setSelectedPdfFile(pdfObj);
                  // clear image selections
                  setSelectedImageFile(null);
                  setImagePreview("");
                  imageForm.resetFields(["image"]);
                }
              }}
              onFinish={() => {
                // Just close the picker; upload happens on Send
                setImageModal(false);
              }}
            >
              <div className="space-y-4">
                <div className="text-lg font-semibold text-gray-700">
                  {attachMode === "pdf"
                    ? i18n?.t("Upload PDF (Max length: 6 MB)")
                    : i18n?.t("Upload Image (Max length: 6 MB)")}
                </div>

                {attachMode === "pdf" ? (
                  <UploadFileComponent
                    label={i18n?.t("Choose PDF file")}
                    name="pdf"
                    className="w-full"
                    fileList={filelist}
                    setFileList={(list) => {
                      const one =
                        list?.length > 0 ? [list[list.length - 1]] : [];
                      setFileList(one);
                      const f = one?.[0]?.originFileObj;
                      if (f) {
                        setSelectedPdfFile(f);
                        setSelectedImageFile(null);
                        setImagePreview("");
                        imageForm.resetFields(["image"]);
                      }
                    }}
                    maxCount={1}
                  />
                ) : (
                  <MultipleImageInput
                    label={i18n?.t("Choose Image")}
                    name="image"
                    className="w-full"
                    maxCount={1}
                    onChange={(files) => {
                      const f = files?.[0]?.originFileObj || files?.[0];
                      if (f) {
                        setSelectedImageFile(f);
                        setImagePreview(URL.createObjectURL(f));
                        setSelectedPdfFile(null);
                        setFileList([]);
                        imageForm.resetFields(["pdf"]);
                      }
                    }}
                  />
                )}

                <button
                  type="submit"
                  className="bg-primary text-white py-2 px-4 rounded-md mt-2 hover:bg-primary-dark"
                >
                  {i18n?.t("Attach File")}
                </button>
              </div>
            </Form>
          </Modal> */}
        </div>


        {(data?.status === "pending" && data?.from === "attorney") && (
          <div className=" flex  sm:flex-row flex-col  gap-[24px] mt-5">
            <button
              className="capitalize px-[32px] py-[16px] rounded-[8px] bg-[#EDEDED] text-[#242628] font-sans text-[18px] leading-[24px] font-medium"
              onClick={async () => {
                try {
                  let res = await updateCaseRequest({
                    _id: data?._id,
                    status: "decline",
                  });
                  if (res?.error) {
                    message.error(res?.msg || res?.message);
                  } else {
                    message.success(res?.msg || res?.message);
                  }
                  getData();
                } catch (error) {
                }
              }}

            >
              Decline
            </button>
            <button
              type="submit"
              className="capitalize text-white px-[32px] py-[16px] rounded-[8px] bg-primary font-sans text-[18px] leading-[24px] font-medium"
              onClick={() => {
                handleSubmit();
              }}
            >
              accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
