"use server";
import adminAddCoupon from "@/services/api/adminAddCoupon";

const handleCouponSubmit = async (prevState, formData) => {
  const formDataObject = {
    couponCode: formData.get("coupon-code").trim().toLowerCase(),
    couponAmount: formData.get("coupon-amount"),
    fromDate: formData.get("from-date"),
    toDate: formData.get("to-date")
  };

  if (formDataObject.fromDate > formDataObject.toDate)
    return {
      message: "Invalid coupon date validity"
    };

  const response = await adminAddCoupon(
    formDataObject.couponCode,
    formDataObject.couponAmount,
    formDataObject.fromDate,
    formDataObject.toDate
  );

  if (!response.ok)
    return {
      message: response?.json?.error ? response.json.error : "An error occured"
    };

  return {
    message: undefined,
    newCoupon: response?.json
  };
};

export default handleCouponSubmit;
