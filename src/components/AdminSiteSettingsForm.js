"use client";
import { useState } from "react";
import FormButton from "./FormButton";
const AdminSiteSettingsForm = () => {
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
      />
      <label htmlFor="no-of-rows">No. of Rows</label>
      <input
        type="number"
        id="no-of-rows"
        name="no-of-rows"
        min={0}
        step={1}
        disabled={!isEditActive}
      />
      {renderButtons()}
    </form>
  );
};

export default AdminSiteSettingsForm;
