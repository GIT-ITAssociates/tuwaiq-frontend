"use client";
import { IoClose } from "react-icons/io5";
import { TbArrowRightToArc } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { Form, message, notification, Modal } from "antd";
import OTPInput from "react-otp-input";
import { useTimer } from "use-timer";
import { useModal } from "@/app/context/modalContext";
import Button from "../common/button";
import { useUser } from "@/app/context/userContext";
import { postForgot, verifyOtp } from "@/app/helpers/backend";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/providers/i18n";

const OtpModal = () => {
  const [form] = Form.useForm();
  const {
    otpModal,
    closeOtpModal,
  } = useModal();
  const { otpPayload, setOtpPayload } = useUser();
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const i18n = useI18n();

  const handleFinish = async (values) => {
    setLoading(true);
    const { error, msg, data } = await verifyOtp({ otp: values?.otp, email: otpPayload?.email });
    if (error) {
      message.error(msg);
      setLoading(false);
    }
    else {
      message.success(msg);
      setLoading(false)
      setOtpPayload({ token: data?.token });
      closeOtpModal();
      push("/auth/reset-password");
    }
  };
  const { time, start, pause, reset } = useTimer({
    initialTime: 120,
    timerType: "DECREMENTAL",
  });

  useEffect(() => {
    if (otpPayload?.email) {
      start();
    }
    if (time === 0) pause();
  }, [time, start, pause, otpPayload?.email]);
  const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);

  return (
    <Modal
      footer={null}
      className=" w-full !bg-transparent auth"
      closeIcon={false}
      open={otpModal}
      onCancel={closeOtpModal}
      styles={{ position: "relative", zIndex: "200" }}
      wrapClassName="auth relative z-50"
      maskClosable={false}
    >
      <div className="sm:max-w-[488px] w-full  mx-auto bg-white rounded-[20px] p-4 sm:p-10 relative ">
        <button
          className={`w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute top-6 inline-flex justify-center items-center ${defaultLang?.rtl ? "left-6" : "right-6"}`}
          onClick={() => {
            closeOtpModal();
          }}
        >
          <IoClose
            size={20}
            className="text-[#242628] text-[12px] cursor-pointer"
          />
        </button>
        <div className="w-[40px] h-[40px] mb-[40px]">
          <TbArrowRightToArc className="text-[33.33px] text-[#242628] cursor-pointer" />
        </div>
        <h2 className="text-center sm:leading-[32.84px] sm:text-[28px] text-base font-semibold text-[#242628] mb-[40px] ">
          {i18n.t('Email verification code')}
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="sm:px-[44px] px-[20px] flex flex-col items-center"
        >
          <>
            <h1 className="text-base font-normal text-center">
              {i18n.t('Your Code to')}
              <span className="text-primary ms-1">{otpPayload?.email}</span>
            </h1>
            <Form.Item name="otp" className="my-8 flex flex-col items-center">
              <OTPInput
                numInputs={6}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: "40px",
                  height: "40px",
                  marginRight: "1rem",
                  fontSize: "24px",
                  lineHeight: "28.15px",
                  border: "1px solid #EDEDED",
                  fontWeight: "500",
                  outline: "none",
                  borderRadius: "8px",
                  display: "flex",
                  columnGap: "16px",
                  justifyContent: "center",
                }}
              />
            </Form.Item>
            <p className="dark:text-White_Color capitalize mt-6 mb-2 md:text-sm text-base font-poppins">
              {i18n.t(`Didn't receive the code? `)}
              {time === 0 ? (
                <span
                  className={`text-primary cursor-pointer `}
                  onClick={async () => {
                    reset();
                    const data = await postForgot({
                      email: otpPayload?.email,
                    });
                    if (data?.error) {
                      message.error(data?.msg || data?.message);
                    } else {
                      message.success(data?.msg || data?.message);
                      setOtpPayload({ token: data?.data?.token });

                    }
                  }}
                >
                  {i18n.t('Resend')}
                </span>
              ) : (
                <span className="text-primary">
                  {i18n.t('Resend in')}  {time} {"s"}
                </span>
              )}
            </p>

            <Button className={"w-full  my-[16px] "} type="submit">
              {loading ? i18n.t('Verifying') : i18n.t("Verify")}
            </Button>
          </>
        </Form>
      </div>
    </Modal>
  );
};

export default OtpModal;
