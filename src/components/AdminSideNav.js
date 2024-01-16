"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiRectangleGroup } from "react-icons/hi2";
import { MdGroups2 } from "react-icons/md";

const AdminSideNav = () => {
  const pathName = usePathname();
  const regex = /^\/admin\/sections\/.+/;

  const navItems = [
    {
      title: "Manage Sections",
      path: "/admin/sections",
      icon: HiRectangleGroup
    },
    { title: "Manage Students", path: "/admin/students", icon: MdGroups2 }
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
                    ? "bg-sky-950 after:!bg-sky-500 font-extrabold"
                    : ""
                }`}
              >
                <item.icon
                  className={`nav-icon ${
                    pathName.startsWith(item.path) ? "text-sky-500" : ""
                  }`}
                />
                <span>{item.title}</span>
              </Link>
            ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminSideNav;
