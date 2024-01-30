"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import adminFetchSectionByID from "@/services/api/adminFetchSectionByID";
import Link from "next/link";
import { useStudentsInSection } from "@/state/store";
import adminFetchAllStudents from "@/services/api/adminFetchAllStudents";

const AdminStudentsHeader = () => {
  const pathname = usePathname();
  const { setStudents } = useStudentsInSection();
  const sectionID = String(pathname).split("/").at(3);
  const currentTab = String(pathname).split("/").pop();
  const [sectionTitle, setSectionTitle] = useState("");
  const [isSectionActive, setIsSectionActive] = useState(false);

  useEffect(() => {
    const fetchSectionAndStudents = async () => {
      if (!sectionID) return;
      const sectionResponse = await adminFetchSectionByID(sectionID);
      if (!sectionResponse?.ok) return;
      setSectionTitle(sectionResponse.json.sectionTitle);
      setIsSectionActive(sectionResponse.json.isActive);

      const studentResponse = await adminFetchAllStudents(sectionID);
      if (!studentResponse?.ok) return;

      setStudents(studentResponse.json.allStudents);
    };

    fetchSectionAndStudents();
  }, [sectionID, setStudents]);

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
