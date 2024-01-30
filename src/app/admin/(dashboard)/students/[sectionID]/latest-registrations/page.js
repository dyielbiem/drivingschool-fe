"use client";
import { useStudentsInSection } from "@/state/store";

const AdminLatestStudentRegistration = () => {
  const { students } = useStudentsInSection();
  const latestRegistrations = [...students].sort(
    (a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate)
  );

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
          <p>Status</p>
        </li>
        {latestRegistrations.map((student, index) => {
          const enrollmentYear = new Date(student.enrollmentDate).getFullYear();
          const enrollmentMonth =
            new Date(student.enrollmentDate).getMonth() + 1;
          const enrollmentDay = new Date(student.enrollmentDate).getDate();

          return (
            <li key={index}>
              <p>{student.studentUserName}</p>
              <p>
                {enrollmentMonth}/{enrollmentDay}/{enrollmentYear}
              </p>
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
          );
        })}
      </ul>
    );
  };

  return renderLatestRegistrations();
};

export default AdminLatestStudentRegistration;
