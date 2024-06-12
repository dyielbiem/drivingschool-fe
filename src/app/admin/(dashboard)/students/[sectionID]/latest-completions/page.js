"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { RiExternalLinkFill } from "react-icons/ri";

import Pagination from "@/components/Pagination";
import StudentCompletionsTable from "@/components/StudentCompletionsTable";

import { useStudentsInSection } from "@/state/store";

import dateFormatter from "@/utils/dateFormatter";

const AdminLatestStudentCompletion = () => {
  const { students, noOfRows } = useStudentsInSection();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const router = useRouter();
  const pathname = usePathname();
  const [studentToView, setStudentToView] = useState(null);

  // Check if student search param exists and valid
  useEffect(() => {
    if (!searchParams.get("student")) return setStudentToView(null);
    const student = students.find(
      (item) => item.studentUserName === searchParams.get("student")
    );

    if (!student) return setStudentToView(null);

    setStudentToView(student);
  }, [searchParams, students]);

  const sortDateLatestToOldestCB = (a, b) => {
    const dateA = new Date(a?.completionDate);
    const dateB = new Date(b?.completionDate);
    if (dateA && dateB == "Invalid Date") return -1;
    if (dateA == "Invalid Date" && dateB) return 1;
    if (dateA && dateB) return dateB - dateA;
    return 0;
  };

  const filteredCompletions = () => {
    if (students.length === 0) return [];
    const searchKey = searchParams.get("search").toLowerCase();
    return [...students]
      .filter((eachStudent) => {
        const username = eachStudent.studentUserName.toLowerCase();
        const fullName =
          `${eachStudent.mailingFirstName} ${eachStudent.mailingLastName}`.toLowerCase();

        if (username.includes(searchKey) || fullName.includes(searchKey))
          return eachStudent;
      })
      .sort(sortDateLatestToOldestCB);
  };

  const completionsPerPage = () => {
    if (students.length === 0) return [];
    const firstStudentToShow = (page - 1) * noOfRows;
    const lastStudentToShow = (page - 1) * noOfRows + noOfRows;
    return [...students]
      .sort(sortDateLatestToOldestCB)
      .slice(firstStudentToShow, lastStudentToShow);
  };

  const completionsToRender = () => {
    if (searchParams.get("search")) {
      return filteredCompletions();
    }
    return completionsPerPage();
  };

  const renderHeaderTitle = () => {
    return (
      <li className="table-header">
        <p>Username</p>
        <p>Name</p>
        <p>Registration Date</p>
        <p>Completion Date</p>
      </li>
    );
  };

  const viewDetailsClick = (studentUserName) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("student", studentUserName);
    router.push(`${pathname}?${currentParams}`);
  };

  const renderCompletions = () => {
    if (studentToView || !students || students.length === 0) return null;
    const completions = completionsToRender();
    return (
      <ul className="latest-completions-table">
        {renderHeaderTitle()}
        {completions.map((eachCompletion, index) => {
          return (
            <li key={index}>
              <p>{eachCompletion.studentUserName}</p>
              <p>
                {eachCompletion.mailingFirstName}{" "}
                {eachCompletion.mailingLastName}
              </p>
              <p>{dateFormatter(eachCompletion.enrollmentDate)}</p>
              <p>
                {dateFormatter(eachCompletion.completionDate) ||
                  "Not completed"}
              </p>
              <button
                onClick={() => viewDetailsClick(eachCompletion.studentUserName)}
              >
                <p>View Details</p>
                <RiExternalLinkFill />
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderPagination = () => {
    if (students?.length === 0 || searchParams.get("search") || studentToView)
      return null;
    return (
      <Pagination itemsLength={Number(students?.length)} noOfRows={noOfRows} />
    );
  };

  const renderStudentCompletions = () => {
    if (!studentToView) return null;
    return <StudentCompletionsTable student={studentToView} />;
  };

  return (
    <>
      {renderCompletions()}
      {renderPagination()}
      {renderStudentCompletions()}
    </>
  );
};

export default AdminLatestStudentCompletion;
