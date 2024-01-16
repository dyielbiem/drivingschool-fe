import { useRouter } from "next/navigation";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useState } from "react";
import adminCreateSection from "@/services/api/adminCreateSection";

const CreateSectionForm = ({ setSections }) => {
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsButtonDisabled(true);
    const response = await adminCreateSection(sectionTitle);

    if (!response.ok) return setIsButtonDisabled(false);
    setSections((prevState) => {
      const newState = prevState.map((item) => {
        return { ...item, isActive: false };
      });

      newState.unshift({ ...response.json, isActive: true });

      return newState;
    });

    router.push("/admin/sections");
  };

  const closeForm = () => {
    router.push("/admin/sections");
  };

  return (
    <div className="create-section-form">
      <form action="POST" onSubmit={(event) => handleSubmit(event)}>
        <button type="button" className="close-btn" onClick={() => closeForm()}>
          <IoCloseCircleSharp />
        </button>
        <h3>Create new section</h3>
        <label htmlFor="section-title">
          Section title <span>*</span>
        </label>
        <input
          type="text"
          name="section-title"
          id="section-title"
          required
          value={sectionTitle}
          onChange={(event) => setSectionTitle(event.target.value)}
        />
        <button
          type="submit"
          className="submit-btn"
          disabled={isButtonDisabled}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateSectionForm;
