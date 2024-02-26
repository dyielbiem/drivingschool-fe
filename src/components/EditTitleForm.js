import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect } from "react";

const EditTitleForm = ({
  prevTitle,
  setItemToEdit,
  updateAction,
  pathWhenCancelled
}) => {
  const router = useRouter();

  const initialState = {
    updatedTitle: undefined
  };

  const [formState, formAction] = useFormState(updateAction, initialState);

  useEffect(() => {
    if (!formState.updatedTitle) return;
    setItemToEdit((prevState) => {
      if (prevState?.sectionTitle)
        return { ...prevState, sectionTitle: formState?.updatedTitle };
      if (prevState?.chapterTitle)
        return { ...prevState, chapterTitle: formState?.updatedTitle };
      if (prevState?.subChapterTitle)
        return {
          ...prevState,
          subChapterTitle: formState?.updatedTitle
        };
    });

    router.push(pathWhenCancelled);
  }, [formState.updatedTitle, pathWhenCancelled, router, setItemToEdit]);

  const handleCancelClick = () => {
    router.push(pathWhenCancelled);
  };

  return (
    <form className="edit-title-form" action={formAction}>
      <input
        type="text"
        required
        defaultValue={prevTitle}
        name="new-title"
        id="new-title"
      />
      <div className="btn-container">
        <button type="submit">Update</button>
        <button type="button" onClick={handleCancelClick}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditTitleForm;
