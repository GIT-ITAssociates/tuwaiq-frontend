import Banner from '@/app/components/common/banner';
import Contact from '@/app/components/common/contact';
import OurClients from '@/app/components/common/out-clients';
import OurFaq from '@/app/components/faq/ourFaq';
import React from 'react';

const page = () => {
    return (
        <div>
            <Banner title={'FAQ'}/>
            <OurFaq/>
            <OurClients/>
            <Contact/>
        </div>
    );
};

export default page;