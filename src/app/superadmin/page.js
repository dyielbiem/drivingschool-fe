"use client";

import LoginForm from "@/components/LoginForm";
import LoginImage from "@/components/LoginImage";

const SuperAdminLogin = () => {
  return (
    <main className="login-page">
      <LoginImage />
      <LoginForm role="superadmin" formTitle="Superadmin Login" />
    </main>
  );
};

export default SuperAdminLogin;
