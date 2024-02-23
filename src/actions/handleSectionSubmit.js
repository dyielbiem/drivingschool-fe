"use server";
import adminCreateSection from "@/services/api/adminCreateSection";

const handleSectionSubmit = async (prevState, formData) => {
  const formDataObject = {
    sectionTitle: formData.get("section-title")
  };

  const response = await adminCreateSection(formDataObject.sectionTitle);
  if (!response.ok)
    return {
      message: response.json.error ? response.json.error : "An error occured"
    };

  return {
    newSection: response.json
  };
};

export default handleSectionSubmit;
