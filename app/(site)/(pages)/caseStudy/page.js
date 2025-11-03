import OurCase from '@/app/components/caseStudy/ourCase';
import Banner from '@/app/components/common/banner';
import Contact from '@/app/components/common/contact';
import OurClients from '@/app/components/common/out-clients';
import React from 'react';

const page = () => {
    return (
        <div>
            <Banner title={'Case Study'}/>
            <OurCase/>
            <OurClients/>
            <Contact/>
            </div>
    );
};

export default page;