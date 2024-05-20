"use client";
import { useEffect, useRef, useState } from "react";
import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";
import adminFetchSiteSettings from "@/services/api/adminFetchSiteSettings";
import { useFormState } from "react-dom";
import handleSiteSettingsUpdate from "@/actions/handleSiteSettingsUpdate";

const AdminSiteSettingsForm = () => {
  const [isEditActive, setIsEditActive] = useState(false);
  const [defaultValue, setDefaultValue] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      const response = await adminFetchSiteSettings();
      if (!response.ok) return;
      setDefaultValue(response.json);
    };

    fetchSiteSettings();
  }, []);

  const initialState = {
    message: undefined,
    updatedSiteSettings: undefined
  };

  const initialAction = handleSiteSettingsUpdate.bind(null, defaultValue);
  const [formState, formAction] = useFormState(initialAction, initialState);

  // Update the input fields after successful site settings update
  useEffect(() => {
    if (!formState?.updatedSiteSettings) return;
    setDefaultValue((prevState) => {
      return {
        ...prevState,
        noOfRows: formState?.updatedSiteSettings.noOfRows || "",
        email: formState?.updatedSiteSettings.email
      };
    });
    setIsEditActive(false);
  }, [formState?.updatedSiteSettings]);

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

  return (
    <form className="admin-settings-form" ref={formRef} action={formAction}>
      <h2>Site Settings</h2>
      <label htmlFor="admin-email-address">
        Admin Email Address <span>*</span>
      </label>
      <input
        type="email"
        id="admin-email-address"
        name="admin-email-address"
        required
        disabled={!isEditActive}
        defaultValue={defaultValue?.email}
      />
      <label htmlFor="no-of-rows">No. of Rows</label>
      <input
        type="number"
        id="no-of-rows"
        name="no-of-rows"
        min={0}
        step={1}
        disabled={!isEditActive}
        defaultValue={defaultValue?.noOfRows}
      />
      {formState?.message && (
        <FormErrorMessage>{formState?.message}</FormErrorMessage>
      )}
      {renderButtons()}
    </form>
  );
};

export default AdminSiteSettingsForm;
