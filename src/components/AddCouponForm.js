import { IoCloseCircleSharp } from "react-icons/io5";
import FormButton from "./FormButton";
import handleCouponSubmit from "@/app/actions/handleCouponSubmit";
import { useFormState } from "react-dom";
import FormErrorMessage from "./FormErrorMessage";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const AddCouponForm = ({ setCoupons }) => {
  const router = useRouter();
  const pathname = usePathname();

  const initialState = {
    newCoupon: undefined,
    message: undefined
  };

  const [formState, formAction] = useFormState(
    handleCouponSubmit,
    initialState
  );

  useEffect(() => {
    if (!formState?.newCoupon) return;
    setCoupons((prevState) => [formState?.newCoupon, ...prevState]);
    router.push(pathname);
  }, [formState?.newCoupon, pathname, router, setCoupons]);

  const closeForm = () => {
    router.push(pathname);
  };

  return (
    <div className="add-coupon-form">
      <form action={formAction}>
        <button type="button" className="close-btn" onClick={closeForm}>
          <IoCloseCircleSharp />
        </button>
        <h3>Add new coupon</h3>
        <label htmlFor="coupon-code">
          Coupon code <span>*</span>
        </label>
        <input type="text" name="coupon-code" id="coupon-code" required />
        <label htmlFor="coupon-amount">
          Coupon amount ($) <span>*</span>
        </label>
        <input
          type="number"
          name="coupon-amount"
          id="coupon-amount"
          required
          min={0.01}
          step={0.01}
        />
        <label htmlFor="from-date">
          From date <span>*</span>
        </label>
        <input type="date" name="from-date" id="from-date" required />
        <label htmlFor="to-date">
          To date <span>*</span>
        </label>
        <input type="date" name="to-date" id="to-date" required />
        {formState?.message && (
          <FormErrorMessage>{formState.message}</FormErrorMessage>
        )}
        <FormButton>Submit</FormButton>
      </form>
    </div>
  );
};

export default AddCouponForm;
