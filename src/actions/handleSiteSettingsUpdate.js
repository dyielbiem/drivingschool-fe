"use server";
import adminUpdateSiteSettings from "@/services/api/adminUpdateSiteSettings";

const handleSiteSettingsUpdate = async (
  prevSiteSettings,
  prevState,
  formData
) => {
  const formDataObject = {
    email: formData.get("admin-email-address"),
    noOfRows: Number(formData.get("no-of-rows")) || ""
  };

  if (
    prevSiteSettings?.email === formDataObject.email &&
    formDataObject.noOfRows === prevSiteSettings?.noOfRows
  )
    return {
      message: undefined,
      updatedSiteSettings: {
        email: formDataObject.email,
        noOfRows: Number(formDataObject.noOfRows)
      }
    };

  const response = await adminUpdateSiteSettings(
    formDataObject.email,
    formDataObject.noOfRows
  );

  if (!response.ok)
    return {
      message: response?.json?.error || "An error occured"
    };

  return {
    message: undefined,
    updatedSiteSettings: response?.json
  };
};

export default handleSiteSettingsUpdate;
