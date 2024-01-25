"use client";
import { useEffect, useState } from "react";
import adminFetchStudentExamDetails from "@/services/api/adminFetchStudentExamDetails";
import { usePathname } from "next/navigation";
import { RiExternalLinkFill } from "react-icons/ri";

const AdminStudentsExamDetails = () => {
  const sectionID = usePathname().split("/").at(3);
  const [examDetails, setExamDetails] = useState([]);

  useEffect(() => {
    const fetchExamDetails = async () => {
      const response = await adminFetchStudentExamDetails(sectionID);
      setExamDetails(response.ok ? response.json.examDetails : []);
    };

    fetchExamDetails();
  }, [sectionID]);

  const renderAllExamDetails = () => {
    if (examDetails.length === 0) return <></>;

    return (
      <ul className="exam-details-table">
        <li className="table-header">
          <p>Username</p>
          <p>Name</p>
          <p>Status</p>
        </li>
        {examDetails.map((examDetail, index) => (
          <li key={index}>
            <p>{examDetail.studentUserName}</p>
            <p>
              {examDetail.mailingFirstName} {examDetail.mailingLastName}
            </p>
            <p>{examDetail.examStatus.toUpperCase()}</p>
            <div>
              <p>View Details</p>
              <RiExternalLinkFill />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return renderAllExamDetails();
};

export default AdminStudentsExamDetails;
