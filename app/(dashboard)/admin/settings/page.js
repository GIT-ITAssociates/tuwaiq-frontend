"use client";
import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "antd";
import { message } from "antd";
import { useFetch } from "@/app/helpers/hooks";
import {
  fetchAdminSettings,
  postAdminSettings,
  postSingleImage,
} from "@/app/helpers/backend";
import FormInput, { HiddenInput } from "@/app/components/common/form/input";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Button from "@/app/components/common/button";
import { useI18n } from "@/app/providers/i18n";
import MultipleImageInput from "@/app/components/common/form/multiImage";
import PageTitle from "@/app/components/common/title/title";

const AdminSettings = () => {
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [data, getData] = useFetch(fetchAdminSettings);
  const [submitLoading, setSubmitLoading] = useState(false);
  useEffect(() => {
    if (data) {
      const updatedData = {
        ...data,
        copyright: data?.copyright,
        logo: data?.logo
          ? [
              {
                uid: "-1",
                name: "logo.png",
                status: "done",
                url: data.logo,
              },
            ]
          : [],
        banner_image: data?.banner_image
          ? [
              {
                uid: "-2",
                name: "banner.png",
                status: "done",
                url: data?.banner_image,
              },
            ]
          : [],
        favicon: data?.favicon
          ? [
              {
                uid: "-3",
                name: "favicon.png",
                status: "done",
                url: data?.favicon,
              },
            ]
          : [],
        loader_image: data?.loader_image
          ? [
              {
                uid: "-4",
                name: "loader1.png",
                status: "done",
                url: data?.loader_image,
              },
            ]
          : [],
      };
      form.setFieldsValue(updatedData);
    }
  }, [data, form]);

  const handleFinish = async (values) => {
    setSubmitLoading(true);

    const data = {
      ...values,
      _id: values?._id,
    };

    if (values?.logo[0]?.originFileObj) {
      const image = values?.logo[0]?.originFileObj;
      const { data: logoData } = await postSingleImage({
        image: image,
        image_name: "logo",
      });
      data.logo = logoData;
    } else {
      data.logo = values?.logo[0]?.url ? values?.logo[0]?.url : values?.logo;
    }

    if (values?.banner_image[0]?.originFileObj) {
      const image = values?.banner_image[0]?.originFileObj;
      const { data: bannerData } = await postSingleImage({
        image: image,
        image_name: "banner_image",
      });
      data.banner_image = bannerData;
    } else {
      data.banner_image = values?.banner_image[0]?.url
        ? values?.banner_image[0]?.url
        : values?.banner_image;
    }

    if (values?.favicon[0]?.originFileObj) {
      const image = values?.favicon[0]?.originFileObj;
      const { data: favIconData } = await postSingleImage({
        image: image,
        image_name: "favicon",
      });
      data.favicon = favIconData;
    } else {
      data.favicon = values?.favicon[0]?.url
        ? values?.favicon[0]?.url
        : values?.favicon;
    }

    if (values?.loader_image[0]?.originFileObj) {
      const image = values?.loader_image[0]?.originFileObj;
      const { data: loader1Data } = await postSingleImage({
        image: image,
        image_name: "loader_image",
      });
      data.loader_image = loader1Data;
    } else {
      data.loader_image = values?.loader_image[0]?.url
        ? values?.loader_image[0]?.url
        : values?.loader_image;
    }

    const { err, msg } = await postAdminSettings(data);
    if (err) {
      message.error(msg);
      setSubmitLoading(false);
    } else {
      setSubmitLoading(false);

      message.success(msg);
      getData();
    }
  };

  return (
    <div>
    <PageTitle title={'Settings'}></PageTitle>
      <Card>
        <Row>
          <Col span={24}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <div className=" user-phone grid lg:grid-cols-2 grid-cols-1 gap-x-10 gap-y-1">
                <HiddenInput name="_id" />
                <FormInput
                  placeholder={i18n?.t("Enter Title")}
                  name="title"
                  label={i18n?.t("Title")}
                  required
                />
                <FormInput
                  placeholder={i18n?.t("Enter Description")}
                  name="description"
                  label={i18n?.t("Description")}
                  required
                />
                <FormInput
                  placeholder={i18n?.t("Enter Email")}
                  name="email"
                  label={i18n?.t("Email")}
                  required
                  isEmail
                />
                <Form.Item
                  name="phone"
                  label={
                    <p className="text-base font-medium text-[#242628]">
                      {i18n?.t("Phone Number")}
                    </p>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please provide phone number",
                    },
                    {
                      validator(_, value) {
                        if (value && !isValidPhoneNumber(value)) {
                          return Promise.reject(
                            new Error("Invalid Phone number")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <PhoneInput
                    className="block w-full outline-0 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 px-3 py-2"
                    placeholder={i18n?.t("Enter Phone Number")}
                    defaultCountry="BD"
                  />
                </Form.Item>

                <FormInput
                  placeholder={i18n?.t("Enter Address")}
                  name="address"
                  label={i18n?.t("Address")}
                  required
                />
                <FormInput
                  placeholder={i18n?.t("Enter Footer Type")}
                  name="copyright"
                  label={i18n?.t("Copyright")}
                  required
                />
                <FormInput
                  placeholder={i18n?.t("Enter Facebook")}
                  name="facebook"
                  label={i18n?.t("Facebook Link")}
                  required
                />
                <FormInput
                  placeholder={i18n?.t("Enter Twitter")}
                  name="twitter"
                  label={i18n?.t("Twitter Link")}
                  required
                />
                <FormInput
                  placeholder={i18n?.t("Enter Instagram")}
                  name="instagram"
                  label={"Instagram Link"}
                  required
                />
                <FormInput
                  placeholder={i18n?.t("Enter Linkedin")}
                  name="whatsapp"
                  label={i18n?.t("Whatsapp Link")}
                  required
                />
                <FormInput
                  placeholder={i18n?.t("Enter Youtube")}
                  name="youtube"
                  label={i18n?.t("Youtube Link")}
                  required
                />
              </div>
              <div className="grid grid-cols-4 my-6">
                <MultipleImageInput
                  name="banner_image"
                  label={i18n?.t("Banner image")}
                />
                <MultipleImageInput name="favicon" label={i18n?.t("Favicon")} />
                <MultipleImageInput
                  name="loader_image"
                  label={i18n?.t("Loader image")}
                />
                <MultipleImageInput
                  name="logo"
                  label={i18n?.t("Logo")}
                  required
                />
              </div>
              <Button type="submit" loading={submitLoading} className="mt-4">
                {" "}
                {i18n?.t("submit")}{" "}
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AdminSettings;
