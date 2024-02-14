import { IoCloseCircleSharp } from "react-icons/io5";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const EmbedYoutubeModal = ({ embedYoutube }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [youtubeURL, setYoutubeURL] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    embedYoutube(youtubeURL);
  };

  const closeModal = () => {
    router.push(`${pathname}?edit_content=true`);
  };

  return (
    <div className="embed-youtube-modal">
      <form onSubmit={(event) => handleSubmit(event)} action="POST">
        <button type="button" className="close-btn" onClick={closeModal}>
          <IoCloseCircleSharp />
        </button>
        <h3>Embed Youtube</h3>
        <label htmlFor="youtube-url">
          Youtube URL <span>*</span>
        </label>
        <input
          type="text"
          id="youtube-url"
          name="youtube-url"
          required
          value={youtubeURL}
          onChange={(event) => setYoutubeURL(event.target.value)}
        />
        <button className="confirm-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmbedYoutubeModal;
