"use server";
import adminUpdateSectionTitle from "@/services/api/adminUpdateSectionTitle";

const handleSectionTitleUpdate = async (prevSection, prevState, formData) => {
  const formDataObject = {
    sectionTitle: formData.get("section-title")
  };

  if (prevSection?.sectionTitle === String(formDataObject?.sectionTitle).trim())
    return {
      updatedTitle: prevSection?.sectionTitle,
      message: undefined
    };

  const response = await adminUpdateSectionTitle(
    prevSection?.sectionID,
    formDataObject.sectionTitle
  );

  if (!response.ok)
    return {
      message: response.json.error ? response.json.error : "An error occured"
    };

  return {
    updatedTitle: response?.json?.sectionTitle,
    message: undefined
  };
};

export default handleSectionTitleUpdate;
