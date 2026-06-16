"use server";
import validator from "validator";
import adminAddStudent from "@/services/api/adminAddStudent";

const handleStudentSubmit = async (prevState, formData) => {
  const userName = formData.get("student-username");
  const courseID = formData.get("student-course");
  const passWord = formData.get("student-password");
  const confirmPassWord = formData.get("student-confirm-password");
  const firstName = formData.get("student-first-name");
  const lastName = formData.get("student-last-name");
  const address = formData.get("student-address");
  const city = formData.get("student-city");
  const state = formData.get("student-state");
  const zip = formData.get("student-zip");
  const email = formData.get("student-email");
  const phoneNumber = formData.get("student-phone");
  const birthDate = formData.get("student-birthdate");
  const highSchool = formData.get("student-high-school").trim() || "";
  const couponCode = formData.get("student-coupon-code");
  const parentFirstName = formData.get("parent-first-name");
  const parentLastName = formData.get("parent-last-name");
  const parentEmail = formData.get("parent-email");
  const parentPhoneNumber = formData.get("parent-phone");
  let billingInformation = {
    firstName: formData.get("student-billing-first-name") || "",
    lastName: formData.get("student-billing-last-name") || "",
    address: formData.get("student-billing-address") || "",
    city: formData.get("student-billing-city") || "",
    state: formData.get("student-billing-state") || "",
    zip: formData.get("student-billing-zip") || "",
    email: formData.get("student-billing-email") || "",
    phoneNumber: formData.get("student-billing-phone") || ""
  };
  // let cardInformation = {
  //   cardNumber: formData.get("student-card-number") || "",
  //   cardCode: formData.get("student-card-code") || "",
  //   cardExpiration: formData.get("student-card-expiration") || ""
  // };

  const formResponse = {
    message: "",
    ok: false,
    clientSecret: null,
    stripePk: null,
    amountToPay: null
  };

  // const cardInfoValues = Object.values(cardInformation);
  // if (
  //   cardInfoValues.some((value) => !!value) &&
  //   !cardInfoValues.every((value) => !!value)
  // ) {
  //   formResponse.message = "Please complete the card information";
  //   return formResponse;
  // }

  // if (cardInfoValues.every((value) => !!value)) {
  //   const [year, month] = cardInformation.cardExpiration
  //     .split("-")
  //     .map((value) => Number(value));

  //   if (month > 12 || month < 1 || year < new Date().getFullYear()) {
  //     formResponse.message = "Card expiration is invalid";
  //     return formResponse;
  //   }

  //   const billingInfoValues = Object.values(billingInformation);
  //   if (!billingInfoValues.every((value) => !!value)) {
  //     formResponse.message = "Please complete the billing information";
  //     return formResponse;
  //   }
  // } else {
  //   cardInformation = null;
  // }

  const billingInfoValues = Object.values(billingInformation);
  if (
    billingInfoValues.some((value) => !!value) &&
    !billingInfoValues.every((value) => !!value)
  ) {
    formResponse.message = "Please complete the billing information";
    return formResponse;
  }

  if (billingInfoValues.every((value) => !value)) {
    billingInformation = null;
  }

  if (!validator.isStrongPassword(passWord)) {
    formResponse.message =
      "Password must be at least 8 characters long with at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol";
    return formResponse;
  }

  if (passWord !== confirmPassWord) {
    formResponse.message = "Passwords do not match";
    return formResponse;
  }

  const { ok, json } = await adminAddStudent(
    userName,
    passWord,
    confirmPassWord,
    courseID,
    firstName,
    lastName,
    highSchool,
    address,
    city,
    state,
    zip,
    "US",
    birthDate,
    email,
    phoneNumber,
    parentFirstName,
    parentLastName,
    parentEmail,
    parentPhoneNumber,
    billingInformation,
    null,
    couponCode
  );

  if (!ok) {
    formResponse.message = json?.error || "An error occured";
    return formResponse;
  }

  if (json.clientSecret) {
    formResponse.clientSecret = json.clientSecret;
    formResponse.stripePk = json.stripePk;
    formResponse.amountToPay = json.amountToPay;
  }

  formResponse.message = undefined;
  formResponse.ok = true;
  return formResponse;
};

export default handleStudentSubmit;
