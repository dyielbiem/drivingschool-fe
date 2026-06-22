"use client";
import { useEffect, useState } from "react";
import { PiWarningCircle } from "react-icons/pi";

import handleStripeSecretKeyUpdate from "@/actions/handleStripeSecretKeyUpdate";
import adminCheckStripeKey from "@/services/api/adminCheckStripeKey";

import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";
import { useFormState } from "react-dom";

const formInitialState = {
  id: Date.now(),
  ok: false,
  errorMessage: ""
};

const AdminStripeForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditActive, setIsEditActive] = useState(false);
  const [hasStripeSecretKey, setHasStripeSecretKey] = useState(true);
  const [localFormState, setLocalFormState] = useState(formInitialState);

  const [formState, formAction] = useFormState(
    handleStripeSecretKeyUpdate,
    formInitialState
  );

  useEffect(() => {
    const fetchData = async () => {
      const { json } = await adminCheckStripeKey();
      setHasStripeSecretKey(json?.hasStripeSecretKey || false);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setLocalFormState(formState);

    if (!formState?.ok) return;

    setHasStripeSecretKey(true);
    setIsEditActive(false);
  }, [formState]);

  const handleCancelClick = () => {
    setLocalFormState(formInitialState);
    setIsEditActive(false);
  };

  const renderButtons = () => {
    return (
      <div className="btn-container">
        {!isEditActive && (
          <button
            type="button"
            className="edit-btn"
            onClick={() => setIsEditActive(true)}
          >
            Edit
          </button>
        )}
        {isEditActive && (
          <>
            <FormButton>Submit</FormButton>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <form className="admin-settings-form" action={formAction}>
      <h2>Stripe</h2>
      <label htmlFor="stripe-secret-key">Secret key</label>
      {isEditActive ? (
        <input
          type="input"
          id="stripe-secret-key"
          name="stripe-secret-key"
          disabled={!isEditActive}
        />
      ) : (
        <>
          <input
            type="input"
            id="stripe-secret-key"
            name="stripe-secret-key"
            disabled={true}
            className={`${hasStripeSecretKey ? "" : "!border-red-700"}`}
            value={
              hasStripeSecretKey && !isLoading ? "sk_live_" + "*".repeat(8) : ""
            }
          />
          {!hasStripeSecretKey && (
            <div className="stripe-warning-message">
              <PiWarningCircle />
              <span>
                Secret key is required to create Stripe payment transaction
              </span>
            </div>
          )}
        </>
      )}
      {localFormState?.errorMessage && (
        <FormErrorMessage>{localFormState?.errorMessage}</FormErrorMessage>
      )}
      {renderButtons()}
    </form>
  );
};

export default AdminStripeForm;
