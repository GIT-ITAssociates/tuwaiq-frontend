"use client";
import { IoClose } from "react-icons/io5";
import { Form,  message,  Modal,  } from "antd";
import { TbArrowRightToArc } from "react-icons/tb";
import { useState } from "react";
import { useModal } from "@/app/context/modalContext";
import FormCountrySelect from "../common/form/country";
import { useUser } from "@/app/context/userContext";
import OtpModal from "./otpmodal";
import { updateProfile } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
import { usePathname, useRouter } from "next/navigation";


const UpdateProfile2 = () => {
  const [form] = Form.useForm();
    const { replace } = useRouter();
      const [loading, setLoading] = useState(false);

  const { user,setUser,otpPayload,setOtpPayload} = useUser();
  const {
    otpModal,
    setOtpModal,
    openUpdateProfile1,
    isProfileUpdate2,
    closeUpdateProfile2,
  } = useModal();
  const i18n=useI18n();
  const handleFinish = async (values) => {
    setLoading(true);
    setOtpPayload({...otpPayload})
   const data2=await updateProfile({...otpPayload,...values})
     if(data2?.error){
      message.error(data2?.msg || data2?.message);
      setLoading(false);
     }
     else{
      message.success(data2?.msg || data2?.message);
     setUser(data2?.data?.user);
    //  closeUpdateProfile2();

                 replace("/user/dashboard");
     }};
    const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);

  return (
    <>
    <Modal
      footer={null}
      className={` w-full !bg-transparent auth ${otpModal && "hidden"}`}
      closeIcon={false}
      open={isProfileUpdate2}
      onCancel={closeUpdateProfile2}
      style={{ position: "relative", zIndex: "200" }}
      wrapClassName="auth"
      maskClosable={false}
    >
      <div className={`sm:max-w-[488px] w-full  mx-auto bg-white rounded-[20px] p-4 sm:p-10 relative`}>
        <button
            className={`w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute top-6 inline-flex justify-center items-center ${defaultLang?.rtl ? "left-6" : "right-6"}`}
          onClick={() => {
            closeUpdateProfile2();
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
              if (user) {
                openUpdateProfile1();
                closeUpdateProfile2();
              }
            }}
          />
        </div>
        <h2 className="leading-[32.84px] text-[28px]  font-semibold text-[#242628] mb-[40px] ">
          {i18n.t('Update Your Profile')}
        </h2>

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                 {i18n.t('Present Address')} 
                </p>
              }
              name="preAddress"
              rules={[
                {
                  required: true,
                  message: i18n.t("Please enter your present address!"),
                },
              ]}
           
            >
              <input
                placeholder={i18n.t("3885 Al Bandariyyah StreetAl Falah Riyadh 13314")}
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n.t('Permanent Address')}
                </p>
              }
              name="perAddress"
           
              rules={[
                {
                  required: true,
                  message: i18n.t("Please enter your permanent address!"),
                },
              ]}
            >
              <input
                placeholder={i18n.t("3885 Al Bandariyyah StreetAl Falah Riyadh 13314")}
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
              />
            </Form.Item>
            <FormCountrySelect
              name={"country"}
              label={i18n.t("Country")}
              required={true}
            />

            <button
              className={
                "border-2 mb-4 mt-[16px] bg-primary  button text-white hover:bg-transparent w-full hover:text-primary border-primary lg:px-8 text-textMain !font-poppins md:px-4 h-[56px] py-4 px-4 whitespace-pre rounded-[8px] transition-all !font-medium duration-300 ease-in-out sm:text-base capitalize text-sm"
              }
              type="submit"
               disabled={loading}
            >
                    
                 {loading ? i18n.t("Submitting...") : i18n.t("Save")}
                       </button>
          </>
        </Form>
      </div>
    </Modal>
   <OtpModal email={user?.email} otpPayload={otpPayload} setOtpModal={setOtpModal}/>
   
    </>
  );
};

export default UpdateProfile2;
