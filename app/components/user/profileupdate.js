'use client";'

import {  postSingleImage } from "@/app/helpers/backend";
import { DatePicker, Form } from "antd";
import Image from "next/image";
import PhoneNumberInput from "../common/form/phoneNumberInput";
import FormCountrySelect from "../common/form/country";
import { useEffect } from "react";
import { TbEdit } from "react-icons/tb";
import { useAction } from "@/app/helpers/hooks";
import { updateProfile } from "@/app/helpers/backend";
import dayjs from "dayjs";
import MultipleImageInput from "../common/form/multiImage";
import { useUser } from "@/app/context/userContext";
import { useI18n } from "@/app/providers/i18n";

export const ProfileUpdate = ({ isEdit, setIsEdit }) => {
    const [form] = Form.useForm();
    const {user, getUserdata} = useUser();
    const i18n = useI18n();

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
                name: user?.name,
                phone_no: user?.phone_no,
                email: user?.email,
                dob: dayjs(user?.dob),
                pre_address: user?.pre_address,
                per_address: user?.per_address,
                postal_code: user?.postal_code,
                country: user?.country,
            });
        }
    }, [user, form]);

    const handleUpdateProfile = async (values) => {

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
        try {
            const profileData = {
                image: values?.image[0]?.url || imageUrl,
                name: values?.name,
                phone_no: values?.phone_no,
                email: values?.email,
                dob: dayjs(values?.dob).format("YYYY-MM-DD"),
                pre_address: values?.pre_address,
                per_address: values?.per_address,
                postal_code: values?.postal_code,
                country: values?.country,
                role: "user",
            };
            useAction(updateProfile, profileData);
            setIsEdit(false);
            getUserdata();
        } catch (error) {
        }
    };

    return (
        <Form form={form} onFinish={handleUpdateProfile} layout="vertical">
            <div className="grid 2xl:grid-cols-[172px_644px] md:grid-cols-[142px_1fr] grid-cols-1  gap-x-[56px] ">
                {isEdit ? (
                    <Form.Item>
                        <MultipleImageInput max={1} name="image" />
                    </Form.Item>
                ) : (
                    <div className="w-[140px] h-[140px] relative row-span-4  md:pb-0 mb-[56px]">
                        <Image
                            width={140}
                            height={140}
                            src={user?.image} 
                            className="w-[140px] h-[140px] object-cover rounded-full"
                            alt="attorney"
                        />
                        <div
                            className="absolute right-0 bottom-0 cursor-pointer w-[44px] h-[44px] rounded-full grid place-content-center bg-primary text-white"
                            onClick={() => {
                                setIsEdit(true);
                            }}
                        >
                            <TbEdit className="text-[24px]" />
                        </div>
                    </div>
                )}

                <div className=" grid sm:grid-cols-2 grid-cols-1 gap-x-[24px] ">
                    <Form.Item
                        label={
                            <p className="text-base font-medium text-[#242628] ">{i18n?.t("Full Name")}</p>
                        }
                        name="name"
                        className="!w-full"
                        rules={[{ required: true, message: i18n?.t("Please enter your name!") }]}
                    >
                        <input
                            placeholder={i18n?.t("Martha Uilson")}
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
                    >
                        <input
                            placeholder={i18n?.t("uilson@email.com")}
                            disabled={isEdit}
                            type="email"
                            className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <p className="text-base font-medium text-[#242628] ">
                                {i18n?.t("Date of Birth")}
                            </p>
                        }
                        name="dob"
                        className="datepick h-[56px]"
                    >
                        <DatePicker
                            format={"DD MMM YYYY"}
                            onChange={(date, dateString) => {}}
                            disabled={!isEdit}
                        />
                    </Form.Item>
                    <PhoneNumberInput
                        name="phone_no"
                        placeholder={"01614790538"}
                        label={i18n?.t("Phone Number")}
                        className={"phone"}
                        disabled={!isEdit}
                    />
                    <Form.Item
                        label={
                            <p className="text-base font-medium text-[#242628] ">
                                {i18n?.t("Present Address")}
                            </p>
                        }
                        name="pre_address"
                        className="!w-full"
                        rules={[{ required: true, message: i18n?.t("Please enter your present address!") }]}
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
                        rules={[{ required: true, message: i18n?.t("Please enter your permanent address!") }]}
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
                        rules={[{ required: true, message: i18n?.t("Please enter your postcode!") }]}
                    >
                        <input
                            placeholder="9300"
                            type="number"
                            className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                            disabled={!isEdit}
                        />
                    </Form.Item>
                    <FormCountrySelect
                        name="country"
                        label={i18n?.t("Country")}
                        disabled={!isEdit}
                        initialValue={user?.country}
                    />
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
    );
};