"use server";
import adminAddAffiliation from "@/services/api/adminAddAffiliation";

const handleAddAffiliation = async (prevState, formData) => {
  const affiliationName = formData.get("affiliation-name").trim();
  const affiliationInfo = formData.get("affiliation-info").trim();
  const affiliationCode = formData.get("affiliation-code").trim();

  const { ok, json } = await adminAddAffiliation(
    affiliationName,
    affiliationInfo,
    affiliationCode
  );

  return ok
    ? {
        errorMessage: null,
        newAffiliation: json
      }
    : {
        errorMessage: json?.error || "An error occured",
        newAffiliation: null
      };
};

export default handleAddAffiliation;
