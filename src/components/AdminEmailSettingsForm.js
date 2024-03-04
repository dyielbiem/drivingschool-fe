"use client";
import { useState, useRef, useEffect } from "react";
import FormButton from "./FormButton";
import adminFetchEmailContent from "@/services/api/adminFetchEmailContent";
import { useFormState } from "react-dom";
import handleEmailContentUpdate from "@/actions/handleEmailContentUpdate";
import FormErrorMessage from "./FormErrorMessage";

const AdminEmailSettingsForm = () => {
  const [isEditActive, setIsEditActive] = useState(false);
  const [defaultValue, setDefaultValue] = useState(undefined);
  const formRef = useRef(undefined);

  useEffect(() => {
    const fetchEmailContent = async () => {
      const response = await adminFetchEmailContent();
      if (!response.ok) return;
      setDefaultValue(response.json);
    };

    fetchEmailContent();
  }, []);

  const initialState = {
    message: undefined,
    updatedEmailContent: undefined
  };

  const initialAction = handleEmailContentUpdate.bind(null, defaultValue);
  const [formState, formAction] = useFormState(initialAction, initialState);

  // Update the input fields after successful email content update
  useEffect(() => {
    if (!formState?.updatedEmailContent) return;
    setDefaultValue((prevState) => {
      return {
        ...prevState,
        emailBody: formState?.updatedEmailContent.emailBody || "",
        emailSubject: formState?.updatedEmailContent.emailSubject
      };
    });
    setIsEditActive(false);
  }, [formState?.updatedEmailContent]);

  const handleCancelClick = () => {
    if (!formRef?.current) return;
    formRef.current.reset();
    formRef.current.requestSubmit();
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

  if (!defaultValue) return null;

  return (
    <form className="admin-settings-form" ref={formRef} action={formAction}>
      <h2>Sign Up Email Content</h2>
      <label htmlFor="admin-email-subject">Email Subject</label>
      <textarea
        id="admin-email-subject"
        name="admin-email-subject"
        disabled={!isEditActive}
        defaultValue={defaultValue?.emailSubject || ""}
      />
      <label htmlFor="admin-email-body">Email Content</label>
      <textarea
        id="admin-email-body"
        name="admin-email-body"
        disabled={!isEditActive}
        defaultValue={defaultValue?.emailBody || ""}
      />
      {formState?.message && (
        <FormErrorMessage>{formState?.message}</FormErrorMessage>
      )}
      {renderButtons()}
    </form>
  );
};

export default AdminEmailSettingsForm;
