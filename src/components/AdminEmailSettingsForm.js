"use client";
import { useState, useEffect } from "react";
import FormButton from "./FormButton";
import adminFetchEmailContent from "@/services/api/adminFetchEmailContent";
import { useFormState } from "react-dom";
import handleEmailContentUpdate from "@/actions/handleEmailContentUpdate";
import FormErrorMessage from "./FormErrorMessage";
import EmailBodyEditor from "./EmailBodyEditor";

const AdminEmailSettingsForm = () => {
  const [isEditActive, setIsEditActive] = useState(false);
  const [prevEmailContent, setPrevEmailContent] = useState(null);
  const [newEmailContent, setNewEmailContent] = useState(null);

  useEffect(() => {
    const fetchEmailContent = async () => {
      const response = await adminFetchEmailContent();
      if (!response.ok) return;
      setPrevEmailContent(response.json);
      setNewEmailContent(response.json);
    };

    fetchEmailContent();
  }, []);

  const initialState = {
    message: "",
    updatedEmailContent: null
  };

  const initialAction = handleEmailContentUpdate.bind(
    null,
    prevEmailContent,
    newEmailContent
  );
  const [formState, formAction] = useFormState(initialAction, initialState);

  // Update the input fields after successful email content update
  useEffect(() => {
    if (!formState?.updatedEmailContent) return;
    setPrevEmailContent((prevState) => {
      return {
        ...prevState,
        emailBody: formState?.updatedEmailContent.emailBody || "",
        emailSubject: formState?.updatedEmailContent.emailSubject
      };
    });
    setIsEditActive(false);
  }, [formState?.updatedEmailContent]);

  const handleCancelClick = () => {
    setNewEmailContent(prevEmailContent);
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
      <h2>Sign Up Email Content</h2>
      <label htmlFor="admin-email-subject">Email Subject</label>
      <textarea
        id="admin-email-subject"
        name="admin-email-subject"
        disabled={!isEditActive}
        value={newEmailContent?.emailSubject}
        onChange={(event) =>
          setNewEmailContent((prevState) => ({
            ...prevState,
            emailSubject: event.target.value
          }))
        }
      />
      <label htmlFor="admin-email-body">Email Content</label>
      <EmailBodyEditor
        isEditable={isEditActive}
        editorContent={newEmailContent?.emailBody}
        value={newEmailContent?.emailBody}
        onChange={(content) =>
          setNewEmailContent((prevState) => ({
            ...prevState,
            emailBody: content
          }))
        }
      />
      {formState?.message && (
        <FormErrorMessage>{formState?.message}</FormErrorMessage>
      )}
      {renderButtons()}
    </form>
  );
};

export default AdminEmailSettingsForm;
