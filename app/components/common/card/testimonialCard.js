"use client";
import { Rate } from 'antd';
import Image from 'next/image';
const TestimonialCard = ({data}) => {
    return (
        <div className="relative py-3 testimonialCard w-full ">
        <Image height={50} width={50}
          className="absolute top-[0.25rem] right-[2.25rem] opacity-1"
          src="/images/coma.png"
          alt=""
        />

        <div
          className="max-w-[424px]  mx-auto bg-white flex flex-col text-black rounded-[10px]"
        >
          <div>
            <div className="flex gap-3 items-center pt-[24px] pb-[16px] px-5 ">
              <Image src={data?.image || '/images/defaultimg.jpg'} alt="client" height={1000} width={1000} className='h-[60px] w-[60px] rounded-full object-cover'/>
              <div>
                <p className="text-lg font-semibold whitespace-nowrap text-[#242628]">
                  {data?.name}
                </p>
               </div>
            </div>
            <hr />
          </div>

          <div className="px-5  pb-[24px] h-[204px]">
            <p className="text-textColor text-ellipsis line-clamp-5 h-[135px] w-full break-all pt-[16px]">
             {data?.description}
            </p>
            <div className="flex gap-1 md:mt-[24px] mt-2">
              <Rate disabled value={data?.rating}/>       
            </div>
          </div>
        </div>
      </div>
    );
};

export default TestimonialCard;
