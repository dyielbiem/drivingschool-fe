"use client";
import { RiExternalLinkFill } from "react-icons/ri";
import { useStudentsInSection } from "@/state/store";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";

const AdminStudentExams = () => {
  const { students, noOfRows } = useStudentsInSection();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const searchKey = searchParams.get("search");

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
    return (
      <li className="table-header">
        <p>Username</p>
        <p>Name</p>
        <p>Status</p>
      </li>
    );
  };

  const renderExamDetails = () => {
    const exams = examsToRender();
    return (
      <ul className="exam-details-table">
        {renderHeaderTitle()}
        {exams.map((eachExam, index) => (
          <li key={index}>
            <p>{eachExam.studentUserName}</p>
            <p>
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
            <div>
              <p>View Details</p>
              <RiExternalLinkFill />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderPagination = () => {
    if (students?.length === 0 || searchParams.get("search")) return null;
    return (
      <Pagination itemsLength={Number(students?.length)} noOfRows={noOfRows} />
    );
  };

  return (
    <>
      {renderExamDetails()}
      {renderPagination()}
    </>
  );
};

export default AdminStudentExams;
