"use server";
import adminAddSectionTestQuestion from "@/services/api/adminAddSectionTestQuestion";

const handleSectionTestQuestionSubmit = async (
  sectionID,
  otherChoices,
  prevState,
  formData
) => {
  const formDataObject = {
    question: formData.get("question"),
    correctAnswer: formData.get("correct-answer")
  };

  const response = await adminAddSectionTestQuestion(
    sectionID,
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

export default handleSectionTestQuestionSubmit;
