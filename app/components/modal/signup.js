"use client";
import { IoClose } from "react-icons/io5";
import { Form, Input, message, Modal, Select } from "antd";
import { TbArrowRightToArc } from "react-icons/tb";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useModal } from "@/app/context/modalContext";
import FormPassword from "../common/form/password";
import { postResister, sendOtp } from "@/app/helpers/backend";
import { useUser } from "@/app/context/userContext";
import { useI18n } from "@/app/providers/i18n";

const SignUp = () => {
  const {
    openLoginModal,
    closeSignUp,
    signUpModal,
   openUpdateProfile1,
    } = useModal();
  const [password, setPassword] = useState("");
  const [passwordLength,setPasswordLength]=useState(0);
  const {  getUserdata } = useUser();
  const[loading,setLoading]=useState(false);
  const i18n = useI18n();
  const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);

  const handleFinish = async (values) => {
    setLoading(true);
    if(passwordLength >= 8){
      if (!!values?.email) {
        const {error,msg, data} = await postResister({
            email: values?.email,
            password:values?.confirm_password,
            name:values?.full_name,
          });
        if (error) {
            return message.error(msg);
        } else {
            localStorage.setItem('token', data.token);
            message.success(msg);
            getUserdata();
            closeSignUp();
            openUpdateProfile1();
            setLoading(false);
            return ;
       }
      }
    }
    else{
      message.error("Please enter strong password");
    }
  };

  return (
    <Modal
      footer={null}
      wrapClassName="auth"
      className=" w-full !bg-transparent auth"
      closeIcon={false}
      open={signUpModal}
      onCancel={() => {
        closeSignUp();
      }}
      style={{ position: "relative", zIndex: "200" }}
    >
      <div className="sm:max-w-[488px] w-full  mx-auto bg-white rounded-[20px] p-4 sm:p-10 relative">

        <button
            className={`w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute top-6 inline-flex justify-center items-center ${defaultLang?.rtl ? "left-6" : "right-6"}`}
          onClick={() => {
            closeSignUp();
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
              closeSignUp();
              openLoginModal();
            }}
          />
        </div>

        <h2 className="leading-[32.84px] text-[28px]  font-semibold text-[#242628] mb-[40px] ">
          {i18n?.t('Sign Up')}
        </h2>

        <Form layout="vertical" onFinish={handleFinish}>
          <>
          <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t('Name')}
                </p>
              }
              name="full_name"
              className="w-full"
              rules={[
                { required: true, message: i18n?.t('Please enter your name!') },
              ]}
            >
              <input
                placeholder="john doe"
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t('Email Address')}
                </p>
              }
              name="email"
              className="w-full"
              rules={[
                { required: true, message: i18n?.t('Please enter your email!') },
                { type: "email", message: i18n?.t('Enter a valid email!') },
              ]}
            >
              <input
                placeholder={i18n?.t('Example@lawstick.com')}
                type="email"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
              />
            </Form.Item>

            <FormPassword
              name="password"
              checkPassword={true}
              label={i18n?.t('Password')}
              min={8}
              password={password}
              setPassword={setPassword}
              className="h-[56px]"
              setPasswordLength={setPasswordLength}
            />
            <Form.Item
              name={"confirm_password"}
              label={
                <p className="text-base font-medium text-[#242628]">
                  {i18n?.t('Repeat Password')}
                </p>
              }
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(i18n?.t('Please confirm your password!'));
                    }
                    if (password !== value) {
                      return Promise.reject(i18n?.t('The two passwords do not match!'));
                    }
                    return Promise.resolve();
                  },
                }),
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

            <button
              className={
                "border-2 mb-4 bg-primary  button text-white hover:bg-transparent w-full hover:text-primary border-primary lg:px-8 text-textMain !font-poppins md:px-4 h-[56px] py-4 px-4 whitespace-pre rounded-[8px] transition-all !font-medium duration-300 ease-in-out sm:text-base capitalize text-sm"
              }
              type="submit"
            >
              {i18n?.t('Sign Up')}
            </button>
          </>
        </Form>

        <div>

          <p className="text-center text-base capitalize text-[#242628] pt-[24px] link font-medium">
            {i18n?.t('Already Have An Account?')}{" "}
            <span
              className="text-[#C4976A] hover:underline cursor-pointer font-medium hover:text-primary link"
              onClick={() => {
                openLoginModal();
                closeSignUp();
              }}
            >
              {i18n?.t('Sign In')}
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SignUp;
