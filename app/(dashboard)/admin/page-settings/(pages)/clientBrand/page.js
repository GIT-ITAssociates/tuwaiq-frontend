"use client";
import React, { useEffect, useState } from "react";
import { Card, Form, message } from "antd";
import FormInput, { HiddenInput } from "@/app/components/common/form/input";
import Button from "@/app/components/common/button";
import { useI18n } from "@/app/providers/i18n";
import { useFetch } from "@/app/helpers/hooks";
import { fetchSinglePage, postPage, postSingleImage } from "@/app/helpers/backend";
import { noSelected } from "@/app/helpers/utils";
import MultipleImageInput from "@/app/components/common/form/multiImage";


const ClientBrand = ({ slug }) => {
  const [form] = Form.useForm();
  const i18n = useI18n();
  let { languages, langCode } = useI18n();
  const [page, getPage] = useFetch(fetchSinglePage, {}, false);
  const [formValues, setFormValues] = useState({});
  const [selectedLang, setSelectedLang] = useState(langCode);
  const[submitLoading,setSubmitLoading]=useState(false);

  useEffect(() => {
    setSelectedLang(langCode);
  }, [langCode]);

  useEffect(() => {
    getPage({ slug: slug || ''});
}, [page?._id]);

useEffect(() => {
  if (page?._id) {
    const initialFormValues = {
      _id: page._id,
      title: page.title,
      slug: page.slug,
      
      client_logo: Array.isArray(page.content?.client_logo)
        ? page.content.client_logo.map((image, index) => ({
            url: image?.url || image,
            uid: `client-${index}-${Date.now()}`,
          }))
        : [],
      
      success_logo: Array.isArray(page.content?.success_logo)
        ? page.content.success_logo.map((image, index) => ({
            url: typeof image === 'string' ? image : image.url,
            uid: `success-${index}-${Date.now()}`,
          }))
        : page.content?.success_logo
          ? [{
              url: page.content.success_logo,
              uid: `success-0-${Date.now()}`,
            }]
          : [],
      
      close_logo: Array.isArray(page.content?.close_logo)
        ? page.content.close_logo.map((image, index) => ({
            url: typeof image === 'string' ? image : image.url,
            uid: `close-${index}-${Date.now()}`,
          }))
        : page.content?.close_logo
          ? [{
              url: page.content.close_logo,
              uid: `close-0-${Date.now()}`,
            }]
          : [],
      
      trusted_logo: Array.isArray(page.content?.trusted_logo)
        ? page.content.trusted_logo.map((image, index) => ({
            url: typeof image === 'string' ? image : image.url,
            uid: `trusted-${index}-${Date.now()}`,
          }))
        : page.content?.trusted_logo
          ? [{
              url: page.content.trusted_logo,
              uid: `trusted-0-${Date.now()}`,
            }]
          : [],
      
      expert_logo: Array.isArray(page.content?.expert_logo)
        ? page.content.expert_logo.map((image, index) => ({
            url: typeof image === 'string' ? image : image.url,
            uid: `expert-${index}-${Date.now()}`,
          }))
        : page.content?.expert_logo
          ? [{
              url: page.content.expert_logo,
              uid: `expert-0-${Date.now()}`,
            }]
          : [],
    };

    if (Array.isArray(languages)) {
      languages.forEach((lang) => {
        initialFormValues.heading = initialFormValues.heading || {};
        initialFormValues.heading[lang.code] =
          page.content?.heading?.[lang.code] || "";

        initialFormValues.case_count = initialFormValues.case_count || {};
        initialFormValues.case_count[lang.code] =
          page.content?.case_count?.[lang.code] || "";

        initialFormValues.close_case_count =
          initialFormValues.close_case_count || {};
        initialFormValues.close_case_count[lang.code] =
          page.content?.close_case_count?.[lang.code] || "";

        initialFormValues.trusted_case_count =
          initialFormValues.trusted_case_count || {};
        initialFormValues.trusted_case_count[lang.code] =
          page.content?.trusted_case_count?.[lang.code] || "";

        initialFormValues.expert_count = initialFormValues.expert_count || {};
        initialFormValues.expert_count[lang.code] =
          page.content?.expert_count?.[lang.code] || "";
      });
    } else {
    }

    // Set form values
    setFormValues(initialFormValues);
    form.setFieldsValue(initialFormValues);
  }
}, [page, languages]);

  useEffect(() => {
    form.setFieldsValue(formValues);
  }, [selectedLang, formValues]);

  const handleValuesChange = (allValues) => {
    setFormValues(allValues);
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    let uploadedLogos=[];
    if (values?.client_logo) {
      // const imageArray = [];
    
      try {
        if (values?.client_logo) {
          try {
             uploadedLogos = await Promise.all(
              values?.client_logo?.map(async (i, index) => {
                const image = {
                  image: i.originFileObj,
                  image_name: `client_logo${index}`,
                };
                const { data } = await postSingleImage(image);
                return data; 
              })
            );
            // values.client_logo=uploadedLogos;
          } catch (error) {
          }
        }
        
    
       
      } catch (error) {
      }
    }
    
  
    const uploadImage = async (imageField, imageName) => {
      try {
        if (values?.[imageField]?.[0]?.originFileObj) {
          const image = {
            image: values[imageField][0].originFileObj,
            image_name: imageName,
          };
          const { data } = await postSingleImage(image);
          values[imageField] = data;
        }
      } catch (error) {
      }
    };
  
    await uploadImage("success_logo", "success_logo");
    await uploadImage("close_logo", "close_logo");
    await uploadImage("trusted_logo", "trusted_logo");
    await uploadImage("expert_logo", "expert_logo");
  
    let formData = {
      title: "Client Brand",
      slug: values?.slug || page?.slug || "default-slug",
      content: {
        heading: values.heading,
        client_logo: uploadedLogos,
        case_count: values.case_count,
        success_logo: values.success_logo,
        close_case_count: values.close_case_count,
        close_logo: values.close_logo,
        trusted_case_count: values.trusted_case_count,
        trusted_logo: values.trusted_logo,
        expert_count: values.expert_count,
        expert_logo: values.expert_logo,
      },
      content_type: "json",
    };
  
    if (values?._id) {
      formData._id = values._id;
    }
    try {
      const res = await postPage(formData);
      if (res?.error === false) {
        message.success(res?.msg);
        setSubmitLoading(false);

      } else {
        setSubmitLoading(false);

        message.error(res?.msg || "Failed to submit data.");
      }
    } catch (error) {
      setSubmitLoading(false);

      message.error("An error occurred while submitting data.");
    }
    finally{
      setSubmitLoading(false);

    }
  };
  
  return (
    <div>
      <Card>
      <h6 className="text-secondary capitalize font-semibold header_4 py-2">
            {i18n?.t("client & Partners")}
          </h6>
        <div className="flex justify-start flex-wrap gap-3 mb-4 mt-4">
        
          {languages?.map((l, index) => (
            <div
              onClick={() => setSelectedLang(l.code)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                l.code === selectedLang
                  ? "bg-primary text-white cursor-pointer"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
              }`}
              key={index}
            >
              {l.name}
            </div>
          ))}
        </div>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
          onFinish={handleSubmit}
        >
          <HiddenInput name="slug" />
          <HiddenInput name="_id" />
        
          {languages?.map((l, index) => (
            <div
              key={index}
              style={{ display: l.code === selectedLang ? "block" : "none" }}
            >
              <FormInput
                label={i18n?.t("Trusted clients")}
                name={["heading", l.code]}
                placeholder={i18n?.t("Trusted by 100k+ Trusted Client")}
                required
              />
            
            </div>
          ))}
           <MultipleImageInput
                label={i18n?.t("Client Logo")}
                name={["client_logo"]}
                placeholder={i18n?.t("Upload Client Logo")}
                max={6}
                required
              />
          <div className="grid grid-cols-2 gap-4">
          <div className="">
          <h2 className="mb-4 border-b text-base font-semibold text-[#4A5568]">
            {i18n?.t("Successful Cases")}
          </h2>
           <MultipleImageInput
              label={i18n?.t("Client Logo")}
              name="success_logo"
              placeholder={i18n?.t("Upload Client Logo")}
              max={1}
              required
            />
              {languages?.map((l, index) => (
            <div
              key={index}
              style={{ display: l.code === selectedLang ? "block" : "none" }}
            >
            <FormInput
              label={i18n?.t("Case count")}
              name={["case_count", l.code]}
              placeholder={i18n?.t("Enter your case count")}
              required
            />
            </div>
          ))}
          </div>
          <div className="">
          <h2 className="mb-4 border-b capitalize text-base font-semibold text-[#4A5568]">
            {i18n?.t("Case close")}
          </h2>
           <MultipleImageInput
              label={i18n?.t("Close Logo")}
              name="close_logo"
              max={1}
              required
            />
              {languages?.map((l, index) => (
            <div
              key={index}
              style={{ display: l.code === selectedLang ? "block" : "none" }}
            >
            <FormInput
              label={i18n?.t("Close Case Count")}
              name={["close_case_count", l.code]}
              required
              placeholder={i18n?.t("Enter your close case count")}
            />
            </div>
          ))}
          </div>
          <div className="">
          <h2 className="mb-4 capitalize border-b text-base font-semibold text-[#4A5568]">
            {i18n?.t("Trusted Client")}
          </h2>
           <MultipleImageInput
              label={i18n?.t("Trusted Client")}
              name="trusted_logo"
              max={1}
              required
            />
              {languages?.map((l, index) => (
            <div
              key={index}
              style={{ display: l.code === selectedLang ? "block" : "none" }}
            >
            <FormInput
              label={i18n?.t("Trusted Count")}
              required
              name={["trusted_case_count", l.code]}
              placeholder={i18n?.t("Enter your trusted client count")}
            />
            </div>
          ))}
          </div>
          <div className="">
          <h2 className="mb-4 capitalize border-b text-base font-semibold text-[#4A5568]">
            {i18n?.t("expert team")}
          </h2>
           <MultipleImageInput
              label={i18n?.t("Expert Team Logo")}
              name="expert_logo"
              max={1}
              required
            />
              {languages?.map((l, index) => (
            <div
              key={index}
              style={{ display: l.code === selectedLang ? "block" : "none" }}
            >
            <FormInput
              label={i18n?.t("Expert Team Count")}
              name={["expert_count", l.code]}
              required
              placeholder={i18n?.t("Enter your expert team count")}
            />
            </div>
          ))}
          </div>
          </div>
          <Button
            loading={submitLoading}
            onClick={() => noSelected({ form, setSelectedLang })}
            type="submit"
            className="mt-2.5"
          >
            {i18n?.t("Submit")}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ClientBrand;
