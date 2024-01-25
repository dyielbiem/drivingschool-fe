"use client";
import { useEffect, useState } from "react";
import adminFetchLatestStudentRegistrations from "@/services/api/adminFetchLatestStudentRegistrations";
import { usePathname } from "next/navigation";

const AdminLatestStudentRegistration = () => {
  const sectionID = usePathname().split("/").at(3);
  const [latestRegistrations, setLatestRegistrations] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      const response = await adminFetchLatestStudentRegistrations(sectionID);
      setLatestRegistrations(
        response.ok ? response.json.latestRegistrations : []
      );
    };

    fetchSections();
  }, [sectionID]);

  const renderLatestRegistrations = () => {
    if (latestRegistrations.length === 0) return <></>;

    return (
      <ul className="latest-registrations-table">
        <li className="table-header">
          <p>Username</p>
          <p>Registration Date</p>
          <p>Name</p>
          <p>Email Address</p>
          <p>Phone No.</p>
          <p>Address</p>
          <p>Course Type</p>
          <p>Active</p>
        </li>
        {latestRegistrations.map((student, index) => (
          <li key={index}>
            <p>{student.studentUserName}</p>
            <p>{student.enrollmentDate}</p>
            <p>
              {student.mailingFirstName} {student.mailingLastName}
            </p>
            <p>{student.mailingEmail}</p>
            <p>{student.mailingPhoneNumber}</p>
            <p>{student.mailingAddress}</p>
            <p>{student.courseType}</p>
            <p
              className={`${
                student.isActive
                  ? "bg-custom-green-light text-custom-green-base"
                  : "bg-custom-gray-base text-custom-gray-dark"
              }`}
            >
              {student.isActive ? "ACTIVE" : "INACTIVE"}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  return renderLatestRegistrations();
};

export default AdminLatestStudentRegistration;
