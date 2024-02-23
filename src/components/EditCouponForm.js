import { IoCloseCircleSharp } from "react-icons/io5";
import FormButton from "./FormButton";
import handleCouponUpdate from "@/actions/handleCouponUpdate";
import { useFormState } from "react-dom";
import FormErrorMessage from "./FormErrorMessage";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const EditCouponForm = ({ prevCoupon, setCoupons }) => {
  const router = useRouter();
  const pathname = usePathname();

  const initialState = {
    updatedCoupon: undefined,
    message: undefined
  };

  const handleCouponUpdateWithPrevCoupon = handleCouponUpdate.bind(
    prevCoupon,
    prevCoupon
  );

  const [formState, formAction] = useFormState(
    handleCouponUpdateWithPrevCoupon,
    initialState
  );

  useEffect(() => {
    if (!formState?.updatedCoupon) return;
    setCoupons((prevState) =>
      prevState.map((coupon) => {
        if (coupon.couponCode !== formState.updatedCoupon.couponCode)
          return coupon;
        return {
          ...coupon,
          couponAmount: formState.updatedCoupon.couponAmount,
          isActive: formState.updatedCoupon.isActive
        };
      })
    );
    router.push(pathname);
  }, [formState?.updatedCoupon, pathname, router, setCoupons]);

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
          Coupon code: <span>{prevCoupon.couponCode}</span>
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
          defaultValue={prevCoupon.couponAmount}
          required
        />
        <label htmlFor="is-active">
          Coupon status <span>*</span>
        </label>
        <select
          name="is-active"
          id="is-active"
          required
          defaultValue={prevCoupon.isActive}
        >
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
        {formState?.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Update</FormButton>
      </form>
    </div>
  );
};

export default EditCouponForm;
