"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { Calendar, Checkbox, message } from "antd";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import dayjs from "dayjs";
import Button from "@/app/components/common/button";
import { getAdminAvailbility, getAvailbility, postAdminAvailbility, postAvailbility } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useUser } from "@/app/context/userContext";
import { useI18n } from "@/app/providers/i18n";


const Availablity = () => {
  const slots = [
  "12:00AM","12:15AM","12:30AM","12:45AM",
  "1:00AM","1:15AM","1:30AM","1:45AM",
  "2:00AM","2:15AM","2:30AM","2:45AM",
  "3:00AM","3:15AM","3:30AM","3:45AM",
  "4:00AM","4:15AM","4:30AM","4:45AM",
  "5:00AM","5:15AM","5:30AM","5:45AM",
  "6:00AM","6:15AM","6:30AM","6:45AM",
  "7:00AM","7:15AM","7:30AM","7:45AM",
  "8:00AM","8:15AM","8:30AM","8:45AM",
  "9:00AM","9:15AM","9:30AM","9:45AM",
  "10:00AM","10:15AM","10:30AM","10:45AM",
  "11:00AM","11:15AM","11:30AM","11:45AM",
  "12:00PM","12:15PM","12:30PM","12:45PM",
  "1:00PM","1:15PM","1:30PM","1:45PM",
  "2:00PM","2:15PM","2:30PM","2:45PM",
  "3:00PM","3:15PM","3:30PM","3:45PM",
  "4:00PM","4:15PM","4:30PM","4:45PM",
  "5:00PM","5:15PM","5:30PM","5:45PM",
  "6:00PM","6:15PM","6:30PM","6:45PM",
  "7:00PM","7:15PM","7:30PM","7:45PM",
  "8:00PM","8:15PM","8:30PM","8:45PM",
  "9:00PM","9:15PM","9:30PM","9:45PM",
  "10:00PM","10:15PM","10:30PM","10:45PM",
  "11:00PM","11:15PM","11:30PM","11:45PM"
];

  const { user, setUser } = useUser();
  const [data, getData, { loading }] = useFetch(getAdminAvailbility, {});
  const admin = data?.find((i) => i?.email === user?.email);
  const [selectDate, setSelectDate] = useState(null);
  const [selectSlots, setSelectSlots] = useState([]);
  const i18n = useI18n();
 

  useEffect(()=>{
  if(!selectDate){
    setSelectDate(dayjs().format("DD/MM/YYYY") || null);
  }
  },[admin?.availability])
  useEffect(() => {
    if (data?.availability) {
      setSelectSlots(data.availability);
    }
  }, [data]);

  const isMonthChangingRef = useRef(false);

  const handleMonthChange = (newValue, onChange) => {
    isMonthChangingRef.current = true;
    onChange(newValue);
    setTimeout(() => {
      isMonthChangingRef.current = false;
    }, 200);
  };

  const handleDateSelect = (value) => {
    if (isMonthChangingRef.current) return;
    const formattedDate = dayjs(value).format("DD/MM/YYYY");
    setSelectDate(formattedDate);
  };
  const handleSlotChange = (slot) => {
    if (!selectDate) return;

    setSelectSlots((prev) => {
      const existingIndex = prev.findIndex((item) => item.date === selectDate);
      if (existingIndex !== -1) {
        const updatedSlots = prev[existingIndex].timeSlots.includes(slot)
          ? prev[existingIndex].timeSlots.filter((s) => s !== slot)
          : [...prev[existingIndex].timeSlots, slot];

        const updatedAvailability = [...prev];
        updatedAvailability[existingIndex] = {
          date: selectDate,
          timeSlots: updatedSlots,
        };
        return updatedAvailability;
      }
      return [...prev, { date: selectDate, timeSlots: [slot] }];
    });
  };

  const handleSave = async () => {
    const updatedAvailability = [...admin?.availability]; 
  
    selectSlots.forEach((newSlot) => {
      const existingIndex = updatedAvailability.findIndex(
        (item) => item.date === newSlot.date
      );
  
      if (existingIndex !== -1) {

        updatedAvailability[existingIndex].timeSlots = Array.from(
          new Set([...updatedAvailability[existingIndex].timeSlots, ...newSlot.timeSlots])
        );
      } else {

        updatedAvailability.push(newSlot);
      }
    });
  
    const payload = { availability: updatedAvailability };
  
    const data2 = await postAdminAvailbility(payload);
    if (!data2?.error) {
      message.success(data2?.msg || data2?.message);
    } else {
      message.error(data2?.msg || data2?.message);
    }
  };
  

  return (
    <div>
      <h1 className="dashboard-title md:py-[38px] py-[17px] md:px-12 sm:px-8 px-[22px] border-b-2">
        {i18n?.t("Availablity")}
      </h1>
      <div className="lg:p-10 p-5">
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
          <div className="sm:col-span-2 md:max-w-[596px] attorney">
            <h2 className="text-[20px] font-medium mb-5 md:mb-10">
              {i18n?.t("Select Date & Time")}
            </h2>
            <Calendar
              fullscreen={false}
              dateFullCellRender={(value) => {
                const formattedDate = dayjs(value).format("DD/MM/YYYY");
                const isAvailable = selectSlots.some(
                  (item) => item.date === formattedDate
                );
                const isPastDate = dayjs(value).isBefore(dayjs(), "day");
                const isAttorneyAvailable = admin?.availability?.some(
                  (item) => item.date === formattedDate
                );

                return (
                  <div
                    className={`p-2 text-center rounded ${
                      isPastDate
                        ? "bg-transparent border-transparent"
                        : isAvailable ||
                          selectDate?.includes(formattedDate) ||
                          isAttorneyAvailable
                        ? "border-primary bg-primary bg-opacity-10 text-primary border m-2 rounded-[8px]"
                        : "bg-transparent"
                    }`}
                  >
                    {value.date()}
                  </div>
                );
              }}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              headerRender={({ value, onChange }) => {
                const current = value.format("MMMM YYYY");
                return (
                  <div className="flex justify-between items-center px-2 xl:px-8 py-4">
                    <div className="text-base font-semibold">{current}</div>
                    <div className="flex items-center gap-[24px]">
                      <button
                        onClick={() =>
                          handleMonthChange(
                            value.clone().subtract(1, "month"),
                            onChange
                          )
                        }
                        className="hover:text-blue-600 text-textColor"
                      >
                        <TfiAngleLeft className="text-[16px]" />
                      </button>
                      <button
                        onClick={() =>
                          handleMonthChange(
                            value.clone().add(1, "month"),
                            onChange
                          )
                        }
                        className="hover:text-blue-600 text-textColor"
                      >
                        <TfiAngleRight className="text-[16px]" />
                      </button>
                    </div>
                  </div>
                );
              }}
              onSelect={handleDateSelect}
            />
          </div>

          {selectDate && (
            <div className="md:max-w-[268px] w-full">
              <h2 className="text-[20px] text-center font-medium md:mb-10 mb-5">
                {i18n?.t("Show Time I'm Free")}
              </h2>
              <div className="flex flex-col gap-4 h-[440px] overflow-y-auto custom-scrollbar">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex px-[20px] border border-[#EDEDED] rounded-[10px] justify-between items-center text-base py-4"
                  >
                    <Checkbox
                      checked={
                        selectSlots
                          .find((item) => item.date === selectDate)
                          ?.timeSlots.includes(slot) ||
                        admin?.availability
                          ?.find((item) => item.date === selectDate)
                          ?.timeSlots.includes(slot) ||
                        false
                      }
                      onChange={() => handleSlotChange(slot)}
                    />
                    <p>{slot}</p>
                    <p> </p>
                  </div>
                ))}
              </div>
              <div className="grid place-content-end">
                <Button className="mt-[50px]" onClick={handleSave}>
                  {i18n?.t("Save Time & Date")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Availablity;
