// "use client";
// import React, { useState } from "react";
// import { Form, Input, message, Modal, notification } from "antd";
// import { useAction } from "@/app/helpers/hooks";
// import { postForgot, resetPassword } from "@/app/helpers/backend";
// import { useRouter } from "next/navigation";
// import { FiLock, FiUnlock } from "react-icons/fi";
// import Password from "antd/es/input/Password";
// import { useUser } from "@/app/context/userContext";
// import Banner from "@/app/components/common/banner";

// const ForgetPassword = () => {
//   const [email, setEmail] = useState("");
//   const [continuing, setContinuing] = useState(false);
//   const { user, otpPayload, setOtpPayload, setUser, getUserdata } = useUser();
//   const { push } = useRouter();

//   return (
//     <div>
//       <Banner title="Reset Password" />
//       <div >

//         <div className="w-fit mx-auto p-10 shadow-lg xl:mb-[150px] md:mb-14 mb-[60px]">
//           <div className="md:flex flex-col justify-center items-center ">
//             <div className="md:max-w-md relative z-10">
//               <h1 className="m:text-2xl text-2xl font-bold mb-4 md:mt-0 mt-5 text-center">
//                 {"Change your password"}?
//               </h1>

//               <Form
//                 onFinish={async (values) => {
//                   setContinuing(true);
//                   try {
//                     const data = await resetPassword({
//                       newPassword: values?.password,
//                       confirmPassword: values?.confirmPassword,
//                       token: otpPayload?.token,
//                     });

//                     if (data?.error) {
//                       message.error(data?.msg || data?.message);
//                       setContinuing(false);
//                       return;
//                     } else {
//                       localStorage.removeItem("token");
//                       message.success(data?.msg || data?.message);
//                       setUser({});
//                       push("/");
//                       getUserdata();
//                       setContinuing(false)
//                     }

//                   } catch (err) {
//                     setContinuing(false)
//                   }
//                   finally {
//                     setContinuing(false)
//                   }
//                 }}
//               >
//                 <div className="w-full">
//                   <div className="flex flex-col gap-2">
//                     <label className="font-semibold ">New Password</label>
//                     <Form.Item
//                       name={"password"}
//                       rules={[
//                         {
//                           required: true,
//                           message: "Please enter your password",
//                         },
//                       ]}
//                     >
//                       <Input.Password
//                         placeholder={"**************"}
//                         className="border border-[#E0E0E0] rounded-[10px] ps-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
//                         iconRender={(visible) =>
//                           visible ? (
//                             <FiUnlock size={16} style={{ color: "#9CA3AF" }} />
//                           ) : (
//                             <FiLock size={16} style={{ color: "#9CA3AF" }} />
//                           )
//                         }
//                       />
//                     </Form.Item>
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <label className="font-semibold ">Confirm Password</label>
//                     <Form.Item
//                       name={"confirmPassword"}
//                       rules={[
//                         ({ getFieldValue }) => ({
//                           validator(_, value) {
//                             if (!value) {
//                               return Promise.reject("Please confirm your password!");
//                             }
//                             if (getFieldValue('password') !== value) {
//                               return Promise.reject("The two passwords do not match!");
//                             }
//                             return Promise.resolve();
//                           },
//                         }),
//                       ]}
//                     >
//                       <Input.Password
//                         placeholder={"**************"}
//                         className="border border-[#E0E0E0] rounded-[10px] ps-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
//                         iconRender={(visible) =>
//                           visible ? (
//                             <FiUnlock size={16} style={{ color: "#9CA3AF" }} />
//                           ) : (
//                             <FiLock size={16} style={{ color: "#9CA3AF" }} />
//                           )
//                         }
//                       />
//                     </Form.Item>
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   className="bg-secondary hover:bg-primary duration-300 ease-in-out text-white px-4 py-3 rounded-md w-full"
//                   disabled={continuing}
//                 >
//                   {continuing ? "Loading" : "Continue"}
//                 </button>
//               </Form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgetPassword;


"use client";
import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { resetPassword } from "@/app/helpers/backend";
import { useRouter } from "next/navigation";
import { FiLock, FiUnlock } from "react-icons/fi";
import { useUser } from "@/app/context/userContext";
import { IoClose } from "react-icons/io5";
import { TbArrowRightToArc } from "react-icons/tb";
import { useI18n } from "@/app/providers/i18n";

const ResetPassword = () => {
  const [continuing, setContinuing] = useState(false);
  const { otpPayload, setUser, getUserdata } = useUser();
  const { push } = useRouter();
  const i18n = useI18n();

  const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);

  const handleSubmit = async (values) => {
    setContinuing(true);
    try {
      const data = await resetPassword({
        newPassword: values?.password,
        confirmPassword: values?.confirmPassword,
        token: otpPayload?.token,
      });

      if (data?.error) {
        message.error(data?.msg || data?.message);
        setContinuing(false);
        return;
      } else {
        localStorage.removeItem("token");
        message.success(data?.msg || data?.message);
        setUser({});
        push("/auth/login");
        getUserdata();
      }
    } catch (err) {
      message.error("An error occurred. Please try again.");
    } finally {
      setContinuing(false);
    }
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/auth_bg.png')" }}
    >

      {/* Reset Password Card */}
      <div className="sm:max-w-[488px] w-full mx-auto bg-white rounded-[20px] p-6 sm:p-10 shadow-lg">
        <div className="w-[40px] h-[40px] mb-[40px]">
          <TbArrowRightToArc
            className="text-[33.33px] text-[#242628] cursor-pointer"
            onClick={() => push("/")}
          />
        </div>

        <h2 className="text-[28px] font-semibold text-[#242628] mb-4 text-center">
          {i18n?.t("Change your password")}
        </h2>

        <p className="text-sm font-normal text-gray-800 mb-6 text-center">
          {i18n?.t("Please enter your new password below")}
        </p>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label={
              <p className="text-base font-medium text-[#242628]">
                {i18n?.t("New Password")}
              </p>
            }
            name="password"
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
                  <FiUnlock size={16} style={{ color: "#9CA3AF" }} />
                ) : (
                  <FiLock size={16} style={{ color: "#9CA3AF" }} />
                )
              }
            />
          </Form.Item>

          <Form.Item
            label={
              <p className="text-base font-medium text-[#242628]">
                {i18n?.t("Confirm Password")}
              </p>
            }
            name="confirmPassword"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(i18n?.t("Please confirm your password!"));
                  }
                  if (getFieldValue('password') !== value) {
                    return Promise.reject(i18n?.t("The two passwords do not match!"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="**************"
              className="border border-[#E0E0E0] rounded-[10px] ps-[20px] h-[56px]"
              iconRender={(visible) =>
                visible ? (
                  <FiUnlock size={16} style={{ color: "#9CA3AF" }} />
                ) : (
                  <FiLock size={16} style={{ color: "#9CA3AF" }} />
                )
              }
            />
          </Form.Item>

          <button
            type="submit"
            className="h-[56px] mb-4 bg-primary text-white w-full rounded-[8px] transition-all duration-300 hover:bg-transparent hover:text-primary border-2 border-primary font-medium capitalize"
            disabled={continuing}
          >
            {continuing ? i18n?.t("Loading") : i18n?.t("Continue")}
          </button>
        </Form>

      </div>
    </div>
  );
};

export default ResetPassword;