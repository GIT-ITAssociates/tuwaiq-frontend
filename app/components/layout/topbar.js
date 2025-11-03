"use client";
import { IoLocationOutline } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { useState } from "react";
import { useUser } from "@/app/context/userContext";
import Link from "next/link";
const Topbar = () => {
  let [socialDropDown, setSocialDropDown] = useState(false);

  let socialToggle = () => {
    setSocialDropDown((prev) => !prev);
  };
const { settings } = useUser();
  return (
    <div className="bg-[#734A35] text-white text-sm py-2 work-sans">
      <div className="custom-container flex justify-between items-center ">
        {/* 1st div */}
        <div>
          <div className="lg:block hidden">
            <div className="flex items-center gap-9">
              <span className=" flex items-center gap-1">
                <IoLocationOutline />
                {settings?.address}
              </span>
              <span>{settings?.email}</span>
            </div>
          </div>

          <div className="block lg:hidden relative">
            <button
              className="peer flex items-center gap-1"
              aria-expanded="false"
              aria-controls="dropdown-menu"
            >
              <IoLocationOutline />
            </button>
            <div
              id="dropdown-menu"
              className="absolute left-0 mt-2 hidden w-64 p-3 bg-gray-700 rounded-md shadow-lg transition-all duration-300 ease-in-out opacity-0 peer-focus:opacity-100 peer-focus:block"
              style={{ position: "absolute", left: "0", zIndex: "100" }}
            >
              <p>Location: {settings?.address}.</p>
              <p>Email: {settings?.email}</p>
            </div>
          </div>
        </div>
        {/* 2nd div */}
        <div className="flex gap-[33px] items-center">
          <div>
            {/* <span className="whitespace-nowrap">Mon-Saturday, 09am - 05pm</span> */}
          </div>
          <div className="sm:flex hidden md:static items-center md:gap-5 gap-3 relative">
            <Link
              href={settings?.facebook || "#"}
              target="_blank"
              className="hover:translate-y-[-1.5px] duration-300 transition-all"
            >
              <FaFacebookF />
            </Link>
            <Link
              href={settings?.twitter || "#"}
              target="_blank"
              className="hover:translate-y-[-1.5px] duration-300 transition-all"
            >
              <FaTwitter />
            </Link>
            <Link
              href={settings?.linkedin || "#"}
              target="_blank"
              className="hover:translate-y-[-1.5px] duration-300 transition-all"
            >
              <FaLinkedinIn />
            </Link>
          </div>
          <div
            className={`drop_down_social flex flex-col md:flex-row  md:static items-center md:gap-5 gap-3 absolute right-0 transition-all duration-500 ${
              socialDropDown
                ? "top-8 bg-indigo-500 w-[50px] py-2 z-10 "
                : "-top-full w-[50px] "
            } `}
            style={{ position: "absolute", right: "0", zIndex: "100" }}
          >
            <Link href={settings?.facebook || "#"} target="_blank">
              <FaFacebookF />
            </Link>
            <Link href={settings?.twitter || "#"} target="_blank">
              <FaTwitter />
            </Link>
            <Link href={settings?.linkedin || "#"} target="_blank">
              <FaLinkedinIn />
            </Link>
          </div>

          <div
            onClick={() => socialToggle()}
            className="sm:hidden block toggleSocial"
          >
            <IoShareSocialOutline></IoShareSocialOutline>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
