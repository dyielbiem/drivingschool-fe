"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { RiExternalLinkFill } from "react-icons/ri";
import { BiLoaderAlt } from "react-icons/bi";

import adminFetchStudentsPerSection from "@/services/api/adminFetchStudentsPerSection";

import Navigate from "@/components/Navigate";
import Pagination from "@/components/Pagination";
import StudentCompletionsTable from "@/components/StudentCompletionsTable";

import { formatDate } from "@/utils";

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

const AdminLatestStudentCompletion = ({ params: { sectionID } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page"));
  const search = searchParams.get("search");
  const studentParam = searchParams.get("student");

  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [numberOfPage, setNumberOfPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { ok, json } = await adminFetchStudentsPerSection(
        sectionID,
        page,
        "latestCompletions",
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

  const studentToView = useMemo(() => {
    return students.find((item) => item.studentUserName === studentParam);
  }, [studentParam, students]);

  const handleView = (studentUserName) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("student", studentUserName);
    router.push(`${pathname}?${currentParams}`);
  };

  if (isLoading) {
    return (
      <div className="students-per-section-loader">
        <BiLoaderAlt />
      </div>
    );
  }

  if (students.length === 0)
    return <p className="no-students-per-section">No students found</p>;

  if (studentToView) return <StudentCompletionsTable student={studentToView} />;

  if (studentParam && !studentToView)
    return <Navigate to={"latest-completions?page=1"} replace={true} />;

  return (
    <>
      <ul className="latest-completions-table">
        <TableHeader />
        <TableData students={students} onView={handleView} />
      </ul>
      <Pagination
        isVisible={students.length !== 0}
        numberOfPage={numberOfPage}
      />
    </>
  );
};

export default AdminLatestStudentCompletion;
