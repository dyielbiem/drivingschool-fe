"use server";
import adminUpdateSubChapterTitle from "@/services/api/adminUpdateSubChapterTitle";

const handleSubChapterTitleUpdate = async (
  prevSubChapter,
  prevState,
  formData
) => {
  const formDataObject = {
    subChapterTitle: formData.get("new-title")
  };

  if (
    prevSubChapter?.subChapterTitle ===
    String(formDataObject?.subChapterTitle).trim()
  )
    return {
      updatedTitle: prevSubChapter?.subChapterTitle,
      message: undefined
    };

  const response = await adminUpdateSubChapterTitle(
    prevSubChapter?.subChapterID,
    formDataObject.subChapterTitle
  );

  if (!response.ok)
    return {
      message: response.json.error ? response.json.error : "An error occured"
    };

  return {
    updatedTitle: response?.json?.subChapterTitle,
    message: undefined
  };
};

export default handleSubChapterTitleUpdate;
