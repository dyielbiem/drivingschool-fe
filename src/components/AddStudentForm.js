import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

import handleStudentSubmit from "@/actions/handleStudentSubmit";

import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";
import CustomSelect from "./CustomSelect";

const stateOptions = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" }
];

const AddStudentForm = ({ courses, setStudentSections }) => {
  const router = useRouter();
  const pathname = usePathname();
  const initialState = {
    message: undefined,
    ok: false
  };

  const [formState, formAction] = useFormState(
    handleStudentSubmit,
    initialState
  );

  useEffect(() => {
    if (!formState?.ok) return;
    setStudentSections((state) =>
      state.map((item) => {
        if (!item?.isActive) return item;
        return { ...item, NoOfStudents: item.NoOfStudents + 1 };
      })
    );
    router.push(pathname);
  }, [formState?.ok, pathname, router, setStudentSections]);

  const goBack = () => {
    router.push(pathname);
  };

  return (
    <form action={formAction} className="add-student-form" autoComplete="off">
      <div className="header">
        <button type="button" onClick={goBack}>
          <IoMdArrowRoundBack />
        </button>
        <h1>Add student</h1>
      </div>
      <h2>Student</h2>
      <div className="fields">
        <label htmlFor="student-username">
          Username <span>*</span>
        </label>
        <input
          type="text"
          name="student-username"
          id="student-username"
          autoComplete="off"
          required
        />
      </div>
      <div className="fields">
        <label htmlFor="student-course">
          Course <span>*</span>
        </label>
        {/* {renderCourseSelect()} */}
        <CustomSelect
          options={courses}
          required={true}
          placeholder="Select course"
          name="student-course"
          id="student-course"
          labelKey="courseName"
          valueKey="courseID"
        />
      </div>
      <div className="fields">
        <label htmlFor="student-password">
          Password <span>*</span>
        </label>
        <input
          type="password"
          name="student-password"
          id="student-password"
          autoComplete="off"
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
        <CustomSelect
          options={stateOptions}
          required={true}
          placeholder="Select a state"
          name="student-state"
          id="student-state"
        />
      </div>
      <div className="fields">
        <label htmlFor="student-zip">
          Zip value<span>*</span>
        </label>
        <input type="text" name="student-zip" id="student-zip" required />
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
        <label htmlFor="student-high-school">High school name</label>
        <input
          type="text"
          name="student-high-school"
          id="student-high-school"
        />
      </div>
      <h2>Parent</h2>
      <div className="fields">
        <label htmlFor="parent-first-name">First Name</label>
        <input type="text" name="parent-first-name" id="parent-first-name" />
      </div>
      <div className="fields">
        <label htmlFor="parent-last-name">Last name</label>
        <input type="text" name="parent-last-name" id="parent-last-name" />
      </div>
      <div className="fields">
        <label htmlFor="parent-phone">Phone number (XXX-XXX-XXXX)</label>
        <input
          type="text"
          name="parent-phone"
          id="parent-phone"
          pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
        />
      </div>
      <div className="fields">
        <label htmlFor="parent-email">Email</label>
        <input type="email" name="parent-email" id="parent-email" />
      </div>
      {formState?.message && (
        <FormErrorMessage>{formState.message}</FormErrorMessage>
      )}
      <div className="btn-container">
        <FormButton>Submit</FormButton>
        <button type="button" onClick={goBack}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddStudentForm;
