"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import adminFetchSectionByID from "@/services/api/adminFetchSectionByID";
import Link from "next/link";
import { useStudentsInSection } from "@/state/store";
import adminFetchAllStudents from "@/services/api/adminFetchAllStudents";

const AdminStudentsHeader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setStudents, setNoOfRows } = useStudentsInSection();
  const sectionID = String(pathname).split("/").at(3);
  const currentTab = String(pathname).split("/").pop();
  const [sectionTitle, setSectionTitle] = useState("");
  const [isSectionActive, setIsSectionActive] = useState(false);

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
      setNoOfRows(studentResponse.json.noOfRows);
    };

    fetchSectionAndStudents();
  }, [sectionID, setNoOfRows, setStudents]);

  const navLinks = [
    {
      label: "All Students",
      link: `all?${searchParams.toString()}`
    },
    {
      label: "Exam Details",
      link: `exams?${searchParams.toString()}`
    },
    {
      label: "Latest Student Registrations",
      link: `latest-registrations?${searchParams.toString()}`
    },
    {
      label: "Latest Student Completions",
      link: `latest-completions?${searchParams.toString()}`
    }
  ];

  const renderNavLinks = () => {
    if (!sectionTitle) return;
    return navLinks.map((item, index) => (
      <Link
        href={item.link}
        key={index}
        className={`${
          item.link.includes(currentTab)
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
      {!searchParams.get("edit_student") && <nav>{renderNavLinks()}</nav>}
    </div>
  );
};

export default AdminStudentsHeader;
