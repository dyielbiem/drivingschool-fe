"use client";
import adminFetchStudentSections from "@/services/api/adminFetchStudentSections";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminStudents = () => {
  const [studentSections, setStudentSections] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSections = async () => {
      const response = await adminFetchStudentSections();
      setStudentSections(response?.ok ? response.json.studentSections : []);
    };

    fetchSections();
  }, []);

  const handleSectionClick = (id) => {
    router.push(`/admin/students/${id}/all`);
  };

  const renderStudentSections = () => {
    if (studentSections.length === 0) return <></>;
    return (
      <ul className="student-table">
        <li className="table-header">
          <p>Section Title</p>
          <p>No. of Students</p>
        </li>
        {studentSections.map((item, index) => (
          <li key={index} onClick={() => handleSectionClick(item.sectionID)}>
            <p>{item.sectionTitle}</p>
            <p>{item.NoOfStudents}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className="admin-students-container">
      <div className="header">
        <h1>Manage Students</h1>
      </div>
      {renderStudentSections()}
    </section>
  );
};

export default AdminStudents;
