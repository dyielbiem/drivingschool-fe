"use client";

import LoginForm from "@/components/LoginForm";
import LoginImage from "@/components/LoginImage";

const AdminLogin = () => {
  return (
    <main className="login-page">
      <LoginImage />
      <LoginForm role="admin" formTitle="Administrator Login" />
    </main>
  );
};

export default AdminLogin;
