"use client";
import { RiExternalLinkFill } from "react-icons/ri";
import { useStudentsInSection } from "@/state/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import StudentExamDetailsTable from "@/components/StudentExamDetailsTable";

const AdminStudentExams = () => {
  const { students, noOfRows } = useStudentsInSection();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const searchKey = searchParams.get("search");
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

  const sortAlphabetical = (a, b) =>
    a.studentUserName.localeCompare(b.studentUserName);

  const filterExams = () => {
    if (students.length === 0) return [];
    const searchKeyLowerCase = searchKey.toLowerCase();
    return students
      .filter((eachStudent) => {
        const username = eachStudent.studentUserName.toLowerCase();
        const fullName =
          `${eachStudent.mailingFirstName} ${eachStudent.mailingLastName}`.toLowerCase();

        if (
          username.includes(searchKeyLowerCase) ||
          fullName.includes(searchKeyLowerCase)
        )
          return eachStudent;
      })
      .sort(sortAlphabetical);
  };

  const examsPerPage = () => {
    if (students.length === 0) return [];
    const firstStudentToShow = (page - 1) * noOfRows;
    const lastStudentToShow = (page - 1) * noOfRows + noOfRows;
    return students
      .sort(sortAlphabetical)
      .slice(firstStudentToShow, lastStudentToShow);
  };

  const examsToRender = () => {
    if (searchKey) {
      return filterExams();
    }
    return examsPerPage();
  };

  const renderHeaderTitle = () => {
    if (!students || students?.length === 0) return null;
    return (
      <li className="table-header">
        <p>Username</p>
        <p>Name</p>
        <p>Status</p>
      </li>
    );
  };

  const viewDetailsClick = (studentUserName) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("student", studentUserName);
    router.push(`${pathname}?${currentParams}`);
  };

  const renderExamDetails = () => {
    if (studentToView) return null;
    const exams = examsToRender();
    return (
      <ul className="exam-details-table">
        {renderHeaderTitle()}
        {exams.map((eachExam, index) => (
          <li key={index}>
            <p>
              <span>Username: </span>
              {eachExam.studentUserName}
            </p>
            <p>
              <span>Name: </span>
              {eachExam.mailingFirstName} {eachExam.mailingLastName}
            </p>
            <p
              className={`${
                eachExam.isCourseCompleted
                  ? "text-custom-green-base bg-custom-green-light"
                  : "text-custom-gray-dark bg-custom-gray-base"
              }`}
            >
              {eachExam.isCourseCompleted ? "COMPLETED" : "IN PROGRESS"}
            </p>
            <button onClick={() => viewDetailsClick(eachExam.studentUserName)}>
              <p>View Details</p>
              <RiExternalLinkFill />
            </button>
          </li>
        ))}
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

  const renderStudentExamDetails = () => {
    if (!studentToView) return null;
    return <StudentExamDetailsTable student={studentToView} />;
  };

  return (
    <>
      {renderExamDetails()}
      {renderPagination()}
      {renderStudentExamDetails()}
    </>
  );
};

export default AdminStudentExams;
