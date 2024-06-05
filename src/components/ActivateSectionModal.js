import { useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";

import adminActivateSection from "@/services/api/adminActivateSection";

const ActivateSectionModal = ({
  closeModalClick,
  onSuccessActivate,
  sectionID
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const confirmClick = async () => {
    setIsConfirming(true);
    const { ok } = await adminActivateSection(sectionID);

    if (!ok) return setIsConfirming(false);

    onSuccessActivate();
  };

  return (
    <div className="activate-section-modal">
      <div>
        <div className="top">
          <h3>Activate this section?</h3>
          <button onClick={closeModalClick}>
            <IoCloseCircleSharp />
          </button>
        </div>
        <p>This action will deactivate the current active section.</p>
        <button onClick={confirmClick} disabled={isConfirming}>
          {isConfirming && <LuLoader2 />}
          {!isConfirming && "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default ActivateSectionModal;
