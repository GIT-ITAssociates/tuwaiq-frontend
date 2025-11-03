"use client";
import {  Grid, message, Modal, Radio } from "antd";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { useFetch } from "@/app/helpers/hooks";
import { bookAttorney, fetchUserPaymentMethods } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
const PaymentModal = ({
  isPaymentModal,
  setIsPaymentModal,
  setPaymentValue,
  setIsCaseDetailsOpen,
  data,
  paymentValue,
  formData
}) => {
  const i18n = useI18n();
  const [tab, setTab] = useState("payment");
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const getModalWidth = () => {
    if (screens.xxl) {
      return 500;
    } else if (screens.xl) {
      return 500;
    } else if (screens.lg) {
      return 500;
    } else if (screens.md) {
      return 500;
    } else if (screens.sm) {
      return 500;
    } else {
      return "100%";
    }
  };
  const [paymentMethods] = useFetch(fetchUserPaymentMethods);
  return (
    <Modal
      className="!bg-transparent"
      footer={null}
      closeIcon={false}
      open={isPaymentModal}
      onCancel={() => setIsPaymentModal(false)}
      style={{ position: "relative", zIndex: "200" }}
      width={getModalWidth()}
    >
      <div className="lg:max-w-[872px] w-full mx-auto bg-white rounded-[20px] p-[10px] relative ">
        <button
          className="w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute sm:top-0 top-[2px] sm:right-0 right-[2px] inline-flex justify-center items-center"
          onClick={() => {
            setIsPaymentModal(false);
          }}
        >
          <IoClose
            size={20}
            className="text-[#242628] text-[12px] cursor-pointer"
          />
        </button>
        <h3 className="font-medium leading-[23.46px] text-[20px] pb-[24px] text-[#191930] font-ebgramond  ">
          {i18n?.t("Payment Details")}
        </h3>
        {tab === "payment" && (
          <div>
            <Radio.Group
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "24px",
              }}
            >
              {paymentMethods?.docs?.map((method, index) => {
                return (
                  <Radio
                    key={index}
                    value={method?.name}
                    onChange={(e) => {
                      setPaymentValue({
                        status: "pending",
                        method: method?.name,
                        paymentIntentId: method?._id,
                        amount: data?.price,
                      });
                    }}
                  >
                    <div className="flex gap-[12px] items-center ">
                      <Image
                        height={24}
                        width={34}
                        src={method?.image}
                        className="h-[24px] w-[34px] object-fill p-1 border rounded"
                        alt="image"
                      />
                      <span className="text-[18px] font-medium leading-[21.78px] text-[#191930] capitalize">
                        {method?.name}
                      </span>
                    </div>
                  </Radio>
                );
              })}
            </Radio.Group>
            <div className="md:w-[355px] m-auto">
              <button
                type="button"
                className={`border-2 bg-primary  button text-white hover:bg-transparent hover:text-primary border-primary lg:px-8 text-textMain !font-poppins md:px-4 h-fit py-4 px-4 whitespace-pre rounded-[8px] transition-all !font-medium duration-300 ease-in-out sm:text-base capitalize text-sm w-full  mt-[24px]`}
                onClick={async() => {
                  if(!paymentValue?.method){
                   message.error("please select payment method");
                   return;
                  }
                    try {
                      let { data, error, msg } =  await bookAttorney(formData);
                      console.log(":rocket: ~ onClick={async ~ data, error, msg:", data, error, msg)
                      if(!!error){
                        message.error(msg || "Something went wrong")
                        return;
                      }else{
                          message.success(msg || "Please complete the payment");
                          setIsCaseDetailsOpen(false);
                          setIsPaymentModal(false);
                          window.location.href=data;
                      }
                    }
                      catch (error) {
                      setIsPaymentModal(false);
                    }
                }}
              >
                {i18n?.t("submit")}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
export default PaymentModal;