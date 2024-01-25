"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import adminFetchSectionByID from "@/services/api/adminFetchSectionByID";
import Link from "next/link";

const AdminStudentsHeader = () => {
  const pathname = usePathname();
  const sectionID = String(pathname).split("/").at(3);
  const currentTab = String(pathname).split("/").pop();
  const [sectionTitle, setSectionTitle] = useState("");
  const [isSectionActive, setIsSectionActive] = useState(false);

  useEffect(() => {
    const fetchSectionInfo = async () => {
      if (!sectionID) return;
      const response = await adminFetchSectionByID(sectionID);
      if (!response.ok) return;
      setSectionTitle(response.json.sectionTitle);
      setIsSectionActive(response.json.isActive);
    };

    fetchSectionInfo();
  }, [sectionID]);

  const navLinks = [
    {
      label: "All Students",
      link: "all"
    },
    {
      label: "Exam Details",
      link: "exams"
    },
    {
      label: "Latest Student Registrations",
      link: "latest-registrations"
    },
    {
      label: "Latest Student Completions",
      link: "latest-completions"
    }
  ];

  const renderNavLinks = () => {
    if (!sectionTitle) return;
    return navLinks.map((item, index) => (
      <Link
        href={item.link}
        key={index}
        className={`${
          currentTab === item.link
            ? "text-black border-b-custom-blue-light border-b-[3px]"
            : ""
        }`}
      >
        {item.label}
      </Link>
    ));
  };

  return (
    <div className="header">
      <h1>
        Manage Students {!sectionTitle ? "" : `- ${sectionTitle}`}{" "}
        {isSectionActive ? "(Latest Version)" : ""}
      </h1>
      <nav>{renderNavLinks()}</nav>
    </div>
  );
};

export default AdminStudentsHeader;
