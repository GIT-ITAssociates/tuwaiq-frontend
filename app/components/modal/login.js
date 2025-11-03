"use client";
import { IoClose } from "react-icons/io5";
import { Form, Input, message, Modal } from "antd";
import { TbArrowRightToArc } from "react-icons/tb";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useModal } from "@/app/context/modalContext";
import { postLogin } from "@/app/helpers/backend";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { useI18n } from "@/app/providers/i18n";

const Login = () => {
  const [form] = Form.useForm();
  const {  getUserdata } = useUser();
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const i18n = useI18n();
  const {
    isLoginModalOpen,
    closeLoginModal,
    openSignUp,
  } = useModal();

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
      if (data?.user?.role === "admin") {
        getUserdata();
        message.success(msg);
        closeLoginModal();
        window.location.href = "/admin"
        setLoading(false);
      }
      else if (data?.user?.role === "attorney") {
        getUserdata();
        message.success(msg);
        closeLoginModal();
        window.location.href = "/attorney/dashboard"
        setLoading(false);
      }
      else {
        getUserdata();
        message.success(msg);
        closeLoginModal();
        window.location.href = "/user/dashboard";
        setLoading(false);


      }
    }
  };


  const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);

  return (
    <>
      <Modal
        footer={null}
        wrapClassName="auth"
        className=" w-full !bg-transparent auth"
        closeIcon={false}
        open={isLoginModalOpen}
        onCancel={closeLoginModal}
        style={{ position: "relative", zIndex: "200" }}
        maskClosable={false}
      >
        <div className="sm:max-w-[488px]  w-full  mx-auto bg-white rounded-[20px] p-4 sm:p-10 relative">

          <button
            className={`w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute top-6 inline-flex justify-center items-center ${defaultLang?.rtl ? "left-6" : "right-6"}`}
            onClick={() => {
              closeLoginModal();
            }}
          >
            <IoClose
              size={20}
              className="text-[#242628] text-[12px] cursor-pointer"
            />
          </button>
          <div className="w-[40px] h-[40px] mb-[40px]">
            <TbArrowRightToArc
              className="text-[33.33px] text-[#242628] cursor-pointer"
              onClick={() => {
                closeLoginModal();
              }}
            />
          </div>
      
          <h2 className="leading-[32.84px] text-[28px]  font-semibold text-[#242628] mb-[40px] ">
            {i18n?.t("Sign in")}
          </h2>

         

          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <>
              <Form.Item
                label={
                  <p className="text-base font-medium text-[#242628]  ">
                    {i18n?.t("Email Address")}
                  </p>
                }
                name="email"
                className="w-full "
                rules={[
                  { required: true, message: i18n?.t("Please enter your email!") },
                  { type: "email", message: i18n?.t("Enter a valid email!") },
                ]}
              >
                <input
                  placeholder={i18n?.t("Example@lawstick.com")}
                  type="email"
                  className="border border-[#E0E0E0] rounded-[10px] px-[20px] pt-[19px] pb-[18px] w-full h-[56px] "
                />
              </Form.Item>

              <Form.Item
                name={"password"}
                className=" w-full"
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
                  placeholder={"**************"}
                  className="border border-[#E0E0E0] rounded-[10px] ps-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
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
                  onClick={() => {
                    push("/forget-password");
                    closeLoginModal();
                  }}
                  className={`text-[#B68C5A] hover:text-primary hover:underline  cursor-pointer duration-300 transition-all text-base font-medium -mt-3 !mb-[24px] `}
                >
                  <span className={`${defaultLang?.rtl ? "text-left" : "text-left"}`}>{i18n?.t("Forget Password")}</span> <span className={`${defaultLang?.rtl ? "text-left" : "text-left"}`}>?</span>
                </div>
              </div>
              <button
                className={
                  "h-[56px] border-2 mb-4 bg-primary  button text-white hover:bg-transparent w-full hover:text-primary border-primary lg:px-8 text-textMain !font-poppins md:px-4  py-4 px-4 whitespace-pre rounded-[8px] transition-all !font-medium duration-300 ease-in-out sm:text-base capitalize text-sm"
                }
                type="submit"
              >
                {i18n?.t("Log In")}
              </button>
            </>
          </Form>

          <div>

            <p className="text-center text-base capitalize text-[#242628] pt-[24px] link font-medium">
              {i18n?.t("Do not have an account?")}{" "}
              <span
                className="text-[#C4976A] hover:underline cursor-pointer hover:text-primary link font-medium "
                onClick={() => {
                  openSignUp();
                  closeLoginModal();
                }}
              >
                {i18n?.t("Sign Up")}
              </span>
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Login;
