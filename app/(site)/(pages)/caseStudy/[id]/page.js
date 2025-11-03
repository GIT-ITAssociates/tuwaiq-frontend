'use client';
import OurCaseDetails from '@/app/components/caseStudy/ourCaseDetails';
import Tabs from '@/app/components/caseStudy/tab';
import Banner from '@/app/components/common/banner';
import { getCaseStudyDetails } from '@/app/helpers/backend';
import { useFetch } from '@/app/helpers/hooks';
import React, { useEffect } from 'react';

const page = ({ params }) => {
    const [data, getData] = useFetch(getCaseStudyDetails);
    useEffect(() => {
      if (params?.id) {
        getData({ _id: params.id });
      }
    }, [data?._id]);


    return (
        <div>
            <Banner title={'Case Study'} />
            <OurCaseDetails data={data} />
            <Tabs solve={data?.solve} challenges={data?.challenges} solved={data?.solved} solved_result={data?.solved_result} next_hearing={data?.next_hearing} data={data} />
        </div>
    );
};

export default page;