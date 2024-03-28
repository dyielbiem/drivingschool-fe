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
    mailingCountry: formData.get("country"),
    mailingEmail: formData.get("email"),
    mailingPhoneNumber: formData.get("phone-number"),
    mailingCompany: formData.get("company")
  };

  const oldStudent = prevState?.oldStudent;

  if (
    formDataObject.studentUserName === oldStudent.studentUserName &&
    formDataObject.isActive === oldStudent.isActive &&
    formDataObject.mailingFirstName === oldStudent.mailingFirstName &&
    formDataObject.mailingLastName === oldStudent.mailingLastName &&
    formDataObject.mailingAddress === oldStudent.mailingAddress &&
    formDataObject.mailingCity === oldStudent.mailingCity &&
    formDataObject.mailingState === oldStudent.mailingState &&
    formDataObject.mailingZip === oldStudent.mailingZip &&
    formDataObject.mailingCountry === oldStudent.mailingCountry &&
    formDataObject.mailingEmail === oldStudent.mailingEmail &&
    formDataObject.mailingPhoneNumber === oldStudent.mailingPhoneNumber &&
    formDataObject.mailingCompany === oldStudent.mailingCompany
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

  const response = await adminUpdateStudent(
    formDataObject.studentUserName,
    formDataObject.isActive,
    formDataObject.mailingFirstName,
    formDataObject.mailingLastName,
    formDataObject.mailingAddress,
    formDataObject.mailingCity,
    formDataObject.mailingState,
    formDataObject.mailingZip,
    formDataObject.mailingCountry,
    formDataObject.mailingEmail,
    formDataObject.mailingPhoneNumber,
    formDataObject.mailingCompany
  );

  if (!response.ok)
    return {
      message: response?.json?.error
        ? response?.json?.error
        : "An error occured",
      oldStudent
    };

  return {
    message: undefined,
    updatedStudent: { ...oldStudent, ...response.json },
    isUpdated: true
  };
};

export default handleStudentUpdate;
