"use client";

import Banner from "@/app/components/common/banner";
import { useI18n } from "@/app/providers/i18n";
import Link from "next/link";
// import Lottie from "lottie-react";
import paymentSuccessAnimation from "../../../../../../public/images/paymentsuccesfull.json"
import { useFetch } from "@/app/helpers/hooks";
import { getSuccessStripeQuery } from "@/app/helpers/backend";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const page = () => {
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [stripeSuccess, getSuccessStripe, { error }] = useFetch(getSuccessStripeQuery, {}, false);
    const i18n = useI18n();
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const session_id = urlParams.get("session_id");
  
      if (session_id) {
        setSessionId(session_id);
        setLoading(false);
      } else {
        setLoading(false);
        window.location.href = "/user/attorney";
      }
    }, []);
  
    useEffect(() => {
      if (sessionId) {
        getSuccessStripe({ session_id: sessionId });
      }
    }, [sessionId]);
  
    useEffect(() => {
      if (stripeSuccess?.payment?.status === "completed") {
        setIsSuccess(true);
      } else if (error) {
        setIsSuccess(false);
      }
    }, [stripeSuccess, error]);
  
    if (loading) {
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="loader"></div>
        </div>
      );
    }

    return (
        <div className="bg-[#F4F9FF]">
           <Banner title={'Payment Success'} /> 
           <div className="container mx-auto flex flex-col items-center justify-center ">
           <div className="w-[500px] h-[500px]">
                    <Lottie animationData={paymentSuccessAnimation} loop={true} />
                </div>
        <div className=" sm:my-12 my-4 flex items-center justify-center">
            <Link href={"/user/appointment"} className="underline font-poppins text-primary">{i18n?.t("Back To Dashboard")}</Link>
        </div>
           </div>
        </div>
    );
};

export default page;