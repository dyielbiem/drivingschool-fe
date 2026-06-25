"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { FaEye } from "react-icons/fa6";
import { BiLoaderAlt } from "react-icons/bi";

import adminFetchStudentsPerSection from "@/services/api/adminFetchStudentsPerSection";
import dateFormatter from "@/utils/dateFormatter";

import Pagination from "@/components/Pagination";

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

  const search = searchParams.get("search");
  const page = Number(searchParams.get("page"));

  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [numberOfPage, setNumberOfPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { ok, json } = await adminFetchStudentsPerSection(
        sectionID,
        page,
        "latestRegistrations",
        search
      );

      if (ok) {
        setStudents(json.studentList);
        setNumberOfPage(json.totalPages);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [sectionID, page, search]);

  const handleView = useCallback(
    (studentUserName) => {
      router.push(
        `/admin/students/${sectionID}/${studentUserName}?prev=latest-registrations`
      );
    },
    [router, sectionID]
  );

  if (isLoading) {
    return (
      <div className="students-per-section-loader">
        <BiLoaderAlt />
      </div>
    );
  }

  if (students.length === 0)
    return <p className="no-students-per-section">No students found</p>;

  return (
    <>
      <ul className="latest-registrations-table">
        <TableHeader />
        <TableData students={students} onView={handleView} />
      </ul>
      <Pagination
        isVisible={students?.length !== 0}
        numberOfPage={numberOfPage}
      />
      <Tooltip id="latest-registrations-table-tooltip" />
    </>
  );
};

export default AdminLatestStudentRegistration;
