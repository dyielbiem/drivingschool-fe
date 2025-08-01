"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Tooltip } from "react-tooltip";

import Navigate from "@/components/Navigate";

import adminFetchAffiliation from "@/services/api/adminFetchAffiliation";
import adminFetchAffiliationStudents from "@/services/api/adminFetchAffiliationStudents";
import adminFetchCourses from "@/services/api/adminFetchCourses";
import { formatDate } from "@/utils";

const Header = ({ affiliation }) => {
  const router = useRouter();
  const { affiliationName, affiliationInfo, affiliationCode } = affiliation;

  return (
    <div className="header">
      <div>
        <button
          type="button"
          onClick={() => router.push("/admin/affiliations")}
        >
          <IoMdArrowRoundBack />
        </button>
        <h1>{affiliationName}</h1>
      </div>
      <div>
        <p>
          <strong>Information: </strong> {affiliationInfo || "--"}
        </p>
        <p>
          <strong>Code: </strong> {affiliationCode}
        </p>
      </div>
    </div>
  );
};

const StudentTable = ({ students, courses }) => {
  if (students.length === 0)
    return (
      <p className="no-students">This affiliation has no enrolled students.</p>
    );

  return (
    <ul className="affiliation-student-table">
      <li>
        <div>Username</div>
        <div>Name</div>
        <div>Email</div>
        <div>Course Enrolled</div>
        <div>Course Amount</div>
        <div>Enrollment date</div>
        <div>Status</div>
      </li>
      {students.map((student, idx) => {
        const {
          studentUserName,
          mailingFirstName,
          mailingLastName,
          mailingEmail,
          courseID,
          enrollmentDate,
          isActive
        } = student;
        const enrolledCourse =
          courses.find((c) => c.courseID === courseID) || {};

        return (
          <li key={idx}>
            <div>{studentUserName}</div>
            <div>
              {mailingFirstName} {mailingLastName}
            </div>
            <div>{mailingEmail}</div>
            <div
              data-tooltip-id="affiliation-student-tooltip"
              data-tooltip-content={
                enrolledCourse.courseName || "Deleted course"
              }
            >
              {enrolledCourse.courseName || "Deleted course"}
            </div>
            <div>$ {enrolledCourse.coursePrice || "XX.XX"}</div>
            <div>{formatDate(enrollmentDate)}</div>
            <div
              className={`${
                isActive
                  ? "bg-custom-green-light text-custom-green-base"
                  : "bg-custom-gray-base text-custom-gray-dark"
              }`}
            >
              {isActive ? "ACTIVE" : "INACTIVE"}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const AffiliationDetail = ({ params: { affiliationID } }) => {
  const [affiliation, setAffiliation] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        { ok, json: affiliation },
        { json: students },
        {
          json: { courses }
        }
      ] = await Promise.all([
        adminFetchAffiliation(affiliationID),
        adminFetchAffiliationStudents(affiliationID),
        adminFetchCourses()
      ]);

      ok &&
        (setAffiliation(affiliation),
        setStudents(students),
        setCourses(courses));
      setIsFetching(false);
    };

    fetchData();
  }, [affiliationID]);

  if (isFetching) return null;

  if (!isFetching && !affiliation)
    return <Navigate to={"/admin/affiliations"} replace={true} />;

  return (
    <div className="admin-affiliation-detail">
      <Header affiliation={affiliation} />
      <StudentTable students={students} courses={courses} />
      <Tooltip id="affiliation-student-tooltip" style={{ maxWidth: "250px" }} />
    </div>
  );
};

export default AffiliationDetail;
