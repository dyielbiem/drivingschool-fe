import { useRouter } from "next/navigation";
import { IoCloseCircleSharp } from "react-icons/io5";

const ConfirmDeleteModal = ({
  itemToDelete,
  pathWhenModalIsClosed,
  confirmAction
}) => {
  const router = useRouter();

  const handleCloseClick = () => {
    router.push(pathWhenModalIsClosed);
  };

  return (
    <div className="confirm-delete-modal">
      <div>
        <div className="header">
          <p>
            Are you sure to delete{" "}
            {itemToDelete ? (
              <span>&quot;{itemToDelete}&quot;?</span>
            ) : (
              "this item?"
            )}
          </p>
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
