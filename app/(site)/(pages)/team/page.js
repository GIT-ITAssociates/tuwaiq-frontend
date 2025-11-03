import Banner from '@/app/components/common/banner';
import OurClients from '@/app/components/common/out-clients';
import OurTeam from '@/app/components/team/ourTeam';
import React from 'react';
const page = () => {
    return (
        <div>
            <Banner title="Team" />  
            <OurTeam/>
            <OurClients/>
        </div>
    );
};

export default page;