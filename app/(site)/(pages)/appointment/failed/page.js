"use client";

import Banner from "@/app/components/common/banner";
import { useI18n } from "@/app/providers/i18n";
import Link from "next/link";
import dynamic from "next/dynamic"; 
import paymentfail from "./../../../../../public/images/paymentfail.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const page = ({params}) => {
    const i18n = useI18n();
    return (
        <div className="bg-[#fc8d9254]">
           <Banner title={'Payment Failed'} /> 
           <div className="container mx-auto flex flex-col items-center justify-center ">
           <div className="w-[500px] h-[500px]">
                    <Lottie animationData={paymentfail} loop={true} />
                </div>
        <div className=" sm:my-12 my-4 flex items-center justify-center">
            <Link href={"/user/appointment"} className="underline font-poppins text-bodyText">{i18n?.t("Back To Dashboard")}</Link>
        </div>
           </div>
        </div>
    );
};

export default page;