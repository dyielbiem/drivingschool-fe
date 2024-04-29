import LoginForm from "@/components/LoginForm";
import LandingImage from "@/components/LandingImage";

const SuperAdminLogin = () => {
  return (
    <main className="login-page">
      <LandingImage />
      <LoginForm
        role="superadmin"
        formTitle="Superadmin Login"
        redirectPath="/superadmin/manage"
      />
    </main>
  );
};

export default SuperAdminLogin;
