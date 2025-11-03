"use client";
import {  useState } from "react";
import PageTitle from "@/app/components/common/title/pageTitle";
import { PasswordUpdate } from "@/app/components/user/PasswordUpdate";
import { ProfileUpdate } from "@/app/components/user/profileupdate";
import { useI18n } from "@/app/providers/i18n";
const UserProfileSettings = () => {
  const [tab, setTab] = useState("profile");
  const [isEdit, setIsEdit] = useState(false);
  const i18n = useI18n();
  

  return (
    <div>
      <PageTitle>
        <h1 className="dashboard-title">{i18n?.t("Profile")}</h1>
      </PageTitle>
      <div className="lg:px-10 px-5 py-10">
        <div className="flex items-center gap-[24px] pb-[56px]">
          <button
            className={`px-[12px] rounded-[10px] py-[11px] text-base font-medium font-sans ${tab === "profile"
              ? "bg-primary text-white"
              : "bg-[#EDEDED] text-[#242628]"
              }`}
            onClick={() => {
              setTab("profile");
            }}
          >
            {i18n?.t("Profile")}
          </button>
          <button
            className={`px-[12px] rounded-[10px]  py-[11px] text-base font-medium font-sans ${tab === "password"
              ? "bg-primary text-white"
              : "bg-[#EDEDED] text-[#242628]"
              }`}
            onClick={() => {
              setTab("password");
            }}
          >
            {i18n?.t("Password")}
          </button>
        </div>
        {tab === "profile" && (
          <ProfileUpdate isEdit={isEdit} setIsEdit={setIsEdit} />
        )}
        {tab === "password" && <PasswordUpdate setTab={setTab} />}
      </div>
    </div>
  );
};

export default UserProfileSettings;

