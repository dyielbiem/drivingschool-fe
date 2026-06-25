"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RiExternalLinkFill } from "react-icons/ri";
import { BiLoaderAlt } from "react-icons/bi";

import adminFetchStudentsPerSection from "@/services/api/adminFetchStudentsPerSection";

import Navigate from "@/components/Navigate";
import Pagination from "@/components/Pagination";
import StudentExamDetailsTable from "@/components/StudentExamDetailsTable";

const StudentExamDetails = ({ students, studentParam, sectionID }) => {
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

  const search = searchParams.get("search");
  const page = Number(searchParams.get("page"));
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
        null,
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
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("student", studentUserName);
      router.push(`${pathname}?${currentParams}`);
    },
    [pathname, router, searchParams]
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

  if (studentParam)
    return (
      <StudentExamDetails
        students={students}
        studentParam={studentParam}
        sectionID={sectionID}
      />
    );

  return (
    <>
      <ul className="exam-details-table">
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

export default AdminStudentExams;
