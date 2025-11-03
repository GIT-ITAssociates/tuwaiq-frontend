
// import NewsBlog from '@/app/components/common/blog';
// import CaseStudy from '@/app/components/common/caseStudy';
// import Contact from '@/app/components/common/contact';
// import Lawyer from '@/app/components/common/lawyer';
// import Service from '@/app/components/common/service';
// import Testimonial from '@/app/components/common/testimonial';
// import OurFaq from '@/app/components/faq/ourFaq';
// import AboutUS from '@/app/components/home/about';
// import Banner from '@/app/components/home/banner';
import Login from '@/app/components/auth/login';

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


const page = async () => {
  const response = await getData("home");
  const data = response?.data || null;
  const herosection = data?.content?.hero_section || null;
  const aboutsection = data?.content?.about_section || null;
  return (
    <div >
      {/* <Banner data={herosection}/>
        <AboutUS data={aboutsection}/>
        <Service/>
        <Lawyer/>
        <Testimonial/>
        <CaseStudy/>
        <OurFaq/>
        <Contact/>
        <NewsBlog/> */}
      <Login />
    </div>
  );
};

export default page;