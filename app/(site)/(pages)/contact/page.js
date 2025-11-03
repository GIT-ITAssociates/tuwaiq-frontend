import Banner from "@/app/components/common/banner";
import OurClients from "@/app/components/common/out-clients";
import Location from "@/app/components/contact/location";
import OurContact from "@/app/components/contact/ourContact";
import React from "react";

const page = () => {
  return (
    <div>
      <Banner title={"Contact Us"} />
      <OurContact />
      <OurClients />
      <Location />
    </div>
  );
};

export default page;
