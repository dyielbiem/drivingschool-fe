import { useRouter } from "next/navigation";
import { IoCloseCircleSharp } from "react-icons/io5";
import FormErrorMessage from "./FormErrorMessage";
import { useFormState } from "react-dom";
import FormButton from "./FormButton";
import handleChapterSubmit from "@/actions/handleChapterSubmit";
import { useEffect } from "react";

const AddChapterForm = ({ sectionID, setNewChapter }) => {
  const router = useRouter();

  const handleChapterSubmitWithSection = handleChapterSubmit.bind(
    null,
    sectionID
  );

  const initialState = {
    message: "",
    newChapter: null
  };

  const [formState, formAction] = useFormState(
    handleChapterSubmitWithSection,
    initialState
  );

  useEffect(() => {
    if (!formState.newChapter) return;
    setNewChapter(formState?.newChapter);

    router.replace(`/admin/sections/${sectionID}`);
  }, [formState.newChapter, router, sectionID, setNewChapter]);

  const closeForm = () => {
    router.push(`/admin/sections/${sectionID}`);
  };

  return (
    <div className="add-chapter-form">
      <form action={formAction}>
        <button type="button" className="close-btn" onClick={() => closeForm()}>
          <IoCloseCircleSharp />
        </button>
        <h3>Add new chapter</h3>
        <label htmlFor="chapter-title">
          Chapter title <span>*</span>
        </label>
        <input type="text" name="chapter-title" id="chapter-title" required />
        {formState?.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Submit</FormButton>
      </form>
    </div>
  );
};

export default AddChapterForm;
