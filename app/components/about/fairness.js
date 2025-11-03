"use client";
import Image from "next/image";
import Button from "../common/button";
import { columnFormatter } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/context/modalContext";
import { useUser } from "@/app/context/userContext";
const Fairness = ({ data }) => {
  const { openLoginModal,openSignUp } = useModal();
  const heading = columnFormatter(data?.heading);
  const words = heading.split(" ");
  const firstWord = words.slice(0, 6).join(" ");
  const secondWord = words?.slice(6, 9).join(" ");
  const lastword = words?.slice(9, words.length).join(" ");
  const i18n = useI18n();
  const router = useRouter();
  const { user } = useUser();
  const onsubmit = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Please sign up as a user");
      openSignUp();
      return;
    }
  
    if (user?.role === "user") {
      router.push("/user/attorney");
    } else {
      openLoginModal();
      message.error("Please login as a user");
    }
  };
  return (
    <div className="relative   xl:mb-[150px] md:mb-14 mb-[60px] ">
      <div className="custom-container">
        <div className="flex flex-col lg:flex-row  lg:gap-14 md:gap-7 gap-6 ">
          <div className="lg:flex hidden w-full lg:w-2/5 justify-center items-center order-2">
            {data?.mission_vision_image && (
              Array.isArray(data?.mission_vision_image) && data?.mission_vision_image.length > 0 ? (
                <div className="md:max-w-[564px] rounded-[20px]">
                  <Image
                    width={564}
                    height={709}
                    className="w-full md:h-[646px] h-[400px] object-cover rounded-[20px]"
                    src={data?.mission_vision_image[0]?.url}
                    alt="About Us"
                  />
                </div>
              ) : (
                typeof data?.mission_vision_image === "string" && (
                  <div className="md:max-w-[564px] rounded-[20px]">
                    <Image
                      width={564}
                      height={709}
                      className="w-full md:h-[646px] h-[400px] object-cover rounded-[20px]"
                      src={data?.mission_vision_image}
                      alt="About Us"
                    />
                  </div>
                )
              )
            )}
          </div>

          <div className=" w-full lg:w-3/5 flex flex-col justify-center  order-1">
            <h1 className="section-title capitalize text-[#242628]">
              {firstWord} <br /> {secondWord}
              <span className="text-[#D4AF37]"> {lastword}</span>
            </h1>
            <p className="text-[#3A3D3F] section-description">
              {columnFormatter(data?.description)}
            </p>

            <div
              className="flex flex-col  lg:text-start text-center"
              style={{ marginTop: "-12px" }}
            >
              <p className="text-[#D4AF37] font-medium md:text-2xl text-lg md:mb-6 mb-3">
                {columnFormatter(data?.aspiration_title)}
              </p>
              <p className="text-[#3A3D3F] text-base font-normal lg:text-start text-center md:leading-[27px] leading-[23px] md:mb-[28px] mb-[10px]">
                {columnFormatter(data?.aspiration_description)}
              </p>
              <p className="text-[#D4AF37] font-medium md:text-2xl text-lg md:mb-6 mb-3 lg:text-start text-center">
                {columnFormatter(data?.commitment_title)}
              </p>
              <p className="text-[#3A3D3F] text-base font-normal lg:text-start text-center md:leading-[27px] leading-[23px] md:mb-[28px] mb-[10px]">
                {columnFormatter(data?.commitment_description)}
              </p>
            </div>

            <div className="flex md:justify-start justify-center lg:mx-0 mx-auto">
              <Button  onClick={onsubmit}>{i18n?.t("Make an Appointment")}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fairness;
