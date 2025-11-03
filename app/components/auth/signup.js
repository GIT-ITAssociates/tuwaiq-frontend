"use client";
import { Form, Input, message, Select } from "antd";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/app/providers/i18n";
import { postResister } from "@/app/helpers/backend";
import FormPassword from "../common/form/password";
import { useUser } from "@/app/context/userContext";
import { useModal } from "../../context/modalContext";
import UpdateProfile2 from "../modal/updateProfile2";
import UpdateProfile1 from "../modal/updateProfile1";
import Image from "next/image";


const Signup = () => {
    const [form] = Form.useForm();
    const { push } = useRouter();
    const [loading, setLoading] = useState(false);
    const i18n = useI18n();

  const {  getUserdata } = useUser();

    const {
      openSignUp,
     isProfileUpdate1,
     isProfileUpdate2,
      closeUpdateProfile1,
      openUpdateProfile1,
      openUpdateProfile2,
    } = useModal();

    
    const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
    const currentLanguage =
    i18n?.languages?.find((lang) => lang?._id === langFromLocalStorage)?.name ||
    "English";


    // const handleFinish = async (values) => {
    //     setLoading(true);
    //     const { error, msg } = await postSignup(values);

    //     if (error) {
    //         message.error(msg);
    //     } else {
    //         message.success(msg);
    //         push("/auth/login");
    //     }
    //     setLoading(false);
    // };



    //   const handleFinish = async (values) => {
    //     setLoading(true);
    //         const {error,msg, data} = await postResister({
    //             email: values?.email,
    //             password:values?.password,
    //             name:values?.name,
    //             role: "user"
    //           });
    //          if (error) {
    //   message.error(msg || "Something went wrong!");
    //   return;
    // }else {
    //             localStorage.setItem('token', data.token);
    //             message.success(msg);
    //             getUserdata();
    //             openUpdateProfile1();
    //             setLoading(false);
    //             return ;
    //        }
          

    //   };

    const handleFinish = async (values) => {
  setLoading(true);
  try {
    const { error, msg, data } = await postResister({
      email: values?.email,
      password: values?.password,
      name: values?.name,
      role: "user"
    });

    if (error) {
      message.error(msg || "Something went wrong!");
      return;
    }

    // ✅ Success case
    localStorage.setItem("token", data?.token);
    message.success(msg || "Registered successfully");
    getUserdata();
    openUpdateProfile1();

  } catch (err) {
    console.error("Registration failed:", err);
    message.error(err?.message || "Unexpected error, please try again");
  } finally {
    setLoading(false); // ✅ Always reset loading
  }
};



    return (
        <div
            className="w-screen h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/auth_bg.png')" }} // 👈 same as login
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


            <div className="sm:max-w-[488px] w-full mx-auto bg-white rounded-[20px] p-6 sm:p-10 shadow-lg">
                <h2 className="text-[28px] font-semibold text-[#242628] mb-[40px]">
                    {i18n?.t("Sign Up")}
                </h2>


                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        label={<p className="text-base font-medium text-[#242628]">{i18n?.t("Name")}</p>}
                        name="name"
                        rules={[{ required: true, message: i18n?.t("Please enter your name!") }]}
                    >
                        <input
                            placeholder={i18n?.t("Enter your name")}
                            className="border border-[#E0E0E0] rounded-[10px] px-[20px] h-[56px] w-full"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<p className="text-base font-medium text-[#242628]">{i18n?.t("Email Address")}</p>}
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

            {/* <FormPassword
              name="password"
              checkPassword={true}
              label={i18n?.t('Password')}
              min={8}
              password={password}
              setPassword={setPassword}
              className="h-[56px]"
              setPasswordLength={setPasswordLength}
            /> */}

{/* <FormPassword
  name="password"
  label={i18n?.t("Password")}
  password={password}
  setPassword={setPassword}
  setPasswordLength={setPasswordLength}
/> */}


<Form.Item
  name="password"
  label={<p className="text-base font-medium text-[#242628]">{i18n?.t("Password")}</p>}
  rules={[
    { required: true, message: i18n?.t("Please enter your password") },
    {
      validator: (_, value) => {
        if (!value || value.length >= 8) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(i18n?.t("Password must be at least 8 characters")));
      },
    },
  ]}
>
  <Input.Password
    placeholder="**************"
    className="border border-[#E0E0E0] rounded-[10px] ps-[20px] h-[56px]"
    iconRender={(visible) =>
      visible ? <FiEye size={16} style={{ color: "#9CA3AF" }} /> : <FiEyeOff size={16} style={{ color: "#9CA3AF" }} />
    }
  />
</Form.Item>

                    <button
                        className="h-[56px] mb-4 bg-primary text-white w-full rounded-[8px] transition-all duration-300 hover:bg-transparent hover:text-primary border-2 border-primary font-medium capitalize"
                        type="submit"
                        disabled={loading}
                    >
                            {loading ? i18n.t("Signing up...") : i18n.t("Sign Up")}
                    </button>
                </Form>

                <p className="text-center text-base capitalize text-[#242628] pt-[24px] font-medium">
{currentLanguage === "English"
  ? "Already have an account?"
  : "هل لديك حساب بالفعل؟"}{" "}
                    <span
                        className="text-[#C4976A] hover:underline cursor-pointer hover:text-primary"
                        onClick={() => push("/auth/login")}
                    >
                        {i18n?.t("Log In")}
                    </span>
                </p>
            </div>

                  {isProfileUpdate1 && <UpdateProfile1 />}
      {isProfileUpdate2 && <UpdateProfile2 />}


        </div>
    );
};

export default Signup;
