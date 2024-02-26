"use server";
import adminUpdateChapterTitle from "@/services/api/adminUpdateChapterTitle";

const handleChapterTitleUpdate = async (prevChapter, prevState, formData) => {
  const formDataObject = {
    chapterTitle: formData.get("new-title")
  };

  if (prevChapter?.chapterTitle === String(formDataObject?.chapterTitle).trim())
    return {
      updatedTitle: prevChapter?.chapterTitle,
      message: undefined
    };

  const response = await adminUpdateChapterTitle(
    prevChapter?.chapterID,
    formDataObject.chapterTitle
  );

  if (!response.ok)
    return {
      message: response.json.error ? response.json.error : "An error occured"
    };

  return {
    updatedTitle: response?.json?.chapterTitle,
    message: undefined
  };
};

export default handleChapterTitleUpdate;
