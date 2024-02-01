import { useRouter } from "next/navigation";
import { IoCloseCircleSharp } from "react-icons/io5";
import FormErrorMessage from "./FormErrorMessage";
import { useFormState } from "react-dom";
import FormButton from "./FormButton";
import handleChapterSubmit from "@/app/actions/handleChapterSubmit";
import { useEffect } from "react";

const AddChapterForm = ({ sectionID, setChapters }) => {
  const router = useRouter();

  const handleChapterSubmitWithSection = handleChapterSubmit.bind(
    sectionID,
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
    setChapters((state) => {
      return [...state, formState?.newChapter];
    });

    router.replace(`/admin/sections/${sectionID}`);
  }, [formState?.newChapter, setChapters, router, sectionID]);

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
