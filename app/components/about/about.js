"use client";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import Button from "../common/button";
import PlayButton from "../common/playbutton";
import Image from "next/image";
import { columnFormatter } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";

const AboutUs = ({data}) => {
  let videoRef = useRef(null);
  const i18n = useI18n();
  let useClickOutside = (handler) => {
    let domNode = useRef();

    useEffect(() => {
      let maybeHandler = (event) => {
        if (!domNode?.current?.contains(event.target)) {
          handler();
        }
      };
      document.addEventListener("mousedown", maybeHandler);

      return () => {
        document.removeEventListener("mousedown", maybeHandler);
      };
    });
    return domNode;
  };
  const [videoOpen, setvideoOpen] = useState(false);

  let domNode = useClickOutside(() => {
    setvideoOpen(false);
  });

    const heading = columnFormatter(data?.heading)
    const words = heading.split(" ");
    const firstWord = words.slice(0, 6).join(" ");
    const secondWord = words?.slice(6, 7).join(" ");
    const lastword = words?.slice(7,words.length);
  
    const description = columnFormatter(data?.description)
    const wordsdesc = description.split(" ");
    const firstWordesc = wordsdesc.slice(0,13).join(" ");
    const secondWordesc = wordsdesc?.slice(13, 22).join(" ");
    const lastwordesc = wordsdesc?.slice(22, wordsdesc.length).join(" ");

  return (
    <div className=" xl:mb-[150px] md:mb-14 mb-[60px]">
      <div className="custom-container">
        <div className="flex flex-col lg:flex-row  lg:gap-14 md:gap-7 gap-6 my-14">
          {data?.group_image && (
            <div
            ref={domNode}
            className=" md:max-w-[582px] lg:mx-0 sm:mx-auto lg:flex sm:block hidden lg:w-2/5 justify-center items-center relative"
          >
            <div className="w-full rounded-[20px]">
            <Image width={452} height={548}
                className="w-full h-[548px] object-fill rounded-[20px] "
                src={
                  Array.isArray(data?.group_image)
                    ? data?.group_image[0].url
                    : data?.group_image
                }
                alt="About Us"
              />
            </div>

            <div className="absolute top-[246px] right-[-64px] bg-white h-[280px] w-[263px] flex justify-center items-center">
              <div className="right-[-56px] bottom-[92px] h-full w-full border-[12px] border-primary">
                <Image width={239} height={256} src="/images/about.png" className="h-full w-full" />
                <div className="absolute top-[6rem] left-[6rem] ">
                  <div onClick={() => setvideoOpen(true)}>
                    <PlayButton videoOpen={videoOpen} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
          <div className="eb-garamond w-full lg:w-3/5 flex flex-col justify-center lg:px-5 xl:px-5 md:px-7 smaller:px-8 sm:px-4 px-2">
            <div className="text-center sm:text-start xl:px-5 md:px-7 smaller:px-8 small:px-4">
              <p className="section-subtitle text-[#D4AF37]">{columnFormatter(data?.title)}</p>
              <h1 className="section-title text-[#242628]  block capitalize">
                {firstWord}<br />
                {secondWord} <span className="text-[#D4AF37]">{lastword}</span>
              </h1>
              <p className="text-[#3A3D3F] section-description">
                {firstWordesc} <br className="hidden xl:block" /> {secondWordesc} <br className="hidden xl:block" /> {lastwordesc}
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[331px_341px] gap-y-[40px] gap-x-[24px] work-sans mb-[50px] xl:px-5 md:px-7 smaller:px-8 sm:px-4">
          
                <div className="flex gap-4">
                  <div className="flex-none md:w-[60px] md:h-[60px] w-11 h-11 rounded-full bg-red-100 flex justify-center items-center">
                    <img
                      className="md:w-11 md:h-11 w-7 h-7"
                      src={
                        Array.isArray(data?.experience_image)
                          ? data?.experience_image[0].url
                          : data?.experience_image
                      }
                      alt="Hammer"
                    />
                  </div>

                  <div>
                    <p className="text-primary text-lg font-semibold">
                      {columnFormatter(data?.experience_title)}
                    </p>
                    <p className="text-[#3A3D3F] md:text-base text-sm">
                      {columnFormatter(data?.experience_description)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none md:w-[60px] md:h-[60px] w-11 h-11 rounded-full bg-red-100 flex justify-center items-center">
                    <img
                      className="md:w-11 md:h-11 w-7 h-7"
                      src={
                        Array.isArray(data?.success_image)
                          ? data?.success_image[0].url
                          : data?.success_image
                      }
                      alt="Result"
                    />
                  </div>
                  <div>
                    <p className="text-primary text-lg font-semibold">
                      {columnFormatter(data?.success_title)}
                    </p>
                    <p className="text-[#3A3D3F] md:text-base text-sm">
                      {columnFormatter(data?.success_description)}
                    </p>
                  </div>
                </div>
            
                <div className="flex gap-4">
                  <div className="flex-none md:w-[60px] md:h-[60px] w-11 h-11 rounded-full bg-red-100 flex justify-center items-center">
                    <img
                      className="md:w-11 md:h-11 w-7 h-7"
                      src={
                        Array.isArray(data?.result_image)
                          ? data?.result_image[0].url
                          : data?.result_image
                      }
                      alt="Daripalla"
                    />
                  </div>
                  <div>
                    <p className="text-primary text-lg font-semibold">
                      {columnFormatter(data?.result_title)}
                    </p>
                    <p className="text-[#3A3D3F] md:text-base text-sm">
                     {columnFormatter(data?.result_description)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none md:w-[60px] md:h-[60px] w-11 h-11 rounded-full bg-red-100 flex justify-center items-center">
                    <img
                      className="md:w-11 md:h-11 w-7 h-7"
                      src={
                        Array.isArray(data?.rate_image)
                          ? data?.rate_image[0].url
                          : data?.rate_image
                      }
                      alt="Success"
                    />
                  </div>
                  <div>
                    <p className="text-primary text-lg font-semibold">
                      {columnFormatter(data?.rate_title)}
                    </p>
                    <p className="text-[#3A3D3F] md:text-base text-sm">
                      {columnFormatter(data?.rate_description)}
                    </p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      {videoOpen && (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black bg-opacity-70" style={{position:"fixed",zIndex:"200",left:"0",top:"0",width:"100%",height:"100%",background:"rgba(0, 0, 0, 0.7)",display:"flex",alignItems:"center",justifyContent:"center"}}
        >
          <div className="mx-auto w-full max-w-[550px] bg-white">
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                controls
                autoPlay
                loop
                muted
              >
                <source src={
                  Array.isArray(data?.about_video)
                    ? data?.about_video[0].url
                    : data?.about_video
                } type="video/mp4" />
              </video>
            </>
          </div>

          <button
            onClick={() => setvideoOpen(false)}
            className="absolute right-0 top-0 flex h-20 w-20 cursor-pointer items-center justify-center "
          >
            <IoClose className="text-7xl" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
