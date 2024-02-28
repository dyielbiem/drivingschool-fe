"use server";
import validator from "validator";
import adminAddStudent from "@/services/api/adminAddStudent";
const handleStudentSubmit = async (prevState, formData) => {
  const formDataObject = {
    userName: formData.get("student-username"),
    courseID: formData.get("student-course"),
    passWord: formData.get("student-password"),
    confirmPassWord: formData.get("student-confirm-password"),
    firstName: formData.get("student-firstname"),
    lastName: formData.get("student-lastname"),
    address: formData.get("student-address"),
    city: formData.get("student-city"),
    state: formData.get("student-state"),
    zip: formData.get("student-zip"),
    country: formData.get("student-country"),
    email: formData.get("student-email"),
    phoneNumber: formData.get("student-phone"),
    company: formData.get("student-company").trim() || "Not applicable"
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

  const response = await adminAddStudent(
    formDataObject.userName,
    formDataObject.passWord,
    formDataObject.confirmPassWord,
    formDataObject.courseID,
    formDataObject.firstName,
    formDataObject.lastName,
    formDataObject.company,
    formDataObject.address,
    formDataObject.city,
    formDataObject.state,
    formDataObject.zip,
    formDataObject.country,
    formDataObject.email,
    formDataObject.phoneNumber
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
