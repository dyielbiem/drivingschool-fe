import { IoCloseCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import handleCourseSubmit from "@/actions/handleCourseSubmit";
import { useFormState } from "react-dom";
import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";
import { useEffect, useRef, useState } from "react";
import { BiSolidCloudUpload } from "react-icons/bi";
import Image from "next/image";

const AddCourseForm = ({ setCourses }) => {
  const router = useRouter();
  const [imageToUpload, setImageToUpload] = useState(undefined);
  const inputImageRef = useRef(undefined);

  const initialState = {
    message: "",
    newCourse: null
  };

  const [formState, formAction] = useFormState(
    handleCourseSubmit,
    initialState
  );

  useEffect(() => {
    if (!formState.newCourse) return;
    setCourses((prevState) => {
      if (!prevState) return prevState;
      return [
        ...prevState,
        {
          ...formState.newCourse,
          isActive: true
        }
      ];
    });

    router.push("/admin/courses");
  }, [formState.newCourse, router, setCourses]);

  const closeForm = () => {
    router.push("/admin/courses");
  };

  const renderUploadImageBox = () => {
    if (imageToUpload) return <></>;
    return (
      <label htmlFor="upload-img" className="upload-img-box">
        <span>
          <BiSolidCloudUpload />
        </span>
        Upload image from your system
      </label>
    );
  };

  const resetImageToUpload = () => {
    if (!inputImageRef) return;
    setImageToUpload(undefined);
    inputImageRef.current.value = "";
  };

  const renderImageToUpload = () => {
    if (!imageToUpload) return null;
    return (
      <div className="img-to-upload-container">
        <button type="button" onClick={resetImageToUpload}>
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

  return (
    <div className="add-course-form">
      <form action={formAction}>
        <button type="button" className="close-btn" onClick={() => closeForm()}>
          <IoCloseCircleSharp />
        </button>
        <h3>Add New Course</h3>
        <label htmlFor="course-name">
          Course name <span>*</span>
        </label>
        <input type="text" name="course-name" id="course-name" required />
        <label htmlFor="course-description">Course description</label>
        <textarea
          type="text"
          name="course-description"
          id="course-description"
        />
        <label htmlFor="course-price">
          Course price <span>*</span>
        </label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          name="course-price"
          id="course-price"
          required
        />
        <label htmlFor="course-type">
          Course type <span>*</span>
        </label>
        <select name="course-type" id="course-type" required defaultValue="">
          <option value="" disabled>
            Select course type
          </option>
          <option value="Online">Online</option>
          <option value="Non-online">Non-online</option>
        </select>
        <label htmlFor="upload-img" className="upload-img">
          Course Image <span>*</span>
        </label>
        {renderUploadImageBox()}
        <input
          ref={inputImageRef}
          type="file"
          id="upload-img"
          name="upload-img"
          accept="image/*"
          className="hidden"
          onChange={(event) => setImageToUpload(event.target.files[0])}
        />
        {renderImageToUpload()}
        {formState?.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Submit</FormButton>
      </form>
    </div>
  );
};

export default AddCourseForm;
