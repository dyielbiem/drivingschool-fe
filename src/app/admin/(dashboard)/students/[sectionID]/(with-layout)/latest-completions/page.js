"use client";
import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { parseDate } from "chrono-node";
import { RiExternalLinkFill } from "react-icons/ri";

import Navigate from "@/components/Navigate";
import Pagination from "@/components/Pagination";
import StudentCompletionsTable from "@/components/StudentCompletionsTable";

import { formatDate } from "@/utils";
import { useStudentsInSection } from "@/state/store";

const sortLatestToOldest = (a, b) => {
  const dateA = parseDate(a?.completionDate);
  const dateB = parseDate(b?.completionDate);
  if (dateA && !dateB) return -1;
  if (!dateA && dateB) return 1;
  if (dateA && dateB) return dateB - dateA;
  return 0;
};

const TableHeader = () => (
  <li className="table-header">
    <p>Username</p>
    <p>Name</p>
    <p>Registration Date</p>
    <p>Completion Date</p>
  </li>
);

const TableData = ({ students, onView }) => {
  return students.map((student, index) => {
    const {
      studentUserName,
      enrollmentDate,
      mailingFirstName,
      mailingLastName,
      completionDate
    } = student;

    return (
      <li key={index}>
        <p col-title="username">{studentUserName}</p>
        <p col-title="name">
          {mailingFirstName} {mailingLastName}
        </p>
        <p col-title="registration date">{formatDate(enrollmentDate) || ""}</p>
        <p col-title="completion date">
          {formatDate(completionDate) || "Not completed"}
        </p>
        <button onClick={() => onView(studentUserName)}>
          <p>View Details</p>
          <RiExternalLinkFill />
        </button>
      </li>
    );
  });
};

const AdminLatestStudentCompletion = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page"));
  const searchKey = searchParams.get("search")?.toLocaleLowerCase?.();
  const studentParam = searchParams.get("student");

  const { students, noOfRows } = useStudentsInSection();

  const studentToView = useMemo(() => {
    return students.find((item) => item.studentUserName === studentParam);
  }, [studentParam, students]);

  const studentsToRender = useMemo(() => {
    const sortedStudents = [...students].sort(sortLatestToOldest);
    const firstStudentInPageIdx = (page - 1) * noOfRows;
    const lastStudentInPageIdx = (page - 1) * noOfRows + noOfRows;

    if (!searchKey)
      return sortedStudents.slice(firstStudentInPageIdx, lastStudentInPageIdx);

    return sortedStudents.filter((eachStudent) => {
      const {
        studentUserName,
        mailingFirstName,
        mailingLastName,
        mailingEmail
      } = eachStudent;

      const searchableFields = {
        username: studentUserName?.toLowerCase() || "",
        email: mailingEmail?.toLowerCase() || "",
        fullName: `${mailingFirstName} ${mailingLastName}`.toLowerCase()
      };

      return Object.values(searchableFields).some((field) =>
        field.includes(searchKey)
      );
    });
  }, [noOfRows, page, students, searchKey]);

  const handleView = (studentUserName) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("student", studentUserName);
    router.push(`${pathname}?${currentParams}`);
  };

  if (students.length === 0) return null;

  if (studentToView) return <StudentCompletionsTable student={studentToView} />;

  if (studentParam && !studentToView)
    return <Navigate to={"latest-completions?page=1"} replace={true} />;

  return (
    <>
      <ul className="latest-completions-table">
        <TableHeader />
        <TableData students={studentsToRender} onView={handleView} />
      </ul>
      <Pagination
        isVisible={students.length !== 0 && !searchKey}
        itemsLength={Number(students.length)}
        noOfRows={noOfRows}
      />
    </>
  );
};

export default AdminLatestStudentCompletion;
