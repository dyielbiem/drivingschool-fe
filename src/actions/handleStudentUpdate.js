"use server";
import adminUpdateStudent from "@/services/api/adminUpdateStudent";

const handleStudentUpdate = async (prevState, formData) => {
  const formDataObject = {
    studentUserName: formData.get("username"),
    isActive: formData.get("is-active") === "false" ? false : true,
    mailingFirstName: formData.get("first-name"),
    mailingLastName: formData.get("last-name"),
    mailingAddress: formData.get("address"),
    mailingCity: formData.get("city"),
    mailingState: formData.get("state"),
    mailingZip: formData.get("zip"),
    mailingCountry: formData.get("country") || "United States",
    mailingEmail: formData.get("email"),
    mailingPhoneNumber: formData.get("phone-number"),
    birthDate: formData.get("birth-date"),
    highSchool: formData.get("high-school") || "",
    parentFirstName: formData.get("parent-first-name"),
    parentLastName: formData.get("parent-last-name"),
    parentEmail: formData.get("parent-email"),
    parentPhoneNumber: formData.get("parent-phone"),
    billingFirstName: formData.get("student-billing-first-name") || "",
    billingLastName: formData.get("student-billing-last-name") || "",
    billingAddress: formData.get("student-billing-address") || "",
    billingCity: formData.get("student-billing-city") || "",
    billingState: formData.get("student-billing-state") || "",
    billingZip: formData.get("student-billing-zip") || "",
    billingEmail: formData.get("student-billing-email") || "",
    billingPhoneNumber: formData.get("student-billing-phone") || ""
  };

  const oldStudent = prevState?.oldStudent;

  if (
    Object.keys(formDataObject).every(
      (key) => formDataObject[key] === oldStudent[key]
    )
  ) {
    return {
      updatedStudent: oldStudent,
      isUpdated: false
    };
  }

  const zipRegex = /^[0-9]{1,20}$/;

  if (!zipRegex.test(formDataObject.mailingZip))
    return {
      message: "Please enter a valid zip code",
      oldStudent
    };

  if (formDataObject.billingZip && !zipRegex.test(formDataObject.billingZip))
    return {
      message: "Please enter a valid billing zip code",
      oldStudent
    };

  const { ok, json } = await adminUpdateStudent(formDataObject);

  if (!ok)
    return {
      message: json?.error ? json?.error : "An error occured",
      oldStudent
    };

  return {
    message: undefined,
    updatedStudent: json,
    isUpdated: true
  };
};

export default handleStudentUpdate;
