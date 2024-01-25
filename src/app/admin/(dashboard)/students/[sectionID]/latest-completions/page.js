"use client";
import { useEffect, useState } from "react";
import adminFetchLatestStudentCompletions from "@/services/api/adminFetchLatestStudentCompletions";
import { usePathname } from "next/navigation";
import { RiExternalLinkFill } from "react-icons/ri";

const AdminLatestStudentCompletion = () => {
  const sectionID = usePathname().split("/").at(3);
  const [latestCompletions, setLatestCompletions] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      const response = await adminFetchLatestStudentCompletions(sectionID);
      setLatestCompletions(response.ok ? response.json.latestCompletions : []);
    };

    fetchSections();
  }, [sectionID]);

  const renderLatestCompletions = () => {
    if (latestCompletions.length === 0) return <></>;

    return (
      <ul className="latest-completions-table">
        <li className="table-header">
          <p>Username</p>
          <p>Name</p>
          <p>Registration Date</p>
          <p>Completion Date</p>
        </li>
        {latestCompletions.map((student, index) => (
          <li key={index}>
            <p>{student.studentUserName}</p>
            <p>
              {student.mailingFirstName} {student.mailingLastName}
            </p>
            <p>{student.enrollmentDate}</p>
            <p>{student.completionDate}</p>
            <div>
              <p>View Details</p>
              <RiExternalLinkFill />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return renderLatestCompletions();
};

export default AdminLatestStudentCompletion;
