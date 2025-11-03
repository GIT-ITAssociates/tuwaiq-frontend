import React from 'react'

const TeamScaliton = () => {
  return (
    <div className="relative xl:mb-[150px] md:mb-14 mb-[60px] work-sans">
    <div className="custom-container">
      <div className="flex flex-col md:flex-row shadow-xl rounded-[20px] md:pl-10 pl-0 md:gap-7 gap-6">
        {/* Skeleton for image */}
        <div className="xl:w-[57%] w-full order-2 flex justify-center">
          <div className="rounded-[20px] bg-gray-300 animate-pulse w-full h-[355px] md:h-[500px] lg:h-[700px]"></div>
        </div>

        {/* Skeleton for text */}
        <div className="eb-garamond w-full xl:w-3/5 flex flex-col justify-center md:px-0 px-3 py-0 sm:py-10 order-1">
          <div className="h-8 bg-gray-300 animate-pulse mb-[10px] w-3/4"></div>
          <div className="h-6 bg-gray-300 animate-pulse mb-4 w-1/2"></div>
          <div className="h-4 bg-gray-300 animate-pulse mb-[28px] w-full"></div>
          <div className="h-4 bg-gray-300 animate-pulse mb-2 w-5/6"></div>
          <div className="h-4 bg-gray-300 animate-pulse mb-2 w-4/6"></div>
          <div className="h-4 bg-gray-300 animate-pulse mb-2 w-3/6"></div>

          {/* Skeleton for social links */}
          <div className="flex items-center mt-[26px] flex-wrap sm:gap-[116px] gap-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
            </div>
            <div className="w-24 h-10 bg-gray-300 animate-pulse rounded"></div>
          </div>
        </div>
      </div>

      {/* Skeleton for additional sections */}
      <div className="mt-[56px] px-5">
        <div className="h-6 bg-gray-300 animate-pulse mb-6 w-1/3"></div>
        <div className="h-4 bg-gray-300 animate-pulse mb-2 w-full"></div>
        <div className="h-4 bg-gray-300 animate-pulse mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-300 animate-pulse mb-2 w-4/6"></div>
      </div>
      <div className="mt-[40px] px-5">
        <div className="h-6 bg-gray-300 animate-pulse mb-6 w-1/3"></div>
        <div className="h-4 bg-gray-300 animate-pulse mb-2 w-full"></div>
        <div className="h-4 bg-gray-300 animate-pulse mb-2 w-5/6"></div>
      </div>
    </div>
  </div>
  )
}

export default TeamScaliton