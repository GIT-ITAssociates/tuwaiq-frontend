"use client";
import { FiSend } from "react-icons/fi";
import Button from "../common/button";
import { AiOutlineMail } from "react-icons/ai";
import { LuPhone } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import {  FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { postContactUs } from "@/app/helpers/backend";
import { useAction } from "@/app/helpers/hooks";
import { useUser } from "@/app/context/userContext";
import { IoShareSocialOutline } from "react-icons/io5";
import { useI18n } from "@/app/providers/i18n";
import Link from "next/link";

const OurContact = () => {
  const i18n = useI18n();
  const { settings } = useUser();
  const handleSubmit = async (values) => {
    values.preventDefault();
    const form = values?.target;
    const payload = {
      name: values.target.name.value,
      email: values.target.email.value, 
      phone: values.target.phone.value,
      caseType: values.target.caseType.value,
      message: values.target.message.value,
    };
      useAction(postContactUs, payload, () => {
        form.reset();
      });
  };

  return (
    <div className="custom-container xl:mb-[150px] md:mb-14 mb-[60px] flex xl:flex-row flex-col gap-[56px]">
      <div className="md:basis-1/2 basis-full">
        <h1 className="header-1">{i18n?.t('Contact Us')}</h1>
        <p className="section-description md:w-[550px] w-full text-textColor">
         {i18n?.t("We’re here to help. Contact us today for personalized legal support and solutions.")}
        </p>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-[60px] sm:mb-[90px] mb-[45px]">
          <div className="flex gap-[8px]">
            <AiOutlineMail className="text-[30px] text-[#242628] mx-[5px]" />
            <div>
              <p className="text-[#242628] leading-[23.46px] text-[20px] font-medium capitalize">
                {i18n?.t('Email to us')}
              </p>
              <div className="pt-3">
                <p className="text-textColor">{settings?.email}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-[8px]">
            <LuPhone className="text-[30px] text-[#242628] mx-[5px]" />
            <div>
              <p className="text-[#242628] leading-[23.46px] text-[20px] font-medium capitalize">
                {i18n?.t('Call to us')}
              </p>
              <div className="pt-3">
                <p className="text-textColor">{settings?.phone}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-[8px]">
            <CiLocationOn className="text-[30px] text-[#242628] mx-[5px]" />
            <div>
              <p className="text-[#242628] leading-[23.46px] text-[20px] font-medium capitalize">
                {i18n?.t('Visit Our Office Branch')}
              </p>
              <div className="pt-3">
                <p className="text-textColor">
                  {settings?.address}
                  </p>
              </div>
            </div>
          </div>
        
         <div className="flex gap-[8px] ">
            <IoShareSocialOutline className="text-[30px] text-[#242628] mx-[5px]" />
            <div>
              <p className="text-[#242628] leading-[23.46px] text-[20px] font-medium capitalize">
                {i18n?.t('Visit Our Office Branch')}
              </p>
              <div className="flex gap-[8px] mt-3">
          <Link href={settings?.facebook || "#"} target="_blank" className="w-[44px] bg-transparent text-[#242628] hover:bg-primary hover:text-white h-[44px] flex justify-center items-center duration-300 transition-all rounded-full"><FaFacebookF className="text-[24px]" /></Link>
          <Link href={settings?.instagram || "#"} target="_blank" className="w-[44px] bg-transparent text-[#242628] hover:bg-primary hover:text-white h-[44px] flex justify-center items-center duration-300 transition-all rounded-full"><FaInstagram className="text-[24px]" /></Link>
          <Link href={settings?.twitter || "#"} target="_blank" className="w-[44px] bg-transparent text-[#242628] hover:bg-primary hover:text-white h-[44px] flex justify-center items-center duration-300 transition-all rounded-full"><FaTwitter className="text-[24px]" /></Link>
        </div>
            </div>
          </div>
             
        </div>
      </div>

      <form
        onSubmit={(values) => handleSubmit(values)}
        className="md:basis-1/2 basis-full rounded-[20px] bg-white p-[40px] border border-[#E0E0E0] md:px-10 px-4 order-2"
      >
        <div className="flex sm:flex-row flex-col gap-6 mb-[24px]">
          <div className="lg:w-1/2 w-full">
            <label htmlFor="name" className="block font-medium text-base mb-3">
              {i18n?.t('Full Name')}
            </label>
            <input
              type="text"
              id="name"
              className="px-[20px] pt-[21px] pb-5 h-[60px] w-full border-[#E0E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={i18n?.t('Full Name')}
              name="name"
              required
            />
          </div>
          <div className="lg:w-1/2 w-full">
            <label htmlFor="email" className="block font-medium text-base mb-3">
              {i18n?.t('Email')}
            </label>
            <input
              type="email"
              id="email"
              className="px-[20px] w-full pt-[21px] pb-5 h-[60px] border-[#E0E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={i18n?.t('Email')}
              name="email"
              required
            />
          </div>
        </div>
        <div className="flex sm:flex-row flex-col gap-6 mb-[24px]">
          <div className="lg:w-1/2 w-full">
            <label
              htmlFor="phone-number"
              className="block font-medium text-base mb-3"
            >
              {i18n?.t('Mobile Number')}
            </label>
            <input
              type="number"
              id="phone-number"
              className="px-[20px] pt-[21px] pb-5 h-[60px] w-full border-[#E0E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={i18n?.t('Mobile Number')}
              name="phone"
              required
            />
          </div>
          <div className="lg:w-1/2 w-full">
            <label
              htmlFor="casetype"
              className="block font-medium text-base mb-3"
            >
              {i18n?.t('Case Type')}
            </label>
            <select
              id="casetype"
              className="px-[20px] w-full pt-[21px] pb-5 h-[60px] border-[#E0E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={i18n?.t('Case Type')}
              name="caseType"
              required
            >
              <option value="civil">{i18n?.t('Civil')}</option>
              <option value="criminal" selected>
                {i18n?.t('Criminal')}
              </option>
            </select>
          </div>
        </div>

        <label
          htmlFor="message"
          className="block font-medium text-lg mb-2 mt-[19px]"
        >
          {i18n?.t('Your message')}
        </label>
        <textarea
          name={"message"}
          type="text"
          id="message"
          className="w-full px-[20px] pt-[21px] pb-5 lg:h-[185px] md:h-[5.5rem] h-[4rem] border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder={i18n?.t('Enter your message')}
          required
        />
        <Button
          className="flex items-center justify-center gap-[10px] mt-[50px] w-full rounded-[20px]"
          type="submit"
        >
          <FiSend size={18.36} />
          {i18n?.t('Send Message')}
        </Button>
      </form>
    </div>
  );
};

export default OurContact;