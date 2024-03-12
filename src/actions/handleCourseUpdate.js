"use server";
import adminUpdateCourse from "@/services/api/adminUpdateCourse";
import adminGetS3UploadCourseImageSignedURL from "@/services/api/adminGetS3UploadCourseImageSignedURL";
import adminPutS3Image from "@/services/api/adminPutS3Image";

const handleCourseUpdate = async (prevCourse, prevState, formData) => {
  const formDataObject = {
    coursePrice: Number(formData.get("course-price")),
    courseDesc: String(formData.get("course-desc")).trim(),
    isActive: formData.get("is-active") === "true" ? true : false,
    img: formData.get("upload-img")
  };

  if (String(formDataObject?.img?.type).includes("image")) {
    const signedURLResponse = await adminGetS3UploadCourseImageSignedURL(
      prevCourse.courseID
    );

    if (!signedURLResponse.ok)
      return {
        message:
          signedURLResponse?.json?.error ||
          "An error occured while uploading the image"
      };

    const formData = new FormData();
    formData.append("image", formDataObject.img);
    const uploadResponse = await adminPutS3Image(
      signedURLResponse?.json?.preSignedURL,
      formData
    );

    if (!uploadResponse.ok)
      return {
        message: "An error occured while uploading the image"
      };
  }

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
