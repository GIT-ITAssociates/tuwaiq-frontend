'use client';
import React, { useState } from 'react';
import { AiOutlineContacts } from "react-icons/ai";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { GoCodeOfConduct } from "react-icons/go";
import { LiaBorderStyleSolid } from "react-icons/lia";
import { IoHomeOutline } from "react-icons/io5";
import PageTitle from '@/app/components/common/title/title';
import { useI18n } from '@/app/providers/i18n';
import HomePageSetting from './(pages)/home/page';
import AboutPageSetting from './(pages)/about/page';
import PrivacyPage from './(pages)/privacy-policy/page';
import TermsPage from './(pages)/terms-and-condition/page';

import ClientBrand from './(pages)/clientBrand/page';
import HelpAndInformation from './(pages)/support/page';

const Content = () => {
    const i18n = useI18n()
    const [tab, setTab] = useState(0);

    const methods = [
      
        {
            label: ("Home"),
            icon: <IoHomeOutline />,
            form: <HomePageSetting slug={'home'} />
        },
        {
            label: ("About Us"),
            icon: <LiaBorderStyleSolid />,
            form: <AboutPageSetting slug={'about'} />
        },
        {
            label: ("client & Partners"),
            icon: <LiaBorderStyleSolid />,
            form: <ClientBrand slug={'client_brand'} />
        },
        {
            label: ("Help & Support"),
            icon: <LiaBorderStyleSolid />,
            form: <HelpAndInformation slug={'support'} />
        },
        {
            label: ("Privacy Policy"),
            icon: <MdOutlinePrivacyTip />,
            form: <PrivacyPage slug={'privacy_policy'} />
        },
        {
            label: ("Terms & Conditions"),
            icon: <GoCodeOfConduct />,
            form: <TermsPage slug={'terms_&_condition'} />
        },
    ];

    return (
        <div>
            <PageTitle title={i18n.t("Pages List")} />
            <div className="flex flex-col  gap-4">
                    <div className="xl:flex grid sm:grid-cols-3 grid-cols-1 ">
                        {methods.map((method, index) => (
                            <div
                                key={index}
                                className={`flex xl:w-1/5 w-full items-center justify-center p-4 cursor-pointer ${tab === index ? "bg-primary text-white" : "bg-white text-dark_text"}`}
                                onClick={() => setTab(index)}>
                                <div className="mr-4">{method.icon}</div>
                                <div className='capitalize'>{i18n?.t(method?.label)}</div>
                            </div>
                        ))}
                    </div>
                {/* </div> */}
                <div className="">
                    {methods[tab].form}
                </div>
            </div>
        </div>
    );
};

export default Content;