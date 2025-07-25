import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { IoCloseCircleSharp } from "react-icons/io5";

const ConfirmDeleteModal = ({
  itemToDelete,
  pathWhenModalIsClosed,
  confirmAction
}) => {
  const router = useRouter();

  const itemName = useMemo(() => {
    if (!itemToDelete) return "this item?";
    return (
      <span>
        <strong>&quot;{itemToDelete?.replace(/\?$/, "")}&quot;</strong>?
      </span>
    );
  }, [itemToDelete]);

  const handleCloseClick = () => {
    router.replace(pathWhenModalIsClosed);
  };

  return (
    <div className="confirm-delete-modal">
      <div>
        <div className="header">
          <p>Are you sure to delete {itemName}</p>
          <button className="close-btn" onClick={handleCloseClick}>
            <IoCloseCircleSharp />
          </button>
        </div>
        <button className="confirm-btn" onClick={confirmAction}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
