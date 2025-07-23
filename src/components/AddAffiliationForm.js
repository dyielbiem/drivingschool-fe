import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { IoCloseCircleSharp } from "react-icons/io5";

import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";

import handleAddAffiliation from "@/actions/handleAddAffiliation";

const AddAffiliationForm = ({ onAffiliationAdded }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [affiliationCode, setAffiliationCode] = useState("");

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

  if (searchParams.get("add_affiliation") !== "true") return null;

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
          Affiliation name <span>*</span>
        </label>
        <input
          type="text"
          name="affiliation-name"
          id="affiliation-name"
          required
        />
        <label htmlFor="affiliation-code">
          Affiliation code <span>*</span>
        </label>
        <input
          type="text"
          name="affiliation-code"
          id="affiliation-code"
          required
          value={affiliationCode}
          onChange={(e) => {
            setAffiliationCode(e.target.value.replace(/\s/g, ""));
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
