"use client";
import { useRouter } from 'next/navigation';
import Button from '../common/button';
import Link from 'next/link';
import Image from 'next/image';
import { columnFormatter } from '@/app/helpers/utils';
import { useI18n } from '@/app/providers/i18n';
const AboutUS = ({data}) => {
  const route=useRouter();
  const heading = columnFormatter(data?.heading)
  const words = heading.split(" ");
  const firstWord = words.slice(0, 6).join(" ");
  const secondWord = words?.slice(6, 7).join(" ");
  const lastword = words?.slice(7, words.length).join(" ");
  const i18n = useI18n();

  const description = columnFormatter(data?.description)
  const wordsdesc = description.split(" ");
  const firstWordesc = wordsdesc.slice(0,13).join(" ");
  const secondWordesc = wordsdesc?.slice(13, 22).join(" ");
  const lastwordesc = wordsdesc?.slice(22, wordsdesc.length).join(" ");
  return (
    <div className="relative about-section">
      <div className="hidden 2xl:block absolute bottom-0 about-statu">
        <div className="">
          <Image src="/images/justice-statu.png" alt=""width={260} height={412}/>
        </div>
      </div>
      <div className="custom-container">
        <div className="flex flex-col-reverse lg:flex-row  xl:mb-[150px] md:mb-14 mb-[60px] gap-6 lg:gap-0">
          <div className="flex w-full xl:w-2/5 justify-center items-center  ">
            <div className="w-full h-[400px] md:h-[500px] xl:h-[646px] lg:h-[800px]  rounded-[20px] ">
            <Image width={564} height={646}
                className="w-full h-full object-cover rounded-[20px]"
                src={
                  Array.isArray(data?.group_image)
                    ? data?.group_image[0].url
                    : data?.group_image
                }
                alt="picture loading"
              />
            </div>
          </div>

          <div className=" w-full xl:w-3/5 flex flex-col lg:px-5 xl:px-5 ">
            <div className="text-center sm:text-start lg:px-5 ">
              <p className="section-subtitle text-[#D4AF37]">
                {columnFormatter(data?.title)}
              </p>
              <h1 className=" section-title capitalize text-[#021C1B]">
                {firstWord} <br className='xl:inline-block lg:hidden inline-block text-[#021C1B]'/>
                {secondWord} <span className="text-[#D4AF37]">{lastword}</span>
              </h1>
              <p className="section-description">
                {firstWordesc} <br className="hidden xl:block" /> {secondWordesc} <br className="hidden xl:block" />{lastwordesc}
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[331px_341px] gap-x-[24px] gap-y-[30px] font-sans xl:mb-[50px] mb-[30px] xl:px-5 md:px-7 smaller:px-8 small:px-4">
                <div className="flex gap-4">
                  <div className="flex-none md:w-[60px] md:h-[60px] w-11 h-11 rounded-full bg-red-100 flex justify-center items-center">
                    <Image width={44} height={44}
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
                    <p className="text-[#B68C5A] text-lg font-semibold">
                      {columnFormatter(data?.experience_title)}
                    </p>
                    <p className="text-[#3A3D3F] md:text-base text-sm">
                      {columnFormatter(data?.experience_description)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none md:w-[60px] md:h-[60px] w-11 h-11 rounded-full bg-red-100 flex justify-center items-center">
                  <Image width={44} height={44}
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
                    <p className="text-[#B68C5A] text-lg font-semibold">
                      {columnFormatter(data?.success_title)}
                    </p>
                    <p className="text-[#3A3D3F] md:text-base text-sm">
                      {columnFormatter(data?.success_description)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-none md:w-[60px] md:h-[60px] w-11 h-11 rounded-full bg-red-100 flex justify-center items-center">
                  <Image width={44} height={44}
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
                    <p className="text-[#B68C5A] text-lg font-semibold">
                      {columnFormatter(data?.result_title)}
                    </p>
                    <p className="text-[#3A3D3F] md:text-base text-sm">
                    {columnFormatter(data?.result_description)}

                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none md:w-[60px] md:h-[60px] w-11 h-11 rounded-full bg-red-100 flex justify-center items-center">
                  <Image width={44} height={44}
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
                    <p className="text-[#B68C5A] text-lg font-semibold">
                    {columnFormatter(data?.rate_title)}
                    </p>
                    <p className="text-[#3A3D3F] md:text-base text-sm">
                    {columnFormatter(data?.rate_description)}
                    </p>
                  </div>
                </div>
            </div>
            <div className="flex sm:justify-start justify-center xl:px-5 md:px-7 smaller:px-8 small:px-4 xl:pb-0 pb-10">
            <Link className="px-[32px] py-[16px] bg-primary text-white font-medium text-[18px] leading-[24px] font-sans rounded-[8px]" href="/about">
                  {i18n?.t("Read More")}
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUS;