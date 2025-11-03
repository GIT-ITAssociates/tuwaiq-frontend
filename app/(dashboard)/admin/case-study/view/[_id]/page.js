"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { singleCaseStudy } from '@/app/helpers/backend';
import { useFetch } from '@/app/helpers/hooks';
import { useI18n } from '@/app/providers/i18n';
import { columnFormatter } from '@/app/helpers/utils';
import { BiCalendar, BiCalendarAlt, BiCheckCircle} from 'react-icons/bi';
import { CiLock } from 'react-icons/ci';
import { FiAlertTriangle, FiBarChart2, FiFileText, FiTrendingUp } from 'react-icons/fi';
import dayjs from 'dayjs';


const AdmincaseView = ({ params }) => {
  const [data, getData] = useFetch(singleCaseStudy, {}, false);
  const i18n = useI18n()
  const [isLoaded, setIsLoaded] = useState(false)
  const getDaysRemaining = (dateString) => {
    const hearingDate = new Date(dateString);
    const today = new Date();
    const diffTime = hearingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      const absDays = Math.abs(diffDays);
      if (absDays >= 365) {
        const years = Math.ceil(absDays / 365);
        return `${years} year${years > 1 ? "s" : ""} left`;
      } else if (absDays >= 7) {
        const weeks = Math.ceil(absDays / 7);
        return `${weeks} week${weeks > 1 ? "s" : ""} left`;
      } else {
        return `${absDays} day${absDays > 1 ? "s" : ""} left`;
      }
    }

    return `${diffDays} day${diffDays > 1 ? "s" : ""} remaining`;
  };

  const daysRemaining = getDaysRemaining(data?.next_hearing?.date);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    getData({ _id: params._id });
  }, [params?._id]);

  const Card = ({ isLoaded, delay, bgColor, icon, title, description, name }) => {
    return (
      <div
        className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-500 delay-${delay} ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <div className={`h-2 ${bgColor}`}></div>
        <div className="p-6">
          <h3 className={`text-sm font-semibold text-${bgColor?.replace('bg-', '')}-600 mb-2 capitalize`}>{name}</h3>
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 rounded-full ${bgColor?.replace('bg-', 'bg-opacity-20 ')} flex items-center justify-center mr-3`}>
              {icon}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          </div>
          <p className="text-slate-600">{description}</p>
        </div>
      </div>
    );
  };



  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">


        <div
          className={`bg-primary text-white transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl transform transition-transform duration-500 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src={data?.image || "/placeholder.svg?height=400&width=400"}
                    alt={'Case Study Image'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3 text-center md:text-left">
            
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{columnFormatter(data?.title)}</h1>
                <p className="text-lg text-indigo-100 mb-6 max-w-2xl">{columnFormatter(data?.description)}</p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                    <BiCalendar className="h-4 w-4 mr-2 text-indigo-200" />
                    <span className="text-sm">{i18n?.t('Filed')}: {dayjs(data?.createdAt).format("YYYY-MM-DD")}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                    <CiLock className="h-4 w-4 mr-2 text-indigo-200" />
                    <span className="text-sm">{i18n?.t('Updated')}: {dayjs(data?.updatedAt).format("YYYY-MM-DD")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-16 bg-slate-50 rounded-t-[50%] transform translate-y-1"></div>
        </div>

        <div className="container mx-auto px-4 -mt-16 pb-16">
          <div
            className={`bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 transform transition-all duration-500 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                <FiFileText className="h-5 w-5 mr-2 text-indigo-600" />
                {i18n?.t('Case Overview')}
              </h2>

            </div>

            <div className="prose max-w-none text-slate-600">
              <p>{columnFormatter(data?.description)}</p>
            </div>

            <div className="mt-8 p-5 bg-indigo-50 border-l-4 border-primary rounded-lg">
              <h3 className="font-semibold text-borderColor mb-2 flex items-center">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                  <span className="text-borderColor text-xs">★</span>
                </span>
                {i18n?.t('Featured Aspect')}
              </h3>
              <div className="text-textColor" dangerouslySetInnerHTML={{ __html: columnFormatter(data?.featured_aspect) }} />
            </div>
          </div>

          <div
            className={`bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 md:p-8 mb-8 text-white transform transition-all duration-500 delay-100 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <BiCalendarAlt className="h-6 w-6 mr-2 text-white" />
                  {columnFormatter(data?.next_hearing.title)}
                </h2>
                <p className="text-amber-100 max-w-xl">{columnFormatter(data?.next_hearing?.description)}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[200px]">
                <div className="text-sm text-amber-100 font-medium mb-1 uppercase">{i18n?.t('Next Hearing')}</div>
                <div className="text-3xl font-bold mb-2">{dayjs(data?.next_hearing.date).format("YYYY-MM-DD")}</div>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div
                    className={`text-sm font-medium ${daysRemaining.includes("year") || daysRemaining.includes("week") || daysRemaining.includes("day")
                        ? "text-green-100"
                        : daysRemaining > 3
                          ? "text-amber-100"
                          : "text-red-100"
                      }`}
                  >
                    {daysRemaining} 
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card
              isLoaded={isLoaded}
              delay="200"
              bgColor="bg-primary"
              name={i18n?.t('Challenges')}
              icon={<FiAlertTriangle className="h-5 w-5 text-red-500" />}
              title={columnFormatter(data?.challenges?.title)}
              description={columnFormatter(data?.challenges?.description)}
            />
            <Card
              isLoaded={isLoaded}
              name={i18n?.t('solve')}
              delay="300"
              bgColor="bg-primary"
              icon={
                <div className="h-5 w-5 text-blue-500 flex items-center justify-center">
                  <FiTrendingUp className="h-5 w-5" />
                </div>
              }
              title={columnFormatter(data?.solve?.title)}
              description={columnFormatter(data?.solve?.description)}
            />
            <Card
              isLoaded={isLoaded}
              delay="400"
              name={i18n?.t('solved')}

              bgColor="bg-primary"
              icon={<BiCheckCircle className="h-5 w-5 text-green-500" />}
              title={columnFormatter(data?.solved?.title)}
              description={columnFormatter(data?.solved?.description)}
            />
            <Card
              isLoaded={isLoaded}
              name={i18n?.t('Solved Result')}
              delay="500"
              bgColor="bg-primary"
              icon={<FiBarChart2 className="h-5 w-5 text-purple-500" />}
              title={columnFormatter(data?.solved_result?.title)}
              description={columnFormatter(data?.solved_result?.description)}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdmincaseView;

