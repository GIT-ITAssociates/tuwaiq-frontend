'use client';
import React from 'react';
import FAQ from '../common/faq';
import { fetchFaq } from '@/app/helpers/backend';
import { useFetch } from '@/app/helpers/hooks';
import { useI18n } from '@/app/providers/i18n';
import { usePathname } from 'next/navigation';

const OurFaq = () => {
  const [data, getData, { loading }] = useFetch(fetchFaq);
  const i18n = useI18n();
  const pathname=usePathname();
    return (
        <div className='custom-container  xl:pb-[150px] md:pb-14 pb-[60px] '>
          <p className={`section-subtitle ${pathname==="/"?"block text-center":"hidden"}`}>{i18n?.t("Faq")}</p>
          <h1 className={`section-title text-[#242628] ${pathname==="/"?"text-center":"text-start"}`}>{i18n?.t("Frequently Asked Questions")}</h1>
          <p className={`section-description ${pathname==="/"?"text-center":"text-start"}`}>
            {i18n?.t("Find answers to common questions about our services and processes.")}
          </p>
          <FAQ data={data?.docs}/>
        </div>
    );
};

export default OurFaq;
