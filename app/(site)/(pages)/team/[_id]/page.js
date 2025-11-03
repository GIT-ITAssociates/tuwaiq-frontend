'use client';
import Banner from '@/app/components/common/banner';
import OurTeamDetails from '@/app/components/team/ourTeamdetails';
import { fetchAttorneyDetails } from '@/app/helpers/backend';
import { useFetch } from '@/app/helpers/hooks';
import React, { useEffect } from 'react';

const page = ({params}) => 
    {
    const [data, getData, { loading }] = useFetch(fetchAttorneyDetails);
    
     useEffect(() => {
         getData({ _id: params._id });
     }, [params._id]);
     
    return (
        <div>
            <Banner title={'Team Details'}/>
            <OurTeamDetails data={data} loading={loading}/> 
        </div>
    );
};

export default page;