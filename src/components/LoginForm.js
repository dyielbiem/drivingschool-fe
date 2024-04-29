"use client";
import Link from "next/link";
import FormButton from "./FormButton";
import handleLoginSubmit from "../actions/handleLoginSubmit";
import FormErrorMessage from "./FormErrorMessage";
import { useFormState } from "react-dom";

const LoginForm = ({ role, formTitle, redirectPath }) => {
  if (role != "admin" && role != "superadmin") throw Error("Invalid role");

  const initialState = {
    message: ""
  };

  const handleSubmitWithBindings = handleLoginSubmit.bind(
    null,
    role,
    redirectPath
  );

  const [formState, formAction] = useFormState(
    handleSubmitWithBindings,
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
      <div className="extra-actions">
        <div className="remember-me-container">
          <input type="checkbox" id="remember-me" name="remember-me" />
          <label htmlFor="remember-me">Remember me on this computer</label>
        </div>
        <Link href={`/${role}/reset-password`}>Forgot password?</Link>
      </div>
      {formState?.message && (
        <FormErrorMessage>{formState.message}</FormErrorMessage>
      )}
      <FormButton>Log In</FormButton>
    </form>
  );
};

export default LoginForm;
