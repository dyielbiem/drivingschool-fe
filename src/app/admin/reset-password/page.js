"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LandingImage from "@/components/LandingImage";
import GetResetPassCodeForm from "@/components/GetResetPassCodeForm";
import VerifyResetPassCodeForm from "@/components/VerifyResetPassCodeForm";
import ResetPasswordForm from "@/components/ResetPasswordForm";

const AdminLogin = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [verificationToken, setVerificationToken] = useState(null);
  const [resetPasswordToken, setResetPasswordToken] = useState(null);

  useEffect(() => {
    if (verificationToken) return;
    router.push(pathname);
  }, [pathname, router, verificationToken]);

  const renderForm = () => {
    if (!verificationToken)
      return (
        <GetResetPassCodeForm
          role={"admin"}
          onSuccess={(token) => setVerificationToken(token)}
        />
      );

    if (!resetPasswordToken)
      return (
        <VerifyResetPassCodeForm
          role={"admin"}
          verificationToken={verificationToken}
          onEmailNotReceived={() => setVerificationToken(null)}
          onSuccess={(token) => setResetPasswordToken(token)}
        />
      );

    return (
      <ResetPasswordForm
        role={"admin"}
        resetPasswordToken={resetPasswordToken}
      />
    );
  };

  return (
    <main className="reset-password-page">
      <LandingImage />
      {renderForm()}
    </main>
  );
};

export default AdminLogin;
