import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoCloseCircleSharp } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";

import adminResetStudentPassword from "@/services/api/adminResetStudentPassword";

const ConfirmResetStudentPasswordModal = ({
  isVisible,
  onClose,
  onSuccessPasswordReset
}) => {
  const searchParams = useSearchParams();
  const student = searchParams.get("edit_student");

  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const { ok, json } = await adminResetStudentPassword(student);

    if (ok) {
      onSuccessPasswordReset(json.newPassword);
      onClose();
    }

    setIsLoading(false);
  };

  if (!isVisible || !student) return null;

  return (
    <div className="confirm-reset-student-password-modal">
      <div>
        <div className="header">
          <p>
            Are you sure you want to reset the password for{" "}
            <span>&apos;{student}&apos;</span>
          </p>
          <button className="close-btn" onClick={onClose}>
            <IoCloseCircleSharp />
          </button>
        </div>
        <button className="confirm-btn" onClick={handleReset}>
          {isLoading ? <LuLoader2 /> : <span>Confirm</span>}
        </button>
      </div>
    </div>
  );
};

export default ConfirmResetStudentPasswordModal;
