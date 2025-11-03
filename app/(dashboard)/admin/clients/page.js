"use client";
import Table, { TableImage } from '@/app/components/common/table/table';
import PageTitle from '@/app/components/common/title/title';
import { getAllUsers } from '@/app/helpers/backend';
import { useFetch } from '@/app/helpers/hooks';
import { useI18n } from '@/app/providers/i18n';
import { Form } from 'antd';
import React from 'react';

const page = () => {
      const [data, getData, { loading }] = useFetch(getAllUsers);
      const i18n = useI18n();
      const { languages, langCode } = useI18n();
       const [form] = Form.useForm();

                   const langFromLocalStorage =
    typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;

    const currentLanguage = i18n?.languages?.find(
  (lang) => lang?._id === langFromLocalStorage
)?.name;


  const columns = [
    {
      text: 'image',
      dataField: 'image',
      formatter: (_, d) => <TableImage url={d?.image ? d?.image : "/default.jpg"} />,
    },
    {
      text: 'Name',
      dataField: 'name',
      formatter: (name) => <span className='capitalize'>{name || 'N/A'}</span>,
    },
    {
      text: 'Email',
      dataField: 'email',
      formatter: (email) => <span >{email || 'N/A'}</span>,
    },
    {
      text: 'phone_no',
      dataField: 'phone_no',
      formatter: (phone_no) => <span >{phone_no || 'N/A'}</span>,
    },
   {
      text: 'Success Cases',
      dataField: 'success_cases',
      formatter: (_,d) => <span >{d?.success_cases || 0}</span>,
    },
     {
  text: currentLanguage === "Arabic" ? "القضايا المعلقة" : "Pending Cases",
  dataField: "pending_cases",
  formatter: (_, d) => <span>{d?.pending_cases || 0}</span>,
},
{
  text: currentLanguage === "Arabic" ? "القضايا النشطة" : "Active Cases",
  dataField: "active_cases",
  formatter: (_, d) => <span>{d?.active_cases || 0}</span>,
},

    {
      text: 'Present Address',
      dataField: 'pre_address',
      formatter: (_,d) => <span className='capitalize'>{d?.pre_address || "N/A"}</span>,
    },
    {
      text: 'Permanent Address',
      dataField: 'per_address',
      formatter: (_,d) => <span className='capitalize'>{d?.per_address || "N/A"}</span>,
    },
     
  ];

  return (
    <div>
<PageTitle title={currentLanguage === "Arabic" ? "العملاء" : i18n?.t("Clients")} />
      <Table
        columns={columns}
        data={data}
        loading={loading}
        onReload={getData}
      noActions={true}

        indexed
        pagination
        langCode={langCode}
      />

    </div>
  )
};

export default page;