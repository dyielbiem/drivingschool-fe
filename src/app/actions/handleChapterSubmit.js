"use server";
import adminAddChapter from "@/services/api/adminAddChapter";

const handleChapterSubmit = async (sectionID, prevState, formData) => {
  const formDataObject = {
    sectionTitle: formData.get("chapter-title")
  };

  const response = await adminAddChapter(
    formDataObject.sectionTitle,
    sectionID
  );
  if (!response.ok)
    return {
      message: response.json.error ? response.json.error : "An error occured"
    };

  return {
    newChapter: response.json
  };
};

export default handleChapterSubmit;
