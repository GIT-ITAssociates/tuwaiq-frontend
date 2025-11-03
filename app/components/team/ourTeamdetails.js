"use client";
import Button from "./../common/button";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import TeamScaliton from "./teamScaliton";
import { useI18n } from "@/app/providers/i18n";
import { useUser } from "@/app/context/userContext";
import { useModal } from "@/app/context/modalContext";
import { message } from "antd";
import { useRouter } from "next/navigation";

const OurTeamDetails = ({ data, loading }) => {
  if (loading) {
    return (
     <TeamScaliton />
    );
  }
const i18n = useI18n();

  const router = useRouter();
 const { openLoginModal,openSignUp } = useModal();
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
    <div className="relative xl:mb-[150px] md:mb-14 mb-[60px] work-sans">
      <div className="custom-container">
        <div className="flex flex-col md:flex-row shadow-xl rounded-[20px] md:pl-10 pl-0 md:gap-7 gap-6">
          {/* image container */}
          <div className="xl:w-[57%] w-full order-2 flex justify-center">
            <div className="rounded-[20px] !w-full">
              <Image
                width={648}
                height={640}
                className="md:w-[648px] !w-full lg:h-[700px] md:h-[500px] h-[355px] object-cover rounded-[20px]"
                src={data?.image}
                alt={data?.name}
              />
            </div>
          </div>

          {/* text container */}
          <div className="eb-garamond w-full xl:w-3/5 flex flex-col justify-center md:px-0 px-3 py-0 sm:py-10 order-1">
            <h1 className="header-1 mb-[10px]">{data?.name}</h1>
            <p className="font-medium text-lg ">{data?.designation}</p>
            <p className="text-[#3A3D3F] w-full break-all text-base font-normal md:leading-[27px] leading-[23px] md:mb-[28px] mb-[10px]">
              {data?.bio}
            </p>

            <div className="flex flex-col md:text-start">
              <p className="text-[#D4AF37] font-medium md:text-2xl text-lg md:mb-6 mb-3">
                {i18n?.t("Certifications and Qualifications:")}
              </p>
              <div className="pl-[27px]">
                <p
                  dangerouslySetInnerHTML={{ __html: data?.certifications }}
                  className="text-[#3A3D3F] w-full break-all text-base font-normal md:text-start md:leading-[30px] leading-[23px]"
                />
              </div>
            </div>

            <div className="flex items-center mt-[26px] flex-wrap sm:gap-[116px] gap-5">
              <div className="flex items-center gap-4">
                <Link
                  href={data?.twitter || "#"}
                  target="_blank"
                  className="sm:w-[56px] w-10 sm:h-[56px] h-10 rounded-full hover:bg-[rgb(182,140,90)] hover:text-white border flex justify-center items-center cursor-pointer"
                >
                  <FaXTwitter className="text-2xl"></FaXTwitter>
                </Link>
                <Link
                  href={data?.facebook || "#"}
                  target="_blank"
                  className="sm:w-[56px] w-10 sm:h-[56px] h-10 rounded-full hover:bg-[#B68C5A] hover:text-white border flex justify-center items-center cursor-pointer"
                >
                  <FaFacebookF className="text-2xl"></FaFacebookF>
                </Link>
                <Link
                  href={data?.linkedin || "#"}
                  target="_blank"
                  className="sm:w-[56px] w-10 sm:h-[56px] h-10 rounded-full hover:bg-[#B68C5A] hover:text-white border flex justify-center items-center cursor-pointer"
                >
                  <FaLinkedinIn className="text-2xl"></FaLinkedinIn>
                </Link>
              </div>
              <div>
                <Button onClick={onsubmit}>{i18n?.t("Book Now")}</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[56px] px-5">
          <h1 className="semi-header mb-6">{i18n?.t('Professional Experience:')}</h1>
          <p
            dangerouslySetInnerHTML={{ __html: data?.professional_experience }}
            className="leading-[28px] text-[#3A3D3F] break-all w-full"
          />
        </div>
        <div className="mt-[40px] px-5">
          <h1 className="semi-header mb-6">{i18n?.t('Practice Areas:')}</h1>

          <div className="mt-6 flex gap-9 flex-col xl:flex-row">
      
              <div className="list-disc pl-6 space-y-2 work-sans text-base">
                <p
                  dangerouslySetInnerHTML={{ __html: data?.practice }}
                  className="leading-[28px] w-full break-all text-[#3A3D3F]"
                />
              </div>
            
            <div className="flex justify-center xl:mt-0 mt-10">
              <Image
                width={424}
                height={593}
                className="xl:w-[424px] xl:h-[593px] md:w-[470px] md:h-[540px] rounded-[20px] object-cover"
                src={data?.image}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="mt-[40px] px-5">
          <div>
            <h1 className="semi-header mb-[16px]">{i18n?.t('Legal Experience:')} </h1>
          </div>

          <div className="mt-[24px]">
            <p
              dangerouslySetInnerHTML={{ __html: data?.legal_experience }}
              className="text-[#3A3D3F] w-full break-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeamDetails;