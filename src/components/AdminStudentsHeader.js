"use client";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { FaAngleDown } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

const navLinkMap = {
  all: "All Students",
  exams: "Exam Details",
  "latest-registrations": "Latest Student Registrations",
  "latest-completions": "Latest Student Completions"
};

const SectionTitle = ({ sectionTitle, isSectionActive, onBack }) => (
  <div className="title">
    <button type="button" onClick={onBack}>
      <IoMdArrowRoundBack />
    </button>
    <h1>
      Manage Students {!sectionTitle ? "" : `- ${sectionTitle}`}{" "}
      {isSectionActive ? "(Latest Version)" : ""}
    </h1>
  </div>
);

const MobileTabNav = ({ currentTab, onTabNavClick }) => {
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
              tab === currentTab && "!bg-custom-blue-base text-white !font-bold"
            }`}
            onPointerDown={() => onTabNavClick(tab)}
          >
            {navLinkMap[tab]}
          </li>
        ))}
      </ul>
    </nav>
  );
};

const WideScreenTabNav = ({ currentTab, navigateParams }) => {
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

const AdminStudentsHeader = ({ section }) => {
  const { sectionTitle, isActive: isSectionActive } = section;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = useMemo(() => pathname.split("/").pop(), [pathname]);
  const studentParam = searchParams.get("student");

  const navigateParams = useMemo(() => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete("student");
    currentParams.set("page", 1);
    return currentParams;
  }, [searchParams]);

  if (
    !section ||
    searchParams.get("edit_student") ||
    (studentParam && ["exams", "latest-completions"].includes(currentTab))
  )
    return null;

  return (
    <div className="header">
      <SectionTitle
        sectionTitle={sectionTitle}
        isSectionActive={isSectionActive}
        onBack={() => router.push("/admin/students")}
      />
      <MobileTabNav
        currentTab={currentTab}
        onTabNavClick={(tab) => router.replace(`${tab}?${navigateParams}`)}
      />
      <WideScreenTabNav
        currentTab={currentTab}
        navigateParams={navigateParams}
      />
    </div>
  );
};

export default AdminStudentsHeader;
