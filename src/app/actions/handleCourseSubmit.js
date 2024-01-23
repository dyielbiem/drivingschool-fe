"use server";
import adminAddCourse from "@/services/api/adminAddCourse";

const handleCourseSubmit = async (prevState, formData) => {
  const formDataObject = {
    courseName: formData.get("course-name"),
    courseDescription: formData.get("course-description"),
    coursePrice: formData.get("course-price"),
    courseType: formData.get("course-type")
  };

  const response = await adminAddCourse(
    formDataObject.courseName,
    formDataObject.courseDescription,
    formDataObject.coursePrice,
    formDataObject.courseType
  );

  if (!response.ok)
    return {
      message: response.json.error ? response.json.error : "An error occured"
    };

  return {
    newCourse: response.json
  };
};

export default handleCourseSubmit;
