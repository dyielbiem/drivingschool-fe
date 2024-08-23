"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PiClipboardTextFill } from "react-icons/pi";
import { MdGroups2 } from "react-icons/md";
import { HiCreditCard, HiBookOpen } from "react-icons/hi2";
import { BiLogOut } from "react-icons/bi";
import { RiSettings4Fill, RiCoupon3Fill, RiMenu3Line } from "react-icons/ri";
import { MdClose } from "react-icons/md";

import adminLogoutClick from "@/actions/adminLogoutClick";
import adminFetchAdmin from "@/services/api/adminFetchAdmin";
import { useAdmin } from "@/state/store";

const AdminSideNav = () => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAdmin } = useAdmin();
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);
  const regex = /^\/admin\/sections\/.+/;

  useEffect(() => {
    const fetchAdmin = async () => {
      const { ok, json } = await adminFetchAdmin();
      if (!ok) return;
      setAdmin(json);
    };

    fetchAdmin();
  }, [setAdmin]);

  useEffect(() => {
    setIsMobileNavVisible(false);
  }, [pathName, searchParams]);

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

  const renderLogo = () => (
    <Link href={"/admin/sections"} className="nav-logo">
      <Image
        src={"/logo.png"}
        alt="logo-image"
        width={1734}
        height={594}
        priority
      />
    </Link>
  );

  const renderNavLink = (nav, index) => {
    const NavIcon = nav.icon;
    const path = nav.path;
    const title = nav.title;

    return (
      <Link
        key={index}
        href={path}
        className={`${
          pathName.startsWith(path)
            ? "bg-custom-blue-darker after:!bg-custom-blue-light font-extrabold"
            : ""
        }`}
      >
        <NavIcon
          className={`nav-icon ${
            pathName.startsWith(path) ? "!text-custom-blue-light" : ""
          }`}
        />
        <span
          className={`${
            pathName.startsWith(path) ? "text-custom-white-base" : ""
          }`}
        >
          {title}
        </span>
      </Link>
    );
  };

  const renderSideNav = () => {
    if (regex.test(pathName)) return null;
    return (
      <>
        <div
          className={`mobile-nav-back-drop ${
            isMobileNavVisible ? "flex" : "hidden"
          }`}
          onClick={() => setIsMobileNavVisible(false)}
        />
        <div
          className={`side-nav-container ${
            isMobileNavVisible ? "flex" : "hidden"
          }`}
        >
          {renderLogo()}
          <nav className="side-nav">
            <div className="nav-items-container">
              <button
                className="close-nav-btn"
                onClick={() => setIsMobileNavVisible(false)}
              >
                <MdClose />
              </button>
              {navItems.map((item, index) => renderNavLink(item, index))}
            </div>
          </nav>
          <button onClick={handleLogoutClick} className="logout-btn">
            <BiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </>
    );
  };

  const renderTopNav = () => {
    if (regex.test(pathName)) return null;
    return (
      <div className="top-nav-container">
        {renderLogo()}
        <button
          className="hamburger-btn"
          onClick={() => setIsMobileNavVisible(true)}
        >
          <RiMenu3Line />
        </button>
      </div>
    );
  };

  return (
    <>
      {renderTopNav()}
      {renderSideNav()}
    </>
  );
};

export default AdminSideNav;
