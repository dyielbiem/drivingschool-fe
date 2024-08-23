"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";

import { useStudentsInSection } from "@/state/store";
import adminFetchStudentSections from "@/services/api/adminFetchStudentSections";

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
    router.push(`/admin/students/${id}/all?page=1`);
  };

  const handleAddStudentClick = () => {
    router.push(`${pathname}?add_student=true`);
  };

  const renderHeader = () => {
    if (searchParams.get("add_student") === "true") return null;
    return (
      <div className="header">
        <h1>Manage Students</h1>
        <button onClick={handleAddStudentClick}>
          <MdOutlinePersonAddAlt1 />
          <span>Add student</span>
        </button>
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
            <p>
              <span>No of students: </span>
              {item.NoOfStudents}
            </p>
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
