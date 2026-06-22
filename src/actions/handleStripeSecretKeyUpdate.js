"use server";
import adminUpdateStripeKey from "@/services/api/adminUpdateStripeKey";

const handleStripeSecretKeyUpdate = async (prevState, formData) => {
  const stripeSecretKey = formData.get("stripe-secret-key")?.trim?.() || "";

  const { ok, json } = await adminUpdateStripeKey(stripeSecretKey);

  return {
    id: Date.now(),
    ok,
    errorMessage: json.error || ""
  };
};

export default handleStripeSecretKeyUpdate;
