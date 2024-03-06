"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import { PiUploadSimpleFill } from "react-icons/pi";
import adminFetchCourses from "@/services/api/adminFetchCourses";
import AddCourseForm from "@/components/AddCourseForm";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import adminDeleteCourse from "@/services/api/adminDeleteCourse";
import EditCourseForm from "@/components/EditCourseForm";
import ChangeCourseImageModal from "@/components/ChangeCourseImageModal";
import NextImage from "next/image";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [itemToDelete, setItemToDelete] = useState(undefined);
  const [itemToEdit, setItemToEdit] = useState(undefined);
  const [courseImageToChange, setCourseImageToChange] = useState(undefined);
  const [imageRefresher, setImageRefresher] = useState(0);

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

  // Observer for change_course_image query
  useEffect(() => {
    if (!courses) return;
    if (!searchParams.get("change_course_image"))
      return setCourseImageToChange(undefined);
    const courseToChange = courses.find(
      (course) => course.courseID === searchParams.get("change_course_image")
    );

    if (!courseToChange) return setCourseImageToChange(undefined);

    setCourseImageToChange(courseToChange);
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

  const handleUploadClick = (courseID) => {
    router.push(`${pathname}?change_course_image=${courseID}`);
  };

  const renderCourseImage = (courseID) => {
    return (
      <div className="course-img-container">
        <NextImage
          alt="course-image"
          src={`${process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL}/image/course/${courseID}?image_refresher=${imageRefresher}`}
          width={1000}
          height={1000}
          unoptimized={true}
          priority
        />
        <button onClick={() => handleUploadClick(courseID)}>
          <PiUploadSimpleFill />
        </button>
      </div>
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
                  ? course.courseName.toUpperCase()
                  : course.courseName.slice(0, 50).toUpperCase() + "..."}
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
      {itemToEdit && (
        <EditCourseForm prevCourse={itemToEdit} setCourses={setCourses} />
      )}
      {courseImageToChange && (
        <ChangeCourseImageModal
          course={courseImageToChange}
          setImageRefresher={setImageRefresher}
        />
      )}
    </section>
  );
};

export default ManageCourses;
