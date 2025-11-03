"use client";
import { columnFormatter } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
const BlogCard = ({data}) => {
  
   const i18n = useI18n();
    return (
             <div className=" group w-full   bg-white duration-500 transition-all  text-black gap-3 rounded-[10px] overflow-hidden border relative">
                       {/* <div className="absolute sm:top-8 top-4 sm:left-8 left-4 bg-bgColor rounded-[10px] p-[10px] ">
                         <p className="tag-text !text-bodyText capitalize">{data?.tag}</p>
                       </div> */}
                       <div className="h-[254px] !w-full duration-500 transition-all overflow-hidden">
                         <Image width={424} height={254} src={data?.image} alt="" className="w-full h-full duration-500 transition-all group-hover:scale-125 object-cover" />
                       </div>
                       <div className="sm:p-6 p-5  text-start flex flex-col ">
                         <Link href={`/blog/view/${data?._id}`} className="blog-title group-hover:text-[#B68C5A] h-[56px] text-bodyText line-clamp-2 ">
                           {columnFormatter(data?.title)}
                         </Link>
                         <p className="tag-text text-secondary my-[12px]">
                         {i18n?.t('Update')} {dayjs(data?.createdAt).format("MMM DD YYYY")}
                         </p>
                         <div className="flex gap-1 xl:justify-between lg:justify-start justify-between items-center xl:flex-nowrap lg:flex-wrap flex-nowrap">
                           <p>
                             {i18n?.t('By')}{" "}
                             <span className="text-primary tag-text !font-normal underline">
                                {i18n?.t('Admin')}
                             </span>
                           </p>
                           <div className="flex  gap-1 items-center group-hover:text-[#B68C5A] text-[#242628] sm:ms-auto xl:mt-0 lg:mt-[10px] mt-0">
                            <Link href={`/blog/view/${data?._id}`} className="h-full w-full">
                             <p className="font-medium lg:text-xl text-base">
                               {i18n?.t('Read More')}
                             </p>
                             </Link>
                             <MdOutlineKeyboardDoubleArrowRight className="h-8 w-6 " />
                           </div>
                         </div>
                       </div>
                     </div>
    );
};

export default BlogCard;