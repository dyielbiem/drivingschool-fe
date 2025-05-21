"use client";
import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RiExternalLinkFill } from "react-icons/ri";

import { useStudentsInSection } from "@/state/store";

import Navigate from "@/components/Navigate";
import Pagination from "@/components/Pagination";
import StudentExamDetailsTable from "@/components/StudentExamDetailsTable";

const sortAlphabetical = (a, b) =>
  a.studentUserName.localeCompare(b.studentUserName);

const StudentExamDetails = ({ studentParam, sectionID }) => {
  const { students } = useStudentsInSection();
  const student = students.find(
    (item) => item.studentUserName === studentParam
  );

  if (!student)
    return (
      <Navigate
        to={`/admin/students/${sectionID}/exams?page=1`}
        replace={true}
      />
    );

  return <StudentExamDetailsTable student={student} />;
};

const TableHeader = () => (
  <li className="table-header">
    <p>Username</p>
    <p>Name</p>
    <p>Status</p>
  </li>
);

const TableData = ({ students, onView }) => {
  return students.map((student, index) => {
    const {
      studentUserName,
      mailingFirstName,
      mailingLastName,
      isCourseCompleted
    } = student;
    return (
      <li key={index}>
        <p>
          <span>Username: </span>
          {studentUserName}
        </p>
        <p>
          <span>Name: </span>
          {mailingFirstName} {mailingLastName}
        </p>
        <p
          className={`${
            isCourseCompleted
              ? "text-custom-green-base bg-custom-green-light"
              : "text-custom-gray-dark bg-custom-gray-base"
          }`}
        >
          {isCourseCompleted ? "COMPLETED" : "IN PROGRESS"}
        </p>
        <button onClick={() => onView(studentUserName)}>
          <p>View Details</p>
          <RiExternalLinkFill />
        </button>
      </li>
    );
  });
};

const AdminStudentExams = ({ params: { sectionID } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page"));
  const searchKey = searchParams.get("search")?.toLowerCase?.();
  const studentParam = searchParams.get("student");

  const { students, noOfRows } = useStudentsInSection();

  const handleView = useCallback(
    (studentUserName) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("student", studentUserName);
      router.push(`${pathname}?${currentParams}`);
    },
    [pathname, router, searchParams]
  );

  const studentToRender = useMemo(() => {
    const sortedStudents = [...students].sort(sortAlphabetical);
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
  }, [noOfRows, page, searchKey, students]);

  if (students.length === 0) return null;

  if (studentParam)
    return (
      <StudentExamDetails studentParam={studentParam} sectionID={sectionID} />
    );

  return (
    <>
      <ul className="exam-details-table">
        <TableHeader />
        <TableData students={studentToRender} onView={handleView} />
      </ul>
      <Pagination
        isVisible={students.length !== 0 && !searchKey}
        itemsLength={Number(students.length)}
        noOfRows={noOfRows}
      />
    </>
  );
};

export default AdminStudentExams;
