"use client";
import  { useState } from 'react'
import { LuPlus } from "react-icons/lu";
import { HiMinusSmall } from "react-icons/hi2";
import { columnFormatter } from '@/app/helpers/utils';


export default function FAQ({data}) {

    const [openIndex, setOpenIndex] = useState(0);

  return (
      
      <div className="flex flex-col gap-4 !pt-[16px]">
          {data?.map((faq, index) => (
         <div className="relative" key={index}>
         <div
          onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
           className={`md:px-7 px-3 md:py-5 py-[7px] flex gap-4 md:items-center items-start border  rounded-lg md:text-lg text-sm font-medium cursor-pointer  ${
             openIndex === index ?  "rounded-b-none bg-[#B68C5A] border-[#B68C5A] text-white " : ""
           }`}
         >
           {!(openIndex === index) ?  (
             <LuPlus className="text-[24px]" />
           ) : (
             <HiMinusSmall className="text-[24px]" />
           )}
           <p className="">{columnFormatter(faq?.question)}</p>
         </div>
         
         {openIndex === index &&  (
           <div className="  w-full z-50 text-cs text-black border rounded-b-lg bg-white md:px-[57px] px-7 py-5 ">
             <p className="text-textColor ">
              {columnFormatter(faq?.answer)}
             </p>
           </div>
         )}
         </div> 
         
          ))}
      </div>
  )
}