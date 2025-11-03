"use client";
import { FiSend } from "react-icons/fi";
import { MdMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import Link from "next/link";
import { postContactUs } from "@/app/helpers/backend";
import { useAction } from "@/app/helpers/hooks";
import { useUser } from "@/app/context/userContext";
import { useI18n } from "@/app/providers/i18n";

const Contact = () => {
 const { settings} = useUser();
 const i18n = useI18n();  
    const handleSubmit = async (values) => {
      values.preventDefault();
      const form = values?.target;
      const payload = {
        name: values.target.name.value,
        email: values.target.email.value, 
        message: values.target.message.value,
      };
        useAction(postContactUs, payload, () => {
          form.reset();
        });
    };
  return (
    <div className="custom-container  xl:pb-[150px] md:pb-14 pb-[60px] ">
      <div className="relative min-h-[738px] rounded-[20px]">
        <div
          style={{ backgroundImage: "url('/images/bg-contact.png')" }}
          className="absolute inset-0 bg-cover bg-center  rounded-[20px] z-0 py-[60px] md:ps-[60px] md:pe-[78px] pe-4 ps-4"
        ></div>

        <div className="relative py-[60px] md:ps-[60px] ps-4  rounded-[20px] md:pe-[78px] pe-4 z-10 flex lg:flex-row-reverse flex-col text-black    gap-10 bg-black h-full w-full bg-opacity-[70%]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="md:basis-1/2 basis-full rounded-[20px] bg-white md:pt-[60px] md:pb-[81px] pt-[43px] pb-[51px] md:w-[588px] max-w-full lg:mx-0 md:mx-auto   md:px-10 px-4 order-2 "
            style={{ boxShadow: "0px 0px 10px 0px #0000000D" }}
          >
            <label htmlFor="name" className="block font-medium text-lg mb-2">
              {i18n?.t("Your name")}
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-4 md:h-[56px] h-[50px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={i18n?.t("Enter your name")}
              name="name"
              required
            />

            <label
              htmlFor="email"
              className="block font-medium text-lg mb-2 mt-5"
            >
              {i18n?.t("Your email")}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-4 md:h-[56px] h-[50px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={i18n?.t("Enter your email")}
              required
            />

            <label
              htmlFor="message"
              className="block font-medium text-lg mb-2 mt-5"
            >
              {i18n?.t("Your message")}
            </label>
            <textarea
              name={"message"}
              type="text"
              id="message"
              className="w-full px-4 py-2 h-36   border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
              placeholder={i18n?.t("Enter your message")}
              required
            />
            <button
              className="flex font-sans items-center gap-[10px] mt-[50px] px-[32px] py-[16px] bg-[#B68C5A] text-white rounded-[8px]"
              type="submit"
            >
              <FiSend size={18.36} />
              {i18n?.t("Send Message")}
            </button>
          </form>
          <div className="md:basis-1/2 basis-full    text-center text-white md:mt-0 mt-7 order-1 ">
            <div className="flex justify-center">
              <Link
                className={
                  "px-[32px] font-ebgramond py-[18px] font-medium bg-[#B68C5A] mb-[40px] text-[20px] leading-[26.1px] rounded-[40px]"
                }
                href={"/contact"}
              >
                {i18n?.t("Contact Us")}
              </Link>
            </div>
            <div className="">
              <h1 className="section-title text-[#D4AF37]">
                {i18n?.t("How Can We Assist You?")}
              </h1>
              <p className="section-description !text-white ">
                {i18n?.t("We're here to help with your legal needs. Reach out for expert advice, answers to your questions, or support tailored to your case. Let us assist you every step of the way.")}
              </p>
            </div>

            <div className="flex flex-col md:justify-start justify-center gap-4  pt-[16px] ">
              <div className="flex flex-row items-center md:text-start text-center gap-2 font-medium text-xl md:py-[21.5px] py-4 md:px-[24px] px-4">
                <div className="w-[24px] h-[24px] flex justify-center items-center">
                  <MdMailOutline className="h-[18px] w-[18px]" />
                </div>
                <p className="font-medium text-[20px]">{settings?.email}</p>
              </div>
              <div className="flex flex-row items-center  md:items-center gap-2 font-medium text-xl md:py-[21.5px] py-4 md:px-[24px] px-4">
                <div className="w-[24px] h-[24px] flex justify-center items-center">
                  {" "}
                  <FiPhone className="h-[18px] w-[18px]"></FiPhone>
                </div>
                <p className="font-medium text-[20px]">{settings?.phone}</p>
              </div>
              <div className="flex flex-row items-center md:items-start gap-2 font-medium text-xl md:py-[21.5px] py-4 md:px-[24px] px-4">
                <div className="w-[24px] h-[24px] flex justify-center items-center">
                  <IoLocationOutline className="h-[18px] w-[18px]"></IoLocationOutline>
                </div>
                <p className="font-medium text-[20px]">{settings?.address}</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;