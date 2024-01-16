"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import adminFetchCourses from "@/services/api/adminFetchCourses";
import AddCourseForm from "@/components/AddCourseForm";

const OfferedCourses = () => {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSections = async () => {
      const response = await adminFetchCourses();
      setCourses(response.ok ? response.json.courses : []);
    };

    fetchSections();
  }, []);

  const handleAddCourseClick = () => {
    router.push("/admin/courses?addNewCourse=true");
  };

  const renderCourses = () => {
    if (!courses || courses.length === 0) return <></>;
    return (
      <>
        <div className="header-title-container">
          <p>Course Name</p>
          <p>Course ID</p>
          <p>Price</p>
          <p>Type</p>
          <p>Status</p>
        </div>
        <ul>
          {courses.map((course, index) => (
            <li key={index}>
              <p>{course.courseName}</p>
              <p>{course.courseID}</p>
              <p>{course.coursePrice}</p>
              <p>{course.courseType}</p>
              <p
                className={`${
                  course.isActive
                    ? "bg-emerald-300 text-emerald-900"
                    : "bg-red-300 text-red-900"
                }`}
              >
                {course.isActive ? "ACTIVE" : "INACTIVE"}
              </p>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <section className="admin-courses-container">
      <div className="header">
        <h1>Offered Courses</h1>
        <button onClick={handleAddCourseClick}>Add new course</button>
      </div>
      {renderCourses()}
      {searchParams.get("addNewCourse") && <AddCourseForm />}
    </section>
  );
};

export default OfferedCourses;
