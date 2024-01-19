"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaTrashCan } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import adminFetchCourses from "@/services/api/adminFetchCourses";
import AddCourseForm from "@/components/AddCourseForm";

const ManageCourses = () => {
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
      <ul className="course-table">
        <li className="table-header">
          <p>Course ID</p>
          <p>Course Name</p>
          <p>Price</p>
          <p>Description</p>
          <p>Course Type</p>
          <p>Status</p>
        </li>
        {courses.map((course, index) => (
          <li key={index}>
            <p>{course.courseID}</p>
            <p
              className={`course-name`}
              onMouseOver={(event) =>
                event.target.setAttribute("data-before", course.courseName)
              }
            >
              {course.courseName.length < 16
                ? course.courseName
                : course.courseName.slice(0, 16) + "..."}
            </p>
            <p>$ {course.coursePrice}</p>
            <p>{course.courseDesc ? course.courseDesc : ""}</p>
            <p>{course.courseType} Course</p>
            <p
              className={`${
                course.isActive
                  ? "bg-custom-green-light text-custom-green-base"
                  : "bg-custom-gray-base text-custom-gray-dark"
              }`}
            >
              {course.isActive ? "ACTIVE" : "INACTIVE"}
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

  return (
    <section className="admin-courses-container">
      <div className="header">
        <h1>Manage Courses</h1>
        <button onClick={handleAddCourseClick}>Add new course</button>
      </div>
      {renderCourses()}
      {searchParams.get("addNewCourse") && (
        <AddCourseForm setCourses={setCourses} />
      )}
    </section>
  );
};

export default ManageCourses;
