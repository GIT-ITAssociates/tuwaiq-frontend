"use client";
import { IoClose, IoEyeOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useState } from "react";
import { Form, Modal, Select, message } from "antd";
import { LuUpload } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Button from "@/app/components/common/button";
import UserDashboardTable from "@/app/components/common/table/userDashboardTable";
import { useI18n } from "@/app/providers/i18n";
import {  useFetch } from "@/app/helpers/hooks";
import UploadFileComponent from "@/app/components/common/form/pdfUpload";

import {
  attorneylist,
  getPdfFileList,
  pdfFileUpload,
  postfileUpload,
} from "@/app/helpers/backend";
import dayjs from "dayjs";

const CaseFile = () => {
  const { push } = useRouter();
  const [form]=Form.useForm();
  const [isUpload, setIsUpload] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [data,getData,{loading:pdfLoading}]=useFetch(getPdfFileList);

  const[fileUrl,setfileUrl]=useState('');
  const [attorney] = useFetch(attorneylist);
  const handleDownloadPDF = (data) => {
    const link = document.createElement("a");
    link.href = data;
    link.download = "assignment.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };  
  const handleViewFile = (fileUrl) => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  
         const i18n = useI18n();

      const langFromLocalStorage =
    typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

    const currentLanguage = i18n?.languages?.find(
  (lang) => lang?._id === langFromLocalStorage
)?.name;

  
  const columns = [
    { text: "Date", dataField: "date",formatter:((_,d)=>{return (<span>{dayjs(d?.createdAt).format('DD MMM , YYYY')}</span>)}) },
   {
  text: currentLanguage === "Arabic" ? "اسم المحامي" : "Attorney Name",
  dataField: "attorneyId",
  formatter: (_, d) => (
    <span>
      {d?.attorneyId?.name || (currentLanguage === "Arabic" ? "غير متوفر" : "Not Available")}
    </span>
  ),
},
    { text: "File Name", dataField: "file_name" },
    {
      text: "File Type",
      dataField: "fileType",
      formatter: (_, d) => {
        return (
          <div
            className="flex gap-2 text-xs items-center cursor-pointer place-content-center w-[118px] h-[34px] bg-[#EDEDED] text-textColor text-[24px] rounded-[10px] border "
            onClick={() => {
              handleDownloadPDF(d?.file);
            }}
          >
            <FaRegFilePdf />
            <span className="text-xs font-sans font-semibold">
              {i18n?.t("Evidence")}
            </span>
    

          </div>
        );
      },
    },
    {
      text: "File",
      dataField: "file",
      formatter: (_, d) => {
        return (
          <div
            className="grid cursor-pointer place-content-center w-[40px] h-[40px] hover:bg-primary hover:text-white text-[24px] rounded-[10px] border hover:border-primary border-[#E0E0E0]"
            onClick={() => {
              setfileUrl(d?.file);
            }}
          >
            <IoEyeOutline />
          </div>
        );
      },
    },
  ];

const handleFinish = async (values) => {
  let evidenceList;

  if (Array.isArray(values?.files) && values.files.length > 0) {
    const firstFile = values.files[0];
    const rawFile = firstFile?.originFileObj || firstFile;

    if (rawFile) {
      const { error, data } = await pdfFileUpload({
        files: rawFile,
      });

      if (!error && data) {
        evidenceList = data; // just assign the first file's response
      } else {
        message.error("Failed to upload file");
        return; // stop execution on error
      }
    }
  }

  const submitdata = {
    file: evidenceList, // ✅ single file
    file_name: values?.file_name,
    attorneyId: values?.attorneyId,
  };


  const data = await postfileUpload(submitdata);
  if (data?.error) {
    message.error(data?.msg || data?.message);
  } else {
    message.success(data?.msg || data?.message);
    getData();
    form.resetFields();
    setIsUpload(false);
    setFileList([]);
  }
};



  // const handleFinish=async (values) => {
  //   let evidenceList ;
  
  //   if (values?.files?.fileList?.length > 0) {
  //     for (const file of values.files.fileList) {
  //       if (file?.originFileObj) {
  //         const { error, data } = await pdfFileUpload({
  //           files: file.originFileObj,
  //         });
  //         evidenceList=data;
  //       }
  //     }
  //   }



  //   const submitdata = {
  //    file: evidenceList, 
  //     file_name: values?.file_name,
  //     attorneyId: values?.attorneyId,
  //   };

  //   console.log("==============", evidenceList)

  // const data=  await postfileUpload(submitdata);
  // if(data?.error){
  //   message.error(data?.msg || data?.message);
  // }
  // else{
  //   message.success(data?.msg || data?.message);
  //   getData();
  //   form.resetFields();
  //   setIsUpload(false);
  //   setFileList([]);
  // }

  // }
    
  return (
    <div>
      <div className="flex sm:flex-row flex-col mx-5 my-7 justify-between items-center sm:gap-0 gap-6">
        <h1 className="dashboard-title">{i18n?.t("Case Files")}</h1>
      </div>
      <hr />
      <div className="px-[24px] pb-[24px]">
        <div className=" overflow-y-auto max-h-[900px] custom-scrollbar">
          <UserDashboardTable data={data} columns={columns} onReload={getData} loading={pdfLoading} pagination/>
        </div>
        <div>
          <Button
            className="flex gap-2 items-center"
            onClick={() => {
              setIsUpload(true);
            }}
          >
            <LuUpload />
            {i18n?.t("Upload you file")}
          </Button>
        </div>
      </div>

      <Modal
        width={600}
        className="!bg-transparent "
        footer={null}
        closeIcon={false}
        open={isUpload}
        onCancel={() => setIsUpload(false)}
        style={{ position: "relative", zIndex: "200" }}
      >
        <div className=" w-full mx-auto bg-white rounded-[20px] p-[10px] relative ">
          <button
            className="w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute sm:top-[-10px] sm:right-[-10px] top-[-5px] right-[-5px] inline-flex justify-center items-center"
            onClick={() => {
              setIsUpload(false);
            }}
          >
            <IoClose
              size={20}
              className="text-[#242628] text-[12px] cursor-pointer"
            />
          </button>
          <h3 className="font-semibold leading-[32.84px] text-[28px] pb-[24px] text-[#242628] font-sans ">
            {i18n?.t("Send File")}
          </h3>
          <Form
            onFinish={handleFinish}
            layout="vertical"
            form={form}
          >
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("File Name")}
                </p>
              }
              name="file_name"
              className="!w-full"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your File name!"),
                },
              ]}
            >
              <input
                placeholder={i18n?.t("File Name")}
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628]">
                  {i18n?.t("Send To")}
                </p>
              }
              name={"attorneyId"}
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please select a Attorney!"),
                },
              ]}
            >
              <Select
                placeholder={i18n?.t("Select an attorney")}
                className="appearance-none w-full bg-white  text-[#242628] rounded-[10px]  h-[56px] "
                options={attorney?.map((item) => ({
                  value: item?._id,
                  label: item?.name,
                }))}
              />
            </Form.Item>

            <UploadFileComponent
              className={'pt-[19px] pb-[18px] h-[56px] px-[20px]'}
              max={1}
              name="files"
              fileList={fileList}
              setFileList={setFileList}
              label={
                <p className="text-base font-medium text-[#242628] mb-[12px]">
                  {i18n?.t("File")}
                </p>
              }
            />
            <button
              type="submit"
              className={`border-2 bg-primary  flex gap-x-2 justify-center items-center  button text-white hover:bg-transparent hover:text-primary border-primary lg:px-8 text-textMain !font-poppins md:px-4 h-fit py-4 px-4 whitespace-pre rounded-[8px] transition-all !font-medium duration-300 ease-in-out sm:text-base capitalize text-sm `}
            >
              <LuUpload />
              {i18n?.t("Upload file")}
            </button>
          </Form>
        </div>
      </Modal>
      {fileUrl && 
  <Modal
    width={600}
    className="!bg-transparent"
    footer={null}
    closeIcon={false}
    open={fileUrl}
    onCancel={() => setfileUrl('')}
    style={{ position: "relative", zIndex: 200 }}
  >
    <div className="w-full mx-auto bg-white rounded-[20px] p-[10px] relative">
      <button
        className="w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute sm:top-[-10px] sm:right-[-10px] top-[-5px] right-[-5px] inline-flex justify-center items-center"
        onClick={() => setfileUrl('')}
      >
        <IoClose
          size={20}
          className="text-[#242628] text-[12px] cursor-pointer"
        />
      </button>
      <h3 className="font-semibold leading-[32.84px] text-[28px] pb-[24px] text-[#242628] font-sans">
        {i18n?.t("Pdf file")}
      </h3>

      <iframe
        src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
        style={{ width: "100%", height: "600px" }}
        frameBorder="0"
      />
    </div>
  </Modal>
}

    </div>
  );
};

export default CaseFile;
