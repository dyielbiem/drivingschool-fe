import { useFormState } from "react-dom";
import { IoCloseCircleSharp } from "react-icons/io5";
import FormButton from "./FormButton";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormErrorMessage from "./FormErrorMessage";
import handleTestQuestionEdit from "@/actions/handleTestQuestionEdit";
import {
  useChapterTestQuestions,
  useSectionTestQuestions
} from "@/state/store";
import QuestionEditor from "./QuestionEditor";

const EditQuestionForm = ({ item }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [otherChoices, setOtherChoices] = useState(
    item.choices.filter((eachChoices) => eachChoices !== item.correctAnswer)
  );
  const [question, setQuestion] = useState(item.question);
  const { setUpdateChapterTestQuestion } = useChapterTestQuestions();
  const { setUpdateSectionTestQuestion } = useSectionTestQuestions();

  const closeForm = () => {
    router.push(pathname);
  };

  const initialState = {
    message: "",
    newQuestion: undefined,
    oldQuestion: item
  };

  const submitActionWithBindings = handleTestQuestionEdit.bind(
    null,
    question,
    otherChoices
  );

  const [formState, formAction] = useFormState(
    submitActionWithBindings,
    initialState
  );

  // Update the list of questions after successful edit
  useEffect(() => {
    if (!formState?.newQuestion) return;
    if (pathname.includes("chapter-test")) {
      setUpdateChapterTestQuestion(formState?.newQuestion);
    } else if (pathname.includes("final-test")) {
      setUpdateSectionTestQuestion(formState?.newQuestion);
    }
    router.push(pathname);
  }, [
    formState?.newQuestion,
    pathname,
    router,
    setUpdateChapterTestQuestion,
    setUpdateSectionTestQuestion
  ]);

  const handleOtherChoicesChange = (index, event) => {
    setOtherChoices((prevState) => {
      const newState = [...prevState];
      newState[index] = event.target.value;
      return newState;
    });
  };

  const handleDeleteOtherChoice = (index) => {
    setOtherChoices((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  const renderOtherChoices = () => {
    if (otherChoices.length === 0) return <></>;
    return otherChoices.map((value, index) => (
      <div key={index} className="other-answer-container">
        <input
          type="text"
          name="other-answer"
          id={`other-answer-${index}`}
          className=""
          required
          value={value}
          onChange={(event) => handleOtherChoicesChange(index, event)}
        />
        {index !== 0 && (
          <button onClick={() => handleDeleteOtherChoice(index)} type="button">
            ✕
          </button>
        )}
      </div>
    ));
  };

  return (
    <div className="question-form">
      <form action={formAction}>
        <button type="button" className="close-btn" onClick={closeForm}>
          <IoCloseCircleSharp />
        </button>
        <h3>Edit new question</h3>
        <label htmlFor="question">
          Question <span>*</span>
        </label>
        <QuestionEditor onChange={setQuestion} editorContent={item.question} />
        <label htmlFor="correct-answer">
          Correct Answer <span>*</span>
        </label>
        <input
          type="text"
          name="correct-answer"
          id="correct-answer"
          required
          defaultValue={item.correctAnswer}
        />
        <label>
          Other Answer Choices <span>*</span>
        </label>
        {renderOtherChoices()}
        <button
          onClick={() => setOtherChoices((prevState) => [...prevState, ""])}
          type="button"
          className="add-answer-btn"
        >
          Add more answer
        </button>
        {formState?.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Submit</FormButton>
      </form>
    </div>
  );
};

export default EditQuestionForm;
