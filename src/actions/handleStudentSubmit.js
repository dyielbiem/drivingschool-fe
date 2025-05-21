"use server";
import validator from "validator";
import adminAddStudent from "@/services/api/adminAddStudent";
const handleStudentSubmit = async (prevState, formData) => {
  const formDataObject = {
    userName: formData.get("student-username"),
    courseID: formData.get("student-course"),
    passWord: formData.get("student-password"),
    confirmPassWord: formData.get("student-confirm-password"),
    firstName: formData.get("student-first-name"),
    lastName: formData.get("student-last-name"),
    address: formData.get("student-address"),
    city: formData.get("student-city"),
    state: formData.get("student-state"),
    zip: formData.get("student-zip"),
    email: formData.get("student-email"),
    phoneNumber: formData.get("student-phone"),
    birthDate: formData.get("student-birthdate"),
    highSchool: formData.get("student-high-school").trim() || "",
    parentFirstName: formData.get("parent-first-name"),
    parentLastName: formData.get("parent-last-name"),
    parentEmail: formData.get("parent-email"),
    parentPhoneNumber: formData.get("parent-phone"),
    billingInformation: {
      firstName: formData.get("student-billing-first-name") || "",
      lastName: formData.get("student-billing-last-name") || "",
      address: formData.get("student-billing-address") || "",
      city: formData.get("student-billing-city") || "",
      state: formData.get("student-billing-state") || "",
      zip: formData.get("student-billing-zip") || "",
      email: formData.get("student-billing-email") || "",
      phoneNumber: formData.get("student-billing-phone") || ""
    }
  };

  const zipRegex = /^[0-9]{1,20}$/;

  if (!validator.isStrongPassword(formDataObject.passWord))
    return {
      message:
        "Password must be at least 8 characters long with at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol",
      ok: false
    };

  if (formDataObject.passWord !== formDataObject.confirmPassWord)
    return {
      message: "Passwords do not match",
      ok: false
    };

  if (!zipRegex.test(formDataObject.zip))
    return {
      message: "Please enter a valid zip code",
      ok: false
    };

  if (
    formDataObject.billingInformation.zip &&
    !zipRegex.test(formDataObject.billingInformation.zip)
  )
    return {
      message: "Please enter a valid billing zip code",
      ok: false
    };

  const response = await adminAddStudent(
    formDataObject.userName,
    formDataObject.passWord,
    formDataObject.confirmPassWord,
    formDataObject.courseID,
    formDataObject.firstName,
    formDataObject.lastName,
    formDataObject.highSchool,
    formDataObject.address,
    formDataObject.city,
    formDataObject.state,
    formDataObject.zip,
    formDataObject.country,
    formDataObject.birthDate,
    formDataObject.email,
    formDataObject.phoneNumber,
    formDataObject.parentFirstName,
    formDataObject.parentLastName,
    formDataObject.parentEmail,
    formDataObject.parentPhoneNumber,
    formDataObject.billingInformation
  );

  if (!response.ok)
    return {
      message: response?.json?.error || "An error occured",
      ok: false
    };

  return {
    message: undefined,
    ok: true
  };
};

export default handleStudentSubmit;
