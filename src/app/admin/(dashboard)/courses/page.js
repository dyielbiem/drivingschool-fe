"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { FaTrashCan, FaPen } from "react-icons/fa6";
import { IoAddSharp } from "react-icons/io5";

import adminFetchCourses from "@/services/api/adminFetchCourses";
import adminDeleteCourse from "@/services/api/adminDeleteCourse";

import AddCourseForm from "@/components/AddCourseForm";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import EditCourseForm from "@/components/EditCourseForm";

const BUCKET_URL = process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL;

const ActionBtns = ({ courseID }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleEditCourseClick = (courseID) => {
    router.push(`${pathname}?edit_course=${courseID}`);
  };

  const handleDeleteCourseClick = (courseID) => {
    router.push(`${pathname}?delete_course=${courseID}`);
  };

  return (
    <div className="btn-container">
      <button onClick={() => handleEditCourseClick(courseID)}>
        <FaPen />
      </button>
      <button onClick={() => handleDeleteCourseClick(courseID)}>
        <FaTrashCan />
      </button>
    </div>
  );
};

const Courses = ({ courses, imageRefresher }) => {
  if (!courses || courses.length === 0) return null;
  return (
    <ul className="course-table">
      {courses.map((course, index) => {
        const {
          courseID,
          courseName,
          coursePrice,
          courseDesc,
          courseType,
          isActive
        } = course;

        return (
          <li key={index}>
            <p
              className={`${
                isActive
                  ? "bg-custom-green-light text-custom-green-base border-custom-green-base"
                  : "bg-custom-gray-base text-custom-gray-dark border-custom-gray-dark"
              } status`}
            >
              {isActive ? "ACTIVE" : "INACTIVE"}
            </p>
            <Image
              alt="course-image"
              src={`${BUCKET_URL}/image/course/${courseID}?image_refresher=${imageRefresher}`}
              width={350}
              height={350}
              priority
            />
            <div className="course-details">
              <p
                className="course-name"
                data-tooltip-id="course-name-tooltip"
                data-tooltip-content={courseName}
                data-tooltip-place="bottom-start"
              >
                {courseName.length < 50
                  ? courseName
                  : courseName.slice(0, 50) + "..."}
              </p>
              <p className="course-type">
                <span>Course Type:</span> {courseType}
              </p>
              <p
                className={`course-desc ${course?.courseDesc ? "" : "hidden"}`}
              >
                {courseDesc}
              </p>
            </div>
            <div className="bottom">
              <p className="course-price">
                $ {parseFloat(coursePrice).toFixed(2)}
              </p>
              <ActionBtns courseID={courseID} />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const ManageCourses = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [imageRefresher, setImageRefresher] = useState(new Date().getTime());

  useEffect(() => {
    const fetchSections = async () => {
      const response = await adminFetchCourses();
      setCourses(response.ok ? response.json.courses : []);
    };

    fetchSections();
  }, []);

  const itemToEdit = useMemo(() => {
    const courseToEditID = searchParams.get("edit_course");
    if (!courseToEditID) return null;
    return courses?.find((course) => course.courseID === courseToEditID);
  }, [searchParams, courses]);

  const itemToDelete = useMemo(() => {
    const courseToDeleteID = searchParams.get("delete_course");
    if (!courseToDeleteID) return null;
    return courses?.find((course) => course.courseID === courseToDeleteID)
      ?.courseName;
  }, [searchParams, courses]);

  const handleAddCourseClick = () => {
    router.push("/admin/courses?add_course=true");
  };

  const handleCourseDelete = async () => {
    const response = await adminDeleteCourse(searchParams.get("delete_course"));
    if (!response.ok) return;
    setCourses((prevState) =>
      [...prevState].filter(
        (course) => course.courseID !== searchParams.get("delete_course")
      )
    );
    router.push(pathname);
  };

  const handleCourseUpdate = useCallback(
    (updatedCourse) => {
      setCourses((prevState) =>
        prevState.map((course) => {
          const { courseID, courseName, coursePrice, courseDesc, isActive } =
            updatedCourse;

          if (course.courseID !== courseID) return course;
          return {
            ...course,
            courseName,
            coursePrice,
            courseDesc,
            isActive
          };
        })
      );
      setImageRefresher(new Date().getTime());
      router.push(pathname);
    },
    [pathname, router]
  );

  return (
    <section className="admin-courses-container">
      <div className="header">
        <h1>Manage Courses</h1>
        <button onClick={handleAddCourseClick}>
          <IoAddSharp />
          <span>Add new course</span>
        </button>
      </div>
      <Courses courses={courses} imageRefresher={imageRefresher} />
      {searchParams.get("add_course") && (
        <AddCourseForm setCourses={setCourses} />
      )}
      {itemToDelete && (
        <ConfirmDeleteModal
          pathWhenModalIsClosed={pathname}
          itemToDelete={itemToDelete}
          confirmAction={handleCourseDelete}
        />
      )}
      {itemToEdit && (
        <EditCourseForm
          prevCourse={itemToEdit}
          onCourseUpdate={handleCourseUpdate}
        />
      )}
      <Tooltip id="course-name-tooltip" className="course-name-tooltip" />
    </section>
  );
};

export default ManageCourses;
