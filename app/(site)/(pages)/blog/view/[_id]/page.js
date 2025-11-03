'use client';
import Details from "@/app/components/blog/blogdetails";
import Banner from "@/app/components/common/banner";
import { blogDetails, fetchBlogsListUser } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useEffect } from "react";

const Blogdetails = ({ params }) => {
       useEffect(() => {
           getData({ _id: params._id });
       }, [params?._id]);
    const [data, getData, { loading }] = useFetch(blogDetails ,{},false);
    const [alldata, getAllData] = useFetch(fetchBlogsListUser);

    return (
        <div>
        <Banner title={'News & Blog'}/>
        <Details data={data} alldata={alldata} loading={loading} getAllData={getAllData}/>
        </div>
    );
};

export default Blogdetails;