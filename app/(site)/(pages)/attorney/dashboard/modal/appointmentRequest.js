"use client";
import { useModal } from "@/app/context/modalContext";
import { Grid, Modal } from "antd";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
const AppointmentRequest = () => {
  const { isAppointmentRequest, setIsAppointmentRequest } = useModal();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint(); // Use the hook correctly
  const getModalWidth = () => {
    if (screens.xxl) {
      return 489;
    } else if (screens.xl) {
      return 489;
    } else if (screens.lg) {
      return 600;
    } else if (screens.md) {
      return 600;
    } else if (screens.sm) {
      return 600;
    } else {
      return "100%";
    }
  };
  return (
    <Modal
      className="!bg-transparent"
      footer={null}
      closeIcon={false}
      open={isAppointmentRequest}
      wrapClassName="attorneySection"
      onCancel={() => {
        setIsAppointmentRequest(false);
      }}
      style={{ position: "relative", zIndex: "200" }}
      width={getModalWidth()}
    >
      <div className=" w-full mx-auto bg-white rounded-[20px] relative py-[50px]">
        <button
          className="w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute right-6 top-6  inline-flex justify-center items-center"
          onClick={() => {
            setIsAppointmentRequest(false);
          }}
        >
          <IoClose
            size={20}
            className="text-[#242628] text-[12px] cursor-pointer"
          />
        </button>
        <div className="text-center pt-[21px] md:mb-10 mb-5">
          <h1 className="font-medium text-2xl font-ebgramond mb-6 capitalize">
            you have an case Request
          </h1>
          <p className="font-ebgramond font-medium text-lg capitalize">
          now you can Accept or Decline
          </p>
        </div>
        <div className="sm:max-w-[297px] max-w-[280px] mx-auto ">
          <div className="border border-[#E0E0E0] rounded-[10px] px-[24px]  py-8 h-[324px] md:mb-10 mb-5">
            <div className="flex items-center gap-3 mb-6">
              <Image
                width={70} height={70}
                className="sm:h-[70px] sm:w-[70px] h-[50px] w-[50px] rounded-full"
                src={"/images/Alina.png"}
                alt=""
              />
              <div className="flex flex-col sm:gap-3 gap-1">
                <p className="work-sans font-semibold text-lg">Alina Gain</p>
                <p className="text-sans-400-16 text-[#818B8F]">
                  alinagain@gmail.com
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sans-500-16">
                <span className="text-[#818B8F]">Case Type:</span> Murder
              </p>
              <p className="text-sans-500-16">
                <span className="text-[#818B8F]">Case Description:</span> This
                case involves Party A and Party B, concerning the alleged murder
                of Victim's Name.
              </p>
            </div>
          </div>
        </div>
        <div className=" flex sm:flex-row gap-4 justify-center">
          <button
            className="md:px-[32px] px-4 md:py-[16px] py-3 border text-sans-500 sm:text-lg text-sm rounded-[8px] bg-[#EDEDED] w-fit"
            onClick={() => {
              setIsAppointmentRequest(false);
            }}
          >
            Decline
          </button>
          <button className="md:px-[32px] px-4 md:py-[16px] py-3  border text-sans-500 sm:text-lg text-sm rounded-[8px]  bg-[#C7A87D] text-white w-fit">
            Accepts
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AppointmentRequest;
