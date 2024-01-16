import { IoCloseCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

const AddCourseForm = () => {
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const closeForm = () => {
    router.push("/admin/courses");
  };

  return (
    <div className="add-course-form">
      <form action="POST" onSubmit={(event) => handleSubmit(event)}>
        <button type="button" className="close-btn" onClick={() => closeForm()}>
          <IoCloseCircleSharp />
        </button>
        <h3>Add New Course</h3>
        <label htmlFor="course-name">
          Course name <span>*</span>
        </label>
        <input type="text" name="course-name" id="course-name" required />
        <label htmlFor="course-name">Course description</label>
        <textarea type="text" name="course-name" id="course-name" />
        <label htmlFor="course-price">
          Course price <span>*</span>
        </label>
        <input
          type="number"
          min="0.00"
          name="course-price"
          id="course-price"
          required
        />
        <label htmlFor="course-type">
          Course type <span>*</span>
        </label>
        <select name="course-type" id="course-price" required>
          <option value="" selected disabled>
            Select course type
          </option>
          <option value="Online">Online</option>
          <option value="Non-online">Non-online</option>
        </select>
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddCourseForm;
