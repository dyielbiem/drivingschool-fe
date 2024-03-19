"use client";
import { useStudentsInSection } from "@/state/store";
import { useSearchParams } from "next/navigation";
import dateFormatter from "@/utils/dateFormatter";
import Pagination from "@/components/Pagination";

const AdminLatestStudentRegistration = () => {
  const { students, noOfRows } = useStudentsInSection();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));

  const sortDateLatestToOldestCB = (a, b) => {
    const dateA = new Date(a?.enrollmentDate);
    const dateB = new Date(b?.enrollmentDate);
    if (dateA && dateB == "Invalid Date") return -1;
    if (dateA == "Invalid Date" && dateB) return 1;
    if (dateA && dateB) return dateB - dateA;
    return 0;
  };

  const filteredRegistrations = () => {
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

  const registrationsPerPage = () => {
    if (students.length === 0) return [];
    const firstStudentToShow = (page - 1) * noOfRows;
    const lastStudentToShow = (page - 1) * noOfRows + noOfRows;
    return [...students]
      .sort(sortDateLatestToOldestCB)
      .slice(firstStudentToShow, lastStudentToShow);
  };

  const registrationsToRender = () => {
    if (searchParams.get("search")) {
      return filteredRegistrations();
    }
    return registrationsPerPage();
  };

  const renderHeaderTitle = () => {
    return (
      <li className="table-header">
        <p>Username</p>
        <p>Registration Date</p>
        <p>Name</p>
        <p>Email Address</p>
        <p>Phone No.</p>
        <p>Address</p>
        <p>Course Type</p>
        <p>Status</p>
      </li>
    );
  };

  const renderRegistrations = () => {
    const registrations = registrationsToRender();
    return (
      <ul className="latest-registrations-table">
        {renderHeaderTitle()}
        {registrations.map((eachRegistation, index) => {
          return (
            <li key={index}>
              <p>{eachRegistation.studentUserName}</p>
              <p>{dateFormatter(eachRegistation.enrollmentDate)}</p>
              <p>
                {eachRegistation.mailingFirstName}{" "}
                {eachRegistation.mailingLastName}
              </p>
              <p>{eachRegistation.mailingEmail}</p>
              <p>{eachRegistation.mailingPhoneNumber}</p>
              <p>{eachRegistation.mailingAddress}</p>
              <p>{eachRegistation.courseType}</p>
              <p
                className={`${
                  eachRegistation.isActive
                    ? "bg-custom-green-light text-custom-green-base"
                    : "bg-custom-gray-base text-custom-gray-dark"
                }`}
              >
                {eachRegistation.isActive ? "ACTIVE" : "INACTIVE"}
              </p>
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
      {renderRegistrations()}
      {renderPagination()}
    </>
  );
};

export default AdminLatestStudentRegistration;
