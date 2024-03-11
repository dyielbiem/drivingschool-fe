"use client";
import { RiExternalLinkFill } from "react-icons/ri";
import { useStudentsInSection } from "@/state/store";
import dateFormatter from "@/utils/dateFormatter";
import { useSearchParams } from "next/navigation";

const AdminLatestStudentCompletion = () => {
  const { students } = useStudentsInSection();
  const searchParams = useSearchParams();

  const renderLatestCompletions = () => {
    if (students.length === 0) return <></>;

    const sortedStudents = students.sort(
      (a, b) => new Date(b?.completionDate) - new Date(a?.completionDate)
    );

    return (
      <ul className="latest-completions-table">
        <li className="table-header">
          <p>Username</p>
          <p>Name</p>
          <p>Registration Date</p>
          <p>Completion Date</p>
        </li>
        {sortedStudents.map((student, index) => {
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
              <p>{dateFormatter(student.enrollmentDate)}</p>
              <p>{dateFormatter(student.completionDate)}</p>
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

  return renderLatestCompletions();
};

export default AdminLatestStudentCompletion;
