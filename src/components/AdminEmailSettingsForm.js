"use client";
import { useState } from "react";
import FormButton from "./FormButton";
const AdminEmailSettingsForm = () => {
  const [isEditActive, setIsEditActive] = useState(false);

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
              onClick={() => setIsEditActive(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <form className="admin-settings-form">
      <h2>Sign Up Email Content</h2>
      <label htmlFor="admin-email-subject">Email Subject</label>
      <textarea
        id="admin-email-subject"
        name="admin-email-subject"
        disabled={!isEditActive}
      />
      <label htmlFor="admin-email-content">Email Content</label>
      <textarea
        id="admin-email-content"
        name="admin-email-content"
        disabled={!isEditActive}
      />
      {renderButtons()}
    </form>
  );
};

export default AdminEmailSettingsForm;
