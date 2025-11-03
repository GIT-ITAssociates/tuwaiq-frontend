
import AboutUs from '@/app/components/about/about';
import Fairness from '@/app/components/about/fairness';
import Banner from '@/app/components/common/banner';
import CasesStatus from '@/app/components/common/caseStatus';
import Contact from '@/app/components/common/contact';
import Lawyer from '@/app/components/common/lawyer';
import OurClients from '@/app/components/common/out-clients';
import Testimonial from '@/app/components/common/testimonial';
import React from 'react';

async function getData(slug) {
    try {
      const res = await fetch(process.env.backend_url + `api/pages?slug=${slug}`, {
        cache: "no-store",
      });
  
      if (!res.ok) {
        return null; 
      }
      const data = await res.json();
      return data;
    } catch (error) {
      return null;
    }
  }
const page = async() => {
    const response = await getData("about");
    const data = response?.data || null;
    const mission_vision_section = data?.content?.mission_vision_section || null;
    const aboutsection = data?.content?.about_section || null;
    return (
        <div>
            <Banner title="About Us"/>
            <AboutUs data={aboutsection}/>
            <CasesStatus />
            <Fairness data={mission_vision_section}/>
            <Testimonial/>
            <Lawyer/>
            <Contact/>
            <OurClients/>
            </div>
    );
};

export default page;