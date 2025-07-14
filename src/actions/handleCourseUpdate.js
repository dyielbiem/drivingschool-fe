"use server";
import adminUpdateCourse from "@/services/api/adminUpdateCourse";
import adminGetS3UploadCourseImageSignedURL from "@/services/api/adminGetS3UploadCourseImageSignedURL";
import adminPutS3Image from "@/services/api/adminPutS3Image";

const handleCourseUpdate = async (prevCourse, prevState, formData) => {
  const formDataObject = {
    courseName: (formData.get("course-name") || "").trim(),
    coursePrice: Number(formData.get("course-price")),
    courseDesc: (formData.get("course-desc") || "").trim(),
    isActive: formData.get("is-active") === "true" ? true : false,
    img: formData.get("upload-img")
  };

  if (formDataObject?.img?.type?.includes?.("image")) {
    const { ok, json } = await adminGetS3UploadCourseImageSignedURL(
      prevCourse.courseID
    );

    if (!ok)
      return {
        message: json?.error || "An error occured while uploading the image"
      };

    const formData = new FormData();
    formData.append("image", formDataObject.img);
    const uploadResponse = await adminPutS3Image(json?.preSignedURL, formData);

    if (!uploadResponse.ok)
      return {
        message: "An error occured while uploading the image"
      };
  }

  const fieldsToUpdate = [
    "courseName",
    "coursePrice",
    "courseDesc",
    "isActive"
  ];

  if (fieldsToUpdate.every((key) => formDataObject[key] === prevCourse[key]))
    return {
      updatedCourse: prevCourse
    };

  const response = await adminUpdateCourse(
    prevCourse.courseID,
    formDataObject.courseName,
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
