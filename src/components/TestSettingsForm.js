import { useEffect } from "react";
import { useFormState } from "react-dom";
import { IoCloseCircleSharp } from "react-icons/io5";

import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";

import handleChangeQuestionToShowCount from "@/actions/handleChangeQuestionToShowCount";

const TestSettingsForm = ({
  parentID,
  type,
  hideForm,
  questionToShowCount,
  updateQuestionToShowCount
}) => {
  const initialState = {
    successKey: null,
    updatedQuestionToShowCount: null,
    message: null
  };

  const initialFormAction = handleChangeQuestionToShowCount.bind(
    null,
    parentID,
    type
  );

  const [formState, formAction] = useFormState(initialFormAction, initialState);

  useEffect(() => {
    if (!formState.successKey) return;
    updateQuestionToShowCount(formState.updatedQuestionToShowCount);
    hideForm(true);
  }, [
    formState.successKey,
    formState.updatedQuestionToShowCount,
    hideForm,
    updateQuestionToShowCount
  ]);

  return (
    <div className="test-setting-form">
      <form action={formAction}>
        <button
          type="button"
          className="close-btn"
          onClick={() => hideForm(true)}
        >
          <IoCloseCircleSharp />
        </button>
        <h3>{type === "section" ? "Section" : "Chapter"} test settings</h3>
        <label htmlFor="questions-to-show-count">
          No. of questions to show to students
        </label>
        <input
          type="text"
          name="questions-to-show-count"
          parentID="questions-to-show-count"
          defaultValue={questionToShowCount || null}
        />
        {formState.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Save</FormButton>
      </form>
    </div>
  );
};

export default TestSettingsForm;
