"use server";
import adminEditQuestion from "@/services/api/adminEditQuestion";

const handleTestQuestionEdit = async (otherChoices, prevState, formData) => {
  const formDataObject = {
    question: formData.get("question"),
    correctAnswer: formData.get("correct-answer")
  };

  const oldOtherChoices = prevState?.oldQuestion?.choices?.filter(
    (item) => item !== prevState?.oldQuestion?.correctAnswer
  );

  if (
    formDataObject.question === prevState?.oldQuestion?.question &&
    formDataObject.correctAnswer === prevState?.oldQuestion?.correctAnswer &&
    otherChoices?.length === oldOtherChoices?.length &&
    otherChoices.every((choice) => oldOtherChoices.includes(choice))
  )
    return {
      newQuestion: prevState?.oldQuestion
    };

  const response = await adminEditQuestion(
    prevState?.oldQuestion.questionID,
    formDataObject.question,
    formDataObject.correctAnswer,
    otherChoices
  );

  if (!response.ok)
    return {
      message: response.json.error ? response.json.error : "An error occured",
      oldQuestion: prevState.oldQuestion
    };

  const newChoices = [...otherChoices, formDataObject.correctAnswer].sort(
    () => Math.random() - 0.5
  );

  return {
    newQuestion: {
      ...prevState.oldQuestion,
      choices: newChoices,
      question: formDataObject.question,
      correctAnswer: formDataObject.correctAnswer
    }
  };
};

export default handleTestQuestionEdit;
