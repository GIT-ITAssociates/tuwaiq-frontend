"use client";
import { useModal } from "@/app/context/modalContext";
import { useUser } from "@/app/context/userContext";
import { columnFormatter } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
import { message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
const Banner = ({ data }) => {
  const { openLoginModal,openSignUp } = useModal();
  const i18n = useI18n();
  const heading = columnFormatter(data?.heading)
  const words = heading.split(" ");
  const firstWord = words.slice(0, 3).join(" ");
  const secondWord = words?.slice(3, 5).join(" ");
  const lastword = words?.slice(5, words.length).join(" ");
      const { user } = useUser();
      const router = useRouter();

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
    <div
      className="relative overflow-hidden 2xl:bg-trasnsparent bg-black text-white pt-[89px] hero-banner xl:mb-[150px] md:mb-14 mb-[60px]"
      style={{
        backgroundImage: `url(/images/bg.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute h-full w-full">
        <div className="flex md:flex-row flex-col h-full custom-container lg:gap-[100px] gap-[50px]">
          <div className="xl:basis-2/3 lg:basis-1/2 md:basis-full">
            <div className="flex flex-col justify-center text-start w-full md:pb-16 xl:pt-[230px]  md:pt-[100px] sm:pt-[80px] pt-[40px] pb-10">
              <p className="md:text-lg sm:text-[18px] text-sm font-medium sm:mb-[13px] mb-2 px-3 sm:px-0 leading-[21.18px] tracking-widest">
                {columnFormatter(data?.title)}
              </p>

             
                <h1 className="hero-title 2xl:text-[64px] xl:text-[55px] lg:text-[48px] md:text-[32px] text-[26px] leading-[1.3] font-normal xl:leading-[76px] lg:leading-[60px] md:leading-[40px] px-3 sm:px-0 md:py-0 py-[14px]">
                  {firstWord}
                  <br />
                  {secondWord}
                  <span className="text-[#D4AF37] ms-1 italic font-semibold">
                    {lastword}
                  </span>
                </h1>
            
              <div className="md:hidden block sm:max-w-[600px] max-w-[500px] mx-auto top-2 relative sm:h-[424px] h-[300px] ">
                <Image
                  width={500}
                  height={500}
                  className=" w-full h-full "
                  src="/images/small-statue.png"
                  alt="..."
                />
                {data?.group_image && (
                  <Image
                    width={500}
                    height={500}
                    className=" w-full absolute bottom-0"
                    src={
                      Array.isArray(data?.group_image)
                        ? data?.group_image[0].url
                        : data?.group_image
                    }
                    alt="..."
                  />
                )}
              </div>

              {/* Description text - Adjusted for mobile readability */}
              <p className="lg:text-base md:mt-0 pt-[20px]  md:text-sm  md:text-start text-center text-sm font-normal md:pt-[13px] 2xl:w-[666px] xl:w-[600px] lg:w-[500px] w-full px-3 sm:px-0">
                {columnFormatter(data?.description)}
              </p>

              {/* Button container - Improved mobile positioning */}
              <div className="lg:mt-10 sm:mt-5 mt-3 px-4 sm:px-0 grid md:place-content-start place-content-center">
                <button
                  className="md:px-[32px] px-2 py-3 md:py-[16px] bg-primary text-white font-medium md:text-[18px] text-[14px] leading-[24px] font-sans rounded-[8px]"
                  onClick={onsubmit}
                >
                  {i18n?.t("Get Appointment")}
                </button>
              </div>
            </div>
          </div>
          <div className="xl:basis-1/3 lg:basis-1/2 md:basis-full" />
        </div>
      </div>

      {/* Desktop/tablet image section - Unchanged */}
      <div className="md:flex mx-auto hidden h-full max-w-[1920px] ">
        <div className="md:basis-1/2 basis-full" />
        <div className="md:basis-1/2 basis-full">
          <div className="relative hero-images h-full">
            <Image
              width={773}
              height={828}
              className="absolute hero-image-shape bottom-0 hidden md:block xl:h-[828px] 2xl:right-[80px] right-0 2xl:w-[773px] xl:w-[690px]"
              src="/images/banner-bg-image.png"
              alt="..."
            />
            {data?.group_image && (
              <Image
                width={712}
                height={698}
                className="absolute bottom-0 hidden md:block translate-x-1/2 right-1/2  xl:h-[698px] lg:h-[600px] md:h-[490px] h-[424px]"
                src={
                  Array.isArray(data?.group_image)
                    ? data?.group_image[0].url
                    : data?.group_image
                }
                alt="..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
