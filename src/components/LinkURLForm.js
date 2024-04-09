import { IoCloseCircleSharp } from "react-icons/io5";
import FormButton from "./FormButton";
import { useState } from "react";

const LinkURLForm = ({ setIsVisible, formAction }) => {
  const [link, setLink] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    formAction(link);
    setIsVisible(false);
  };

  return (
    <div className="link-url-form">
      <form onSubmit={handleSubmit}>
        <h3>Link URL</h3>
        <button
          type="button"
          className="close-btn"
          onClick={() => setIsVisible(false)}
        >
          <IoCloseCircleSharp />
        </button>
        <input
          type="text"
          required
          value={link}
          onChange={(event) => setLink(event.target.value)}
        />
        <FormButton>Link</FormButton>
      </form>
    </div>
  );
};

export default LinkURLForm;
