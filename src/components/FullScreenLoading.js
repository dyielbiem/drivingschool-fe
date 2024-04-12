import { RiLoader2Fill } from "react-icons/ri";

const FullScreenLoading = ({ loadingText }) => {
  return (
    <div className="full-screen-loading">
      <RiLoader2Fill />
      <p>{loadingText || "Please wait a moment"}</p>
    </div>
  );
};

export default FullScreenLoading;
