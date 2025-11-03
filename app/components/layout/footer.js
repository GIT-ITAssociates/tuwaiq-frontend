"use client";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";
import { useRef, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/app/providers/i18n";
import { Form, message, Select } from "antd";
import { postAdminNewsletter } from "@/app/helpers/backend";
import { useUser } from "@/app/context/userContext";
import Link from "next/link";

const Footer = () => {
  let [active, setActive] = useState(false);
  const i18n = useI18n();
  const { settings } = useUser();

  const emailref = useRef(null);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const res = await postAdminNewsletter(values);
    if (res?.error === true) {
      message.error(res?.msg);
    } else {
      message.success(res?.msg);
      form.resetFields();
    }
  };

  const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);


  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
  return (
    <div
      className="bg-gradient-to-r from-[#0C0C15] to-[#3F4069]
     relative "
    >
      <Image
        className="absolute bottom-0 left-0 hidden 2xl:block h-[311px] !z-20 "
        src={"/images/footer1.png"}
        width={811}
        height={311}
        alt=""
      />
      <Image
        className="absolute bottom-0 right-0 hidden 2xl:block "
        src={"/images/footer2.png"}
        width={448}
        height={272}
        alt=""
      />
      <Image
        height={100}
        width={100}
        className="absolute bottom-0 right-0 hidden 2xl:block "
        src={"/images/footer-line.png"}
        alt=""
      />
      <Image
        height={100}
        width={100}
        className="absolute bottom-0 right-0 hidden 2xl:block "
        src={"/images/footer-line-2.png"}
        alt=""
      />

      <div className="custom-container py-[62px] text-white ">
        <div className="flex flex-col md:flex-row lg:flex-nowrap flex-wrap justify-between md:mb-[69px] mb-10 lg:gap-0 md:gap-6 gap-[60px] ">
          <div>
            <Image width={40.05} height={43.46} src={settings?.logo} alt="" />
            <p className="mt-6 leading-[27.2px] sm:w-[375px] w-full  font-normal ">
              {settings?.description}
            </p>
            <div className="flex justify-start  mt-10 gap-4 relative !z-50">
              <Link
                target="_blank"
                className=""
                href={settings?.facebook || "#"}
              >
                <FaFacebookF className="!text-[24px] hover:text-primary !cursor-pointer" />
              </Link>
              <Link
                target="_blank"
                className="hover:text-primary cursor-pointer"
                href={settings?.twitter || "#"}
              >
                <FaTwitter className="text-[24px] hover:text-primary cursor-pointer" />
              </Link>
              <Link
                target="_blank"
                className="hover:text-primary cursor-pointer"
                href={settings?.youtube || "#"}
              >
                <FaYoutube className="text-[24px]" />
              </Link>
              <Link
                target="_blank"
                className="hover:text-primary cursor-pointer text-white"
                href={settings?.instagram || "#"}
              >
                <AiFillInstagram className="text-[24px]" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col ">
            <h1 className="font-medium text-2xl mb-[10px] whitespace-nowrap">
              {i18n?.t("Quick Links")}
            </h1>
            <div className="md:mt-10 mt-5 flex flex-col leading-9 content-end">
              <a className="hover:text-primary" href="">
                {i18n?.t("Home")}
              </a>
              <Link className="hover:text-primary" href="/about">
                {i18n?.t("About")}
              </Link>
              <Link className="hover:text-primary" href="/service">
                {i18n?.t("Service")}
              </Link>
              <Link className="hover:text-primary" href="/caseStudy">
                {i18n?.t("Case Study")}
              </Link>
              <Link className="hover:text-primary" href="/contact">
                {i18n?.t("Contact Us")}
              </Link>
            </div>
          </div>
          <div className="flex flex-col ">
            <h1 className="font-medium text-2xl mb-[10px]">
              {i18n?.t("Support")}
            </h1>
            <div className="md:mt-10 mt-5 flex flex-col leading-9 content-end">
              <Link className="hover:text-primary" href="/faq">
                {i18n?.t("FAQ'S")}
              </Link>
              <Link className="hover:text-primary" href="/privacy-policy">
                {i18n?.t("Privacy Policy")}
              </Link>
              <Link className="hover:text-primary" href="/terms-condition">
                {i18n?.t("Terms & Condition")}
              </Link>
            </div>
          </div>
          <div>
            <h1 className="font-medium text-2xl">{i18n?.t("Address")}</h1>
            <p className="md:mt-[52px] mt-6 mb-6 sm:w-[203px] w-full leading-7">
              {settings?.address}
            </p>
            <p className="mb-[20px] brightness-50">{i18n?.t("Language")}</p>
            <div className="relative flex ">
              <div className="p-2 rounded-lg font-medium whitespace-nowrap w-[144px] lg:text-lg text-base flex items-center justify-center  text-black border bg-white">
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
                    variant="border"
                    className="text-[#242628] text-xl !font-bold"
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
                  // suffixIcon={<FaChevronDown className="text-textMain" />}
                  />
                </div>
              </div>
              {/* dropdown */}

              {/* {active && (
                <div className="absolute top-full bg-white text-black px-2 py-2 rounded-lg w-[144px] z-10">
                  {i18n?.languages?.map((lang, index) => (
                    <div
                      onClick={() => {
                        i18n.changeLanguage(lang._id || langCode);
                        localStorage.setItem("lang", lang._id);
                        setDefaultLang(lang.name);
                        setActive(false);
                      }}
                      className="py-1 px-2 cursor-pointer hover:bg-blue-100"
                      key={index}
                    >
                      {lang.name }
                    </div>
                  ))}
                </div>
              )} */}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center sm:max-w-[400px] max-w-[250px] mx-auto mb-[60px]">
          <form
            form={form}
            onSubmit={(e) => {
              e.preventDefault();
              const email = e.target.email.value;
              handleSubmit({ email });
              e.target.reset();
            }}
            className="w-full  relative"
          >
            <input
              ref={emailref}
              placeholder={i18n?.t("Your Email")}
              name="email"
              onInvalid={(e) =>
                e.target.setCustomValidity(
                  i18n?.t("Please enter a valid email address")
                )
              }
              onInput={(e) => e.target.setCustomValidity("")}
              className="bg-transparent border-b outline-none w-full h-[40px] pl-[10px] text-[#E8E8E8] placeholder:text-[#dbdbdb]"
              type="email"
              required
            />
            <button
              type="submit"
              className={`text-primary text-opacity-80 hover:text-opacity-100 text-xl absolute top-[50%] ${defaultLang?.rtl ? "left-[10px] rotate-180" : "right-[10px]"
                } translate-y-[-50%]`}
            >
              <IoMdSend />
            </button>
          </form>
        </div>
        <div className="flex md:flex-row flex-col gap-5 md:justify-between">
          <p className="text-center md:text-left">{settings?.copyright}</p>
          <div className="text-center flex gap-3 md:text-left">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
