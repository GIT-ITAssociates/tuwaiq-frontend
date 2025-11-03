'use client';
import Table from '@/app/components/common/table/table'
import PageTitle from '@/app/components/common/title/title';
import { delAdminNewsletter, fetchAdminNewsletter } from '@/app/helpers/backend';
import { useFetch } from '@/app/helpers/hooks';
import React from 'react'

const Page = () => {
    const [data, getData, { loading }] = useFetch (fetchAdminNewsletter);
    const columns = [
        {
          text: 'Email',
          dataField: 'email',
          formatter: (_, d) => (
            <span className='line-clamp-2 w-[150px] text-wrap sm:w-[250px]'>{d?.email}</span>
          ),
        },
      ]
  return (
    <div>
      <PageTitle title='Newsletter' />
         <Table
        data={data}
        indexed
        pagination
        getData={getData}
        columns={columns}
        loading={loading}
        onReload={getData}
        onDelete={delAdminNewsletter}
      />
    </div>
  )
}

export default Page