"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import { IoAddSharp } from "react-icons/io5";

import adminFetchCourses from "@/services/api/adminFetchCourses";
import adminDeleteCourse from "@/services/api/adminDeleteCourse";

import AddCourseForm from "@/components/AddCourseForm";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EditCourseForm from "@/components/EditCourseForm";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [itemToDelete, setItemToDelete] = useState(undefined);
  const [itemToEdit, setItemToEdit] = useState(undefined);
  const [imageRefresher, setImageRefresher] = useState(new Date().getTime());

  useEffect(() => {
    const fetchSections = async () => {
      const response = await adminFetchCourses();
      setCourses(response.ok ? response.json.courses : []);
    };

    fetchSections();
  }, []);

  // Observer for delete_course query
  useEffect(() => {
    if (!courses) return;
    if (!searchParams.get("delete_course")) return setItemToDelete(undefined);
    const courseToDelete = courses.find(
      (course) => course.courseID === searchParams.get("delete_course")
    );

    setItemToDelete(
      courseToDelete?.courseName ? courseToDelete?.courseName : undefined
    );
  }, [courses, searchParams]);

  // Observer for edit_course query
  useEffect(() => {
    if (!courses) return;
    if (!searchParams.get("edit_course")) return setItemToEdit(undefined);
    const courseToEdit = courses.find(
      (course) => course.courseID === searchParams.get("edit_course")
    );

    setItemToEdit(courseToEdit || undefined);
  }, [courses, searchParams]);

  const handleAddCourseClick = () => {
    router.push("/admin/courses?add_course=true");
  };

  const handleEditCourseClick = (courseID) => {
    router.push(`${pathname}?edit_course=${courseID}`);
  };

  const handleDeleteCourseClick = (courseID) => {
    router.push(`${pathname}?delete_course=${courseID}`);
  };

  const renderButtons = (course) => {
    return (
      <div className="btn-container">
        <button onClick={() => handleEditCourseClick(course.courseID)}>
          <FaPen />
        </button>
        <button onClick={() => handleDeleteCourseClick(course.courseID)}>
          <FaTrashCan />
        </button>
      </div>
    );
  };

  const renderCourseImage = (courseID) => {
    return (
      <Image
        alt="course-image"
        src={`${process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL}/image/course/${courseID}?image_refresher=${imageRefresher}`}
        width={350}
        height={350}
        unoptimized={true}
        priority
      />
    );
  };

  const renderCourses = () => {
    if (!courses || courses.length === 0) return <></>;
    return (
      <ul className="course-table">
        {courses.map((course, index) => (
          <li key={index}>
            <p
              className={`${
                course.isActive
                  ? "bg-custom-green-light text-custom-green-base border-custom-green-base"
                  : "bg-custom-gray-base text-custom-gray-dark border-custom-gray-dark"
              } status`}
            >
              {course.isActive ? "ACTIVE" : "INACTIVE"}
            </p>
            {renderCourseImage(course.courseID)}
            <div className="course-details">
              <p
                className={`course-name`}
                onMouseOver={(event) =>
                  event.target.setAttribute("hover-text", course.courseName)
                }
              >
                {course.courseName.length < 50
                  ? course.courseName
                  : course.courseName.slice(0, 50) + "..."}
              </p>
              <p className="course-type">
                <span>Course Type:</span> {course.courseType}
              </p>
              <p
                className={`course-desc ${course?.courseDesc ? "" : "hidden"}`}
              >
                {course.courseDesc}
              </p>
            </div>
            <div className="bottom">
              <p className="course-price">
                $ {parseFloat(course.coursePrice).toFixed(2)}
              </p>
              {renderButtons(course)}
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
        <button onClick={handleAddCourseClick}>
          <IoAddSharp />
          <span>Add new course</span>
        </button>
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
      {itemToEdit && (
        <EditCourseForm
          prevCourse={itemToEdit}
          setCourses={setCourses}
          setImageRefresher={setImageRefresher}
        />
      )}
    </section>
  );
};

export default ManageCourses;
