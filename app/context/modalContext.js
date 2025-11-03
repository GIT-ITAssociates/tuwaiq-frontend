"use client";
import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [isProfileUpdate1, setIsProfileUpdate1] = useState(false);  // Fixed typo
  const [isProfileUpdate2, setIsProfileUpdate2] = useState(false);  // Fixed typo
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isCaseRequest, setIsCaseRequest] = useState(false);
  const [isAppointmentRequest, setIsAppointmentRequest] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  const openSignUp = () => setSignUpModal(true);
  const closeSignUp = () => setSignUpModal(false);

  const openUpdateProfile1 = () => setIsProfileUpdate1(true);
  const closeUpdateProfile1 = () => setIsProfileUpdate1(false);

  const openUpdateProfile2 = () => setIsProfileUpdate2(true);
  const closeUpdateProfile2 = () => setIsProfileUpdate2(false);

  const openOtpModal = () => setOtpModal(true);
  const closeOtpModal = () => setOtpModal(false);
  const [attorney_id, setAttorneyId] = useState(null);
  const [attorneyDetalis, setAttornyDetails] = useState({});
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
    const [isNewCaseModal, setIsNewCaseModal] = useState(false);



  return (
    <ModalContext.Provider
      value={{
        isLoginModalOpen,
        setLoginModalOpen, // Exposed setter
        openLoginModal,
        closeLoginModal,

        signUpModal,
        setSignUpModal, // Exposed setter
        openSignUp,
        closeSignUp,

        otpModal,
        setOtpModal, // Exposed setter
        openOtpModal,
        closeOtpModal,

        isProfileUpdate1,
        setIsProfileUpdate1, // Exposed setter
        openUpdateProfile1,
        closeUpdateProfile1,

        isProfileUpdate2,
        setIsProfileUpdate2, // Exposed setter
        openUpdateProfile2,
        closeUpdateProfile2,

        isAppointmentOpen,
        setIsAppointmentOpen,

        isPaymentModal,
        setIsPaymentModal,

        isCaseRequest,
        setIsCaseRequest,

        isAppointmentRequest,
        setIsAppointmentRequest,

        isRecommended, 
        setIsRecommended,
        attorney_id,
        setAttorneyId,
        attorneyDetalis,
        setAttornyDetails,

        isSuccessModal,
        setIsSuccessModal,

        isNewCaseModal,
        setIsNewCaseModal,

      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const 
useModal = () => useContext(ModalContext);
