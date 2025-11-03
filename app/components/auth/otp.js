"use client";
import { IoClose } from "react-icons/io5";
import { TbArrowRightToArc } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { Form, message } from "antd";
import OTPInput from "react-otp-input";
import { useTimer } from "use-timer";
import { useUser } from "@/app/context/userContext";
import { postForgot, verifyOtp } from "@/app/helpers/backend";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/providers/i18n";

const OtpPage = () => {
    const [form] = Form.useForm();
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
        } else {
            message.success(msg);
            setLoading(false);
            setOtpPayload({ token: data?.token });
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
        <div
            className="w-screen h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/auth_bg.png')" }}
        >

            {/* OTP Card */}
            <div className="sm:max-w-[488px] w-full mx-auto bg-white rounded-[20px] p-6 sm:p-10 shadow-lg">
                <div className="w-[40px] h-[40px] mb-[40px]">
                    <TbArrowRightToArc
                        className="text-[33.33px] text-[#242628] cursor-pointer"
                        onClick={() => push("/")}
                    />
                </div>

                <h2 className="text-[28px] font-semibold text-[#242628] mb-4 text-center">
                    {i18n.t('Email verification code')}
                </h2>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    className="flex flex-col items-center"
                >
                    <>
                        <p className="text-base font-normal text-center mb-6">
                            {i18n.t('Your Code to')}
                            <span className="text-primary ms-1">{otpPayload?.email}</span>
                        </p>

                        <Form.Item
                            name="otp"
                            className="mb-6 flex flex-col items-center"
                            rules={[{ required: true, message: i18n.t('Please enter the verification code') }]}
                        >
                            <OTPInput
                                numInputs={6}
                                renderInput={(props) => <input {...props} />}
                                inputStyle={{
                                    width: "40px",
                                    height: "40px",
                                    margin: "0 8px",
                                    fontSize: "24px",
                                    lineHeight: "28.15px",
                                    border: "1px solid #EDEDED",
                                    fontWeight: "500",
                                    outline: "none",
                                    borderRadius: "8px",
                                    textAlign: "center"
                                }}
                                containerStyle={{
                                    justifyContent: "center",
                                    marginBottom: "24px"
                                }}
                            />
                        </Form.Item>

                        <p className="text-sm text-gray-800 mb-6 text-center">
                            {i18n.t(`Didn't receive the code? `)}
                            {time === 0 ? (
                                <span
                                    className="text-primary cursor-pointer font-medium"
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
                                <span className="text-primary font-medium">
                                    {i18n.t('Resend in')} {time}s
                                </span>
                            )}
                        </p>

                        <button
                            type="submit"
                            className="h-[56px] mb-4 bg-primary text-white w-full rounded-[8px] transition-all duration-300 hover:bg-transparent hover:text-primary border-2 border-primary font-medium capitalize"
                            disabled={loading}
                        >
                            {loading ? i18n.t('Verifying') : i18n.t("Verify")}
                        </button>
                    </>
                </Form>

                <p className="text-center text-base capitalize text-[#242628] pt-[24px] font-medium">
                    {i18n.t("Need to change email?")}{" "}
                    <span
                        className="text-[#C4976A] hover:underline cursor-pointer hover:text-primary"
                        onClick={() => push("/forget-password")}
                    >
                        {i18n.t("Go back")}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default OtpPage;