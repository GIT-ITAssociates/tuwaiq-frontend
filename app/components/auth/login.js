"use client";
import { IoClose } from "react-icons/io5";
import { Form, Input, message, Select } from "antd";
import { TbArrowRightToArc } from "react-icons/tb";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { postLogin } from "@/app/helpers/backend";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/app/providers/i18n";
import Image from "next/image";


const Login = () => {
    const [form] = Form.useForm();
    const { getUserdata } = useUser();
    const [loading, setLoading] = useState(false);
    const { push } = useRouter();
    const i18n = useI18n();

    const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
    const currentLanguage =
    i18n?.languages?.find((lang) => lang?._id === langFromLocalStorage)?.name ||
    "English";


    const handleFinish = async (values) => {
        setLoading(true);
        const { error, msg, data } = await postLogin({
            email: values?.email,
            password: values?.password,
        });

        if (error) {
            message.error(msg);
            setLoading(false);
        } else {
            localStorage.setItem("token", data.token);
            getUserdata();
            message.success(msg);

            if (data?.user?.role === "admin") {
                window.location.href = "/admin";
            } else if (data?.user?.role === "attorney") {
                window.location.href = "/attorney/dashboard";
            } else {
                window.location.href = "/user/dashboard";
            }
            setLoading(false);
        }
    };

    const defaultLang =
        i18n?.languages?.find(
            (lang) => localStorage.getItem("lang") === lang?._id
        ) || i18n?.languages?.find((lang) => lang?.default);

    return (
        <div
            className="w-screen h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/auth_bg.png')" }} // 👈 background set here
        >



  {/* Language Dropdown */}
   <div className="absolute top-6 right-6 z-50">
    <div className="relative flex">
      <div className="p-2 rounded-lg font-medium whitespace-nowrap w-[144px] lg:text-lg text-base flex items-center justify-center bg-white">
        <Image
          width={20}
          height={20}
          src={"/images/footer-circle.png"}
          className="h-[20px] w-[20px]"
          alt=""
        />
        <div className="languagehere cursor-pointer static z-50">
          <Select
            defaultValue="en"
            variant="borderless"
            className="text-black text-xl !font-bold"
            value={
              langFromLocalStorage
                ? i18n?.languages?.find(
                    (lang) => lang?._id === langFromLocalStorage
                  )?.name
                : i18n?.languages?.find((lang) => lang?.default)?.name
            }
            onChange={(value) => {
              i18n?.changeLanguage(value);
            }}
            options={i18n?.languages?.map((lang) => ({
              value: lang?._id,
              label: lang?.name,
            }))}
          />
        </div>
      </div>
    </div>
  </div>



            {/* Close Button */}
            {/* <button
                className={`w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute top-6 ${defaultLang?.rtl ? "left-6" : "right-6"
                    } flex items-center justify-center`}
                onClick={() => push("/")}
            >
                <IoClose size={20} className="text-[#242628] cursor-pointer" />
            </button> */}

            {/* Login Card */}
            <div className="sm:max-w-[488px] w-full mx-auto bg-white rounded-[20px] p-6 sm:p-10 shadow-lg">
                {/* <div className="w-[40px] h-[40px] mb-[40px]">
                    <TbArrowRightToArc
                        className="text-[33.33px] text-[#242628] cursor-pointer"
                        onClick={() => push("/")}
                    />
                </div> */}

                <h2 className="text-[28px] font-semibold text-[#242628] mb-[40px]">
                    {i18n?.t("Sign in")}
                </h2>

                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        label={
                            <p className="text-base font-medium text-[#242628]">
                                {i18n?.t("Email Address")}
                            </p>
                        }
                        name="email"
                        rules={[
                            { required: true, message: i18n?.t("Please enter your email!") },
                            { type: "email", message: i18n?.t("Enter a valid email!") },
                        ]}
                    >
                        <input
                            placeholder={i18n?.t("Example@lawstick.com")}
                            type="email"
                            className="border border-[#E0E0E0] rounded-[10px] px-[20px] h-[56px] w-full"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={
                            <p className="text-base font-medium text-[#242628]">
                                {i18n?.t("Password")}
                            </p>
                        }
                        rules={[
                            {
                                required: true,
                                message: i18n?.t("Please enter your password"),
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="**************"
                            className="border border-[#E0E0E0] rounded-[10px] ps-[20px] h-[56px]"
                            iconRender={(visible) =>
                                visible ? (
                                    <FiEye size={16} style={{ color: "#9CA3AF" }} />
                                ) : (
                                    <FiEyeOff size={16} style={{ color: "#9CA3AF" }} />
                                )
                            }
                        />
                    </Form.Item>

                    <div className="grid place-content-end">
                        <div
                            onClick={() => push("/forget-password")}
                            className="text-[#B68C5A] hover:text-primary hover:underline cursor-pointer duration-300 transition-all text-base font-medium -mt-3 mb-[24px]"
                        >
                            {i18n?.t("Forget Password")}?
                        </div>
                    </div>

                    <button
                        className="h-[56px] mb-4 bg-primary text-white w-full rounded-[8px] transition-all duration-300 hover:bg-transparent hover:text-primary border-2 border-primary font-medium capitalize"
                        type="submit"
                        disabled={loading}
                    >
                        {i18n?.t("Log In")}
                    </button>
                </Form>

                <p className="text-center text-base capitalize text-[#242628] pt-[24px] font-medium">
                    {i18n?.t("Do not have an account?")}{" "}
                    <span
                        className="text-[#C4976A] hover:underline cursor-pointer hover:text-primary"
                        onClick={() => push("/auth/signup")}
                    >
                        {i18n?.t("Sign Up")}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
