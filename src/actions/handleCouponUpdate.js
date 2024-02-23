"use server";
import adminUpdateCoupon from "@/services/api/adminUpdateCoupon";

const handleCouponUpdate = async (prevCoupon, prevState, formData) => {
  const formDataObject = {
    couponAmount: Number(formData.get("coupon-amount")),
    isActive: formData.get("is-active") === "true" ? true : false
  };

  if (
    formDataObject.couponAmount === prevCoupon.couponAmount &&
    formDataObject.isActive === prevCoupon.isActive
  )
    return {
      updatedCoupon: {
        couponAmount: prevCoupon.couponAmount,
        isActive: prevCoupon.isActive,
        couponCode: prevCoupon.couponCode
      }
    };

  const response = await adminUpdateCoupon(
    prevCoupon.couponCode,
    formDataObject.couponAmount,
    formDataObject.isActive
  );

  if (!response.ok)
    return {
      message: response?.json?.error
        ? response?.json?.error
        : "An error occured"
    };

  return {
    message: undefined,
    updatedCoupon: response?.json
  };
};

export default handleCouponUpdate;
