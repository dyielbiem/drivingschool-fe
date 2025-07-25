"use server";
import adminUpdateAffiliation from "@/services/api/adminUpdateAffiliation";

const handleUpdateAffiliation = async (affiliationID, prevState, formData) => {
  const affiliationName = formData.get("affiliation-name").trim();
  const affiliationCode = formData.get("affiliation-code").trim();

  const { ok, json } = await adminUpdateAffiliation(
    affiliationID,
    affiliationName,
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

export default handleUpdateAffiliation;
