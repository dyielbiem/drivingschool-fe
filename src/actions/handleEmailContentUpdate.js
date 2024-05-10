"use server";
import adminUpdateEmailContent from "@/services/api/adminUpdateEmailContent";

const handleEmailContentUpdate = async (
  prevEmailContent,
  newEmailContent,
  // eslint-disable-next-line no-unused-vars
  prevState,
  // eslint-disable-next-line no-unused-vars
  formData
) => {
  if (
    prevEmailContent?.emailSubject === newEmailContent.emailSubject &&
    prevEmailContent.emailBody === newEmailContent?.emailBody
  )
    return {
      message: "",
      updatedEmailContent: {
        emailSubject: prevEmailContent.emailSubject,
        emailBody: prevEmailContent.emailBody
      }
    };

  const response = await adminUpdateEmailContent(
    newEmailContent.emailSubject,
    newEmailContent.emailBody
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
