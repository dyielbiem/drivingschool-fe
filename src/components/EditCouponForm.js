import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { IoCloseCircleSharp } from "react-icons/io5";

import handleCouponUpdate from "@/actions/handleCouponUpdate";
import { formatDate } from "@/utils";

import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";

const initialState = {
  updatedCoupon: null,
  errorMessage: ""
};

const EditCouponForm = ({ coupon, onCouponUpdated }) => {
  const router = useRouter();
  const pathname = usePathname();

  const formActionHandler = handleCouponUpdate.bind(null, coupon);
  const [formState, formAction] = useFormState(formActionHandler, initialState);

  useEffect(() => {
    if (!formState?.updatedCoupon) return;
    onCouponUpdated(formState.updatedCoupon);
  }, [formState.updatedCoupon, onCouponUpdated]);

  const closeForm = () => {
    router.push(pathname);
  };

  return (
    <div className="edit-coupon-form">
      <form action={formAction}>
        <button type="button" className="close-btn" onClick={closeForm}>
          <IoCloseCircleSharp />
        </button>
        <h3>Edit coupon</h3>
        <p className="coupon-code">
          Coupon code: <span>{coupon.couponCode}</span>
        </p>
        <label htmlFor="coupon-amount">
          Coupon amount ($) <span>*</span>
        </label>
        <input
          type="number"
          name="coupon-amount"
          id="coupon-amount"
          min={0.01}
          step={0.01}
          defaultValue={coupon.couponAmount}
          required
        />
        <label htmlFor="is-active">
          Coupon status <span>*</span>
        </label>
        <select
          name="is-active"
          id="is-active"
          required
          defaultValue={coupon.isActive}
        >
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
        <label htmlFor="from-date">
          From date <span>*</span>
        </label>
        <input
          type="date"
          name="from-date"
          id="from-date"
          defaultValue={formatDate(coupon.fromDate, "YYYY-MM-DD")}
          required
        />
        <label htmlFor="to-date">
          To date <span>*</span>
        </label>
        <input
          type="date"
          name="to-date"
          id="to-date"
          defaultValue={formatDate(coupon.toDate, "YYYY-MM-DD")}
          required
        />
        {formState?.errorMessage && (
          <FormErrorMessage>{formState.errorMessage}</FormErrorMessage>
        )}
        <FormButton>Update</FormButton>
      </form>
    </div>
  );
};

export default EditCouponForm;
