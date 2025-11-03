"use client";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { Form } from "antd";
import Image from "next/image";
import Button from "@/app/components/common/button";
import PhoneNumberInput from "@/app/components/common/form/phoneNumberInput";
import { useUser } from "@/app/context/userContext";
import MultipleImageInput from "@/app/components/common/form/multiImage";
import { useAction } from "@/app/helpers/hooks";
import { adminUpdateProfile, postSingleImage, updateProfile } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";

const AdminProfile = () => {
  const [form] = Form.useForm();
  const { user, getUserdata, setUser, otpPayload, setOtpPayload } = useUser();
  const [edit, setEdit] = useState(false);
  const i18n=useI18n();
  useEffect(() => {
    form.setFieldsValue({
      ...user,
      image:
        user?.image?.length > 0
          ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: user?.image,
            },
          ]
          : [],
    });
  }, [user]);

  return (
    <div className=" lg:w-3/5 w-full mx-auto   ">
      <div className=" bg-white p-10 shadow-sm ">
        <div className="container mx-auto flex gap-3">
          <span
            role="button"
            onClick={() => setEdit(false)}
            className={`font-semibold  cursor-pointer hover:text-primary ${!edit && "text-primary"
              }`}
          >
            {i18n.t('My Profile')}
          </span>
          <span className="text-gray-500">|</span>
          <a
            role="button"
            onClick={() => setEdit(true)}
            className={`font-semibold uppercase flex hover:text-primary items-center ${edit && "text-primary"
              }`}
          >
            <FiEdit className="inline-block mr-1" />
            {i18n.t('Edit profile')}
          </a>
        </div>
      </div>

      {edit ? (
        <div className="rounded-b-lg bg-white p-10 shadow-sm ">
          <div className="container mx-auto">
            <Form
              layout="vertical"
              form={form}
              onFinish={async (values) => {
                if (values?.image[0]?.originFileObj) {
                  const image = values?.image[0]?.originFileObj;
                  const { data } = await postSingleImage({ image: image, image_name: 'image' });
                  values.image = data;
                } else {
                  values.image = values?.image[0]?.url;
                }
                useAction(
                  adminUpdateProfile,
                  {
                    ...values,
                    image: values?.image,
                  },
                  () => {
                    getUserdata();
                    setEdit(false);
                  }
                );
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 user-phone">
                <Form.Item
                  label={
                    <p className="text-base font-medium text-[#242628] ">
                      {i18n.t('Name')}
                    </p>
                  }
                  name="name"
                  className="w-full"

                >
                  <input
                    placeholder={i18n.t("Enter Name")}
                    type="text"
                    className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                    rules={[
                      { required: true, message: "Please enter your email!" },
                      { type: "email", message: "Enter a valid email!" },
                    ]}
                  />
                </Form.Item>
                <div>
                  <p className="text-base font-medium text-[#242628] mb-[8px]">
                    {i18n.t('Profile Picture')}
                  </p>

                  <MultipleImageInput
                    name="image"
                    max={1}
                    required
                    style={{ backgroundColor: "#888AA0" }}
                    className="!bg-[#D2D2D2]"
                  />
                </div>
                <Form.Item
                  label={
                    <p className="text-base font-medium text-[#242628] ">
                      {i18n.t('Email')}
                    </p>
                  }
                  name="email"
                  className="w-full"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Enter a valid email!" },
                  ]}
                >
                  <input
                    placeholder={i18n.t("Example@lawstick.com")}
                    readOnly={true}
                    type="email"
                    className="border border-[#E0E0E0] rounded-[10px] px-[20px] w-full pt-[19px] pb-[18px] h-[56px]"
                  />
                </Form.Item>
                <PhoneNumberInput name="phone_no" label={i18n.t("Phone Number")} />
              </div>
              <Button type="submit" className="mt-1">
                {i18n.t('Update')}
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        <div className="rounded-b-lg bg-white px-10 py-10 shadow-sm">
          <div className="container mx-auto">
            <div className="flex flex-col gap-1 my-3 items-center">
              {user?.image ? (
                <Image
                  width={1000}
                  height={100}
                  src={user?.image}
                  alt=""
                  className="w-32 h-32 rounded-full border border-primary"
                />
              ) : (
                <Image
                  width={1000}
                  height={100}
                  src="/user.png"
                  alt=""
                  className="w-32 h-32 rounded-full border border-primary"
                />
              )}
            </div>
            <div className="flex justify-between flex-wrap lg:gap-0 gap-5 mt-10">
              <div className="flex flex-col gap-y-4">
                <div className="flex items-center">
                  <p className="text-sm text-gray-700">{i18n.t('Name')} :</p>
                  <p className="font-semibold">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-700">{i18n.t('Email')} :</p>
                <div className="flex gap-x-1 items-center">
                  <p className="font-semibold">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-700">{i18n.t('Phone')}:</p>
                <div className="flex gap-x-2 items-center">
                  <p className="font-semibold">{user?.phone_no}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
