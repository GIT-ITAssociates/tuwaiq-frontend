// "use client";
// import { useEffect, useState } from "react";
// import { Drawer, message, Space, Select } from "antd";
// import { IoMdMenu } from "react-icons/io";
// import { MdOutlineDashboard } from "react-icons/md";
// import { IoInformationCircleOutline, IoSettingsOutline } from "react-icons/io5";
// import { HiOutlineLogout } from "react-icons/hi";
// import { GiClawHammer } from "react-icons/gi";
// import { TbMessage } from "react-icons/tb";
// import { LuCalendarClock, LuCalendarDays } from "react-icons/lu";
// import { RiUserSearchLine } from "react-icons/ri";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useModal } from "@/app/context/modalContext";
// import UserDashboardSkeleton from "@/app/components/skeleton/userDashboardSkeleton";
// import AppointmentRequest from "./dashboard/modal/appointmentRequest";
// import NewCaseRequest from "./dashboard/modal/newCaseRequest";
// import { useUser } from "@/app/context/userContext";
// import { useI18n } from "@/app/providers/i18n";
// import { getProfile } from "@/app/helpers/backend";
// import { useFetch } from "@/app/helpers/hooks";
// import { GoLaw } from "react-icons/go";
// import { io } from "socket.io-client";
// import SuccessModal from "../user/attorney/modal/successModal";
// import { FaFileShield } from "react-icons/fa6";


// const AttorneyDashboardLayout = ({ children }) => {
//   const { user } = useUser();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [open, setOpen] = useState(false);
//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
//   const showDrawer = () => setOpen(true);
//   const onClose = () => setOpen(false);
//   const i18n = useI18n();


//   // LANGUAGE
//   const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);
//   const langFromLocalStorage =
//     typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;


//   useEffect(() => {
//     getProfile().then(({ error, data, msg }) => {
//       if (error) {
//         message.error("Please login as attorney");
//         router.push("/");
//       } else {
//         if (data?.role === "attorney") {
//           getUserdata();
//         } else {
//           router.push("/");
//           message.error("Please login as attorney");
//           getUserdata();
//           setLoginModalOpen(true);
//         }
//       }
//     });
//   }, []);
//   const {
//     isCaseRequest,
//     setIsCaseRequest,
//     isAppointmentRequest,
//     setIsAppointmentRequest,
//     setIsSuccessModal,
//     isSuccessModal
//   } = useModal();
//   const router = useRouter();
//   const [userdata, getUserdata, { loading: userLoading }] = useFetch(getProfile);

//   const menuItems = [
//     {
//       id: 1,
//       name: "Dashboard",
//       href: "/attorney/dashboard",
//       icon: <MdOutlineDashboard />,
//     },
//     {
//       id: 2,
//       name: "My Cases",
//       href: "/attorney/cases",
//       icon: <FaFileShield />,
//     },

//     {
//       id: 4,
//       name: "Booking",
//       href: "/attorney/booking",
//       icon: <LuCalendarDays />,
//     },
//     {
//       id: 5,
//       name: "Availability",
//       href: "/attorney/availablity",
//       icon: <LuCalendarClock />,
//     },
//     {
//       id: 6,
//       name: "Client's",
//       href: "/attorney/client",
//       icon: <RiUserSearchLine />,
//     },
//     {
//       id: 7,
//       name: "Message",
//       href: "/attorney/message",
//       icon: <TbMessage />
//     },

//     {
//       id: 8,
//       name: "Settings",
//       href: "/attorney/setting",
//       icon: <IoSettingsOutline />,
//     },
//   ];




//   // const [socketdata, setSocketData] = useState({});

//   // useEffect(() => {
//   //   const socket = io(process.env.socket_url);

//   //   socket.on("case", (data) => {
//   //     setSocketData(data);
//   //     console.log("Received case from server:", data);
//   //   });

//   //   // Cleanup when component unmounts
//   //   return () => {
//   //     socket.disconnect();
//   //   };
//   // }, []);

//   // useEffect(() => {
//   //   if ((Object.keys(socketdata).length > 0) && (socketdata?.from ==="user")) {
//   //     setIsSuccessModal(true);
//   //   }
//   // }, [socketdata]);



//   // // appointments-status

//   // console.log("socketdata", socketdata);

//   return (userdata?.role !== "attorney") ? (
//     <UserDashboardSkeleton open={open} showDrawer={showDrawer} onClose={onClose} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//   ) : (
//     <section className="bg-white">
//       <div className="custom-container lg:pt-[150px] pt-[150px] lg:pb-[150px] pb-[100px]">
//         <div className="flex items-end justify-between mb-[56px]">
//           <div className="">
//             <h2 className="font-sans font-medium text-[24px] leading-[28.15px] pb-[24px]">
//               {i18n?.t('Good Morning')},
//               <span className="sm:text-[38px] text-[28px] ms-1 leading-[44.57px] break-all">
//                 {user?.name}
//               </span>
//             </h2>
//             <p className="text-base font-normal font-sans text-textColor md:w-[353px] w-[250px]">
//               {i18n?.t("Here's a quick overview of your performance. Let's make today another successful day!")}
//             </p>
//           </div>


//           <div>
//             <p className="mb-[10px] brightness-50">{i18n?.t("Language")}</p>
//             <div className="relative flex ">
//               <div className="p-2 rounded-lg font-medium whitespace-nowrap w-[144px] lg:text-lg text-base flex items-center justify-center  text-black border bg-white">
//                 <Image
//                   width={20}
//                   height={20}
//                   src={"/images/footer-circle.png"}
//                   className="h-[20px] w-[20px]"
//                   alt=""
//                 />
//                 <div className="languagehere cursor-pointer static z-50">
//                   <Select
//                     defaultValue="en"
//                     variant="border"
//                     className="text-[#242628] text-xl !font-bold"
//                     value={
//                       langFromLocalStorage
//                         ? i18n?.languages?.find(
//                           (lang) => lang?._id === langFromLocalStorage
//                         )?.name
//                         : i18n?.languages?.find((lang) => lang?.default)?.name
//                     }
//                     onChange={(value) => {
//                       i18n?.changeLanguage(value);
//                     }}
//                     options={i18n?.languages?.map((lang) => ({
//                       value: lang?._id,
//                       label: lang?.name,
//                     }))}
//                   // suffixIcon={<FaChevronDown className="text-textMain" />}
//                   />
//                 </div>
//               </div>
//               {/* dropdown */}

//             </div>
//           </div>
//           <Space className="lg:hidden block">
//             <IoMdMenu className="text-[40px] cursor-pointer" onClick={showDrawer} />
//           </Space>

//           <Drawer
//             placement={"right"}
//             closable={false}
//             onClose={onClose}
//             open={open}
//           >
//             <SidebarContent menuItems={menuItems} />
//           </Drawer>
//         </div>
//         <div className="w-full flex lg:flex-row flex-col gap-6">
//           <div className="hidden lg:block lg:w-1/4 w-full border  rounded-[20px] pb-[113px] shadow-md overflow-hidden">
//             <SidebarContent
//               menuItems={menuItems}
//               setIsCaseRequest={setIsCaseRequest}
//               setIsAppointmentRequest={setIsAppointmentRequest}
//             />
//           </div>

//           {isSidebarOpen && (
//             <div
//               className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
//               onClick={toggleSidebar}
//             ></div>
//           )}

//           <div className="lg:w-3/4 w-full shadow-md rounded-[20px] border  ">
//             {children}
//           </div>
//         </div>
//       </div>
//       {/* {isSuccessModal && <SuccessModal socketdata={socketdata} />} */}

//       {/* {isCaseRequest && <NewCaseRequest />}
//       {isAppointmentRequest && <AppointmentRequest />} */}
//     </section>
//   );
// };

// const SidebarContent = ({
//   menuItems,
//   setIsCaseRequest,
//   setIsAppointmentRequest,


// }) => {
//   const pathname = usePathname();
//   const { user, getUserdata, setUser, userLoading } = useUser();
//   const router = useRouter();
//   const i18n = useI18n();
//   return (
//     <div className="">
//       <div className="bg-[#EDEDED]">
//         <div className="flex justify-start ps-4 items-center gap-[10px] py-[34px]">
//           <div className={`${user?.image && "border"}rounded-full   border-black`}>
//             <Image
//               width={48}
//               height={48}
//               className="rounded-full w-[48px] h-[48px] object-cover"
//               src={user?.image || '/images/defaultimg.jpg'}
//               alt="profile"
//             />
//           </div>
//           <div>
//             <h3 className="font-medium mb-[2px]">{user?.name}</h3>
//             <p className="text-gray-500 text-sm">{user?.email}</p>
//           </div>
//         </div>
//       </div>
//       <div className="pt-[40px]  mx-auto px-4 w-[242px]">
//         <nav className="space-y-[27px]">
//           {menuItems?.map((item, index) => (
//             <Link
//               key={index}
//               href={item?.href}
//               className={`flex items-center !w-fit gap-[15px] ${pathname === item.href ? "text-[#B68C5A]" : "text-[#242628]"
//                 }`}
//             >
//               <span className="text-[24px]">{item.icon}</span>
//               <span className="sidebar-title">{i18n?.t(item?.name)}</span>
//             </Link>
//           ))}
//           <div className="pt-[50px] space-y-[27px]">
//             <Link
//               href="/attorney/help"
//               className={`flex items-center gap-[15px] 
//              ${pathname === "/attorney/help"
//                   ? "text-[#B68C5A]"
//                   : "text-[#242628]"
//                 }
//             `}
//             >
//               <div className="flex items-center gap-[15px]">
//                 <span
//                   className="text-[24px]"
//                   onClick={() => {
//                     setIsAppointmentRequest(true);
//                   }}
//                 >
//                   <IoInformationCircleOutline />
//                 </span>
//                 <span className="sidebar-title">{i18n?.t("Help & Info")}</span>
//               </div>
//             </Link>
//             <a
//               href="#"
//               className="flex gap-[15px] items-center"
//               onClick={() => {
//                 localStorage.removeItem("token");
//                 message.success("Sign out successfully");
//                 router.push("/auth/login");
//                 setUser({});
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

// export default AttorneyDashboardLayout;






"use client";
import { useEffect, useState } from "react";
import { Drawer, message, Space, Select } from "antd";
import { IoMdMenu } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { IoInformationCircleOutline, IoSettingsOutline } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { GiClawHammer } from "react-icons/gi";
import { TbMessage } from "react-icons/tb";
import { LuCalendarClock, LuCalendarDays } from "react-icons/lu";
import { RiUserSearchLine } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useModal } from "@/app/context/modalContext";
import UserDashboardSkeleton from "@/app/components/skeleton/userDashboardSkeleton";
import AppointmentRequest from "./dashboard/modal/appointmentRequest";
import NewCaseRequest from "./dashboard/modal/newCaseRequest";
import { useUser } from "@/app/context/userContext";
import { useI18n } from "@/app/providers/i18n";
import { getProfile } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { GoLaw } from "react-icons/go";
import { io } from "socket.io-client";
import SuccessModal from "../user/attorney/modal/successModal";
import { FaFileShield } from "react-icons/fa6";


const AttorneyDashboardLayout = ({ children }) => {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const i18n = useI18n();


  // LANGUAGE
  const defaultLang = i18n?.languages?.find((lang) => localStorage.getItem("lang") === lang?._id) || i18n?.languages?.find((lang) => lang?.default);
  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;


  useEffect(() => {
    getProfile().then(({ error, data, msg }) => {
      if (error) {
        message.error("Please login as attorney");
        router.push("/");
      } else {
        if (data?.role === "attorney") {
          getUserdata();
        } else {
          router.push("/");
          message.error("Please login as attorney");
          getUserdata();
          setLoginModalOpen(true);
        }
      }
    });
  }, []);
  const {
    isCaseRequest,
    setIsCaseRequest,
    isAppointmentRequest,
    setIsAppointmentRequest,
    setIsSuccessModal,
    isSuccessModal
  } = useModal();
  const router = useRouter();
  const [userdata, getUserdata, { loading: userLoading }] = useFetch(getProfile);

  const menuItems = [
    {
      id: 1,
      name: "Dashboard",
      href: "/attorney/dashboard",
      icon: <MdOutlineDashboard />,
    },
    {
      id: 2,
      name: "My Cases",
      href: "/attorney/cases",
      icon: <FaFileShield />,
    },

    // {
    //   id: 4,
    //   name: "Booking",
    //   href: "/attorney/booking",
    //   icon: <LuCalendarDays />,
    // },
    {
      id: 5,
      name: "Client's",
      href: "/attorney/client",
      icon: <RiUserSearchLine />,
    },
    {
      id: 6,
      name: "Message",
      href: "/attorney/message",
      icon: <TbMessage />
    },

    {
      id: 7,
      name: "Settings",
      href: "/attorney/setting",
      icon: <IoSettingsOutline />,
    },
  ];

  return (userdata?.role !== "attorney") ? (
    <UserDashboardSkeleton open={open} showDrawer={showDrawer} onClose={onClose} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
        <div className="absolute top-6 left-6 z-10 mb-4 w-[140px] h-[60px]">
          <Image
            src="/images/logo.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 custom-container flex items-end pb-4">
          <div className="w-full flex items-end justify-between">
            <div className="text-white">
              <h2 className="font-sans font-medium text-[24px] leading-[28.15px] pb-[24px]">
                {i18n?.t('Good Morning')},
                <span className="sm:text-[38px] text-[28px] ms-1 leading-[44.57px] break-all">
                  {user?.name}
                </span>
              </h2>
              <p className="text-base font-normal font-sans md:w-[353px] w-[250px]">
                {i18n?.t("Here's a quick overview of your performance. Let's make today another successful day!")}
              </p>
            </div>

            <div className="text-white">
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
        </div>
      </div>

      <div className="custom-container lg:lg:pb-[150px] pb-[100px]">
        <Space className="lg:hidden block mt-4">
          <IoMdMenu className="text-[40px] cursor-pointer" onClick={showDrawer} />
        </Space>

        <Drawer
          placement={"right"}
          closable={false}
          onClose={onClose}
          open={open}
        >
          <SidebarContent menuItems={menuItems} />
        </Drawer>

        <div className="w-full flex lg:flex-row flex-col gap-6 mt-6">
          <div className="hidden lg:block lg:w-1/4 w-full border rounded-[20px] pb-[113px] shadow-md overflow-hidden">
            <SidebarContent
              menuItems={menuItems}
              setIsCaseRequest={setIsCaseRequest}
              setIsAppointmentRequest={setIsAppointmentRequest}
            />
          </div>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
              onClick={toggleSidebar}
            ></div>
          )}

          <div className="lg:w-3/4 w-full shadow-md rounded-[20px] border">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

const SidebarContent = ({
  menuItems,
  setIsCaseRequest,
  setIsAppointmentRequest,
}) => {
  const pathname = usePathname();
  const { user, getUserdata, setUser, userLoading } = useUser();
  const router = useRouter();
  const i18n = useI18n();
  return (
    <div className="">
      <div className="bg-[#EDEDED]">
        <div className="flex justify-start ps-4 items-center gap-[10px] py-[34px]">
          <div className={`${user?.image && "border"}rounded-full border-black`}>
            <Image
              width={48}
              height={48}
              className="rounded-full w-[48px] h-[48px] object-cover"
              src={user?.image || '/images/defaultimg.jpg'}
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
        <nav className="space-y-[27px]">
          {menuItems?.map((item, index) => (
            <Link
              key={index}
              href={item?.href}
              className={`flex items-center !w-fit gap-[15px] ${pathname === item.href ? "text-[#B68C5A]" : "text-[#242628]"
                }`}
            >
              <span className="text-[24px]">{item.icon}</span>
              <span className="sidebar-title">{i18n?.t(item?.name)}</span>
            </Link>
          ))}
          <div className="pt-[50px] space-y-[27px]">
            <Link
              href="/attorney/help"
              className={`flex items-center gap-[15px] 
             ${pathname === "/attorney/help"
                  ? "text-[#B68C5A]"
                  : "text-[#242628]"
                }
            `}
            >
              <div className="flex items-center gap-[15px]">
                <span
                  className="text-[24px]"
                  onClick={() => {
                    setIsAppointmentRequest(true);
                  }}
                >
                  <IoInformationCircleOutline />
                </span>
                <span className="sidebar-title">{i18n?.t("Help & Info")}</span>
              </div>
            </Link>
            <a
              href="#"
              className="flex gap-[15px] items-center"
              onClick={() => {
                localStorage.removeItem("token");
                message.success("Sign out successfully");
                router.push("/auth/login");
                setUser({});
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

export default AttorneyDashboardLayout;