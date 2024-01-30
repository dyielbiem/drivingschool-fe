"use client";
import { FaTrashCan } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import { useStudentsInSection } from "@/state/store";

const AdminAllStudents = () => {
  const { students } = useStudentsInSection();

  const renderAllStudents = () => {
    if (students.length === 0) return <></>;

    return (
      <ul className="all-students-table">
        <li className="table-header">
          <p>Username</p>
          <p>Name</p>
          <p>Email Address</p>
          <p>Lesson Progress</p>
          <p>Status</p>
        </li>
        {students.map((student, index) => (
          <li key={index}>
            <p>{student.studentUserName}</p>
            <p>
              {student.mailingFirstName} {student.mailingLastName}
            </p>
            <p>{student.mailingEmail}</p>
            <p>{student.lessonProgress}</p>
            <p
              className={`${
                student.isActive
                  ? "bg-custom-green-light text-custom-green-base"
                  : "bg-custom-gray-base text-custom-gray-dark"
              }`}
            >
              {student.isActive ? "ACTIVE" : "INACTIVE"}
            </p>
            <div>
              <button>
                <FaPen />
              </button>
              <button>
                <FaTrashCan />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return renderAllStudents();
};

export default AdminAllStudents;
