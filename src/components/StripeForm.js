import { useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LuLoader2 } from "react-icons/lu";

import adminConfirmStripePayment from "@/services/api/adminConfirmStripePayment";

const StripeForm = ({ amountToPay, onBack }) => {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required"
    });

    if (error || !paymentIntent.id) {
      setIsLoading(false);
      return;
    }

    const { ok } = await adminConfirmStripePayment(paymentIntent.id);

    ok && router.push(pathname);
    setIsLoading(false);
  };

  if (hasError)
    return (
      <div className="stripe-element-error">
        Something went wrong with the Stripe payment.
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="header">
        <button type="button" onClick={onBack}>
          <IoMdArrowRoundBack />
        </button>
        <h1>Stripe payment</h1>
      </div>

      <div className="amount">
        Amount to pay: <strong>${amountToPay.toFixed?.(2)}</strong>
      </div>

      <PaymentElement onLoadError={() => setHasError(true)} />
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? <LuLoader2 /> : "Pay"}
      </button>
    </form>
  );
};

const StripeFormWithContext = ({ stripePk, clientSecret, ...otherProps }) => {
  const stripeObj = useMemo(() => loadStripe(stripePk), [stripePk]);

  if (!stripeObj) return null;

  return (
    <Elements
      stripe={stripeObj}
      options={{
        clientSecret
      }}
    >
      <StripeForm {...otherProps} />
    </Elements>
  );
};

export default StripeFormWithContext;
