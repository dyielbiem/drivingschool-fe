"use client";
import { FaTrashCan } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import { useStudentsInSection } from "@/state/store";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";

const AdminAllStudents = () => {
  const { students, noOfRows } = useStudentsInSection();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const searchKey = searchParams.get("search");

  const sortAlphabetical = (a, b) =>
    a.studentUserName.localeCompare(b.studentUserName);

  const filterStudents = () => {
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

  const studentsPerPage = () => {
    if (students.length === 0) return [];
    const firstStudentToShow = (page - 1) * noOfRows;
    const lastStudentToShow = (page - 1) * noOfRows + noOfRows;
    return students
      .sort(sortAlphabetical)
      .slice(firstStudentToShow, lastStudentToShow);
  };

  const studentsToRender = () => {
    if (searchKey) {
      return filterStudents();
    }
    return studentsPerPage();
  };

  const renderHeaderTitle = () => {
    return (
      <li className="table-header">
        <p>Username</p>
        <p>Name</p>
        <p>Email Address</p>
        <p>Lesson Progress</p>
        <p>Status</p>
      </li>
    );
  };

  const renderActionButtons = () => {
    return (
      <div>
        <button>
          <FaPen />
        </button>
        <button>
          <FaTrashCan />
        </button>
      </div>
    );
  };

  const renderStudents = () => {
    const students = studentsToRender();
    if (students.length === 0) return null;
    return (
      <ul className="all-students-table">
        {renderHeaderTitle()}
        {students.map((eachStudent, index) => (
          <li key={index}>
            <p>{eachStudent.studentUserName}</p>
            <p>
              {eachStudent.mailingFirstName} {eachStudent.mailingLastName}
            </p>
            <p>{eachStudent.mailingEmail}</p>
            <p>
              {eachStudent.isCourseCompleted
                ? "Completed"
                : eachStudent.chapterProgress
                  ? `Chapter ${eachStudent.chapterProgress}`
                  : "In progress"}
            </p>
            <p
              className={`${
                eachStudent.isActive
                  ? "bg-custom-green-light text-custom-green-base"
                  : "bg-custom-gray-base text-custom-gray-dark"
              }`}
            >
              {eachStudent.isActive ? "ACTIVE" : "INACTIVE"}
            </p>
            {renderActionButtons()}
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
      {renderStudents()}
      {renderPagination()}
    </>
  );
};

export default AdminAllStudents;
