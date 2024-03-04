"use server";
import adminUpdateEmailContent from "@/services/api/adminUpdateEmailContent";

const handleEmailContentUpdate = async (
  prevEmailContent,
  prevState,
  formData
) => {
  const formDataObject = {
    emailSubject: formData.get("admin-email-subject"),
    emailBody: formData.get("admin-email-body")
  };

  if (
    prevEmailContent?.emailSubject === formDataObject.emailSubject &&
    formDataObject.emailBody === prevEmailContent?.emailBody
  )
    return {
      message: undefined,
      updatedEmailContent: {
        emailSubject: formDataObject.emailSubject,
        emailBody: formDataObject.emailBody
      }
    };

  const response = await adminUpdateEmailContent(
    formDataObject.emailSubject,
    formDataObject.emailBody
  );

  if (!response.ok)
    return {
      message: response?.json?.error || "An error occured"
    };

  return {
    message: undefined,
    updatedEmailContent: response?.json
  };
};

export default handleEmailContentUpdate;
