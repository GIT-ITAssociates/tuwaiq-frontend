'use client';
import Banner from "@/app/components/common/banner";
import { fetchSinglePage } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { columnFormatter } from "@/app/helpers/utils";
import { Skeleton } from "antd";


const Page = () => {
  const [page , getPage, {loading}] = useFetch(fetchSinglePage, {slug:"privacy_policy"} );

  return (
    <>
      <Banner title={'Privacy Policy'} />
      <div className="custom-container ">
      {
        loading ? <Skeleton active paragraph={{ rows: 6 }} /> : (
          <div dangerouslySetInnerHTML={{ __html: columnFormatter(page?.content) }} className=" lg:my-[120px] my-16 w-full break-all"></div>
        )
      }
      </div>
    </>
  )
}

export default Page
