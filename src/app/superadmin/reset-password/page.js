"use client";
import LandingImage from "@/components/LandingImage";
import GetResetPassCodeForm from "@/components/GetResetPassCodeForm";

const AdminLogin = () => {
  return (
    <main className="reset-password-page">
      <LandingImage />
      <GetResetPassCodeForm role={"superadmin"} />
    </main>
  );
};

export default AdminLogin;
