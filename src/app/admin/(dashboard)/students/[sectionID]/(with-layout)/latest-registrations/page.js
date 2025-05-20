"use client";
import { useMemo, useCallback } from "react";
import { parseDate } from "chrono-node";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { FaEye } from "react-icons/fa6";

import dateFormatter from "@/utils/dateFormatter";
import { useStudentsInSection } from "@/state/store";

import Pagination from "@/components/Pagination";

const sortLatestToOldest = (a, b) => {
  const dateA = parseDate(a?.enrollmentDate);
  const dateB = parseDate(b?.enrollmentDate);
  if (dateA && !dateB) return -1;
  if (!dateA && dateB) return 1;
  if (dateA && dateB) return dateB - dateA;
  return 0;
};

const TableHeader = () => (
  <li className="table-header">
    <p>Username</p>
    <p>Registration Date</p>
    <p>Name</p>
    <p>Email Address</p>
    <p>Course Type</p>
    <p>Status</p>
  </li>
);

const TableData = ({ students, onView }) => {
  if (students.length === 0) return null;

  return students.map((student, index) => {
    const {
      studentUserName,
      enrollmentDate,
      mailingFirstName,
      mailingLastName,
      mailingEmail,
      courseType,
      isActive
    } = student;

    return (
      <li key={index}>
        <p col-title="username">{studentUserName}</p>
        <p col-title="registration date">{dateFormatter(enrollmentDate)}</p>
        <p col-title="name">
          {mailingFirstName} {mailingLastName}
        </p>
        <p col-title="email">{mailingEmail}</p>
        <p col-title="course type">{courseType}</p>
        <p
          col-title="status"
          className={`${
            isActive
              ? "bg-custom-green-light text-custom-green-base"
              : "bg-custom-gray-base text-custom-gray-dark"
          }`}
        >
          {isActive ? "ACTIVE" : "INACTIVE"}
        </p>
        <button
          onClick={() => onView(studentUserName)}
          data-tooltip-id="latest-registrations-table-tooltip"
          data-tooltip-content="View Student"
        >
          <FaEye />
        </button>
      </li>
    );
  });
};

const AdminLatestStudentRegistration = ({ params: { sectionID } }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { students, noOfRows } = useStudentsInSection();

  const searchKey = searchParams.get("search")?.toLocaleLowerCase?.();
  const page = Number(searchParams.get("page"));

  const studentsToRender = useMemo(() => {
    if (students.length === 0) return [];

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

  const handleView = useCallback(
    (studentUserName) => {
      router.push(
        `/admin/students/${sectionID}/${studentUserName}?prev=latest-registrations`
      );
    },
    [router, sectionID]
  );

  return (
    <>
      <ul className="latest-registrations-table">
        <TableHeader />
        <TableData students={studentsToRender} onView={handleView} />
      </ul>
      <Pagination
        isVisible={students?.length !== 0 && !searchKey}
        itemsLength={Number(students?.length)}
        noOfRows={noOfRows}
      />
      <Tooltip id="latest-registrations-table-tooltip" />
    </>
  );
};

export default AdminLatestStudentRegistration;
