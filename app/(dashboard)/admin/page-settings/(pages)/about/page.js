"use client";
import Button from "@/app/components/common/button";
import FormInput, { HiddenInput } from "@/app/components/common/form/input";
import MultipleImageInput from "@/app/components/common/form/multiImage";
import {
  fetchSinglePage,
  postPage,
  postSingleImage,
} from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { noSelected } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
import { Card, Form, message } from "antd";
import React, { useEffect, useState } from "react";

const AboutPageSetting = ({ slug }) => {
  const [form] = Form.useForm();
  const i18n = useI18n();
  let { languages, langCode } = useI18n();
  const [page, getPage] = useFetch(fetchSinglePage);
  const [selectedLang, setSelectedLang] = useState();
  const [formValues, setFormValues] = useState({});
  const[submitLoading,setSubmitLoading]=useState(false);

  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    getPage({ slug: slug });
    if (page?._id) {
      const initialFormValues = {
        _id: page._id,
        title: page.title,
        slug: page.slug,
        about_group_image: Array.isArray(
          page.content?.about_section?.group_image
        )
          ? page.content?.about_section?.group_image.map((image) => ({
              url: image.url,
            }))
          : [{ url: page.content?.about_section?.group_image }],

        about_video: Array.isArray(page.content?.about_section?.about_video)
          ? page.content?.about_section?.about_video.map((image) => ({
              url: image.url,
            }))
          : [{ url: page.content?.about_section?.about_video }],

        experience_image: Array.isArray(
          page.content?.about_section?.experience_image
        )
          ? page.content?.about_section?.experience_image.map((image) => ({
              url: image.url,
            }))
          : [{ url: page.content?.about_section?.experience_image }],

        success_image: Array.isArray(page.content?.about_section?.success_image)
          ? page.content?.about_section?.success_image.map((image) => ({
              url: image.url,
            }))
          : [{ url: page.content?.about_section?.success_image }],

        result_image: Array.isArray(page.content?.about_section?.result_image)
          ? page.content?.about_section?.result_image.map((image) => ({
              url: image.url,
            }))
          : [{ url: page.content?.about_section?.result_image }],

        rate_image: Array.isArray(page.content?.about_section?.rate_image)
          ? page.content?.about_section?.rate_image.map((image) => ({
              url: image.url,
            }))
          : [{ url: page.content?.about_section?.rate_image }],

        mission_vision_image: Array.isArray(
          page.content?.mission_vision_section?.mission_vision_image
        )
          ? page.content?.mission_vision_section?.mission_vision_image.map(
              (image) => ({
                url: image.url,
              })
            )
          : [
              {
                url: page.content?.mission_vision_section?.mission_vision_image,
              },
            ],
      };

      if (Array.isArray(languages)) {
        languages?.forEach((lang) => {
          initialFormValues.about_section =
            initialFormValues.about_section || {};
          initialFormValues.about_section.title =
            initialFormValues.about_section.title || {};
          initialFormValues.about_section.title[lang.code] =
            page.content?.about_section?.title?.[lang.code] || "";
          initialFormValues.about_section.heading =
            initialFormValues.about_section.heading || {};
          initialFormValues.about_section.heading[lang.code] =
            page.content?.about_section?.heading?.[lang.code] || "";
          initialFormValues.about_section.description =
            initialFormValues.about_section.description || {};
          initialFormValues.about_section.description[lang.code] =
            page.content?.about_section?.description?.[lang.code] || "";

          initialFormValues.about_section.experience =
            initialFormValues.about_section.experience || {};
          initialFormValues.about_section.experience.title =
            initialFormValues.about_section.experience.title || {};
          initialFormValues.about_section.experience.title[lang.code] =
            page.content?.about_section?.experience_title?.[lang.code] || "";
          initialFormValues.about_section.experience.description =
            initialFormValues.about_section.experience.description || {};
          initialFormValues.about_section.experience.description[lang.code] =
            page.content?.about_section?.experience_description?.[lang.code] ||
            "";

          initialFormValues.about_section.success =
            initialFormValues.about_section.success || {};
          initialFormValues.about_section.success.title =
            initialFormValues.about_section.success.title || {};
          initialFormValues.about_section.success.title[lang.code] =
            page.content?.about_section?.success_title?.[lang.code] || "";
          initialFormValues.about_section.success.description =
            initialFormValues.about_section.success.description || {};
          initialFormValues.about_section.success.description[lang.code] =
            page.content?.about_section?.success_description?.[lang.code] || "";

          initialFormValues.about_section.result =
            initialFormValues.about_section.result || {};
          initialFormValues.about_section.result.title =
            initialFormValues.about_section.result.title || {};
          initialFormValues.about_section.result.title[lang.code] =
            page.content?.about_section?.result_title?.[lang.code] || "";
          initialFormValues.about_section.result.description =
            initialFormValues.about_section.result.description || {};
          initialFormValues.about_section.result.description[lang.code] =
            page.content?.about_section?.result_description?.[lang.code] || "";

          initialFormValues.about_section.rate =
            initialFormValues.about_section.rate || {};
          initialFormValues.about_section.rate.title =
            initialFormValues.about_section.rate.title || {};
          initialFormValues.about_section.rate.title[lang.code] =
            page.content?.about_section?.rate_title?.[lang.code] || "";
          initialFormValues.about_section.rate.description =
            initialFormValues.about_section.rate.description || {};
          initialFormValues.about_section.rate.description[lang.code] =
            page.content?.about_section?.rate_description?.[lang.code] || "";

          initialFormValues.mission_vision_section =
            initialFormValues.mission_vision_section || {};

          initialFormValues.mission_vision_section.heading =
            initialFormValues.mission_vision_section.heading || {};
          initialFormValues.mission_vision_section.heading[lang.code] =
            page.content?.mission_vision_section?.heading?.[lang.code] || "";
          initialFormValues.mission_vision_section.description =
            initialFormValues.mission_vision_section.description || {};
          initialFormValues.mission_vision_section.description[lang.code] =
            page.content?.mission_vision_section?.description?.[lang.code] ||
            "";

          initialFormValues.mission_vision_section.aspiration =
            initialFormValues.mission_vision_section.aspiration || {};
          initialFormValues.mission_vision_section.aspiration.title =
            initialFormValues.mission_vision_section.aspiration.title || {};
          initialFormValues.mission_vision_section.aspiration.title[lang.code] =
            page.content?.mission_vision_section?.aspiration_title?.[
              lang.code
            ] || "";
          initialFormValues.mission_vision_section.aspiration.description =
            initialFormValues.mission_vision_section.aspiration.description ||
            {};
          initialFormValues.mission_vision_section.aspiration.description[
            lang.code
          ] =
            page.content?.mission_vision_section?.aspiration_description?.[
              lang.code
            ] || "";

          initialFormValues.mission_vision_section.commitment =
            initialFormValues.mission_vision_section.commitment || {};
          initialFormValues.mission_vision_section.commitment.title =
            initialFormValues.mission_vision_section.commitment.title || {};
          initialFormValues.mission_vision_section.commitment.title[lang.code] =
            page.content?.mission_vision_section?.commitment_title?.[
              lang.code
            ] || "";
          initialFormValues.mission_vision_section.commitment.description =
            initialFormValues.mission_vision_section.commitment.description ||
            {};
          initialFormValues.mission_vision_section.commitment.description[
            lang.code
          ] =
            page.content?.mission_vision_section?.commitment_description?.[
              lang.code
            ] || "";
        });
      } else {
      }
      setFormValues(initialFormValues);
      form.setFieldsValue(initialFormValues);
    }
  }, [page?.slug]);

  useEffect(() => {
    form.setFieldsValue(formValues);
  }, [selectedLang, formValues]);

  const handleValuesChange = (allValues) => {
    setFormValues(allValues);
  };

  return (
    <div>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          onFinish={async (values) => {
            setSubmitLoading(true);
            const uploadImage = async (imageField, imageName) => {
              if (values?.[imageField]?.[0]?.originFileObj) {
                const image = {
                  image: values[imageField][0].originFileObj,
                  image_name: imageName,
                };
                const { data } = await postSingleImage(image);
                values[imageField] = data;
              }
            };
            await uploadImage("about_group_image", "about_section");
            await uploadImage("about_video", "about_section");
            await uploadImage("experience_image", "about_section");
            await uploadImage("success_image", "about_section");
            await uploadImage("result_image", "about_section");
            await uploadImage("rate_image", "about_section");
            await uploadImage("mission_vision_image", "mission_vision_section");

            let formData = {
              title: "About",
              slug: values.slug,
              content: {
                about_section: {
                  title: values?.about_section?.title,
                  heading: values?.about_section?.heading,
                  description: values?.about_section?.description,
                  group_image: values?.about_group_image || undefined,
                  about_video: values?.about_video || undefined,
                  experience_title: values?.about_section?.experience?.title,
                  experience_description:
                    values?.about_section?.experience?.description,
                  experience_image: values?.experience_image,
                  success_title: values?.about_section?.success?.title,
                  success_description:
                    values?.about_section?.success?.description,
                  success_image: values?.success_image,

                  result_title: values?.about_section?.result?.title,
                  result_description:
                    values?.about_section?.result?.description,
                  result_image: values?.result_image,

                  rate_title: values?.about_section?.rate?.title,
                  rate_description: values?.about_section?.rate?.description,
                  rate_image: values?.rate_image,
                },
                mission_vision_section: {
                  heading: values?.mission_vision_section?.heading,
                  description: values?.mission_vision_section?.description,
                  mission_vision_image:
                    values?.mission_vision_image || undefined,

                  aspiration_title:
                    values?.mission_vision_section?.aspiration?.title,
                  aspiration_description:
                    values?.mission_vision_section?.aspiration?.description,

                  commitment_title:
                    values?.mission_vision_section?.commitment?.title,
                  commitment_description:
                    values?.mission_vision_section?.commitment?.description,
                },
              },
              content_type: "json",
            };

            if (values?._id) {
              formData._id = page?._id;
            }
            postPage(formData).then((res) => {
              if (res?.error === false) {
                message.success(res?.msg);
                setSubmitLoading(false);
              } else {
                message.success(res?.msg);
                setSubmitLoading(false);

              }
            });
          }}
        >
          <HiddenInput name="slug" />
          <HiddenInput name="_id" />
          <h6 className="text-secondary font-semibold header_4 py-2">
            {i18n?.t("About Page")}
          </h6>
          <div className="mb-4 mt-4 flex flex-wrap justify-start gap-3">
            {languages?.map((l, index) => (
              <div
                onClick={() => setSelectedLang(l.code)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                  l.code === selectedLang
                    ? "cursor-pointer bg-primary text-white"
                    : "cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                key={index}
              >
                {l.name}
              </div>
            ))}
          </div>

          {/* about section  */}
          <div className="rounded border p-3">
            {languages?.map((l, index) => (
              <div
                key={index}
                style={{ display: l.code === selectedLang ? "block" : "none" }}
              >
                <h2 className="mb-4 border-b text-lg font-semibold text-[#4A5568]">
                  {i18n?.t("About Section")}
                </h2>
                <label className="text-[#4A5568] text-sm font-medium">
                  {i18n?.t("Title")}
                </label>
                <FormInput
                  name={["about_section", "title", l.code]}
                  placeholder="Enter heading"
                  required
                />
                <label className="text-[#4A5568] text-sm font-medium">
                  {i18n?.t("Heading")}
                </label>
                <FormInput
                  name={["about_section", "heading", l.code]}
                  placeholder="Enter heading"
                  required
                />
                <label className="text-[#4A5568] text-sm font-medium">
                  {i18n?.t("Description")}
                </label>
                <FormInput
                  name={["about_section", "description", l.code]}
                  placeholder="Enter description"
                  textArea
                  rows={4}
                  required
                />
              </div>
            ))}
            <div className="flex gap-4 items-center">
              <MultipleImageInput
                name="about_group_image"
                label={i18n?.t("Group Image")}
                required
              />
              <MultipleImageInput
                name="about_video"
                label={i18n?.t("Video")}
                video
                required
              />
            </div>

            <h2 className="mb-4 border-b text-lg font-semibold text-[#4A5568]">
              {i18n?.t("Key Highlights")}
            </h2>
            {/* Experience */}
            <span
              className="text-[#4A5568] text-sm font-medium "
              style={{ marginBottom: "10px" }}
            >
              {i18n?.t("Experience ")}
            </span>
            {languages?.map((l, index) => (
              <div
                key={index}
                style={{ display: l.code === selectedLang ? "block" : "none" }}
              >
                <FormInput
                  name={["about_section", "experience", "title", l.code]}
                  placeholder="Enter title"
                  required
                />

                <FormInput
                  name={["about_section", "experience", "description", l.code]}
                  placeholder="Enter description"
                  label={"Description"}
                  textArea
                  rows={4}
                  required
                />
              </div>
            ))}
            <MultipleImageInput
              name="experience_image"
              label={i18n?.t("Image")}
              required
            />
            {/* Success Cases */}
            <span
              className="text-[#4A5568] text-sm font-medium "
              style={{ marginBottom: "10px" }}
            >
              {i18n?.t("Success Cases ")}
            </span>
            {languages?.map((l, index) => (
              <div
                key={index}
                style={{ display: l.code === selectedLang ? "block" : "none" }}
              >
                <FormInput
                  name={["about_section", "success", "title", l.code]}
                  placeholder="Enter title"
                  required
                />

                <FormInput
                  name={["about_section", "success", "description", l.code]}
                  placeholder="Enter description"
                  label={"Description"}
                  textArea
                  rows={4}
                  required
                />
              </div>
            ))}
            <MultipleImageInput name="success_image" label={i18n?.t("Image")} required/>
            {/* Result */}
            <span
              className="text-[#4A5568] text-sm font-medium "
              style={{ marginBottom: "10px" }}
            >
              {i18n?.t("Short Time Result")}
            </span>
            {languages?.map((l, index) => (
              <div
                key={index}
                style={{ display: l.code === selectedLang ? "block" : "none" }}
              >
                <FormInput
                  name={["about_section", "result", "title", l.code]}
                  placeholder="Enter title"
                  required
                />

                <FormInput
                  name={["about_section", "result", "description", l.code]}
                  placeholder="Enter description"
                  label={"Description"}
                  textArea
                  rows={4}
                  required
                />
              </div>
            ))}
            <MultipleImageInput name="result_image" label={i18n?.t("Image")} required/>
            {/* Success Rate */}
            <span
              className="text-[#4A5568] text-sm font-medium "
              style={{ marginBottom: "10px" }}
            >
              {i18n?.t("Success Rate ")}
            </span>
            {languages?.map((l, index) => (
              <div
                key={index}
                style={{ display: l.code === selectedLang ? "block" : "none" }}
              >
                <FormInput
                  name={["about_section", "rate", "title", l.code]}
                  placeholder="Enter title"
                  required
                />

                <FormInput
                  name={["about_section", "rate", "description", l.code]}
                  placeholder="Enter description"
                  label={"Description"}
                  textArea
                  rows={4}
                  required
                />
              </div>
            ))}
            <MultipleImageInput name="rate_image" label={i18n?.t("Image")} required/>
          </div>

          {/* Our Mission & Vission Section" */}
          <div className="rounded border p-3 mt-6">
            {languages?.map((l, index) => (
              <div
                key={index}
                style={{ display: l.code === selectedLang ? "block" : "none" }}
              >
                <h2 className="mb-4 border-b text-lg font-semibold text-[#4A5568]">
                  {i18n?.t("Our Mission & Vission Section")}
                </h2>

                <label className="text-[#4A5568] text-sm font-medium">
                  {i18n?.t("Heading")}
                </label>
                <FormInput
                  name={["mission_vision_section", "heading", l.code]}
                  placeholder="Enter heading"
                  required
                />
                <label className="text-[#4A5568] text-sm font-medium">
                  {i18n?.t("Description")}
                </label>
                <FormInput
                  name={["mission_vision_section", "description", l.code]}
                  placeholder="Enter description"
                  textArea
                  rows={4}
                  required
                />
              </div>
            ))}
            <MultipleImageInput
              name="mission_vision_image"
              label={i18n?.t("Group Image")}
              required
            />

            <h2 className="mb-4 border-b text-lg font-semibold text-[#4A5568]">
              {i18n?.t("Our Aspiration & Commitment")}
            </h2>
            {/* Aspiration */}
            <span
              className="text-[#4A5568] text-sm font-medium "
              style={{ marginBottom: "10px" }}
            >
              {i18n?.t("Our Aspiration")}
            </span>
            {languages?.map((l, index) => (
              <div
                key={index}
                style={{ display: l.code === selectedLang ? "block" : "none" }}
              >
                <FormInput
                  name={[
                    "mission_vision_section",
                    "aspiration",
                    "title",
                    l.code,
                  ]}
                  placeholder="Enter title"
                  required
                />

                <FormInput
                  name={[
                    "mission_vision_section",
                    "aspiration",
                    "description",
                    l.code,
                  ]}
                  placeholder="Enter description"
                  label={"Description"}
                  textArea
                  rows={4}
                  required
                />
              </div>
            ))}

            {/*Commitment */}
            <span
              className="text-[#4A5568] text-sm font-medium "
              style={{ marginBottom: "10px" }}
            >
              {i18n?.t("Our Commitment")}
            </span>
            {languages?.map((l, index) => (
              <div
                key={index}
                style={{ display: l.code === selectedLang ? "block" : "none" }}
              >
                <FormInput
                  name={[
                    "mission_vision_section",
                    "commitment",
                    "title",
                    l.code,
                  ]}
                  placeholder="Enter title"
                  required
                />

                <FormInput
                  name={[
                    "mission_vision_section",
                    "commitment",
                    "description",
                    l.code,
                  ]}
                  placeholder="Enter description"
                  label={"Description"}
                  textArea
                  rows={4}
                  required
                />
              </div>
            ))}
          </div>
          <Button
            type="submit"
            loading={submitLoading}
            onClick={() => noSelected({ form, setSelectedLang })}
            className="mt-2.5"
          >
            {i18n?.t("submit")}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AboutPageSetting;
