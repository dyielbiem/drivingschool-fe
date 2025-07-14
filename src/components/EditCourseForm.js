import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { IoCloseCircleSharp } from "react-icons/io5";
import { BiSolidCloudUpload } from "react-icons/bi";

import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";

import handleCourseUpdate from "@/actions/handleCourseUpdate";

const BUCKET_URL = process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL;

const CourseImage = ({ courseID, imageToUpload, onImgUpload }) => {
  return (
    <div className="course-img-box">
      <label htmlFor="upload-img">
        <BiSolidCloudUpload />
        <span>Upload image from your system</span>
      </label>
      <input
        type="file"
        accept="image/*"
        id="upload-img"
        name="upload-img"
        onChange={onImgUpload}
      />
      <Image
        priority
        height={500}
        width={500}
        alt="course-image"
        src={
          imageToUpload ||
          `${BUCKET_URL}/image/course/${courseID}?time_stamp=${new Date().getTime()}`
        }
      />
    </div>
  );
};

const EditCourseForm = ({ prevCourse, onCourseUpdate }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [imageToUpload, setImageToUpload] = useState(null);

  const initialState = {
    updatedCourse: null,
    message: null
  };

  const formHandler = handleCourseUpdate.bind(null, prevCourse);
  const [formState, formAction] = useFormState(formHandler, initialState);

  useEffect(() => {
    if (!formState?.updatedCourse) return;
    onCourseUpdate(formState.updatedCourse);
  }, [formState.updatedCourse, onCourseUpdate]);

  const handleImgUpload = (event) => {
    const file = event?.target?.files[0];
    if (file && file.type.includes("image")) {
      setImageToUpload(URL.createObjectURL(file));
      return;
    }

    event.target.value = "";
    return setImageToUpload(null);
  };

  const closeForm = () => {
    router.push(pathname);
  };

  return (
    <div className="edit-course-form">
      <form action={formAction}>
        <button type="button" className="close-btn" onClick={closeForm}>
          <IoCloseCircleSharp />
        </button>
        <h3>Edit course</h3>
        <label htmlFor="course-name">
          Course name <span>*</span>
        </label>
        <textarea
          type="text"
          name="course-name"
          id="course-name"
          defaultValue={prevCourse?.courseName || ""}
          required
        />
        <label htmlFor="course-price">
          Course price ($) <span>*</span>
        </label>
        <input
          type="number"
          name="course-price"
          id="course-price"
          min={0.01}
          step={0.01}
          defaultValue={prevCourse.coursePrice}
          required
        />
        <label htmlFor="course-desc">Course description</label>
        <textarea
          type="text"
          name="course-desc"
          id="course-desc"
          defaultValue={prevCourse?.courseDesc || ""}
        />
        <label htmlFor="is-active">
          Course status <span>*</span>
        </label>
        <select
          name="is-active"
          id="is-active"
          required
          defaultValue={prevCourse.isActive}
        >
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
        <label htmlFor="course-image">
          Course image <span>*</span>
        </label>
        <CourseImage
          courseID={prevCourse.courseID}
          imageToUpload={imageToUpload}
          onImgUpload={handleImgUpload}
        />
        {formState?.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Update</FormButton>
      </form>
    </div>
  );
};

export default EditCourseForm;
