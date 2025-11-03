"use client";
import { columnFormatter } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
import { AiOutlineFilePdf } from "react-icons/ai";

const Service_LawInfo = ({ info,number }) => {
  const i18n=useI18n();
  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = info?.file; 
    link.download = "assignment.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex md:flex-row flex-col justify-between items-start md:items-center md:mt-[40px] mt-[18px]">
      <div className="pl-2">
        <h1 className="font-medium lg:text-2xl md:text-[21px] text-[20px] leading-[31px] flex items-center gap-1 md:mb-6 mb-3 font-ebgramond capitalize">
          {number+1}. {columnFormatter(info?.name)}
        </h1>
        <div className=" pl-6 space-y-2 font-worksans text-base w-full break-all" dangerouslySetInnerHTML={{ __html: columnFormatter(info?.description) }}></div>
      </div>
      {
        info?.file && (
          <div className="lg:pl-0 pl-2 lg:mt-0 mt-4">
          <button onClick={handleDownloadPDF} className="primary-btn">
            <AiOutlineFilePdf className="lg:h-6 lg:w-6 md:h-5 md:w-5 sm:h-4 sm:w-4 h-3 w-3" />
            {i18n.t('Download PDF')}
          </button>
        </div>
        )
      }
     
    </div>
  );
};

export default Service_LawInfo;
