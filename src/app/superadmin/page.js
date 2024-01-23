import LoginForm from "@/components/LoginForm";
import LoginImage from "@/components/LoginImage";

const SuperAdminLogin = () => {
  return (
    <main className="login-page">
      <LoginImage />
      <LoginForm
        role="superadmin"
        formTitle="Superadmin Login"
        redirectPath="/superadmin/manage"
      />
    </main>
  );
};

export default SuperAdminLogin;
