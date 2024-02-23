"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaTrashCan } from "react-icons/fa6";
import { FaPen } from "react-icons/fa6";
import adminFetchCourses from "@/services/api/adminFetchCourses";
import AddCourseForm from "@/components/AddCourseForm";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import adminDeleteCourse from "@/services/api/adminDeleteCourse";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [itemToDelete, setItemDelete] = useState(undefined);

  useEffect(() => {
    const fetchSections = async () => {
      const response = await adminFetchCourses();
      setCourses(response.ok ? response.json.courses : []);
    };

    fetchSections();
  }, []);

  useEffect(() => {
    if (!courses) return;
    if (!searchParams.get("delete_course")) return setItemDelete(undefined);
    const courseToDelete = courses.find(
      (course) => course.courseID === searchParams.get("delete_course")
    );

    setItemDelete(
      courseToDelete?.courseName ? courseToDelete?.courseName : undefined
    );
  }, [courses, searchParams]);

  const handleAddCourseClick = () => {
    router.push("/admin/courses?add_course=true");
  };

  const handleDeleteCourseClick = (courseID) => {
    router.push(`${pathname}?delete_course=${courseID}`);
  };

  const renderCourses = () => {
    if (!courses || courses.length === 0) return <></>;
    return (
      <ul className="course-table">
        <li className="table-header">
          <p>Course Name</p>
          <p>Price</p>
          <p>Description</p>
          <p>Course Type</p>
          <p>Status</p>
        </li>
        {courses.map((course, index) => (
          <li key={index}>
            <p
              className={`course-name`}
              onMouseOver={(event) =>
                event.target.setAttribute("hover-text", course.courseName)
              }
            >
              {course.courseName.length < 32
                ? course.courseName
                : course.courseName.slice(0, 32) + "..."}
            </p>
            <p>$ {parseFloat(course.coursePrice).toFixed(2)}</p>
            <p>
              {course.courseDesc
                ? course.courseDesc.length < 32
                  ? course.courseDesc
                  : course.courseDesc.slice(0, 32) + "..."
                : ""}
            </p>
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
              <button onClick={() => handleDeleteCourseClick(course.courseID)}>
                <FaTrashCan />
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const deleteCourseAction = async () => {
    const response = await adminDeleteCourse(searchParams.get("delete_course"));
    if (!response.ok) return;
    setCourses((prevState) =>
      [...prevState].filter(
        (course) => course.courseID !== searchParams.get("delete_course")
      )
    );
    router.push(pathname);
  };

  return (
    <section className="admin-courses-container">
      <div className="header">
        <h1>Manage Courses</h1>
        <button onClick={handleAddCourseClick}>Add new course</button>
      </div>
      {renderCourses()}
      {searchParams.get("add_course") && (
        <AddCourseForm setCourses={setCourses} />
      )}
      {itemToDelete && (
        <ConfirmDeleteModal
          pathWhenModalIsClosed={pathname}
          itemToDelete={itemToDelete}
          confirmAction={deleteCourseAction}
        />
      )}
    </section>
  );
};

export default ManageCourses;
