"use client";
import { Form, message } from "antd";
import { useEffect, useMemo, useState } from "react";
import { TbEdit } from "react-icons/tb";
import PhoneNumberInput from "@/app/components/common/form/phoneNumberInput";
import { useFetch } from "@/app/helpers/hooks";
import {
  getProfile,
  postSingleImage,
  updateAttorneyProfile,
} from "@/app/helpers/backend";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import { HiddenInput } from "@/app/components/common/form/input";
import Image from "next/image";
import MultipleImageInput from "@/app/components/common/form/multiImage";
import { useI18n } from "@/app/providers/i18n";
import FormCountrySelect from "@/app/components/common/form/country";
const ProfileUpdate = ({ isEdit, setIsEdit }) => {
  const config = useMemo(
    () => ({
      readonly: isEdit ? false : true,
    }),
    [isEdit]
  );
  const [data, getData, { loading }] = useFetch(getProfile, {});
  const [user, setUser] = useState(data);
  const i18n = useI18n();
  const [form] = Form.useForm();
  useEffect(() => {
    setUser(data);
  }, [data]);
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        image: user?.image
          ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: user.image,
            },
          ]
          : [],
        name: user.name,
        phone_no: user.phone_no,
        email: user.email,
        facebook: user?.facebook,
        twitter: user?.twitter,
        twitter: user?.instagram,
        certifications: user?.certifications,
        professional_experience: user?.professional_experience,
        legal_experience: user?.legal_experience,
        pre_address: user?.pre_address,
        per_address: user?.per_address,
        postal_code: user?.postal_code,
        country: user?.country,
      });
    }
  }, [user?.id]);

          const langFromLocalStorage =
    typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

    const currentLanguage = i18n?.languages?.find(
  (lang) => lang?._id === langFromLocalStorage
)?.name;

  return (
    <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
      <Form
        form={form}
        onFinish={async (values) => {
          let imageUrl;
          if (values?.image[0]?.originFileObj) {
            const image = values.image[0]?.originFileObj;
            const { data } = await postSingleImage({
              image,
              image_name: "image",
            });
            imageUrl = data;
          } else {
            imageUrl = values?.image[0]?.url || "";
          }

          const payload = {
            ...values,
            image: imageUrl,
          };
          const { error, msg, data } = await updateAttorneyProfile(payload);
          if (error) {
            message.error(msg);
          } else {
            message.success(msg);
            setUser(data?.attorney);
          }
        }}
        layout="vertical"
      >
        <div className="grid 2xl:grid-cols-[172px_644px] md:grid-cols-[142px_1fr] grid-cols-1  gap-x-[56px] ">
          <HiddenInput name="id" />
          {isEdit ? (
            <Form.Item>
              <MultipleImageInput max={1} name="image" />
            </Form.Item>
          ) : (
            <div className="w-[140px] h-[140px] relative row-span-4  md:pb-0 mb-[56px]">
              <Image
                width={140}
                height={140}
                src={user?.image || "/images/defaultimg.jpg"}
                className="w-[140px] h-[140px] object-cover rounded-full"
                alt="attorney"
              />
              <button
                className="absolute right-0 bottom-0 cursor-pointer w-[44px] h-[44px] rounded-full grid place-content-center bg-primary text-white"
                onClick={() => {
                  setIsEdit(!isEdit);
                }}
              >
                <TbEdit className="text-[24px]" />
              </button>
            </div>
          )}

          <div className=" grid sm:grid-cols-2 grid-cols-1 gap-x-[24px] ">
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Full Name")}
                </p>
              }
              name="name"
              className="!w-full"
              rules={[
                { required: true, message: i18n?.t("Please enter your name!") },
              ]}
            >
              <input
                placeholder="Martha Uilson"
                disabled={!isEdit}
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] pt-[19px] pb-[18px] w-full h-[56px]"
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Email Address")}
                </p>
              }
              name="email"
              className="!w-full"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your email!"),
                },
              ]}
            >
              <input
                placeholder="uilson@email.com"
                disabled={!isEdit}
                type="email"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
              />
            </Form.Item>

            <PhoneNumberInput
              name="phone_no"
              placeholder={"01614790538"}
              label={currentLanguage === "Arabic" ? "رقم الهاتف" : "Phone Number"}
              className={"phone"}
              disabled={!isEdit}
            />
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Designation")}
                </p>
              }
              name="designation"
              className="!w-full"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your designation!"),
                },
              ]}
            >
              <input
                placeholder="Senior Lawyer"
                disabled={!isEdit}
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
              />
            </Form.Item>

            <Form.Item
              name="bio"
              className="!w-full col-span-1 md:col-span-2"
              label={
                <p className="text-base font-medium text-[#242628] mb-[12px]">
                  {i18n?.t("Short Bio")}
                </p>
              }
            >
              <textarea
                type="text"
                disabled={!isEdit}
                className="w-full placeholder:text-base placeholder:font-normal  px-4 py-2 lg:h-[180px] md:h-[180px] h-[4rem] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
                placeholder={i18n?.t(
                  "This case involves Party A and Party B, concerning the alleged murder of Victim's Name."
                )}
                required
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Certifications and Qualifications")}
                </p>
              }
              name="certifications"
              className="!w-full  col-span-1 md:col-span-2"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your Certifications!"),
                },
              ]}
            >
              <JoditEditor
                config={config}
                required={true}
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px]"
                placeholder={i18n?.t(
                  "This case involves Party A and Party B, concerning the alleged murder of Victim's Name."
                )}
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Professional Experience")}
                </p>
              }
              className="!w-full  col-span-1 md:col-span-2"
              name="professional_experience"
            >
              <JoditEditor
                config={config}
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px]"
                placeholder={i18n?.t(
                  "This case involves Party A and Party B, concerning the alleged murder of Victim's Name."
                )}
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Legal Experience")}
                </p>
              }
              className="!w-full  col-span-1 md:col-span-2"
              name="legal_experience"
            >
              <JoditEditor
                config={config}
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px]"
                placeholder={i18n?.t(
                  "This case involves Party A and Party B, concerning the alleged murder of Victim's Name."
                )}
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("My Practice")}
                </p>
              }
              className="!w-full  col-span-1 md:col-span-2"
              name="practice"
              required={true}
            >
              <JoditEditor
                config={config}
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px]"
                placeholder={i18n?.t(
                  "This case involves Party A and Party B, concerning the alleged murder of Victim's Name."
                )}
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Present Address")}
                </p>
              }
              name="pre_address"
              className="!w-full"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your present address!"),
                },
              ]}
            >
              <input
                placeholder={i18n?.t("3885 Al Bandariyyah StreetAl Falah Riyadh 13314")}
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                disabled={!isEdit}
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Permanent Address")}
                </p>
              }
              name="per_address"
              className="!w-full"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your permanent address!"),
                },
              ]}
            >
              <input
                placeholder={i18n?.t("3885 Al Bandariyyah StreetAl Falah Riyadh 13314")}
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                disabled={!isEdit}
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Postal Code")}
                </p>
              }
              name="postal_code"
              className="!w-full"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your postcode!"),
                },
              ]}
            >
              <input
                placeholder="9300"
                type="number"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                disabled={!isEdit}
              />
            </Form.Item>
            <div className="pt-2">
              <FormCountrySelect
                name="country"
                label={i18n?.t("Country")}
                disabled={!isEdit}
                initialValue={user?.country}
              /></div>
            <p className="text-[28px] font-sans mb-3 leading-[41.76px] font-medium text-[#242628] col-span-1 md:col-span-2">
              {i18n?.t("Social Links")}
            </p>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Twitter")}
                </p>
              }
              name="twitter"
              className="!w-full  col-span-1 md:col-span-2"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your twitter!"),
                },
              ]}
            >
              <input
                placeholder="www.twitter.com"
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                disabled={!isEdit}
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Facebook")}{" "}
                </p>
              }
              name="facebook"
              className="!w-full  col-span-1 md:col-span-2"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your facebook link!"),
                },
              ]}
            >
              <input
                placeholder={i18n?.t("www.facebook.com")}
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                disabled={!isEdit}
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Linkedin")}
                </p>
              }
              name="linkedin"
              className="!w-full  col-span-1 md:col-span-2"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your linkedin link!"),
                },
              ]}
            >
              <input
                placeholder="www.linkedin.com"
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                disabled={!isEdit}
              />
            </Form.Item>
            <Form.Item
              label={
                <p className="text-base font-medium text-[#242628] ">
                  {i18n?.t("Instagram")}{" "}
                </p>
              }
              name="instagram"
              className="!w-full  col-span-1 md:col-span-2"
              rules={[
                {
                  required: true,
                  message: i18n?.t("Please enter your postcode!"),
                },
              ]}
            >
              <input
                placeholder={i18n?.t("www.instagram.com")}
                type="text"
                className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                disabled={!isEdit}
              />
            </Form.Item>

            {isEdit && (
              <div className="flex gap-6 items-center justify-end sm:col-span-2 col-span-1">
                <span
                  className="capitalize w-fit px-[32px] py-[16px] rounded-[8px] bg-[#EDEDED] text-[#242628] font-sans text-[18px] leading-[24px] font-medium cursor-pointer"
                  onClick={() => {
                    setIsEdit(false);
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
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};
export default ProfileUpdate;
