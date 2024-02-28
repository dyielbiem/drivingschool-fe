import FormButton from "./FormButton";
import { useFormState } from "react-dom";
import FormErrorMessage from "./FormErrorMessage";
import handleStudentSubmit from "@/actions/handleStudentSubmit";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const AddStudentForm = ({ courses, setStudentSections }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCourse, setSelectedCourse] = useState({
    courseID: "",
    courseName: ""
  });
  const [isCourseSelectOnFocus, setIsCourseSelectOnFocus] = useState(false);
  const initialState = {
    message: undefined,
    ok: false
  };

  const [formState, formAction] = useFormState(
    handleStudentSubmit,
    initialState
  );

  const handleOptionClick = (courseID, courseName) => {
    setSelectedCourse({ courseID, courseName });
    setIsCourseSelectOnFocus(false);
  };

  if (formState?.ok) {
    setStudentSections((state) =>
      state.map((item) => {
        if (!item?.isActive) return item;
        return { ...item, NoOfStudents: item.NoOfStudents + 1 };
      })
    );
    router.push(pathname);
  }

  const renderCourseSelect = () => {
    return (
      <div
        course-name={selectedCourse.courseName}
        className={`course-select ${
          selectedCourse.courseName ? "" : "before:!hidden"
        }`}
        onClick={() => setIsCourseSelectOnFocus(true)}
        onBlur={() => setIsCourseSelectOnFocus(false)}
      >
        <input
          name="student-course"
          id="student-course"
          value={selectedCourse.courseID}
          required
          readOnly
          placeholder={selectedCourse.courseID ? "" : "Select a course"}
        />
        {isCourseSelectOnFocus && (
          <ul className="custom-option">
            {courses.map((course, index) => (
              <li
                key={index}
                onMouseDown={() =>
                  handleOptionClick(course.courseID, course.courseName)
                }
              >
                {course.courseName}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <form action={formAction} className="add-student-form">
      <h2>Add student</h2>
      <div className="fields">
        <label htmlFor="student-username">
          Username <span>*</span>
        </label>
        <input
          type="text"
          name="student-username"
          id="student-username"
          required
        />
      </div>
      <div className="fields">
        <label htmlFor="student-course">
          Course <span>*</span>
        </label>
        {renderCourseSelect()}
      </div>
      <div className="fields">
        <label htmlFor="student-password">
          Password <span>*</span>
        </label>
        <input
          type="password"
          name="student-password"
          id="student-password"
          required
        />
      </div>
      <div className="fields">
        <label htmlFor="student-confirm-password">
          Confirm password <span>*</span>
        </label>
        <input
          type="password"
          name="student-confirm-password"
          id="student-confirm-password"
          required
        />
      </div>
      <div className="fields">
        <label htmlFor="student-firstname">
          First name <span>*</span>
        </label>
        <input
          type="text"
          name="student-firstname"
          id="student-firstname"
          required
        />
      </div>
      <div className="fields">
        <label htmlFor="student-lastname">
          Last name <span>*</span>
        </label>
        <input
          type="text"
          name="student-lastname"
          id="student-lastname"
          required
        />
      </div>
      <div className="fields student-address">
        <label htmlFor="student-address">
          Address <span>*</span>
        </label>
        <input
          type="text"
          name="student-address"
          id="student-address"
          required
        />
      </div>
      <div className="fields">
        <label htmlFor="student-city">
          City <span>*</span>
        </label>
        <input type="text" name="student-city" id="student-city" required />
      </div>
      <div className="fields">
        <label htmlFor="student-state">
          State <span>*</span>
        </label>
        <input type="text" name="student-state" id="student-state" required />
      </div>
      <div className="fields">
        <label htmlFor="student-zip">
          Zip code<span>*</span>
        </label>
        <input type="text" name="student-zip" id="student-zip" required />
      </div>
      <div className="fields">
        <label htmlFor="student-country">
          Country <span>*</span>
        </label>
        <input
          type="text"
          name="student-country"
          id="student-country"
          required
        />
      </div>
      <div className="fields">
        <label htmlFor="student-email">
          Email <span>*</span>
        </label>
        <input type="email" name="student-email" id="student-email" required />
      </div>
      <div className="fields">
        <label htmlFor="student-phone">
          Phone number <span>*</span> (XXX-XXX-XXXX)
        </label>
        <input
          type="text"
          name="student-phone"
          id="student-phone"
          required
          pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
        />
      </div>
      <div className="fields">
        <label htmlFor="student-company">Company name</label>
        <input type="text" name="student-company" id="student-company" />
      </div>
      {formState?.message && (
        <FormErrorMessage>{formState.message}</FormErrorMessage>
      )}
      <div className="btn-container">
        <FormButton>Submit</FormButton>
        <button type="button">Cancel</button>
      </div>
    </form>
  );
};

export default AddStudentForm;
