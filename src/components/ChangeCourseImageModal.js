import { usePathname, useRouter } from "next/navigation";
import { IoCloseCircleSharp } from "react-icons/io5";
import { BiSolidCloudUpload } from "react-icons/bi";
import { LuLoader2 } from "react-icons/lu";
import { useRef, useState } from "react";
import adminGetS3UploadCourseImageSignedURL from "@/services/api/adminGetS3UploadCourseImageSignedURL";
import adminPutS3Image from "@/services/api/adminPutS3Image";
import Image from "next/image";

const ChangeCourseImageModal = ({ course, setImageRefresher }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [imageToUpload, setImageToUpload] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const imageInputRef = useRef(undefined);

  const closeModalClick = () => {
    router.push(pathname);
  };

  const renderCustomImageInput = () => {
    if (imageToUpload) return null;
    return (
      <label htmlFor="image-input" className="image-input-box">
        <BiSolidCloudUpload />
        <span>Upload image from your system</span>
      </label>
    );
  };

  const removeImageClick = () => {
    if (!imageInputRef?.current) return;
    imageInputRef.current.value = "";
    setImageToUpload(undefined);
  };

  const renderImageToUpload = () => {
    if (!imageToUpload) return null;
    return (
      <div className="img-to-upload-container">
        <button type="button" onClick={removeImageClick}>
          <IoCloseCircleSharp />
        </button>
        <Image
          alt="image-to-uplod"
          src={URL.createObjectURL(imageToUpload)}
          width={500}
          height={500}
          priority
        />
      </div>
    );
  };

  const handleSubmitClick = async () => {
    if (!imageToUpload) return setErrorMessage("Please upload an image");
    if (!String(imageToUpload?.type).includes("image"))
      return setErrorMessage("The uplaoded file is not an image");
    setIsLoading(true);
    const signedURLResponse = await adminGetS3UploadCourseImageSignedURL(
      course.courseID
    );

    if (!signedURLResponse.ok) {
      setErrorMessage(signedURLResponse?.json?.error || "An error occured");
      return setIsLoading(false);
    }

    const formData = new FormData();
    formData.append("image", imageToUpload);

    const uploadResponse = await adminPutS3Image(
      signedURLResponse?.json?.preSignedURL,
      formData
    );

    if (!uploadResponse.ok) {
      setErrorMessage("An error occured while uploading the image");
      return setIsLoading(false);
    }

    setImageRefresher((prevState) => prevState + 1);
    router.push(pathname);
  };

  return (
    <div className="change-course-image-modal">
      <div>
        <h3>Change course image</h3>
        <p className="course-name">
          <span>Course name:</span> {course.courseName}
        </p>
        <button className="close-btn" onClick={closeModalClick}>
          <IoCloseCircleSharp />
        </button>
        {renderCustomImageInput()}
        <input
          ref={imageInputRef}
          type="file"
          id="image-input"
          accept="image/*"
          name="image-input"
          className="hidden"
          onChange={(event) => setImageToUpload(event.target.files[0])}
        />
        {renderImageToUpload()}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          className="submit-btn"
          disabled={isLoading}
          onClick={handleSubmitClick}
        >
          {isLoading && <LuLoader2 />}
          {!isLoading && "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ChangeCourseImageModal;
