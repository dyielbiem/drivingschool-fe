import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { IoCloseCircleSharp } from "react-icons/io5";

import FormErrorMessage from "./FormErrorMessage";
import FormButton from "./FormButton";
import CreatedSectionModal from "./CreatedSectionModal";

import handleSectionSubmit from "@/actions/handleSectionSubmit";

const CreateSectionForm = ({ setSections }) => {
  const router = useRouter();
  const [isNewSectionCreated, setIsNewSectionCreated] = useState(false);

  const initialState = {
    message: "",
    newSection: null
  };

  const [formState, formAction] = useFormState(
    handleSectionSubmit,
    initialState
  );

  useEffect(() => {
    if (!formState.newSection) return;
    setSections((prevState) => {
      return [{ ...formState.newSection, isActive: false }, ...prevState];
    });

    setIsNewSectionCreated(true);
  }, [formState.newSection, setSections, router]);

  const closeForm = () => {
    router.push("/admin/sections");
  };

  if (isNewSectionCreated) return <CreatedSectionModal />;

  return (
    <div className="create-section-form">
      <form action={formAction}>
        <button type="button" className="close-btn" onClick={() => closeForm()}>
          <IoCloseCircleSharp />
        </button>
        <h3>Create new section</h3>
        <label htmlFor="section-title">
          Section title <span>*</span>
        </label>
        <input type="text" name="section-title" id="section-title" required />
        {formState?.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Submit</FormButton>
      </form>
    </div>
  );
};

export default CreateSectionForm;
