import Banner from '@/app/components/common/banner';
import Contact from '@/app/components/common/contact';
import Lawyer from '@/app/components/common/lawyer';
import OurClients from '@/app/components/common/out-clients';
import OurService from '@/app/components/service/ourService';
import React from 'react';

const page = () => {
    return (
        <div>
            <Banner title="Service"/>
            <OurService/>
            <OurClients/>
            <Contact/>
            <Lawyer/>
        </div>
    );
};

export default page;