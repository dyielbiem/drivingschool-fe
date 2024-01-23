import { useRouter } from "next/navigation";
import { IoCloseCircleSharp } from "react-icons/io5";
import FormErrorMessage from "./FormErrorMessage";
import { useFormState } from "react-dom";
import FormButton from "./FormButton";
import handleSectionSubmit from "@/app/actions/handleSectionSubmit";
import { useEffect } from "react";

const CreateSectionForm = ({ setSections }) => {
  const router = useRouter();

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
      if (!prevState) return prevState;

      const newState = prevState.map((item) => {
        return { ...item, isActive: false };
      });

      return [{ ...formState.newSection, isActive: true }, ...newState];
    });

    router.push("/admin/sections");
  }, [formState.newSection, setSections, router]);

  const closeForm = () => {
    router.push("/admin/sections");
  };

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
