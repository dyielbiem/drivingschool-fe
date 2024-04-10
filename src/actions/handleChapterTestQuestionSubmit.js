"use server";
import adminAddChapterTestQuestion from "@/services/api/adminAddChapterTestQuestion";

const handleChapterTestQuestionSubmit = async (
  parentID,
  question,
  otherChoices,
  prevState,
  formData
) => {
  const formDataObject = {
    correctAnswer: formData.get("correct-answer")
  };

  if (!question)
    return {
      message: "Question is required"
    };

  const response = await adminAddChapterTestQuestion(
    parentID,
    question,
    otherChoices,
    formDataObject.correctAnswer
  );

  if (!response.ok)
    return {
      message: response.json.error ? response.json.error : "An error occured"
    };

  return {
    newQuestion: response.json
  };
};

export default handleChapterTestQuestionSubmit;
