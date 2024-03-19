"use client";
import { RiExternalLinkFill } from "react-icons/ri";
import { useStudentsInSection } from "@/state/store";
import dateFormatter from "@/utils/dateFormatter";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";

const AdminLatestStudentCompletion = () => {
  const { students, noOfRows } = useStudentsInSection();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));

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

  const renderCompletions = () => {
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
              <div>
                <p>View Details</p>
                <RiExternalLinkFill />
              </div>
            </li>
          );
        })}
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
      {renderCompletions()}
      {renderPagination()}
    </>
  );
};

export default AdminLatestStudentCompletion;
