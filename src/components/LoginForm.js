import loginAdmin from "@/utils/fetch/loginAdmin";
import loginSuperAdmin from "@/utils/fetch/loginSuperAdmin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

const LoginForm = ({ role, formTitle }) => {
  if (role != "admin" && role != "superadmin") throw Error("Invalid role");

  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsButtonDisabled(true);
    setError("");

    if (!userName) {
      setIsButtonDisabled(false);
      return setError("Username must not be empty");
    }

    if (!passWord) {
      setIsButtonDisabled(false);
      return setError("Password must not be empty");
    }

    let response;
    if (role === "superadmin") {
      response = await loginSuperAdmin(userName, passWord);
    } else if (role === "admin") {
      response = await loginAdmin(userName, passWord);
    }

    if (!response.ok) {
      setError(response.json?.error);
      return setIsButtonDisabled(false);
    }

    Cookies.set("accessToken", response.json?.accessToken);
    Cookies.set("refreshToken", response.json?.refreshToken);

    router.replace(`/${role}/dashboard`);
    return setIsButtonDisabled(false);
  };

  return (
    <form
      className="login-form"
      onSubmit={(event) => handleSubmit(event)}
      method="post"
    >
      <h1>{formTitle}</h1>
      <label htmlFor={`${role}-username-input`}>Username</label>
      <input
        type="text"
        name={`${role}-username-input`}
        id={`${role}-username-input`}
        className="username-input"
        value={userName}
        onChange={(event) => setUserName(event.target.value)}
      />
      <label htmlFor={`${role}-password-input`}>Password</label>
      <input
        type="password"
        name={`${role}-password-input`}
        id={`${role}-password-input`}
        className="password-input"
        value={passWord}
        onChange={(event) => setPassWord(event.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="login-btn" disabled={isButtonDisabled}>
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
