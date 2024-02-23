import { useRouter, usePathname } from "next/navigation";
import { IoCloseCircleSharp } from "react-icons/io5";
import FormErrorMessage from "./FormErrorMessage";
import { useFormState } from "react-dom";
import FormButton from "./FormButton";
import handleSubChapterSubmit from "@/actions/handleSubChapterSubmit";
import { useEffect } from "react";
import { useSubChapters } from "@/state/store";

const AddSubChapterForm = ({ chapterID }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setNewSubChapter } = useSubChapters();

  const handleSubChapterSubmitWithSection = handleSubChapterSubmit.bind(
    chapterID,
    chapterID
  );

  const initialState = {
    message: "",
    newSubChapter: null
  };

  const [formState, formAction] = useFormState(
    handleSubChapterSubmitWithSection,
    initialState
  );

  useEffect(() => {
    if (!formState.newSubChapter) return;
    setNewSubChapter(formState.newSubChapter);
    router.push(pathname);
  }, [formState.newSubChapter, setNewSubChapter, router, pathname]);

  const closeForm = () => {
    router.push(pathname);
  };

  return (
    <div className="add-sub-chapter-form">
      <form action={formAction}>
        <button type="button" className="close-btn" onClick={closeForm}>
          <IoCloseCircleSharp />
        </button>
        <h3>Add new sub-chapter</h3>
        <label htmlFor="sub-chapter-title">
          Sub-chapter title <span>*</span>
        </label>
        <input
          type="text"
          name="sub-chapter-title"
          id="sub-chapter-title"
          required
        />
        {formState?.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Submit</FormButton>
      </form>
    </div>
  );
};

export default AddSubChapterForm;
