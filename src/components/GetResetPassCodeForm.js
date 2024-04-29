import { useEffect } from "react";
import { useFormState } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import handleGetResetPassCode from "@/actions/handleGetResetPassCode";
import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";

const GetResetPassCodeForm = ({ role, onSuccess }) => {
  const router = useRouter();
  const pathname = usePathname();
  const initialState = {
    verificationToken: null,
    username: null,
    message: ""
  };

  const formDispatch = handleGetResetPassCode.bind(null, role);
  const [formState, formAction] = useFormState(formDispatch, initialState);

  useEffect(() => {
    if (!formState.verificationToken) return;
    onSuccess(formState.verificationToken);
    router.push(`${pathname}?user_name=${formState.username}`);
  }, [
    formState.username,
    formState.verificationToken,
    onSuccess,
    pathname,
    router
  ]);

  return (
    <form className="reset-password-form" action={formAction}>
      <h1>Forgot Password</h1>
      <p>
        Enter your {role} username and we will email you a reset password code
      </p>
      <label htmlFor={`${role}-username`}>Username</label>
      <input
        type="text"
        name={`${role}-username`}
        id={`${role}-username`}
        required
      />
      {formState.message && (
        <FormErrorMessage>{formState.message}</FormErrorMessage>
      )}
      <FormButton>Submit</FormButton>
    </form>
  );
};

export default GetResetPassCodeForm;
