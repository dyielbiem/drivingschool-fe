import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import handleVerifyResetPassCode from "@/actions/handleVerifyResetPassCode";
import FormButton from "./FormButton";
import FormErrorMessage from "./FormErrorMessage";
import adminGetResetPasswordCode from "@/services/api/adminGetResetPasswordCode";

const VerifyResetPassCodeForm = ({
  role,
  verificationToken: token,
  onSuccess
}) => {
  const [countDown, setCountDown] = useState(90);
  const searchParams = useSearchParams();
  const [verificationToken, setVerificationToken] = useState(token);
  const initialState = {
    resetPasswordToken: null,
    message: ""
  };

  const formDispatch = handleVerifyResetPassCode.bind(
    null,
    role,
    verificationToken
  );
  const [formState, formAction] = useFormState(formDispatch, initialState);

  useEffect(() => {
    if (!formState.resetPasswordToken) return;
    onSuccess(formState.resetPasswordToken);
  }, [formState.resetPasswordToken, onSuccess]);

  useEffect(() => {
    if (!countDown) return;
    const decreaseCountDown = setInterval(() => {
      setCountDown((prevState) => prevState - 1);
    }, 1000);

    return () => clearInterval(decreaseCountDown);
  }, [countDown]);

  const handleResendCode = async () => {
    if (countDown) return;
    const { ok, json } = await adminGetResetPasswordCode(
      searchParams.get("user_name")
    );

    if (!ok) return;

    setVerificationToken(json.verificationToken);
    setCountDown(90);
  };

  return (
    <form className="reset-password-form" action={formAction}>
      <h1>Verification Code</h1>
      <p>
        You should have received a 6-digit verification code in your email.
        Please enter it below:
      </p>
      <input
        type="text"
        pattern="^\d{6}$"
        name={`${role}-code`}
        id={`${role}-code`}
        required
      />
      <p>
        Haven&lsquo;t received a code?{" "}
        <span className="resend-code" onClick={handleResendCode}>
          Resend it {countDown ? `in ${countDown}s` : ""}
        </span>
      </p>
      {formState.message && (
        <FormErrorMessage>{formState.message}</FormErrorMessage>
      )}
      <FormButton>Verify</FormButton>
    </form>
  );
};

export default VerifyResetPassCodeForm;
