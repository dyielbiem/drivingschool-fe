"use client";
import { RiExternalLinkFill } from "react-icons/ri";
import { useStudentsInSection } from "@/state/store";
import { useSearchParams } from "next/navigation";

const AdminStudentsstudents = () => {
  const { students } = useStudentsInSection();
  const searchParams = useSearchParams();

  const renderAllstudents = () => {
    if (students.length === 0) return <></>;

    return (
      <ul className="exam-details-table">
        <li className="table-header">
          <p>Username</p>
          <p>Name</p>
          <p>Status</p>
        </li>
        {students.map((student, index) => {
          // Filter students based on search query
          if (searchParams.get("search")) {
            const search = searchParams.get("search");
            const username = student.studentUserName.toLowerCase();
            const fullName =
              `${student.mailingFirstName} ${student.mailingLastName}`.toLowerCase();
            if (!username.includes(search) && !fullName.includes(search))
              return null;
          }

          return (
            <li key={index}>
              <p>{student.studentUserName}</p>
              <p>
                {student.mailingFirstName} {student.mailingLastName}
              </p>
              <p
                className={`${
                  student.isCourseCompleted
                    ? "text-custom-green-base bg-custom-green-light"
                    : "text-custom-gray-dark bg-custom-gray-base"
                }`}
              >
                {student.isCourseCompleted ? "COMPLETED" : "IN PROGRESS"}
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

  return renderAllstudents();
};

export default AdminStudentsstudents;
