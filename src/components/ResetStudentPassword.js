import { useState } from "react";
import { toast } from "react-toastify";
import { LuCopy, LuRotateCw } from "react-icons/lu";

import ConfirmResetStudentPasswordModal from "./ConfirmResetStudentPasswordModal";

const ResetStudentPassword = () => {
  const [newPassword, setNewPassword] = useState(null);

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const handleCopy = () => {
    if (!newPassword) return;
    navigator.clipboard.writeText(newPassword);
    setNewPassword(null);
    toast.success(
      <p className="toastify-message">
        Student password has been copied to the clipboard
      </p>
    );
  };

  const handleSuccessPasswordReset = (newPassword) => {
    setNewPassword(newPassword);
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
        <input
          type={newPassword ? "text" : "password"}
          name="password"
          id="password"
          readOnly
          value={newPassword || "*".repeat(16)}
        />
      </div>
      <div className="btn-container">
        <button onClick={handleCopy} disabled={!newPassword}>
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
