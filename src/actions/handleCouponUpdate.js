"use server";
import moment from "moment";
import { parseDate } from "chrono-node";

import adminUpdateCoupon from "@/services/api/adminUpdateCoupon";

const handleCouponUpdate = async (coupon, prevState, formData) => {
  const { couponCode, couponAmount, isActive, fromDate, toDate } = coupon;
  const data = {
    couponAmount: Number(formData.get("coupon-amount")),
    isActive: formData.get("is-active") === "true" ? true : false,
    fromDate: formData.get("from-date"),
    toDate: formData.get("to-date")
  };

  if (moment(parseDate(data.fromDate)).isAfter(moment(parseDate(data.toDate))))
    return {
      errorMessage: "'To date' must be the same or after 'From date'"
    };

  if (
    data.couponAmount === couponAmount &&
    data.isActive === isActive &&
    data.fromDate === fromDate &&
    data.toDate === toDate
  )
    return {
      updatedCoupon: coupon
    };

  const response = await adminUpdateCoupon(
    couponCode,
    data.couponAmount,
    data.isActive,
    data.fromDate,
    data.toDate
  );

  if (!response.ok)
    return {
      errorMessage: response?.json?.error
        ? response?.json?.error
        : "An error occured"
    };

  return {
    errorMessage: "",
    updatedCoupon: {
      ...coupon,
      ...data
    }
  };
};

export default handleCouponUpdate;
