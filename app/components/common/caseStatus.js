'use client'; 
import { fetchSinglePage } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { columnFormatter } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
import Image from "next/image";
import { Skeleton } from "antd";

const CasesStatus = () => {
  const i18n = useI18n();
  const [data, getData, { loading }] = useFetch(fetchSinglePage, { slug: "client_brand" });

  return (
    <div className="bg-gradient-to-r from-[#0C0C15] to-[#3F4069] xl:mb-[150px] md:mb-14 mb-[60px]">
      <div className="custom-container py-[75px] plan-section">
        {loading ? (
          <Skeleton active />
        ) : (
          <div className="lg:flex lg:flex-row grid sm:grid-cols-2 grid-cols-1 lg:gap-0 gap-8 sm:align-items-start align-items-center justify-between text-center text-white">
            <div className="flex flex-col items-center xl:pe-[92px] lg:pe-[30px] bg">
              <div className="flex items-center gap-[30px]">
                <span className="text-gold text-4xl mb-2">
                  <Image
                    width={50}
                    height={50}
                    src={
                      Array.isArray(data?.content?.success_logo)
                        ? data?.content?.success_logo[0]?.url
                        : data?.content?.success_logo
                    }
                    alt="case"
                    className="h-[50px] w-[50px]"
                  />
                </span>
                <div>
                  <h3 className="text-[32px] leading-[41.76px] tracking-[4%] font-bold mb-4">
                    {columnFormatter(data?.content?.case_count)}
                  </h3>
                  <p className="text-xl capitalize">{i18n?.t('Successful Case')}</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block border-l border-gray-500 w-0 h-[78px] border-opacity-[20%]"></div>

            <div className="flex flex-col items-center xl:px-[92px] lg:px-[30px]">
              <div className="flex items-center gap-[30px]">
                <span className="text-gold text-4xl mb-2">
                  <Image
                    width={50}
                    height={50}
                    src={
                      Array.isArray(data?.content?.close_logo)
                        ? data?.content?.close_logo[0]?.url
                        : data?.content?.close_logo
                    }
                    alt="case"
                    className="h-[50px] w-[50px]"
                  />
                </span>
                <div>
                  <h3 className="text-[32px] leading-[41.76px] tracking-[4%] font-bold mb-4">
                    {columnFormatter(data?.content?.close_case_count)}
                  </h3>
                  <p className="text-xl capitalize">{i18n?.t('case close')}</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block border-l border-gray-500 w-0 h-[78px] border-opacity-[20%]"></div>

            <div className="flex flex-col items-center xl:px-[92px] lg:px-[30px]">
              <div className="flex items-center gap-[30px]">
                <span className="text-gold text-4xl mb-2">
                  <Image
                    width={50}
                    height={50}
                    src={
                      Array.isArray(data?.content?.trusted_logo)
                        ? data?.content?.trusted_logo[0]?.url
                        : data?.content?.trusted_logo
                    }
                    alt="case"
                    className="h-[50px] w-[50px]"
                  />
                </span>
                <div>
                  <h3 className="text-[32px] leading-[41.76px] tracking-[4%] font-bold mb-4">
                    {columnFormatter(data?.content?.trusted_case_count)}
                  </h3>
                  <p className="text-xl capitalize">{i18n?.t('Trusted client')}</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block border-l border-gray-500 w-0 h-[78px] border-opacity-[20%]"></div>

            <div className="flex flex-col items-center xl:ps-[92px] lg:ps-[30px]">
              <div className="flex items-center gap-[30px]">
                <span className="text-gold text-4xl mb-2">
                  <Image
                    width={50}
                    height={50}
                    src={
                      Array.isArray(data?.content?.expert_logo)
                        ? data?.content?.expert_logo[0]?.url
                        : data?.content?.expert_logo
                    }
                    alt="case"
                    className="h-[50px] w-[50px]"
                  />
                </span>
                <div>
                  <h3 className="text-[32px] leading-[41.76px] tracking-[4%] font-bold mb-4">
                    {columnFormatter(data?.content?.expert_count)}
                  </h3>
                  <p className="text-xl capitalize">{i18n?.t('expert team')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CasesStatus;