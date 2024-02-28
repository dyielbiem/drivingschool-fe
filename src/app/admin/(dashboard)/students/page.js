"use client";
import adminFetchStudentSections from "@/services/api/adminFetchStudentSections";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useStudentsInSection } from "@/state/store";
import AddStudentForm from "@/components/AddStudentForm";
import adminFetchCourses from "@/services/api/adminFetchCourses";

const AdminStudents = () => {
  const [studentSections, setStudentSections] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setStudents } = useStudentsInSection();
  const [courses, setCourses] = useState(undefined);

  useEffect(() => {
    const fetchSections = async () => {
      setStudents([]);
      const response = await adminFetchStudentSections();
      setStudentSections(response?.ok ? response.json.studentSections : []);
    };

    fetchSections();
  }, [setStudents]);

  useEffect(() => {
    const fetchMethod = async () => {
      const response = await adminFetchCourses();
      setCourses(
        response?.ok
          ? response.json.courses.filter((course) => course.isActive === true)
          : []
      );
    };

    fetchMethod();
  }, []);

  const handleSectionClick = (id) => {
    router.push(`/admin/students/${id}/all`);
  };

  const handleAddStudentClick = () => {
    router.push(`${pathname}?add_student=true`);
  };

  const renderHeader = () => {
    return (
      <div className="header">
        <h1>Manage Students</h1>
        {searchParams.get("add_student") !== "true" && (
          <button onClick={handleAddStudentClick}>Add student</button>
        )}
      </div>
    );
  };

  const renderStudentSections = () => {
    if (
      studentSections.length === 0 ||
      searchParams.get("add_student") === "true"
    )
      return <></>;
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

  const renderAddStudentForm = () => {
    if (searchParams.get("add_student") !== "true" || !courses) return <></>;
    if (courses.length === 0)
      return <p className="no-course">There is no active offered course</p>;
    return (
      <AddStudentForm
        courses={courses}
        setStudentSections={setStudentSections}
      />
    );
  };

  return (
    <section className="admin-students-container">
      {renderHeader()}
      {renderStudentSections()}
      {renderAddStudentForm()}
    </section>
  );
};

export default AdminStudents;
