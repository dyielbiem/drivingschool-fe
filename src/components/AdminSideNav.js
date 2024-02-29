"use client";

import Link from "next/link";
import adminLogoutClick from "@/actions/adminLogoutClick";
import { usePathname, useRouter } from "next/navigation";
import { PiClipboardTextFill } from "react-icons/pi";
import { MdGroups2 } from "react-icons/md";
import { RiCoupon3Fill } from "react-icons/ri";
import { HiCreditCard, HiBookOpen } from "react-icons/hi2";
import { BiLogOut } from "react-icons/bi";
import { RiSettings4Fill } from "react-icons/ri";

const AdminSideNav = () => {
  const pathName = usePathname();
  const router = useRouter();
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
      icon: HiBookOpen
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: RiSettings4Fill
    }
  ];

  const handleLogoutClick = async () => {
    await adminLogoutClick();
    router.push("/admin");
  };

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
      <button onClick={handleLogoutClick}>
        <BiLogOut />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default AdminSideNav;
