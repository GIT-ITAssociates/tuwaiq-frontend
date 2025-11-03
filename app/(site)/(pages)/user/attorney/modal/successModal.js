"use client";
import { message, Modal } from "antd";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useModal } from "@/app/context/modalContext";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { updateCaseRequest } from "@/app/helpers/backend";

const SuccessModal = ({socketdata}) => {

const {isSuccessModal,setIsSuccessModal}=useModal();

  const router = useRouter();
  const handleSubmit = async() => {
   try {
      let data =  await updateCaseRequest({_id:socketdata?._id,status:'accept'});
      if(data?.error){
        message.error(data?.msg || data?.message)
      }
      else{
        message.success(data?.msg || data?.message);
        setIsSuccessModal(false);

      }
 
    } 
      catch (error) {
        setIsSuccessModal(false);

    }
    finally{
      setIsSuccessModal(false);

    }
  };

  return (
    <Modal
    width={450}
    className="!bg-transparent"
    footer={null}
    closeIcon={false}
    open={isSuccessModal}
    onCancel={() => setIsSuccessModal(false)}
    maskClosable={false} 
    style={{ position: "relative", zIndex: "200" }}
  >
  
      <div className=" w-full  bg-white rounded-[20px] p-[10px] relative ">
        <button
          className="w-[32px] h-[32px] rounded-full bg-[#EDEDED] absolute sm:right-0 sm:top-0 top-[-15px] right-[-15px] inline-flex justify-center items-center"
          onClick={() => {
            setIsSuccessModal(false);
          }}
        >
          <IoClose
            size={20}
            className="text-[#242628] text-[12px] cursor-pointer"
          />
        </button>

        <h3 className="font-medium leading-[23.46px] text-[20px] pb-[24px] text-[#191930] font-ebgramond text-center capitalize ">
        The {socketdata?.from ==="attorney"? "Attorney":"User"} Has Created a Case for You
        </h3>
        <h4 className="font-medium leading-[23.46px] text-[18px] pb-[48.18px] text-[#191930] font-ebgramond text-center capitalize ">
        Please Accept or Decline the Request
        </h4>
     
         <div className="sm:mx-auto sm:max-w-[350px] w-full">
            <div className="border border-[#E0E0E0] rounded-[10px] px-[24px]  py-8 h-[300px]  mb-5">
              <div className="flex items-center gap-3 mb-6">
                <Image width={70} height={70}
                  className="sm:h-[70px] sm:w-[70px] h-[50px] w-[50px] rounded-full"
                  src={socketdata?.from ==="attorney"?socketdata?.attorney?.image:socketdata?.user?.image || '/images/defaultimg.jpg'}
                  alt=""
                />
                <div className="flex flex-col sm:gap-3 gap-1">
                  <p className="work-sans font-semibold text-lg">{socketdata?.from ==="attorney"?socketdata?.attorney.name:socketdata?.user.name}</p>
                  <p className="text-sans-400-16 text-[#818B8F]">{socketdata?.from ==="attorney"?socketdata?.attorney.email:socketdata?.user.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sans-500-16">
                  <span
                    className="text-[#818B8F]">Case Type:
                  </span>{" "}
                 {socketdata?.appointment?.case_type}
                </p>
                <p className="text-sans-500-16 ">
                  <span
                    className="text-[#818B8F]">Case Description:
                  </span>{" "}
                 <p className="line-clamp-4 !text-sm !font-normal">{socketdata?.appointment?.short_description} </p> 
                </p>
              </div>
            </div>
          </div>
        <div className=" flex justify-center mx-4  flex-row  gap-[24px] items-center">
          <button
            className="capitalize w-1/2 sm:px-[32px] sm:py-[16px] px-[16px] py-[16px] rounded-[8px] bg-[#EDEDED] text-[#242628] font-sans text-[18px] leading-[24px] font-medium"
            onClick={async() => {
              try {
                let data =  await updateCaseRequest({_id:socketdata?._id,status:'decline'});
                if(data?.error){
                  message.error(data?.msg || data?.message)
                }
                else{
                  message.success(data?.msg || data?.message);
                  setIsSuccessModal(false);
          
                }
           
              } 
                catch (error) {
                  setIsSuccessModal(false);
          
              }
              finally{
                setIsSuccessModal(false);
          
              }
            }}
          >
            Decline
          </button>
          <button
            type="submit"
            className="capitalize w-1/2 sm:px-[32px] sm:py-[16px] px-[16px] py-[16px] text-white rounded-[8px] bg-primary font-sans text-[18px] leading-[24px] font-medium"
            onClick={() => {
              handleSubmit();
            }}
          >
            accept
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;