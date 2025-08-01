import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { IoCloseCircleSharp } from "react-icons/io5";

import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";

import handleUpdateAffiliation from "@/actions/handleUpdateAffiliation";

const EditAffiliationForm = ({ affiliationToEdit, onAffiliationEdited }) => {
  const pathname = usePathname();
  const router = useRouter();
  const initialState = {
    errorMessage: null,
    newAffiliation: null
  };

  const initialFormAction = handleUpdateAffiliation.bind(
    null,
    affiliationToEdit.affiliationID
  );

  const [formState, formAction] = useFormState(initialFormAction, initialState);

  useEffect(() => {
    if (!formState.newAffiliation) return;
    onAffiliationEdited(formState.newAffiliation);
    router.replace(pathname);
  }, [formState.newAffiliation, onAffiliationEdited, pathname, router]);

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
        <h3>Edit affiliation</h3>
        <label htmlFor="affiliation-name">
          Name <span>*</span>
        </label>
        <input
          type="text"
          name="affiliation-name"
          id="affiliation-name"
          defaultValue={affiliationToEdit.affiliationName}
          required
        />
        <label htmlFor="affiliation-info">Information</label>
        <input
          type="text"
          name="affiliation-info"
          id="affiliation-info"
          defaultValue={affiliationToEdit.affiliationInfo || ""}
        />
        <label htmlFor="affiliation-code">
          Code <span>*</span>
        </label>
        <input
          type="text"
          name="affiliation-code"
          id="affiliation-code"
          required
          defaultValue={affiliationToEdit.affiliationCode}
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

export default EditAffiliationForm;
