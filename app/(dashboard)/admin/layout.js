"use client";
import { BiCategory } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { message, Skeleton, Badge } from "antd";
import { LuContact } from "react-icons/lu";
import {
  FaRegNewspaper,
  FaServicestack,
  FaUserTie,
  FaBloggerB,
  FaUser,
} from "react-icons/fa";
import { CiShoppingTag } from "react-icons/ci";
import { PiContactlessPaymentFill, PiFilesFill } from "react-icons/pi";
import { FaLanguage, FaQuestion, FaWrench } from "react-icons/fa6";
import {
  MdEmail,
  MdOutlineInsertPageBreak,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sideBar";
import { useUser } from "@/app/context/userContext";
import { getProfile, fetchAdminAllCases } from "@/app/helpers/backend";
import { FiMessageCircle } from "react-icons/fi";
import { useI18n } from "@/app/providers/i18n";
import { AiFillRead } from "react-icons/ai";
import { LiaUsersSolid } from "react-icons/lia";
import { LuCalendarClock, LuCalendarDays } from "react-icons/lu";


const Layout = ({ children }) => {
  const router = useRouter();
  const { user, getUserdata, setUser, settings } = useUser();
  const i18n = useI18n();
  const [pendingCount, setPendingCount] = useState(0);

  // detect language
  const langFromLocalStorage =
    typeof window !== "undefined" ? localStorage.getItem("lang") : null;

  const currentLanguage = i18n?.languages?.find(
    (lang) => lang?._id === langFromLocalStorage
  )?.name;

  // ✅ Fetch count of pending cases
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const { data, error } = await fetchAdminAllCases({ status: "pending" });
        if (!error && data?.docs) {
          setPendingCount(data.docs.length);
        } else {
          setPendingCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch pending cases:", err);
        setPendingCount(0);
      }
    };

    fetchPending();
  }, []);

  // ✅ Build menu (with badge for "New Requests")
  const menu = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <MdOutlineSpaceDashboard />,
      permissions: ["admin", "dashboard"],
    },
    {
  label: (
    <div className="flex items-center justify-between w-full">
      <span>New Requests</span>
      {pendingCount > 0 && (
        <Badge
          count={pendingCount}
          style={{
            backgroundColor: "#1677ff",
            color: "#fff",
            fontSize: "11px",
          }}
          className="ml-3" // ✅ Adds margin-left
        />
      )}
    </div>
  ),
  href: "/admin/case-requests",
  icon: <PiFilesFill />,
  permissions: ["admin", "caseRequests_view"],
},
    {
      label: "Availability",
      href: "/admin/availablity",
      icon: <LuCalendarClock />,
      permissions: ["admin", "availability_view"],
    },
    {
          
          label: "Booking",
          href: "/admin/booking",
          icon: <LuCalendarDays />,
      permissions: ["admin", "booking_view"],
        },
    {
      label: "Case Type",
      href: "/admin/caseType",
      icon: <BiCategory />,
      permissions: ["admin", "caseType_view"],
    },
    {
      label: "Attorney",
      href: "/admin/attorney",
      icon: <FaUserTie />,
      permissions: ["admin", "trainers_view"],
    },
    {
      label: "Clients",
      href: "/admin/clients",
      icon: <LiaUsersSolid />,
      permissions: ["admin", "trainers_view"],
    },
    {
      label: currentLanguage === "Arabic" ? "قضايانا" : "Our Cases",
      href: "/admin/our-cases",
      icon: <PiFilesFill />,
      permissions: ["admin", "cases_overview"],
    },
    {
      label: "Case Study",
      href: "/admin/case-study",
      icon: <AiFillRead />,
      permissions: ["admin", "case_study_view"],
    },
    {
      menu: "payment",
      permissions: ["admin", "payment"],
    },
    {
      label: "Payment Method",
      href: "/admin/payment-method",
      icon: <PiContactlessPaymentFill />,
      permissions: ["admin", "payment_method_view"],
    },
    {
      label: "Payment list",
      href: "/admin/payment-list",
      icon: <GiTakeMyMoney />,
      permissions: ["admin", "payment_list_view"],
    },
    {
      menu: "other",
      permissions: ["admin", "other"],
    },
    {
      label: "Message",
      href: "/admin/message",
      icon: <FiMessageCircle />,
      permissions: ["admin", "message"],
    },
    {
      menu: "Settings",
      permissions: ["admin", "settings"],
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <FaWrench />,
      permissions: ["admin", "site_settings_view"],
    },
    {
      label: "Languages",
      href: "/admin/languages",
      icon: <FaLanguage />,
      permissions: ["admin", "language_view"],
    },
    {
      label: "Faq",
      href: "/admin/faq",
      icon: <FaQuestion />,
      permissions: ["admin", "faq_view"],
    },
  ];

  const { push } = router;
  const { pathname } = router;
  const finalMenu = getMenu(user, push, pathname, menu);

  // ✅ Ensure user is admin
  useEffect(() => {
    getProfile().then(({ error, data }) => {
      if (error) {
        message.error(i18n.t("Please login as admin"));
        router.push("/");
      } else {
        if (data?.role === "admin") {
          getUserdata();
          setUser(data?.user);
        } else {
          getUserdata();
          message.error(i18n.t("Please login as admin"));
          router.push("/");
        }
      }
    });
  }, []);

  if (!user || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          <div className="w-[250px] p-4">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
          <div className="flex-1">
            <div className="p-4 py-12">
              <Skeleton active title={false} paragraph={{ rows: 1 }} />
            </div>
            <div className="p-4">
              <Skeleton active paragraph={{ rows: 10 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user?.role === "admin" && (
        <>
          <Header title={settings?.title} />
          <Sidebar title={settings?.title} menu={finalMenu} />
          <div className="content">
            <div className="p-4">{children}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;

/* ----------------------------- MENU HELPERS ----------------------------- */

const getMenu = (user, push, pathname, menu) => {
  const hasPermission = (menuItem) => {
    if (menuItem.permission && havePermission(menuItem.permission, user?.roles)) {
      return true;
    }
    if (menuItem.permissions) {
      for (let permission of menuItem.permissions) {
        if (havePermission(permission, user?.roles)) {
          return true;
        }
      }
    }
    if (menuItem.permissions) {
      for (let permission of menuItem.permissions) {
        if (roleWisePermission(permission, [user?.role])) {
          return true;
        }
      }
    }
    if (menuItem.permission) {
      if (roleWisePermission("admin", [user?.role])) {
        return true;
      }
    }
    return false;
  };

  return menu
    ?.map((d) => ({ ...d, href: d.href?.replace("[_id]", user?._id) }))
    .filter((menuItem) => {
      if (menuItem?.permission === "any") return true;
      else if (menuItem.permission || menuItem.permissions)
        return hasPermission(menuItem);
      else if (Array.isArray(menuItem.child)) {
        menuItem.child = menuItem.child.filter(() => {});
        return menuItem.child.length > 0;
      }
      return false;
    });
};

export const havePermission = (permission, roles) => {
  for (let role of roles || []) {
    if (role?.permissions?.includes(permission)) {
      return true;
    }
  }
  return false;
};

export const roleWisePermission = (permission, roles) => {
  if (roles?.includes(permission)) {
    return true;
  }
  return false;
};



// "use client";
// import { BiCategory } from "react-icons/bi";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { message, Skeleton } from "antd";
// import { LuContact } from "react-icons/lu";
// import { FaRegNewspaper, FaServicestack, FaUserTie, FaBloggerB, FaUser } from "react-icons/fa";
// import { CiShoppingTag } from "react-icons/ci";
// import { PiContactlessPaymentFill, PiFilesFill } from "react-icons/pi";
// import { FaLanguage, FaQuestion, FaWrench } from "react-icons/fa6";
// import { MdEmail, MdOutlineInsertPageBreak, MdOutlineSpaceDashboard } from "react-icons/md";
// import { GiTakeMyMoney } from "react-icons/gi";
// import Header from "../components/layout/header";
// import Sidebar from "../components/layout/sideBar";
// import { useUser } from "@/app/context/userContext";
// import { getProfile } from "@/app/helpers/backend";
// import { FiMessageCircle, FiMessageSquare } from "react-icons/fi";
// import { useI18n } from "@/app/providers/i18n";
// import { AiFillRead } from "react-icons/ai";
// import { LiaUsersSolid } from "react-icons/lia";
// import { LuCalendarClock } from "react-icons/lu";

// const Layout = ({ children }) => {
//   const router = useRouter();
//   const { user, getUserdata, setUser, settings } = useUser();
//   const i18n = useI18n();

//   // detect language
//   const langFromLocalStorage =
//     typeof window !== "undefined" ? localStorage.getItem("lang") : null;

//   const currentLanguage = i18n?.languages?.find(
//     (lang) => lang?._id === langFromLocalStorage
//   )?.name;

//   // build menu here so it has access to currentLanguage
//   const menu = [
//     {
//       label: "Dashboard",
//       href: "/admin",
//       icon: <MdOutlineSpaceDashboard />,
//       permissions: ["admin", "dashboard"],
//     },
//      {
//       label: "New Requests",
//       href: "/admin/case-requests",
//       icon: <PiFilesFill />,
//       permissions: ["admin", "caseRequests_view"],
//     },
//     {
//       label: "Availability",
//       href: "/admin/availablity",
//       icon: <LuCalendarClock />,
//       permissions: ["admin", "availability_view"],
//     },
//     {
//       label: "Case Type",
//       href: "/admin/caseType",
//       icon: <BiCategory />,
//       permissions: ["admin", "caseType_view"],
//     },
//     {
//       label: "Attorney",
//       href: "/admin/attorney",
//       icon: <FaUserTie />,
//       permissions: ["admin", "trainers_view"],
//     },
//     {
//       label: "Clients",
//       href: "/admin/clients",
//       icon: <LiaUsersSolid />,
//       permissions: ["admin", "trainers_view"],
//     },
//     {
//       label: currentLanguage === "Arabic" ? "قضايانا" : "Our Cases",
//       href: "/admin/our-cases",
//       icon: <PiFilesFill />,
//       permissions: ["admin", "cases_overview"],
//     },
//     {
//       label: "Case Study",
//       href: "/admin/case-study",
//       icon: <AiFillRead />,
//       permissions: ["admin", "case_study_view"],
//     },
//     {
//       menu: "payment",
//       permissions: ["admin", "payment"],
//     },
//     {
//       label: "Payment Method",
//       href: "/admin/payment-method",
//       icon: <PiContactlessPaymentFill />,
//       permissions: ["admin", "payment_method_view"],
//     },
//     {
//       label: "Payment list",
//       href: "/admin/payment-list",
//       icon: <GiTakeMyMoney />,
//       permissions: ["admin", "payment_list_view"],
//     },
//     {
//       menu: "other",
//       permissions: ["admin", "other"],
//     },
//     {
//       label: "Message",
//       href: "/admin/message",
//       icon: <FiMessageCircle />,
//       permissions: ["admin", "message"],
//     },
//     {
//       menu: "Settings",
//       permissions: ["admin", "settings"],
//     },
//     {
//       label: "Settings",
//       href: "/admin/settings",
//       icon: <FaWrench />,
//       permissions: ["admin", "site_settings_view"],
//     },
//     {
//       label: "Languages",
//       href: "/admin/languages",
//       icon: <FaLanguage />,
//       permissions: ["admin", "language_view"],
//     },
//     {
//       label: "Faq",
//       href: "/admin/faq",
//       icon: <FaQuestion />,
//       permissions: ["admin", "faq_view"],
//     },
//   ];

//   const { push } = router;
//   const { pathname } = router;

//   const finalMenu = getMenu(user, push, pathname, menu);

//   useEffect(() => {
//     getProfile().then(({ error, data }) => {
//       if (error) {
//         message.error(i18n.t("Please login as admin"));
//         router.push("/");
//       } else {
//         if (data?.role === "admin") {
//           getUserdata();
//           setUser(data?.user);
//         } else {
//           getUserdata();
//           message.error(i18n.t("Please login as admin"));
//           router.push("/");
//         }
//       }
//     });
//   }, []);

//   if (!user || user?.role !== "admin") {
//     return (
//       <div className="min-h-screen bg-gray-100">
//         <div className="flex">
//           <div className="w-[250px] p-4">
//             <Skeleton active paragraph={{ rows: 8 }} />
//           </div>
//           <div className="flex-1">
//             <div className="p-4 py-12">
//               <Skeleton active title={false} paragraph={{ rows: 1 }} />
//             </div>
//             <div className="p-4">
//               <Skeleton active paragraph={{ rows: 10 }} />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {user?.role === "admin" && (
//         <>
//           <Header title={settings?.title} />
//           <Sidebar title={settings?.title} menu={finalMenu} />
//           <div className="content">
//             <div className="p-4">{children}</div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Layout;

// const getMenu = (user, push, pathname, menu) => {
//   const hasPermission = (menuItem) => {
//     if (menuItem.permission && havePermission(menuItem.permission, user?.roles)) {
//       return true;
//     }
//     if (menuItem.permissions) {
//       for (let permission of menuItem.permissions) {
//         if (havePermission(permission, user?.roles)) {
//           return true;
//         }
//       }
//     }
//     if (menuItem.permissions) {
//       for (let permission of menuItem.permissions) {
//         if (roleWisePermission(permission, [user?.role])) {
//           return true;
//         }
//       }
//     }
//     if (menuItem.permission) {
//       if (roleWisePermission("admin", [user?.role])) {
//         return true;
//       }
//     }
//     return false;
//   };

//   return menu
//     ?.map((d) => ({ ...d, href: d.href?.replace("[_id]", user?._id) }))
//     .filter((menuItem) => {
//       if (menuItem?.permission === "any") {
//         return true;
//       } else if (menuItem.permission || menuItem.permissions) {
//         return hasPermission(menuItem);
//       } else if (Array.isArray(menuItem.child)) {
//         menuItem.child = menuItem.child.filter(() => {});
//         return menuItem.child.length > 0;
//       }
//       return false;
//     });
// };

// export const havePermission = (permission, roles) => {
//   for (let role of roles || []) {
//     if (role?.permissions?.includes(permission)) {
//       return true;
//     }
//   }
//   return false;
// };

// export const roleWisePermission = (permission, roles) => {
//   if (roles?.includes(permission)) {
//     return true;
//   }
//   return false;
// };


// "use client";
// import { BiCategory } from "react-icons/bi";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { message, Skeleton } from "antd";
// import { LuContact } from "react-icons/lu";
// import { FaRegNewspaper, FaServicestack, FaUserTie, FaBloggerB, FaUser } from "react-icons/fa";
// import { CiShoppingTag } from "react-icons/ci";
// import {
//   PiContactlessPaymentFill,
// } from "react-icons/pi";
// import {
//   FaLanguage,
//   FaQuestion,
//   FaWrench,
// } from "react-icons/fa6";
// import {
//   MdEmail,
//   MdOutlineInsertPageBreak,
//   MdOutlineSpaceDashboard,
// } from "react-icons/md";
// import { GiTakeMyMoney } from "react-icons/gi";
// import Header from "../components/layout/header";
// import Sidebar from "../components/layout/sideBar";
// import { useUser } from "@/app/context/userContext";
// import { getProfile } from "@/app/helpers/backend";
// import { FiMessageCircle, FiMessageSquare } from "react-icons/fi";
// import { useI18n } from "@/app/providers/i18n";
// import { PiFilesFill } from "react-icons/pi";
// import { AiFillRead } from "react-icons/ai";
// import { LiaUsersSolid } from "react-icons/lia";


// const Layout = ({ children }) => {
//   const router = useRouter();
//   const { user, getUserdata, setUser, settings } = useUser();
//   const push = router.push;
//   const { pathname } = router;
//   const menu = getMenu(user, push, pathname);
//   const i18n = useI18n();
//   useEffect(() => {
//     getProfile().then(({ error, data, msg }) => {
//       if (error) {
//         message.error(i18n.t('Please login as admin'));
//         router.push("/");
//       }
//       else {
//         if (data?.role === "admin") {
//           getUserdata();
//           setUser(data?.user);
//         } else if ((data?.role !== "admin")) {
//           getUserdata();
//           message.error(i18n.t("Please login as admin"));
//           router.push("/");
//         }
//       }

//     });
//   }, []);


//   if (!user || user?.role !== "admin") {

//     return (
//       <div className="min-h-screen bg-gray-100">
//         <div className="flex">
//           <div className="w-[250px] p-4">
//             <Skeleton active paragraph={{ rows: 8 }} />
//           </div>
//           <div className="flex-1">
//             <div className="p-4 py-12">
//               <Skeleton active title={false} paragraph={{ rows: 1 }} />
//             </div>
//             <div className="p-4">
//               <Skeleton active paragraph={{ rows: 10 }} />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {!!(user?.role === "admin") && (
//         <>
//           <Header title={settings?.title} />
//           <Sidebar title={settings?.title} menu={menu} />
//           <div className="content">
//             <div className="p-4">{children}</div>
//           </div>

//         </>
//       )}
//     </div>
//   );
// };

// export default Layout;

// const menu = [
//   {
//     label: "Dashboard",
//     href: "/admin",
//     icon: <MdOutlineSpaceDashboard />,
//     permissions: ["admin", "dashboard"],
//   },
//   {
//     label: "Case Type",
//     href: "/admin/caseType",
//     icon: <BiCategory />,
//     permissions: ["admin", "caseType_view"],
//   },
//   {
//     label: "Attorney",
//     href: "/admin/attorney",
//     icon: <FaUserTie />,
//     permissions: ["admin", "trainers_view"],
//   },
//   {
//     label: "Clients",
//     href: "/admin/clients",
//     icon: <LiaUsersSolid />,
//     permissions: ["admin", "trainers_view"],
//   },
//   {
//     label: "Our Cases",
//     href: "/admin/our-cases",
//     icon: <PiFilesFill />,
//     permissions: ["admin", "cases_overview"],

//   },
//   {
//     label: "Case Study",
//     href: "/admin/case-study",
//     icon: <AiFillRead />,
//     permissions: ["admin", "case_study_view"],
//   },

//   {
//     menu: "payment",
//     permissions: ["admin", "payment"],
//   },
//   {
//     label: "Payment Method",
//     href: "/admin/payment-method",
//     icon: <PiContactlessPaymentFill />,
//     permissions: ["admin", "payment_method_view"],
//   },

//   {
//     label: "Payment list",
//     href: "/admin/payment-list",
//     icon: <GiTakeMyMoney />,
//     permissions: ["admin", "payment_list_view"],
//   },
//   // {
//   //   menu: "Blog",
//   //   permissions: ["admin", "blog"],
//   // },
//   // {
//   //   label: "Category",
//   //   href: "/admin/blog/category",
//   //   icon: <BiCategory />,
//   //   permissions: ["admin", "blog_category_view"],
//   // },
//   // {
//   //   label: "Tags",
//   //   href: "/admin/blog/tags",
//   //   icon: <CiShoppingTag />,
//   //   permissions: ["admin", "blog_tags_view"],
//   // },
//   // {
//   //   label: "Blogs",
//   //   href: "/admin/blog",
//   //   icon: <FaBloggerB />,
//   //   permissions: ["admin", "blogs_view"],
//   // },

//   {
//     menu: "other",
//     permissions: ["admin", "other"],
//   },

//   // {
//   //   label: "Service",
//   //   href: "/admin/service",
//   //   icon: <FaServicestack />,
//   //   permissions: ["admin", "service"],
//   // },
//   // {
//   //   label: "Newsletter",
//   //   href: "/admin/newsletter",
//   //   icon: <FaRegNewspaper />,
//   //   permissions: ["admin", "newsletter"],
//   // },
//   // {
//   //   label: "Testimonial",
//   //   href: "/admin/testimonial",
//   //   icon: <FiMessageSquare />,
//   //   permissions: ["admin", "testimonial"],
//   // },
//   // {
//   //   label: "Contact",
//   //   href: "/admin/contacts",
//   //   icon: <LuContact />,
//   //   permissions: ["admin", "contact_view"],
//   // },
//   {
//     label: "Message",
//     href: "/admin/message",
//     icon: <FiMessageCircle />,
//     permissions: ["admin", "message"],
//   },
//   {
//     menu: "Settings",
//     permissions: ["admin", "settings"],
//   },
//   {
//     label: "Settings",
//     href: "/admin/settings",
//     icon: <FaWrench />,
//     permissions: ["admin", "site_settings_view"],
//   },
//   {
//     label: "Languages",
//     href: "/admin/languages",
//     icon: <FaLanguage />,
//     permissions: ["admin", "language_view"],
//   },

//   // {
//   //   label: "Email Settings",
//   //   href: "/admin/email-setting",
//   //   icon: <MdEmail />,
//   //   permissions: ["admin", "email_settings_view"],
//   // },

//   {
//     label: "Faq",
//     href: "/admin/faq",
//     icon: <FaQuestion />,
//     permissions: ["admin", "faq_view"],
//   },
//   // {
//   //   label: "Page Settings",
//   //   href: "/admin/page-settings",
//   //   icon: <MdOutlineInsertPageBreak />,
//   //   permissions: ["admin", "page_settings_view"],
//   // },
// ];

// const getMenu = (user, push, pathname) => {
//   const hasPermission = menu => {
//     if (menu.permission && havePermission(menu.permission, user?.roles)) {
//       return true
//     }
//     if (menu.permissions) {
//       for (let permission of menu.permissions) {
//         if (havePermission(permission, user?.roles)) {
//           return true
//         }
//       }
//     }
//     if (menu.permissions) {
//       for (let permission of menu.permissions) {
//         if (roleWisePermission(permission, [user?.role])) {
//           return true
//         }
//       }
//     }
//     if (menu.permission) {
//       if (roleWisePermission('admin', [user?.role])) {
//         return true
//       }
//     }
//     return false
//   }
//   return menu?.map(d => ({ ...d, href: d.href?.replace('[_id]', user?._id) })).filter(menu => {
//     if (menu?.permission === 'any') {
//       return true
//     } else if (menu.permission || menu.permissions) {
//       return hasPermission(menu)
//     } else if (Array.isArray(menu.child)) {
//       menu.child = menu.child.filter(child => {
//       })
//       return menu.child.length > 0
//     }
//     return false
//   })
// }

// export const havePermission = (permission, roles) => {
//   for (let role of roles || []) {
//     if (role?.permissions?.includes(permission)) {
//       return true;
//     }
//   }
//   return false;
// };

// export const roleWisePermission = (permission, roles) => {
//   if (roles?.includes(permission)) {
//     return true
//   }
//   return false
// }
