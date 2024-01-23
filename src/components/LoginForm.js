"use client";
import FormButton from "./FormButton";
import handleLoginSubmit from "../app/actions/handleLoginSubmit";
import FormErrorMessage from "./FormErrorMessage";
import { useFormState } from "react-dom";

const LoginForm = ({ role, formTitle, redirectPath }) => {
  if (role != "admin" && role != "superadmin") throw Error("Invalid role");

  const initialState = {
    message: ""
  };

  const handleSubmitWithRole = handleLoginSubmit.bind(role, role);
  const handleSubmitWithRoleAndPath = handleSubmitWithRole.bind(
    redirectPath,
    redirectPath
  );

  const [formState, formAction] = useFormState(
    handleSubmitWithRoleAndPath,
    initialState
  );

  return (
    <form className="login-form" action={formAction}>
      <h1>{formTitle}</h1>
      <label htmlFor={`${role}-username-input`}>Username</label>
      <input
        type="text"
        name={`${role}-username-input`}
        id={`${role}-username-input`}
        className="username-input"
        required
      />
      <label htmlFor={`${role}-password-input`}>Password</label>
      <input
        type="password"
        name={`${role}-password-input`}
        id={`${role}-password-input`}
        className="password-input"
        required
      />
      {formState?.message && (
        <FormErrorMessage>{formState.message}</FormErrorMessage>
      )}
      <FormButton>Log In</FormButton>
    </form>
  );
};

export default LoginForm;
