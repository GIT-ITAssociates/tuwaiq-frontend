// "use client";
// import { useEffect, useState } from "react";
// import { Drawer, message, Space, Select } from "antd";
// import { IoMdMenu } from "react-icons/io";
// import { MdOutlineDashboard } from "react-icons/md";
// import { IoSettingsOutline } from "react-icons/io5";
// import { IoIosInformationCircleOutline } from "react-icons/io";
// import { HiOutlineLogout } from "react-icons/hi";
// import { GiClawHammer } from "react-icons/gi";
// import { TbMessage } from "react-icons/tb";
// import { LuCalendarClock } from "react-icons/lu";
// import { VscFiles } from "react-icons/vsc";
// import { FaUserTie } from "react-icons/fa6";
// import UserDashboardSkeleton from "@/app/components/skeleton/userDashboardSkeleton";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import Appointment from "./attorney/appointment";
// import { useUser } from "@/app/context/userContext";
// import { getProfile } from "@/app/helpers/backend";
// import { useModal } from "@/app/context/modalContext";
// import { useI18n } from "@/app/providers/i18n";
// import { io } from "socket.io-client";
// import RecommendAttorney from "./attorney/modal/recommendedModal";
// import SuccessModal from "./attorney/modal/successModal";
// import { FaFileShield } from "react-icons/fa6";

// const UserDashboardLayout = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [socketdata, setSocketData] = useState({});
//   const [appointmentData, setAppointmentData] = useState({});
//   const router = useRouter();

//   const { user, getUserdata, setUser } = useUser();
//   const {
//     setLoginModalOpen,
//     isRecommended,
//     setIsRecommended,
//     isSuccessModal,
//     setIsSuccessModal,
//   } = useModal();
//   const i18n = useI18n();

//   // LANGUAGE
//   const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);
//   const langFromLocalStorage =
//     typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;

//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
//   const showDrawer = () => setOpen(true);
//   const onClose = () => setOpen(false);

//   useEffect(() => {
//     getProfile().then(({ error, data }) => {
//       if (error || data?.role !== "user") {
//         message.error("Please login as user");
//         router.push("/");
//         setLoginModalOpen(true);
//         return;
//       }
//       getUserdata();
//     });
//   }, []);

//   useEffect(() => {
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("token") : null;

//     if (!token) return;

//     const socket = io(process.env.socket_url, {
//       auth: {
//         token
//       },
//     });

//     socket.on("connect", () => {
//     });

//     socket.on("create-case", (data) => {
//       setSocketData(data);
//     });

//     socket.on("case", (data) => {
//       setAppointmentData(data);
//     });

//     socket.on("connect_error", (err) => {
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if ((Object.keys(socketdata).length > 0) && (Object.keys(appointmentData).length > 0)) {
//       setIsRecommended(false);
//       setIsSuccessModal(true);
//     }
//   }, [socketdata, appointmentData]);

//   useEffect(() => {
//     if (Object.keys(appointmentData).length > 0) {
//       setIsRecommended(true);
//       setIsSuccessModal(false);
//     }
//   }, [appointmentData]);

//   const menuItems = [
//     {
//       id: 1,
//       name: "Dashboard",
//       href: "/user/dashboard",
//       icon: <MdOutlineDashboard />,
//     },
//     { id: 2, name: "Attorney", href: "/user/attorney", icon: <FaUserTie /> },
//     {
//       id: 3,
//       name: "My Cases",
//       href: "/user/cases",
//       icon: <FaFileShield />,
//     },
//     {
//       id: 4,
//       name: "Appointments",
//       href: "/user/appointment",
//       icon: <LuCalendarClock />,
//     },
//     { id: 5, name: "Files", href: "/user/files", icon: <VscFiles /> },
//     { id: 6, name: "Message", href: "/user/message", icon: <TbMessage /> },
//     {
//       id: 7,
//       name: "Settings",
//       href: "/user/setting",
//       icon: <IoSettingsOutline />,
//     },
//   ];

//   return (
//     <>
//       {!user ? (
//         <UserDashboardSkeleton />
//       ) : (
//         <section className="bg-white">
//           <div className="custom-container lg:pt-[50px] pt-[150px] lg:pb-[150px] pb-[100px]">

//             <div className="mb-4 flex justify-end w-full">
//               <div>
//                 <p className="mb-4 brightness-50">{i18n?.t("Language")}</p>
//                 <div className="relative flex">
//                   <div className="p-2 rounded-lg font-medium whitespace-nowrap w-[144px] lg:text-lg text-base flex items-center justify-center text-black border bg-white">
//                     <Image
//                       width={20}
//                       height={20}
//                       src={"/images/footer-circle.png"}
//                       className="h-[20px] w-[20px]"
//                       alt=""
//                     />
//                     <div className="languagehere cursor-pointer static z-50">
//                       <Select
//                         defaultValue="en"
//                         variant="border"
//                         className="text-[#242628] text-xl !font-bold"
//                         value={
//                           langFromLocalStorage
//                             ? i18n?.languages?.find(
//                               (lang) => lang?._id === langFromLocalStorage
//                             )?.name
//                             : i18n?.languages?.find((lang) => lang?.default)?.name
//                         }
//                         onChange={(value) => {
//                           i18n?.changeLanguage(value);
//                         }}
//                         options={i18n?.languages?.map((lang) => ({
//                           value: lang?._id,
//                           label: lang?.name,
//                         }))}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>


//             <div className="w-full flex lg:flex-row flex-col gap-6">



//               {/* Mobile Drawer */}
//               <div className="block lg:hidden">
//                 <Space>
//                   <IoMdMenu
//                     className="text-[40px] cursor-pointer"
//                     onClick={showDrawer}
//                   />
//                 </Space>
//                 <Drawer
//                   placement="left"
//                   closable={false}
//                   onClose={onClose}
//                   open={open}
//                 >
//                   <SidebarContent menuItems={menuItems} />
//                 </Drawer>
//               </div>

//               {/* Sidebar */}
//               <div className="hidden lg:block lg:w-1/4 w-full border rounded-[20px] pb-[113px] shadow-md overflow-hidden">
//                 <SidebarContent menuItems={menuItems} />
//               </div>

//               {/* Overlay for mobile */}
//               {isSidebarOpen && (
//                 <div
//                   className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
//                   onClick={toggleSidebar}
//                 ></div>
//               )}

//               {/* Main content */}
//               <div className="lg:w-3/4 w-full shadow-md rounded-[20px] border overflow-hidden">
//                 {children}
//               </div>
//             </div>
//           </div>
//           <Appointment />
//         </section>
//       )}

//       {isRecommended && <RecommendAttorney />}
//       {isSuccessModal && <SuccessModal socketdata={socketdata} />}
//     </>
//   );
// };

// const SidebarContent = ({ menuItems }) => {
//   const pathname = usePathname();
//   const { user, setUser, getUserdata } = useUser();
//   const i18n = useI18n();
//   const router = useRouter();

//   return (
//     <div>
//       <div className="bg-[#EDEDED]">
//         <div className="flex justify-start ps-4 items-center gap-[10px] py-[34px]">
//           <div className="rounded-full p-[3px] border border-black">
//             <Image
//               width={48}
//               height={48}
//               className="rounded-full w-[48px] h-[48px] object-cover"
//               src={user?.image || "/images/defaultimg.jpg"}
//               alt="profile"
//             />
//           </div>
//           <div>
//             <h3 className="font-medium mb-[2px]">{user?.name}</h3>
//             <p className="text-gray-500 text-sm">{user?.email}</p>
//           </div>
//         </div>
//       </div>

//       <div className="pt-[40px] mx-auto px-4 w-[242px]">
//         <nav className="space-y-[27px] w-fit">
//           {menuItems.map((item) => (
//             <Link
//               key={item.id}
//               href={item.href}
//               className={`flex items-center !w-fit gap-[15px] ${pathname.startsWith(item?.href)
//                 ? "text-primary"
//                 : "!text-[#242628]"
//                 }`}
//             >
//               <span className="text-[24px]">{item?.icon}</span>
//               <span className="sidebar-title">
//                 {i18n?.t(item?.name) ?? item.name}
//               </span>
//             </Link>
//           ))}

//           <div className="pt-[50px] space-y-[27px]">
//             <Link
//               href="/user/help"
//               className={`flex items-center gap-[15px] ${pathname === "/user/help" ? "text-[#B68C5A]" : "text-[#242628]"
//                 }`}
//             >
//               <span className="text-[24px]">
//                 <IoIosInformationCircleOutline />
//               </span>
//               <span className="sidebar-title">{i18n?.t("Help & Info")}</span>
//             </Link>
//             <a
//               className="flex items-center gap-[15px] cursor-pointer"
//               onClick={() => {
//                 localStorage.removeItem("token");
//                 message.success("Sign out successfully");
//                 setUser({});
//                 router.push("/auth/login");
//                 getUserdata();
//               }}
//             >
//               <HiOutlineLogout className="h-6 w-6 hover:text-[#B68C5A] text-[#242628]" />
//               <span className="sidebar-title">{i18n?.t("Logout")}</span>
//             </a>
//           </div>
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default UserDashboardLayout;



"use client";
import { useEffect, useState } from "react";
import { Drawer, message, Space, Select } from "antd";
import { IoMdMenu } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { HiOutlineLogout } from "react-icons/hi";
import { GiClawHammer } from "react-icons/gi";
import { TbMessage } from "react-icons/tb";
import { LuCalendarClock } from "react-icons/lu";
import { VscFiles } from "react-icons/vsc";
import { FaUserTie } from "react-icons/fa6";
import UserDashboardSkeleton from "@/app/components/skeleton/userDashboardSkeleton";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Appointment from "./attorney/appointment";
import { useUser } from "@/app/context/userContext";
import { getProfile } from "@/app/helpers/backend";
import { useModal } from "@/app/context/modalContext";
import { useI18n } from "@/app/providers/i18n";
import { io } from "socket.io-client";
import RecommendAttorney from "./attorney/modal/recommendedModal";
import SuccessModal from "./attorney/modal/successModal";
import { FaFileShield } from "react-icons/fa6";
import CaseDetailsModal from "./attorney/modal/casedetailsModal";

const UserDashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [socketdata, setSocketData] = useState({});
  const [appointmentData, setAppointmentData] = useState({});
  const router = useRouter();



  const { user, getUserdata, setUser } = useUser();
  const {
    setLoginModalOpen,
    isRecommended,
    setIsRecommended,
    isSuccessModal,
    setIsSuccessModal,
    isNewCaseModal,
    setIsNewCaseModal
  } = useModal();
  const i18n = useI18n();

  // LANGUAGE
  const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);
  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
      const currentLanguage =
    i18n?.languages?.find((lang) => lang?._id === langFromLocalStorage)?.name ||
    "English";

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  useEffect(() => {
    getProfile().then(({ error, data }) => {
      if (error || data?.role !== "user") {
        message.error("Please login as user");
        router.push("/");
        setLoginModalOpen(true);
        return;
      }
      getUserdata();
    });
  }, []);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) return;

    const socket = io(process.env.socket_url, {
      auth: {
        token
      },
    });

    socket.on("connect", () => {
    });

    socket.on("create-case", (data) => {
      setSocketData(data);
    });

    socket.on("case", (data) => {
      setAppointmentData(data);
    });

    socket.on("connect_error", (err) => {
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if ((Object.keys(socketdata).length > 0) && (Object.keys(appointmentData).length > 0)) {
      setIsRecommended(false);
      setIsSuccessModal(true);
    }
  }, [socketdata, appointmentData]);

  useEffect(() => {
    if (Object.keys(appointmentData).length > 0) {
      setIsRecommended(true);
      setIsSuccessModal(false);
    }
  }, [appointmentData]);

  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      href: "/user/dashboard",
      icon: <MdOutlineDashboard />,
    },
    { id: 2, name: "Attorney", href: "/user/attorney", icon: <FaUserTie /> },
    {
      id: 3,
      name: "My Cases",
      href: "/user/cases",
      icon: <FaFileShield />,
    },
    {
      id: 4,
      name: "Appointments",
      href: "/user/appointment",
      icon: <LuCalendarClock />,
    },
    // { id: 5, name: "Files", href: "/user/files", icon: <VscFiles /> },
    { id: 6, name: "Message", href: "/user/message", icon: <TbMessage /> },
    {
      id: 7,
      name: "Settings",
      href: "/user/setting",
      icon: <IoSettingsOutline />,
    },
  ];

  return (
    <>
      {!user ? (
        <UserDashboardSkeleton />
      ) : (
        <section className="bg-white">
          {/* Header with background image */}
          <div className="relative w-full h-[200px] lg:h-[250px]">
            <div className="absolute inset-0">
              <Image
                src="/images/dashboard-bg.png"
                alt="Background"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Logo */}
            <div className="absolute top-6 left-6 z-10 mb-4">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={120}
                height={60}
                className="object-contain"
              />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 custom-container flex items-end pb-4 pt-10">
              <div className="w-full flex items-end justify-between">
                <div className="text-white">
                  <h2 className="font-sans font-medium text-[24px] leading-[28.15px] pb-[24px]">
                    {i18n?.t('Good Morning')},
                    <span className="sm:text-[38px] text-[28px] ms-1 leading-[44.57px] break-all">
                      {user?.name}
                    </span>
                  </h2>
                </div>


<div className="text-white flex items-end gap-4">
  {/* Register a Case Button */}
<button
  onClick={() => setIsNewCaseModal(true)}
//   onClick={() =>                 
//     router.push("/user/payments/invoice")
// }
  className="px-6 py-2 rounded-lg font-medium whitespace-nowrap lg:text-lg text-base flex items-center justify-center bg-primary text-white hover:opacity-90 transition"
>
  {currentLanguage === "Arabic"
    ? "تسجيل قضية" // Arabic text for "Register a Case"
    : "Register a Case"}
</button>


  {/* Language Dropdown */}
  <div>
    <p className="mb-[10px]">{i18n?.t("Language")}</p>
    <div className="relative flex">
      <div className="p-2 rounded-lg font-medium whitespace-nowrap w-[144px] lg:text-lg text-base flex items-center justify-center bg-white">
        <Image
          width={20}
          height={20}
          src={"/images/footer-circle.png"}
          className="h-[20px] w-[20px]"
          alt=""
        />
        <div className="languagehere cursor-pointer static z-50">
          <Select
            defaultValue="en"
            variant="borderless"
            className="text-black text-xl !font-bold"
            value={
              langFromLocalStorage
                ? i18n?.languages?.find(
                    (lang) => lang?._id === langFromLocalStorage
                  )?.name
                : i18n?.languages?.find((lang) => lang?.default)?.name
            }
            onChange={(value) => {
              i18n?.changeLanguage(value);
            }}
            options={i18n?.languages?.map((lang) => ({
              value: lang?._id,
              label: lang?.name,
            }))}
          />
        </div>
      </div>
    </div>
  </div>
</div>

                {/* <div className="text-white">
                  <p className="mb-[10px]">{i18n?.t("Language")}</p>
                  <div className="relative flex">
                    <div className="p-2 rounded-lg font-medium whitespace-nowrap w-[144px] lg:text-lg text-base flex items-center justify-center bg-white">
                      <Image
                        width={20}
                        height={20}
                        src={"/images/footer-circle.png"}
                        className="h-[20px] w-[20px]"
                        alt=""
                      />
                      <div className="languagehere cursor-pointer static z-50">
                        <Select
                          defaultValue="en"
                          variant="borderless"
                          className="text-black text-xl !font-bold"
                          value={
                            langFromLocalStorage
                              ? i18n?.languages?.find(
                                (lang) => lang?._id === langFromLocalStorage
                              )?.name
                              : i18n?.languages?.find((lang) => lang?.default)?.name
                          }
                          onChange={(value) => {
                            i18n?.changeLanguage(value);
                          }}
                          options={i18n?.languages?.map((lang) => ({
                            value: lang?._id,
                            label: lang?.name,
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="custom-container lg:pt-[30px] pt-[30px] lg:pb-[150px] pb-[100px]">
            <div className="w-full flex lg:flex-row flex-col gap-6 mt-6">
              {/* Mobile Drawer */}
              <div className="block lg:hidden">
                <Space>
                  <IoMdMenu
                    className="text-[40px] cursor-pointer"
                    onClick={showDrawer}
                  />
                </Space>
                <Drawer
                  placement="left"
                  closable={false}
                  onClose={onClose}
                  open={open}
                >
                  <SidebarContent menuItems={menuItems} />
                </Drawer>
              </div>

              {/* Sidebar */}
              <div className="hidden lg:block lg:w-1/4 w-full border rounded-[20px] pb-[113px] shadow-md overflow-hidden">
                <SidebarContent menuItems={menuItems} />
              </div>

              {/* Overlay for mobile */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
                  onClick={toggleSidebar}
                ></div>
              )}

              {/* Main content */}
              <div className="lg:w-3/4 w-full shadow-md rounded-[20px] border overflow-hidden">
                {children}
              </div>
            </div>
          </div>
          <Appointment />
        </section>
      )}

      {isRecommended && <RecommendAttorney />}
      {isSuccessModal && <SuccessModal socketdata={socketdata} />}
      {isNewCaseModal && (
        <CaseDetailsModal
        // setCaseDetailsValue={setCaseDetailsValue}
          isCaseDetaiOpen={isNewCaseModal}
          setIsCaseDetailsOpen={setIsNewCaseModal}
        //   selectSlot={selectSlot}
        //   selectDate={selectDate}
        //   setIsPaymentModal={setIsPaymentModal}
        //   attorneyDetalis={attorneyDetalis} 
        //   caseDetailsValue={caseDetailsValue}
        //   setIsAppointmentOpen={setIsAppointmentOpen}

        />
      )}
    </>
  );
};

const SidebarContent = ({ menuItems }) => {
  const pathname = usePathname();
  const { user, setUser, getUserdata } = useUser();
  const i18n = useI18n();
  const router = useRouter();

  return (
    <div>
      <div className="bg-[#EDEDED]">
        <div className="flex justify-start ps-4 items-center gap-[10px] py-[34px]">
          <div className="rounded-full p-[3px] border border-black">
            <Image
              width={48}
              height={48}
              className="rounded-full w-[48px] h-[48px] object-cover"
              src={user?.image || "/images/defaultimg.jpg"}
              alt="profile"
            />
          </div>
          <div>
            <h3 className="font-medium mb-[2px]">{user?.name}</h3>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="pt-[40px] mx-auto px-4 w-[242px]">
        <nav className="space-y-[27px] w-fit">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center !w-fit gap-[15px] ${pathname.startsWith(item?.href)
                ? "text-primary"
                : "!text-[#242628]"
                }`}
            >
              <span className="text-[24px]">{item?.icon}</span>
              <span className="sidebar-title">
                {i18n?.t(item?.name) ?? item.name}
              </span>
            </Link>
          ))}

          <div className="pt-[50px] space-y-[27px]">
            <Link
              href="/user/help"
              className={`flex items-center gap-[15px] ${pathname === "/user/help" ? "text-[#B68C5A]" : "text-[#242628]"
                }`}
            >
              <span className="text-[24px]">
                <IoIosInformationCircleOutline />
              </span>
              <span className="sidebar-title">{i18n?.t("Help & Info")}</span>
            </Link>
            <a
              className="flex items-center gap-[15px] cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                message.success("Sign out successfully");
                setUser({});
                router.push("/auth/login");
                getUserdata();
              }}
            >
              <HiOutlineLogout className="h-6 w-6 hover:text-[#B68C5A] text-[#242628]" />
              <span className="sidebar-title">{i18n?.t("Logout")}</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default UserDashboardLayout;