"use server";
import adminAddCourse from "@/services/api/adminAddCourse";
import adminGetS3UploadCourseImageSignedURL from "@/services/api/adminGetS3UploadCourseImageSignedURL";
import adminPutS3Image from "@/services/api/adminPutS3Image";

const handleCourseSubmit = async (prevState, formData) => {
  const formDataObject = {
    courseName: formData.get("course-name"),
    courseDescription: formData.get("course-description"),
    coursePrice: formData.get("course-price"),
    courseType: formData.get("course-type"),
    courseImage: formData.get("upload-img")
  };

  if (formDataObject?.courseImage?.name === "undefined")
    return {
      message: "Please upload a course image"
    };
  if (!String(formDataObject?.courseImage?.type).includes("image"))
    return {
      message: "The uploaded file is not an image"
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

  const {
    json: { preSignedURL }
  } = await adminGetS3UploadCourseImageSignedURL(response?.json?.courseID);

  if (preSignedURL) {
    const imageFormData = new FormData();
    imageFormData.append("image", formData.courseImage);
    await adminPutS3Image(preSignedURL, imageFormData);
  }

  return {
    newCourse: response.json
  };
};

export default handleCourseSubmit;
