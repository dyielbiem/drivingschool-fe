import LoginForm from "@/components/LoginForm";
import LandingImage from "@/components/LandingImage";

const AdminLogin = () => {
  return (
    <main className="login-page">
      <LandingImage />
      <LoginForm
        role="admin"
        formTitle="Administrator Login"
        redirectPath="/admin/sections"
      />
    </main>
  );
};

export default AdminLogin;
