import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { LuCopy, LuRotateCw } from "react-icons/lu";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import ConfirmResetStudentPasswordModal from "./ConfirmResetStudentPasswordModal";

import adminFetchStudentPassword from "@/services/api/adminFetchStudentPassword";

const ResetStudentPassword = () => {
  const searchParams = useSearchParams();
  const studentUserName = useMemo(
    () => searchParams.get("edit_student") || "",
    [searchParams]
  );
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  useEffect(() => {
    const fetchStudentPassword = async () => {
      const { json } = await adminFetchStudentPassword(studentUserName);
      const { passWord } = json;
      setPassword(passWord);
    };

    fetchStudentPassword();
  }, [studentUserName]);

  const handleCopy = () => {
    if (!isPasswordVisible || !password) return;
    navigator.clipboard.writeText(password);
    toast.success(
      <p className="toastify-message">
        Student password has been copied to the clipboard
      </p>
    );
  };

  const handleSuccessPasswordReset = (newPassword) => {
    setPassword(newPassword);
    setIsPasswordVisible(true);
    toast.success(
      <p className="toastify-message">
        Student password has been reset successfully
      </p>
    );
  };

  return (
    <div className="reset-student-password">
      <h2>Reset Password</h2>
      <div className="fields">
        <label htmlFor="password">Password</label>
        <div className="input-container">
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            id="password"
            readOnly
            value={password}
          />
          <button onClick={() => setIsPasswordVisible((prev) => !prev)}>
            {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </div>
      <div className="btn-container">
        <button onClick={handleCopy} disabled={!isPasswordVisible}>
          <LuCopy />
          <span>Copy</span>
        </button>
        <button onClick={() => setIsConfirmModalVisible(true)}>
          <LuRotateCw />
          <span>Reset</span>
        </button>
      </div>
      <ConfirmResetStudentPasswordModal
        isVisible={isConfirmModalVisible}
        onClose={() => setIsConfirmModalVisible(false)}
        onSuccessPasswordReset={handleSuccessPasswordReset}
      />
    </div>
  );
};

export default ResetStudentPassword;
