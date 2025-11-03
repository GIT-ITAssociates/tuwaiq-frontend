// "use client";
// import React, { useState } from "react";
// import { Form, message, Modal, notification } from "antd";
// import { postForgot } from "@/app/helpers/backend";
// import { useRouter } from "next/navigation";
// import Banner from "@/app/components/common/banner";
// import { useModal } from "@/app/context/modalContext";
// import { useUser } from "@/app/context/userContext";
// import { useI18n } from "@/app/providers/i18n";

// const ForgetPassword = () => {
//     const [email, setEmail] = useState("");
//     const [continuing, setContinuing] = useState(false);
//     const { openOtpModal}=useModal();
//     const {push} = useRouter();
//     const i18n = useI18n();
//     const {  setOtpPayload } = useUser();
//     const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);
//     return (
//         <div>
//         <Banner title="Forget Password"/>

//         <div className=" pb-[120px]  ">
//             <div className="w-fit mx-auto p-10 shadow-lg ">
//                 <div className="md:flex flex-col justify-center items-center ">
//                     <div className="md:max-w-md relative z-10">
//                         <h1 className={`m:text-2xl text-2xl font-bold mb-4 md:mt-0 mt-5 text-center `}>
//                             {i18n?.t("Forgot your password")}?
//                         </h1>
//                         <p className="text-sm font-normal text-gray-800 mb-6 text-center">
//                             {i18n?.t("Please confirm your email address below and we will send you a verification code.")} 
//                         </p>
//                         <Form
//                             onFinish={async() => {
//                                 setContinuing(true);
//                                 setOtpPayload({email:email});
//                                 const data=await postForgot({ email: email })
//                                 if(data?.error){
//                                     message.error(data?.msg || data?.message);
//                                     setContinuing(false);
//                                 }
//                                 else{
//                                     message.success(data?.msg || data?.message);
//                                     openOtpModal();
//                                     setContinuing(false);
//                                  }
//                             }}
//                         >
//                             <div className="mb-5">
//                                 <label className="block font-medium mb-2">{i18n?.t("Email")}</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={email}
//                                     placeholder={i18n?.t("Type your email")}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     required
//                                     className="w-full px-3 py-3 border-2 rounded-lg border-dotted border-primary focus:ring-2 focus:ring-transparent focus:border-primary focus:border-dashed"
//                                 />
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="bg-secondary hover:bg-primary duration-300 ease-in-out text-white px-4 py-3 rounded-md w-full"
//                                 disabled={continuing}
//                             >
//                                 {continuing ? i18n?.t("Loading") : i18n?.t("Continue")}
//                             </button>
//                         </Form>
//                     </div>
//                 </div>
//             </div>
//         </div></div>
//     );
// };

// export default ForgetPassword;



"use client";
import React, { useState } from "react";
import { Form, message, Modal, notification } from "antd";
import { postForgot } from "@/app/helpers/backend";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/context/modalContext";
import { useUser } from "@/app/context/userContext";
import { useI18n } from "@/app/providers/i18n";
import { IoClose } from "react-icons/io5";
import { TbArrowRightToArc } from "react-icons/tb";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [continuing, setContinuing] = useState(false);
    const { openOtpModal } = useModal();
    const { push } = useRouter();
    const i18n = useI18n();
    const { setOtpPayload } = useUser();

    const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);

    const handleSubmit = async () => {
        setContinuing(true);
        setOtpPayload({ email: email });
        const data = await postForgot({ email: email });

        if (data?.error) {
            message.error(data?.msg || data?.message);
            setContinuing(false);
        } else {
            message.success(data?.msg || data?.message);
            // openOtpModal();
            push("/auth/otp")
            setContinuing(false);
        }
    };

    return (
        <div
            className="w-screen h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/auth_bg.png')" }}
        >

            {/* Forgot Password Card */}
            <div className="sm:max-w-[488px] w-full mx-auto bg-white rounded-[20px] p-6 sm:p-10 shadow-lg">
                <div className="w-[40px] h-[40px] mb-[40px]">
                    <TbArrowRightToArc
                        className="text-[33.33px] text-[#242628] cursor-pointer"
                        onClick={() => push("/")}
                    />
                </div>

                <h2 className="text-[28px] font-semibold text-[#242628] mb-4">
                    {i18n?.t("Forgot your password")}?
                </h2>

                <p className="text-sm font-normal text-gray-800 mb-6">
                    {i18n?.t("Please confirm your email address below and we will send you a verification code.")}
                </p>

                <Form onFinish={handleSubmit} layout="vertical">
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
                            type="email"
                            value={email}
                            placeholder={i18n?.t("Example@tuwaiq.com")}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-3 border-2 rounded-lg border-dotted border-primary focus:ring-2 focus:ring-transparent focus:border-primary focus:border-dashed"
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

                <p className="text-center text-base capitalize text-[#242628] pt-[24px] font-medium">
                    {i18n?.t("Remember your password?")}{" "}
                    <span
                        className="text-[#C4976A] hover:underline cursor-pointer hover:text-primary"
                        onClick={() => push("/auth/login")}
                    >
                        {i18n?.t("Sign In")}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ForgetPassword;