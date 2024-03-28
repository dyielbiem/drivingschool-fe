import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FormButton from "./FormButton";
import { useFormState } from "react-dom";
import handleStudentUpdate from "@/actions/handleStudentUpdate";
import FormErrorMessage from "./FormErrorMessage";
import { useEffect } from "react";
import { useStudentsInSection } from "@/state/store";

const EditStudentForm = ({ student }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUpdateStudent } = useStudentsInSection();

  const initialState = {
    message: undefined,
    oldStudent: student,
    updatedStudent: undefined,
    isUpdated: false
  };

  const [formState, formAction] = useFormState(
    handleStudentUpdate,
    initialState
  );

  useEffect(() => {
    if (!formState.updatedStudent) return;
    if (formState.isUpdated) {
      setUpdateStudent(formState.updatedStudent);
    }

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("edit_student");

    router.push(`${pathname}?${currentParams}`);
  }, [
    formState.isUpdated,
    formState.updatedStudent,
    pathname,
    router,
    searchParams,
    setUpdateStudent
  ]);

  const cancelClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("edit_student");
    router.push(`${pathname}?${currentParams}`);
  };

  return (
    <form className="edit-student-form" action={formAction}>
      <h2>Edit student</h2>
      <div className="fields">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          required
          readOnly
          value={student.studentUserName}
        />
      </div>
      <div className="fields">
        <label htmlFor="is-active">
          Status <span>*</span>
        </label>
        <select
          required
          id="is-active"
          name="is-active"
          defaultValue={student.isActive}
        >
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
      </div>
      <div className="fields">
        <label htmlFor="first-name">
          First name <span>*</span>
        </label>
        <input
          type="text"
          name="first-name"
          id="first-name"
          required
          defaultValue={student.mailingFirstName}
        />
      </div>
      <div className="fields">
        <label htmlFor="last-name">
          Last name <span>*</span>
        </label>
        <input
          type="text"
          name="last-name"
          id="last-name"
          required
          defaultValue={student.mailingLastName}
        />
      </div>
      <div className="fields">
        <label htmlFor="address">
          Address <span>*</span>
        </label>
        <input
          type="text"
          name="address"
          id="address"
          required
          defaultValue={student.mailingAddress}
        />
      </div>
      <div className="fields">
        <label htmlFor="city">
          City <span>*</span>
        </label>
        <input
          type="text"
          name="city"
          id="city"
          required
          defaultValue={student.mailingCity}
        />
      </div>
      <div className="fields">
        <label htmlFor="state">
          State <span>*</span>
        </label>
        <input
          type="text"
          name="state"
          id="state"
          required
          defaultValue={student.mailingState}
        />
      </div>
      <div className="fields">
        <label htmlFor="zip">
          Zip Code <span>*</span>
        </label>
        <input
          type="text"
          name="zip"
          id="zip"
          required
          defaultValue={student.mailingZip}
        />
      </div>
      <div className="fields">
        <label htmlFor="country">
          Country <span>*</span>
        </label>
        <input
          type="text"
          name="country"
          id="country"
          required
          defaultValue={student.mailingCountry}
        />
      </div>
      <div className="fields">
        <label htmlFor="email">
          Email <span>*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          defaultValue={student.mailingEmail}
        />
      </div>
      <div className="fields">
        <label htmlFor="phone-number">
          Phone Number <span>*</span> (XXX-XXX-XXXX)
        </label>
        <input
          type="text"
          name="phone-number"
          id="phone-number"
          required
          pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
          defaultValue={student.mailingPhoneNumber}
        />
      </div>
      <div className="fields">
        <label htmlFor="company">Company name</label>
        <input
          type="text"
          name="company"
          id="comppany"
          defaultValue={student.mailingCompany}
        />
      </div>
      {formState?.message && (
        <FormErrorMessage>{formState.message}</FormErrorMessage>
      )}
      <div className="btn-container">
        <FormButton>Submit</FormButton>
        <button type="button" onClick={cancelClick}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditStudentForm;
