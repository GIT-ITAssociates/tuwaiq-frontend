'use client';
import PageTitle from '@/app/components/common/title/title';
import { fetchSinglePage } from '@/app/helpers/backend';
import { useFetch } from '@/app/helpers/hooks';
import { columnFormatter } from '@/app/helpers/utils';
import React from 'react'

const Page = () => {
    const [data , getData] = useFetch(fetchSinglePage,{slug:"support"});
  return (
    <div className="">
        <PageTitle title={'Help & Info'}></PageTitle>
    <div className="m-6 ">
    <div dangerouslySetInnerHTML={{ __html: columnFormatter(data?.content) }} />
    </div>
    </div>
  )
}

export default Page