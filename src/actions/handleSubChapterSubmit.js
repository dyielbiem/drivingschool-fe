"use server";
import adminAddSubChapter from "@/services/api/adminAddSubChapter";

const handleSubChapterSubmit = async (chapterID, prevState, formData) => {
  const formDataObject = {
    subChapterTitle: formData.get("sub-chapter-title")
  };

  const response = await adminAddSubChapter(
    formDataObject.subChapterTitle,
    chapterID
  );
  if (!response.ok)
    return {
      message: response.json.error ? response.json.error : "An error occured"
    };

  return {
    newSubChapter: response.json
  };
};

export default handleSubChapterSubmit;
