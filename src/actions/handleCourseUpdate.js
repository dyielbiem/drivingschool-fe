"use server";
import adminUpdateCourse from "@/services/api/adminUpdateCourse";

const handleCourseUpdate = async (prevCourse, prevState, formData) => {
  const formDataObject = {
    coursePrice: Number(formData.get("course-price")),
    courseDesc: String(formData.get("course-desc")).trim(),
    isActive: formData.get("is-active") === "true" ? true : false
  };

  if (
    formDataObject.coursePrice === prevCourse?.coursePrice &&
    formDataObject.courseDesc === prevCourse?.courseDesc &&
    formDataObject.isActive === prevCourse?.isActive
  )
    return {
      updatedCourse: {
        ...prevState
      }
    };

  const response = await adminUpdateCourse(
    prevCourse.courseID,
    formDataObject.coursePrice,
    formDataObject.courseDesc,
    formDataObject.isActive
  );

  if (!response.ok)
    return {
      message: response?.json?.error
        ? response?.json?.error
        : "An error occured"
    };

  return {
    message: undefined,
    updatedCourse: response?.json
  };
};

export default handleCourseUpdate;
