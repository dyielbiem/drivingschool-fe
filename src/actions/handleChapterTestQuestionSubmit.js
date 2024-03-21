"use server";
import adminAddChapterTestQuestion from "@/services/api/adminAddChapterTestQuestion";

const handleChapterTestQuestionSubmit = async (
  parentID,
  otherChoices,
  prevState,
  formData
) => {
  const formDataObject = {
    question: formData.get("question"),
    correctAnswer: formData.get("correct-answer")
  };

  const response = await adminAddChapterTestQuestion(
    parentID,
    formDataObject.question,
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
