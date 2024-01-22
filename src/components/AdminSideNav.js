"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiClipboardTextFill } from "react-icons/pi";
import { MdGroups2 } from "react-icons/md";
import { RiCoupon3Fill } from "react-icons/ri";
import { HiCreditCard } from "react-icons/hi2";
import { FaBookOpen } from "react-icons/fa";

const AdminSideNav = () => {
  const pathName = usePathname();
  const regex = /^\/admin\/sections\/.+/;

  const navItems = [
    {
      title: "Manage Sections",
      path: "/admin/sections",
      icon: PiClipboardTextFill
    },
    { title: "Manage Students", path: "/admin/students", icon: MdGroups2 },
    {
      title: "Manage Coupons",
      path: "/admin/coupons",
      icon: RiCoupon3Fill
    },
    {
      title: "Billing Information",
      path: "/admin/billing",
      icon: HiCreditCard
    },
    {
      title: "Manage Courses",
      path: "/admin/courses",
      icon: FaBookOpen
    }
  ];

  return (
    <div
      className={`side-nav-container ${regex.test(pathName) ? "!hidden" : ""}`}
    >
      <nav className="side-nav">
        <div className="nav-items-container">
          {navItems?.length > 0 &&
            navItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className={`${
                  pathName.startsWith(item.path)
                    ? "bg-custom-blue-darker after:!bg-custom-blue-light font-extrabold"
                    : ""
                }`}
              >
                <item.icon
                  className={`nav-icon ${
                    pathName.startsWith(item.path)
                      ? "!text-custom-blue-light"
                      : ""
                  }`}
                />
                <span
                  className={`${
                    pathName.startsWith(item.path)
                      ? "text-custom-white-base"
                      : ""
                  }`}
                >
                  {item.title}
                </span>
              </Link>
            ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminSideNav;
