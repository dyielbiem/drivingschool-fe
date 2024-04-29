import { useEffect } from "react";
import { useFormState } from "react-dom";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import handleResetPassword from "@/actions/handleResetPassword";
import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";

const ResetPasswordForm = ({ role, resetPasswordToken }) => {
  const router = useRouter();
  const initialState = {
    isPasswordReset: false
  };

  const formDispatch = handleResetPassword.bind(null, role, resetPasswordToken);
  const [formState, formAction] = useFormState(formDispatch, initialState);

  useEffect(() => {
    if (!formState.isPasswordReset) return;
    setTimeout(() => {
      router.replace(`${role}`);
    }, 5000);
  }, [formState.isPasswordReset, role, router]);

  return (
    <form className="reset-password-form" action={formAction}>
      <h1>Reset Password</h1>
      <p>Setup your new password below to recover your account.</p>
      <label htmlFor={`${role}-new-password`}>New Password</label>
      <input
        type="password"
        name={`${role}-new-password`}
        id={`${role}-new-password`}
        required
      />
      <label htmlFor={`${role}-confirm-password`}>Confirm Password</label>
      <input
        type="password"
        name={`${role}-confirm-password`}
        id={`${role}-confirm-password`}
        required
      />
      {formState.message && (
        <FormErrorMessage>{formState.message}</FormErrorMessage>
      )}
      {formState.isPasswordReset && (
        <p className="success-message">
          <span>
            <LuLoader2 />
          </span>
          Your password has been successfully reset! Redirecting you to the
          login page...
        </p>
      )}
      <FormButton>Reset</FormButton>
    </form>
  );
};

export default ResetPasswordForm;
