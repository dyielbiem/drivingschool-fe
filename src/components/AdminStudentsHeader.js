"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { FaAngleDown } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

import { useStudentsInSection } from "@/state/store";
import adminFetchSectionByID from "@/services/api/adminFetchSectionByID";
import adminFetchAllStudents from "@/services/api/adminFetchAllStudents";

const AdminStudentsHeader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sectionID = String(pathname).split("/").at(3);
  const currentTab = String(pathname).split("/").pop();
  const { setStudents, setNoOfRows } = useStudentsInSection();
  const [sectionTitle, setSectionTitle] = useState("");
  const [isSectionActive, setIsSectionActive] = useState(false);

  const navigateParams = new URLSearchParams(searchParams.toString());
  navigateParams.delete("student");

  useEffect(() => {
    if (Number(searchParams.get("page"))) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", "1");
    router.replace(`${pathname}?${currentParams}`);
  }, [pathname, router, searchParams]);

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
      setNoOfRows(studentResponse.json.noOfRows || 100);
    };

    fetchSectionAndStudents();
  }, [sectionID, setNoOfRows, setStudents]);

  const navLinkMap = {
    all: "All Students",
    exams: "Exam Details",
    "latest-registrations": "Latest Student Registrations",
    "latest-completions": "Latest Student Completions"
  };

  const onTabSelect = (newTab) => {
    router.push(newTab);
  };

  const renderTitle = () => {
    return (
      <div className="title">
        <button type="button" onClick={goBack}>
          <IoMdArrowRoundBack />
        </button>
        <h1>
          Manage Students {!sectionTitle ? "" : `- ${sectionTitle}`}{" "}
          {isSectionActive ? "(Latest Version)" : ""}
        </h1>
      </div>
    );
  };

  const renderMobileNav = () => {
    if (!sectionTitle) return null;
    return (
      <nav className="mobile-nav" tabIndex={0}>
        <button>
          {navLinkMap[currentTab]} <FaAngleDown />
        </button>
        <ul>
          {Object.keys(navLinkMap).map((tab, index) => (
            <li
              key={index}
              className={`${
                tab === currentTab &&
                "!bg-custom-blue-base text-white !font-bold"
              }`}
              onPointerDown={() => onTabSelect(`${tab}?${navigateParams}`)}
            >
              {navLinkMap[tab]}
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  const renderWideScreenNav = () => {
    if (!sectionTitle) return null;
    return (
      <nav className="wide-screen-nav">
        {Object.keys(navLinkMap).map((tab, index) => (
          <Link
            href={`${tab}?${navigateParams}`}
            key={index}
            className={`${
              tab === currentTab
                ? "!text-black border-b-custom-blue-light border-b-[3px]"
                : "border-b-custom-gray-base border-b-[2px]"
            }`}
          >
            {navLinkMap[tab]}
          </Link>
        ))}
      </nav>
    );
  };

  if (searchParams.get("edit_student") || searchParams.get("student")) {
    return null;
  }

  const goBack = () => {
    router.push("/admin/students");
  };

  return (
    <div className="header">
      {renderTitle()}
      {renderMobileNav()}
      {renderWideScreenNav()}
    </div>
  );
};

export default AdminStudentsHeader;
