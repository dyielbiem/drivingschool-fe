import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { IoCloseCircleSharp } from "react-icons/io5";

import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";

import handleAddAffiliation from "@/actions/handleAddAffiliation";

const AddAffiliationForm = ({ onAffiliationAdded }) => {
  const pathname = usePathname();
  const router = useRouter();

  const initialState = {
    errorMessage: null,
    newAffiliation: null
  };

  const [formState, formAction] = useFormState(
    handleAddAffiliation,
    initialState
  );

  useEffect(() => {
    if (!formState.newAffiliation) return;
    onAffiliationAdded(formState.newAffiliation);
    router.replace(pathname);
  }, [formState.newAffiliation, onAffiliationAdded, pathname, router]);

  return (
    <div className="affiliation-form">
      <form action={formAction}>
        <button
          type="button"
          className="close-btn"
          onClick={() => router.replace(pathname)}
        >
          <IoCloseCircleSharp />
        </button>
        <h3>Add new affiliation</h3>
        <label htmlFor="affiliation-name">
          Name <span>*</span>
        </label>
        <input
          type="text"
          name="affiliation-name"
          id="affiliation-name"
          required
        />
        <label htmlFor="affiliation-info">Information</label>
        <input type="text" name="affiliation-info" id="affiliation-info" />
        <label htmlFor="affiliation-code">
          Code <span>*</span>
        </label>
        <input
          type="text"
          name="affiliation-code"
          id="affiliation-code"
          required
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\s/g, "");
          }}
          onKeyDown={(e) => {
            if (e.key !== " ") return;
            e.preventDefault();
          }}
        />
        {formState.errorMessage && (
          <FormErrorMessage>{formState.errorMessage}</FormErrorMessage>
        )}
        <FormButton>Submit</FormButton>
      </form>
    </div>
  );
};

export default AddAffiliationForm;
