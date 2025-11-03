'use client';
import { useAction } from "@/app/helpers/hooks";
import { updatepassword } from "@/app/helpers/backend";
import { useRouter } from "next/navigation";
import {  Form, Input, message} from "antd";
import { FiLock, FiUnlock } from "react-icons/fi";
import { useI18n } from "@/app/providers/i18n";
import { useUser } from "@/app/context/userContext";

 const PasswordUpdate = ({ setTab }) => {
    const i18n = useI18n();
    const router = useRouter();
    const {setUser}=useUser();
    return (
      <div>
        <h2 className="leading-[28.15px] text-[#242628] font-medium md:text-[24px] text-[20px] font-sans mb-[24px]">
          {i18n?.t("Change Password")}
        </h2>
        <Form
          layout="vertical"
          onFinish={async (values) => {
            const payload = {
              oldPassword: values?.oldPassword,
              newPassword: values?.newPassword,
            }
            
            useAction(updatepassword, payload, () => {
              localStorage.removeItem('token')
              window.location.href = '/'
              setUser({});
              setTab("profile");
               router.push("/");
            });
          }}
        >
          <div className="md:max-w-[342px] w-full">
            <Form.Item
              name={"oldPassword"}
              label={
                <p className="text-base font-medium text-[#242628]">
                  {i18n?.t("Old Password")}
                </p>
              }
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter old your password"),
                },
              ]}
            >
              <Input.Password
                placeholder={"**************"}
                className="border border-[#E0E0E0] rounded-[10px] ps-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
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
              name={"newPassword"}
              label={
                <p className="text-base font-medium text-[#242628]">
                  {i18n?.t("New Password")}
                </p>
              }
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your new password"),
                },
              ]}
            >
              <Input.Password
                placeholder={"**************"}
                className="border border-[#E0E0E0] rounded-[10px] ps-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                iconRender={(visible) =>
                  visible ? (
                    <FiUnlock size={16} style={{ color: "#9CA3AF" }} />
                  ) : (
                    <FiLock size={16} style={{ color: "#9CA3AF" }} />
                  )
                }
              />
            </Form.Item>
          </div>
          <div className="flex gap-6 items-center justify-end sm:col-span-2 col-span-1">
            <span
              className="capitalize w-fit px-[32px] py-[16px] rounded-[8px] bg-[#EDEDED] text-[#242628] font-sans text-[18px] leading-[24px] font-medium cursor-pointer"
              onClick={() => {
                setTab("profile");
              }}
            >
              {i18n?.t("Cancel")}
            </span>
            <button
              type="submit"
              className={`border-2 bg-primary w-fit  button text-white hover:bg-transparent hover:text-primary border-primary lg:px-8 text-textMain !font-poppins md:px-4  py-4 px-4 whitespace-pre rounded-[8px] transition-all !font-medium duration-300 ease-in-out sm:text-base capitalize text-sm `}
            >
              {i18n?.t("Save")}
            </button>
          </div>
        </Form>
      </div>
    );
  };
  export default PasswordUpdate;