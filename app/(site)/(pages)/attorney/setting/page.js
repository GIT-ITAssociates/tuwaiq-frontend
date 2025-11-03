"use client";
import { useState } from "react";
import ProfileUpdate from "./profile"; 
import PasswordUpdate from "./password"; 
import { useI18n } from "@/app/providers/i18n";

const AttorneyProfileSettings = () => {
  const [tab, setTab] = useState("profile");
  const [isEdit, setIsEdit] = useState(false);
  const i18n = useI18n();

  return (
    <div>
      <h1 className="dashboard-title md:py-[38px] py-[17px] md:px-12 sm:px-8 px-[22px] border-b-2">
        {i18n?.t("Profile")}
      </h1>
      <div className="lg:px-10 px-5 py-10">
        <div className="flex items-center gap-[24px] pb-[56px]">
          <button
            className={`px-[12px] rounded-[10px] py-[11px] text-base font-medium font-sans ${
              tab === "profile"
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
            className={`px-[12px] rounded-[10px]  py-[11px] text-base font-medium font-sans ${
              tab === "password"
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

export default AttorneyProfileSettings;

