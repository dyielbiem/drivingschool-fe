import { IoCloseCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import handleCourseSubmit from "@/app/actions/handleCourseSubmit";
import { useFormState } from "react-dom";
import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";
import { useEffect } from "react";

const AddCourseForm = ({ setCourses }) => {
  const router = useRouter();

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
        {formState?.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Submit</FormButton>
      </form>
    </div>
  );
};

export default AddCourseForm;
