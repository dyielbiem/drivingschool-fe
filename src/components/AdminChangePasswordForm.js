"use client";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import FormButton from "./FormButton";
import handleChangePassword from "@/actions/handleChangePassword";
import FormSuccessMessage from "./FormSuccessMessage";
import FormErrorMessage from "./FormErrorMessage";

const AdminChangePasswordForm = () => {
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef(null);

  const initialState = {
    message: "",
    successKey: null
  };

  const [formState, formAction] = useFormState(
    handleChangePassword,
    initialState
  );

  useEffect(() => {
    if (formState.message) {
      setErrorMessage(formState.message);
      return;
    }

    setSuccessMessage("Your password has been changed successfully");
    const clearSuccessMessage = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    setIsFormDisabled(true);
    if (!formRef.current) return;
    formRef.current.reset();

    return () => {
      clearTimeout(clearSuccessMessage);
    };
  }, [formState]);

  const handleCancelClick = () => {
    if (!formRef.current) return;
    formRef.current.reset();
    setErrorMessage("");
    setIsFormDisabled(true);
  };

  const renderButtons = () => {
    if (isFormDisabled)
      return (
        <button
          type="button"
          className="edit-btn"
          onClick={() => setIsFormDisabled(false)}
        >
          Change
        </button>
      );

    return (
      <>
        <FormButton>Confirm</FormButton>
        <button
          type="button"
          className="cancel-btn"
          onClick={handleCancelClick}
        >
          Cancel
        </button>
      </>
    );
  };

  return (
    <form className="admin-settings-form" ref={formRef} action={formAction}>
      <h2>Change Password</h2>
      <label htmlFor="old-password">
        Old password <span>*</span>
      </label>
      <input
        type="password"
        name="old-password"
        id="old-password"
        required
        disabled={isFormDisabled}
      />
      <label htmlFor="new-password">
        New password <span>*</span>
      </label>
      <input
        type="password"
        name="new-password"
        id="new-password"
        required
        disabled={isFormDisabled}
      />
      <label htmlFor="old-password">
        Confirm password <span>*</span>
      </label>
      <input
        type="password"
        name="confirm-password"
        id="confirm-password"
        required
        disabled={isFormDisabled}
      />
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
      {successMessage && (
        <FormSuccessMessage>{successMessage}</FormSuccessMessage>
      )}
      <div className="btn-container">{renderButtons()}</div>
    </form>
  );
};

export default AdminChangePasswordForm;
