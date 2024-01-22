import { IoCloseCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import adminAddCourse from "@/services/api/adminAddCourse";
import { useState } from "react";

const AddCourseForm = ({ setCourses }) => {
  const router = useRouter();
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [coursePrice, setCoursePrice] = useState(null);
  const [courseType, setCourseType] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await adminAddCourse(
      courseName,
      courseDesc,
      coursePrice,
      courseType
    );
    if (!response.ok)
      return setError(
        response.json.error ? response.json.error : "An error occured"
      );
    setCourses((prevState) => [
      ...prevState,
      {
        courseName,
        courseDesc,
        coursePrice: parseFloat(coursePrice).toFixed(2),
        courseType,
        courseID: response.json.courseID,
        isActive: true
      }
    ]);
    router.push("/admin/courses");
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
        <input
          type="text"
          name="course-name"
          id="course-name"
          required
          value={courseName}
          onChange={(event) => setCourseName(event.target.value)}
        />
        <label htmlFor="course-description">Course description</label>
        <textarea
          type="text"
          name="course-description"
          id="course-description"
          value={courseDesc}
          onChange={(event) => setCourseDesc(event.target.value)}
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
          value={coursePrice}
          onChange={(event) => setCoursePrice(event.target.value)}
        />
        <label htmlFor="course-type">
          Course type <span>*</span>
        </label>
        <select
          name="course-type"
          id="course-type"
          required
          value={courseType}
          onChange={(event) => setCourseType(event.target.value)}
        >
          <option value="" disabled>
            Select course type
          </option>
          <option value="Online">Online</option>
          <option value="Non-online">Non-online</option>
        </select>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddCourseForm;
