"use server";
import adminUpdateSectionQuestionToShowCount from "@/services/api/adminUpdateSectionQuestionToShowCount";
import adminUpdateChapterQuestionToShowCount from "@/services/api/adminUpdateChapterQuestionToShowCount";

const handleChangeQuestionToShowCount = async (
  id,
  type,
  prevState,
  formData
) => {
  const formDataObject = {
    questionToShowCount: formData.get("questions-to-show-count")
  };

  const patchMethod = {
    section: adminUpdateSectionQuestionToShowCount,
    chapter: adminUpdateChapterQuestionToShowCount
  };

  const { ok, json } = await patchMethod[type](
    id,
    Number(formDataObject.questionToShowCount)
  );

  if (!ok)
    return {
      message: json.error || "An error occured"
    };

  return {
    successKey: new Date(),
    updatedQuestionToShowCount: Number(formDataObject.questionToShowCount)
  };
};

export default handleChangeQuestionToShowCount;
