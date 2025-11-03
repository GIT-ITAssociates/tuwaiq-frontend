"use client";
import { FaRegChartBar } from "react-icons/fa6";
import { useState } from "react";
import { Avatar, Badge, Drawer, Dropdown, message } from "antd";
import { FaAngleDown, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { TfiCommentAlt } from "react-icons/tfi";
import { RxDashboard } from "react-icons/rx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useModal } from "@/app/context/modalContext";
import SignUp from "../modal/signup";
import Login from "../modal/login";
import OtpModal from "../modal/otpmodal";
import Button from "../common/button";
import UpdateProfile2 from "../modal/updateProfile2";
import UpdateProfile1 from "../modal/updateProfile1";
import Image from "next/image";
import { useUser } from "@/app/context/userContext";
import { useI18n } from "@/app/providers/i18n";
import { IoClose } from "react-icons/io5";
import { useFetch } from "@/app/helpers/hooks";
import { userListMessaged } from "@/app/helpers/backend";

const Navbar = () => {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const { user, getUserdata, setUser, userLoading, settings, } = useUser();
  const [userCount] = useFetch(userListMessaged)
  const { push } = useRouter();
  const i18n = useI18n();

  const {
    isLoginModalOpen,
    openLoginModal,
    signUpModal,
    otpModal,
    isProfileUpdate1,
    isProfileUpdate2,
  } = useModal();


  const dropdownContent2 = (
    <div className="absolute right-0 z-40  mt-2 transition-all duration-300 bg-white  shadow-lg ring-1 ring-black ring-opacity-5 w-[150px]">
      <div className="">

        <Link
          href={(user && user?.role === "user") ? '/user/dashboard' : (user && user?.role === 'admin') ? '/admin' : '/attorney/dashboard'}
          className={`block ${pathname ===
            ("/user/dashboard" || "/attorney/dashboard" || "/admin")
            ? "bg-primary text-white"
            : ""
            } px-4 py-2 text-lg text-textColor transition duration-200  hover:bg-primary  hover:text-white`}
        >
          <div className="flex items-center gap-2 work-font">
            <RxDashboard />
            <span>{i18n?.t("Dashboard")}</span>
          </div>
        </Link>

        <div
          onClick={() => {
            localStorage.removeItem("token");
            message.success("Sign out successfully");
            getUserdata();
            setUser({});
            push("/auth/login");
          }}
          className="block px-4 py-2 text-lg text-textColor transition duration-200  cursor-pointer hover:bg-primary hover:text-white"
        >
          <div className="flex items-center gap-2 !work-font">
            <FiLogOut />
            <span>{i18n?.t("Logout")}</span>
          </div>
        </div>
      </div>
    </div>
  );
  const dropdownContent = (
    <div className="bg-white relative z-40 flex flex-col items-start w-[150px] h-fit shadow-xl ">
      <Link
        href="/blog"
        className={`${pathname === "/blog"
          ? "bg-primary text-white"
          : "bg-white text-textColor"
          } hover:bg-primary hover:text-white text-lg  ps-[20px] block py-[10px] w-full`}
      >
        {i18n?.t("Blog")}
      </Link>
      <Link
        href="/team"
        className={`${pathname === "/team"
          ? "bg-primary text-white"
          : "bg-white text-textColor"
          } hover:bg-primary hover:text-white text-lg  ps-[20px] block py-[10px] w-full`}
      >
        {i18n?.t("Team")}
      </Link>

      <Link
        href="/faq"
        className={`${pathname === "/faq"
          ? "bg-primary text-white"
          : "bg-white text-textColor"
          } hover:bg-primary hover:text-white text-lg  ps-[20px] block py-[10px] w-full`}
      >
        {i18n?.t("Faq")}
      </Link>

    </div>
  );
  return (
    <header
      className={`w-full absolute bg-transparent  ${pathname.match(/user|attorney|admin/gi)
        ? "text-textColor border-[#EDEDED]"
        : "text-white border-b-[#EDAAAA33]"
        } z-20 lg:pt-[30px] lg:pb-[27.66px] pb-[12px] pt-[15px] border-b`}
      id="navbar"
    >
      <nav className="flex justify-between items-center custom-container relative">
        {
          userLoading ? (
            <div className="w-[40px] h-[40px] bg-gray-300 rounded-full animate-pulse"></div>
          ) : (

            <Link href="/">
              <Image
                width={56}
                height={62}
                className="xl:w-[56px] xl:h-[62px] md:w-[45px] md:h-[49px] w-[29px] h-[32px]"
                src={settings?.logo}
                alt="logo"
              />
            </Link>
          )
        }
        <div className={` items-center gap-[100px] flex`}>
          <div
            className="hidden lg:block"
          >
            <div
              className={`flex gap-9 text-lg font-medium transition-all  w-full items-center`}
            >
              <ul className="flex items-center gap-8">
                <div>
                  <Link href={`/`}>
                    <li
                      className={`hover:text-primary ${pathname === "/" ? "text-primary" : ""
                        }`}
                    >
                      {i18n?.t("Home")}
                    </li>
                  </Link>
                </div>
                <div>
                  <Link href={`/about`}>
                    <li
                      className={`hover:text-primary ${pathname === "/about" ? "text-primary" : ""
                        }`}
                    >
                      {i18n?.t("About")}
                    </li>
                  </Link>
                </div>
                <div>
                  <Link href={`/service`}>
                    <li
                      className={`hover:text-primary ${pathname === "/service" ? "text-primary" : ""
                        }`}
                    >
                      {i18n?.t("Service")}
                    </li>
                  </Link>
                </div>
                <div>
                  <Link href={`/caseStudy`}>
                    <li
                      className={`hover:text-primary ${pathname === "/caseStudy" ? "text-primary" : ""
                        }`}
                    >
                      {i18n?.t("Case Study")}
                    </li>
                  </Link>
                </div>
                <Link href={`/contact`}>
                  <li
                    className={`hover:text-primary cursor-pointer ${pathname === "/contact" ? "text-primary" : ""
                      }`}
                  >
                    {i18n?.t("Contact Us")}
                  </li>
                </Link>
                <li className={`hover:text-primary cursor-pointer`}>
                  <Dropdown overlay={dropdownContent} trigger={["hover"]}>
                    <span
                      onClick={(e) => e.preventDefault()}
                      className="flex items-center gap-2"
                    >
                      {i18n?.t("Pages")}
                      <FaAngleDown className="text-sm" />
                    </span>
                  </Dropdown>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {userLoading ? (
              <div className="flex gap-[20px] items-center">
                <div className="w-[80px] h-[20px] bg-gray-300 rounded-md animate-pulse"></div>
                <div className="w-[20px] h-[20px] bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-[20px] h-[20px] bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-[40px] h-[40px] bg-gray-300 rounded-full animate-pulse"></div>
              </div>
            ) : (user?._id || user?.id) ? (
              <div className="flex gap-[20px] items-center">
                <Badge
                  color='#E67529'
                  count={userCount?.[0]?.unseenCount ? userCount?.[0]?.unseenCount : 0}
                  onClick={() => { user?.role === "user" && push('/user/message') || user?.role === "attorney" && push('/attorney/message') || user?.role === "admin" && push('/admin/message') }}
                  className="cursor-pointer"
                >
                  <TfiCommentAlt
                    className={`text-[18px] cursor-pointer ${pathname.match(/user|attorney|admin/gi)
                      ? "text-textColor"
                      : "text-white"
                      }`}
                  />
                </Badge>

                <div className="relative dropdown-container">
                  <Dropdown overlay={dropdownContent2} trigger={["hover"]}>
                    <div className="cursor-pointer">
                      {user?.image ? (
                        <Image height={45} width={45}
                          src={user?.image || '/images/defaultimg.jpg'}
                          alt="User"
                          className="object-cover w-[45px] h-[45px] rounded-full"
                        />
                      ) : (
                        <Avatar
                          name={user?.name}
                          className="w-[40px] h-[40px]"
                          bgColor="bg-secondary"
                          icon={<FaUser className="text-[20px]" />}
                        />
                      )}
                    </div>
                  </Dropdown>
                </div>
              </div>
            ) : (
              // <Button onClick={openLoginModal}>{i18n?.t("Login/Signup")}</Button>
              <Button onClick={() => push("/auth/login")}>{i18n?.t("Login/Signup")}</Button>


            )}
            <div className="relative">
              <div
                onClick={() => setActive((prev) => !prev)}
                className="block lg:hidden toggle-icon cursor-pointer"
              >
                <FaRegChartBar className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        {active && (
          <Drawer
            title={i18n?.t("Menu")}
            placement="left"
            onClose={() => setActive(false)}
            open={active}
            bodyStyle={{ backgroundColor: "#3F4069", color: "white" }}
          >
            <ul className="flex flex-col items-start gap-8 p-8">
              <div
                className=" flex justify-end items-end w-full"
              >
                <div className=" rounded-full border" onClick={() => setActive(false)}>
                  <IoClose className="text-[20px]" />
                </div>
              </div>
              <div>
                <Link href={`/`}>
                  <li
                    className={`hover:text-primary  ${pathname === "/" ? "text-primary" : ""}`}
                  >
                    {i18n?.t("Home")}
                  </li>
                </Link>
              </div>
              <div>
                <Link href={`/about`}>
                  <li
                    className={`hover:text-primary  ${pathname === "/about" ? "text-primary" : ""}`}
                  >
                    {i18n?.t("About")}
                  </li>
                </Link>
              </div>
              <div>
                <Link href={`/service`}>
                  <li
                    className={`hover:text-primary  ${pathname === "/service" ? "text-primary" : ""}`}
                  >
                    {i18n?.t("Service")}
                  </li>
                </Link>
              </div>
              <li
                className={`hover:text-primary  ${pathname === "/caseStudy" ? "text-primary" : ""}`}
              >
                {i18n?.t("Case Study")}
              </li>
              <li
                className={`hover:text-primary  cursor-pointer ${pathname === "/contact" ? "text-primary" : ""}`}
              >
                {i18n?.t("Contact Us")}
              </li>
              <li className={`hover:text-primary cursor-pointer`}>
                <Dropdown overlay={dropdownContent} trigger={["hover"]}>
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-2"
                  >
                    {i18n?.t("Pages")}
                    <FaAngleDown className="text-sm" />
                  </a>
                </Dropdown>
              </li>
            </ul>
          </Drawer>
        )}
      </nav>

      {signUpModal && <SignUp />}
      {isLoginModalOpen && <Login />}
      {otpModal && <OtpModal />}
      {isProfileUpdate1 && <UpdateProfile1 />}
      {isProfileUpdate2 && <UpdateProfile2 />}
    </header>
  );
};

export default Navbar;
