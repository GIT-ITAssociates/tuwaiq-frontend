"use client";

import Banner from "@/app/components/common/banner";
import { useI18n } from "@/app/providers/i18n";
import Link from "next/link";
import paymentSuccessAnimation from "../../../../../../public/images/paymentsuccesfull.json"
import { useFetch } from "@/app/helpers/hooks";
import { getPaypalOrderPaymentSuccess } from "@/app/helpers/backend";
import { useEffect, useState } from "react";
import { message } from "antd";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const page = () => {
    const i18n = useI18n();
    const [paymentId, setpaymentId] = useState(null);
    const [payerId, setPayerId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [payPalSuccess, getSuccessPaypal, { error }] = useFetch(getPaypalOrderPaymentSuccess, {}, false);
  
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentId = urlParams.get("paymentId");
      const payerId = urlParams.get("PayerID");
      if (paymentId && payerId) {
        setpaymentId(paymentId);
        setPayerId(payerId);
        setLoading(false);
      } else {
        setLoading(false);
        message.error(i18n?.t('Missing payment information.'));
        window.location.href = "/user/attorney";
      }
    }, []);
  
    useEffect(() => {
      if (paymentId && payerId) {
        getSuccessPaypal({paymentId: paymentId, PayerID: payerId });
      }
    }, [paymentId, payerId]);
  
    useEffect(() => {
      if (payPalSuccess?.payment?.status === "completed") {
        setIsSuccess(true);
      } else if (error) {
        message.error(i18n?.t('Failed to verify payment.'));
        setIsSuccess(false);
      }
    }, [payPalSuccess, error]);
  
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