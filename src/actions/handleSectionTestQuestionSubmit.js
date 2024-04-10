"use server";
import adminAddSectionTestQuestion from "@/services/api/adminAddSectionTestQuestion";

const handleSectionTestQuestionSubmit = async (
  sectionID,
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

  const response = await adminAddSectionTestQuestion(
    sectionID,
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

export default handleSectionTestQuestionSubmit;
