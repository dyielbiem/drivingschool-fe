"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

import Navigate from "@/components/Navigate";

import adminFetchAffiliation from "@/services/api/adminFetchAffiliation";
import adminFetchAffiliationStudents from "@/services/api/adminFetchAffiliationStudents";
import { formatDate } from "@/utils";

const Header = ({ affiliation }) => {
  const router = useRouter();
  const { affiliationName, affiliationCode, dateAdded } = affiliation;

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
          <strong>Affiliation code:</strong> {affiliationCode}
        </p>
        <p>
          <strong>Date added: </strong> {formatDate(dateAdded)}
        </p>
      </div>
    </div>
  );
};

const StudentTable = ({ students }) => {
  if (students.length === 0)
    return (
      <p className="no-students">This affiliation has no enrolled students.</p>
    );

  return (
    <ul className="affiliation-student-table">
      <li>
        <div>Username</div>
        <div>Name</div>
        <div>Paid Amount</div>
        <div>Enrollment date</div>
      </li>
      {students.map((student, idx) => {
        const {
          studentUserName,
          mailingFirstName,
          mailingLastName,
          paidAmount,
          enrollmentDate
        } = student;

        return (
          <li key={idx}>
            <div>{studentUserName}</div>
            <div>
              {mailingFirstName} {mailingLastName}
            </div>
            <div>$ {paidAmount}</div>
            <div>{formatDate(enrollmentDate)}</div>
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

  useEffect(() => {
    const fetchData = async () => {
      const [{ ok, json: affiliation }, { json: students }] = await Promise.all(
        [
          adminFetchAffiliation(affiliationID),
          adminFetchAffiliationStudents(affiliationID)
        ]
      );

      ok && (setAffiliation(affiliation), setStudents(students));
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
      <StudentTable students={students} />
    </div>
  );
};

export default AffiliationDetail;
