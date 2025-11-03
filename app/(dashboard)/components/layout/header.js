"use client";
import {
  Badge,
  Dropdown,
  Select,
  Space,
  message as antMessage,
  message,
  notification as myNotification,
} from "antd";
import { FaBars } from "react-icons/fa";
import { FiLock, FiLogOut, FiUser } from "react-icons/fi";
import { BiSolidMessageDots, BiUser } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ImExit } from "react-icons/im";
import { useUser } from "@/app/context/userContext";
import { useI18n } from "@/app/providers/i18n";
import { FaChevronDown } from 'react-icons/fa';

const Header = () => {
  const { push } = useRouter();
  const { setUser, user } = useUser();
  const i18n = useI18n();
  const defaultLang = i18n?.languages?.find((lang) => lang?.default)?.name;
  const langFromLocalStorage =
    typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      message.success(i18n.t("Sign out successfully"));
      setUser({});
      push("/auth/login");
      getUserdata();
    } catch (error) {

    }
  };

  const handleProfile = () => {
    push("/admin/profile");
  };

  const handleChangePassword = () => {
    if (user?.role === "admin") {
      push("/admin/profile/change-password");
    }
  };

  const items = [
    {
      label: i18n.t("Profile"),
      icon: <FiUser />,
      key: "1",
      onClick: handleProfile,
    },
    {
      label: i18n.t("Change Password"),
      icon: <FiLock />,
      key: "2",
      onClick: handleChangePassword,
    },
    {
      label: i18n.t("Logout"),
      icon: <FiLogOut />,
      key: "3",
      onClick: handleLogout,
    },
  ];

  return (
    <header className="header z-10 ">
      {
        <div className="flex justify-between items-center h-full p-4">
          <div className="">
            <FaBars
              className="md:hidden"
              role="button"
              onClick={() => {
                window.document
                  .querySelector(".sidebar")
                  .classList.toggle("open");
                window.document
                  .querySelector(".sidebar-overlay")
                  .classList.toggle("open");
              }}
            />
          </div>

          <div className="flex items-center gap-x-6 notification-popover">
            <div className="hidden sm:block mt-3">
              <Badge
                size="small"
                color="#E67529"
                count={0}
                onClick={() => push("/admin/message")}
              >
                <BiSolidMessageDots
                  onClick={() => push("/admin/message")}
                  size={25}
                  className={`text-textMain hover:text-primary duration-500 cursor-pointer `}
                />
              </Badge>
            </div>


            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 hover:text-primary"
            >
              <ImExit />
              <p className="whitespace-pre">{i18n.t("Live Site")} </p>
            </Link>
            <div className='languageSelect border-primary/40'>
              <Select
                defaultValue='en'
                variant='borderless'
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
                suffixIcon={<FaChevronDown className='text-textMain' />}
              />
            </div>
            <Dropdown
              menu={{
                items,
              }}
            >
              <a className=" flex items-center">
                <Space className="">
                  <span className="cursor-pointer hidden sm:block">{i18n.t('Admin')}</span>
                  <BiUser className="cursor-pointer" size={20} />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
      }
    </header>
  );
};

export default Header;
