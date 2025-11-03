"use client";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/common/searchBar";
import GenerateInvoice from "@/app/components/payment/generatePayment";
import { useFetch } from "@/app/helpers/hooks";
import { getBookingAppointment } from "@/app/helpers/backend";
import dayjs from "dayjs";
import { useI18n } from "@/app/providers/i18n";
import { useEffect, useState } from "react";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import { Select } from "antd";

const GenerateInvoicePage = () => {




  return (
    <div>
      <GenerateInvoice />

    </div>
  );
};


// return (
//   <div>
//     <div className="flex sm:flex-row flex-col justify-between  items-center mx-5  my-7 sm:gap-0 gap-6 lg:h-[56px] h-auto">
//       <GenerateInvoice />
//     </div>
//   </div>
// );
// };

export default GenerateInvoicePage;
