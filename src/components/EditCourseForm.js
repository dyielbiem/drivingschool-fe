import { IoCloseCircleSharp } from "react-icons/io5";
import { BiSolidCloudUpload } from "react-icons/bi";
import FormButton from "./FormButton";
import handleCourseUpdate from "@/actions/handleCourseUpdate";
import { useFormState } from "react-dom";
import FormErrorMessage from "./FormErrorMessage";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const EditCourseForm = ({ prevCourse, setCourses, setImageRefresher }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [imageToUpload, setImageToUpload] = useState(undefined);

  const initialState = {
    updatedCourse: undefined,
    message: undefined
  };

  const handlecourseUpdateWithPrevCourse = handleCourseUpdate.bind(
    prevCourse,
    prevCourse
  );

  const [formState, formAction] = useFormState(
    handlecourseUpdateWithPrevCourse,
    initialState
  );

  useEffect(() => {
    if (!formState?.updatedCourse) return;
    setCourses((prevState) =>
      prevState.map((course) => {
        if (course.courseID !== formState.updatedCourse.courseID) return course;
        return {
          ...course,
          coursePrice: formState?.updatedCourse?.coursePrice,
          courseDesc: formState?.updatedCourse?.courseDesc,
          isActive: formState?.updatedCourse?.isActive
        };
      })
    );
    setImageRefresher(new Date().getTime());
    router.push(pathname);
  }, [
    formState.updatedCourse,
    pathname,
    router,
    setCourses,
    setImageRefresher
  ]);

  const handleImgUpload = (event) => {
    if (!event?.target?.files[0]) return;
    const file = event.target.files[0];
    if (!String(file.type).includes("image")) {
      event.target.value = "";
      return setImageToUpload(undefined);
    }
    setImageToUpload(URL.createObjectURL(file));
  };

  const renderCourseImage = () => {
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
          onChange={(event) => handleImgUpload(event)}
        />
        <Image
          priority
          height={500}
          width={500}
          alt="course-image"
          src={
            imageToUpload ||
            `${process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL}/image/course/${
              prevCourse.courseID
            }?time_stamp=${new Date().getTime()}`
          }
          unoptimized={true}
        />
      </div>
    );
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
        <p className="course-name">
          Course name: <span>{prevCourse.courseName}</span>
        </p>
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
        {renderCourseImage()}
        {formState?.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Update</FormButton>
      </form>
    </div>
  );
};

export default EditCourseForm;
