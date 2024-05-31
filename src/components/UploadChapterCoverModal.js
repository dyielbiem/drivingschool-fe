import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BiSolidCloudUpload } from "react-icons/bi";
import { IoCloseCircleSharp } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";

import ImageWithFallback from "./ImageWithFallback";

import adminGetS3UploadChapterImageSignedURL from "@/services/api/adminGetS3UploadChapterImageSignedURL";
import adminPutS3Image from "@/services/api/adminPutS3Image";

const UploadChapterCoverModal = ({ chapterID }) => {
  const coverImageSrc = `${
    process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL
  }/image/chapter/${chapterID}?image_refresher=${new Date().getTime()}`;
  const [imageToUpload, setImageToUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleImgUpload = (event) => {
    if (!event?.target?.files[0]) return;
    setErrorMessage("");
    const file = event.target.files[0];
    if (!String(file.type).includes("image")) {
      event.target.value = "";
      setErrorMessage("Selected file is not an image");
      return setImageToUpload(null);
    }
    setImageToUpload(file);
  };

  const handleUploadClick = async () => {
    if (!imageToUpload) return setErrorMessage("Please upload an image");
    setErrorMessage("");
    setIsUploading(true);
    const { ok: preSignedOk, json: preSignedJSON } =
      await adminGetS3UploadChapterImageSignedURL(chapterID);
    if (!preSignedOk) {
      setErrorMessage(preSignedJSON.error || "An error occured");
      return setIsUploading(false);
    }

    const formData = new FormData();
    formData.append("image", imageToUpload);

    const { ok: uploadOk } = await adminPutS3Image(
      preSignedJSON.preSignedURL,
      formData
    );

    if (!uploadOk) {
      setErrorMessage("An error occured");
      return setIsUploading(false);
    }

    setSuccessMessage("Chapter cover image has been updated");

    setTimeout(() => {
      handleCloseClick();
    }, 2000);
  };

  const handleCloseClick = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete("upload_cover_image");
    router.push(`${pathname}?${currentParams}`);
  };

  return (
    <div className="upload-chapter-cover-modal">
      <div>
        <div className="header">
          <h3>Upload chapter cover image</h3>
          <button
            className="close-btn"
            onClick={handleCloseClick}
            disabled={isUploading && !successMessage}
          >
            <IoCloseCircleSharp />
          </button>
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="upload-image-box">
          <ImageWithFallback
            alt="chapter-cover-image"
            fallBackSrc="/logo.png"
            src={
              imageToUpload
                ? URL.createObjectURL(imageToUpload)
                : `${coverImageSrc}`
            }
            height={228}
            width={448}
          />
          <label htmlFor="upload-chapter-cover">
            <BiSolidCloudUpload />
            <span>Upload image from your system</span>
          </label>
          <input
            type="file"
            accept="image/*"
            id="upload-chapter-cover"
            name="upload-chapter-cover"
            onChange={(event) => handleImgUpload(event)}
          />
        </div>
        {!successMessage && (
          <button
            className="upload-btn"
            disabled={isUploading}
            onClick={handleUploadClick}
          >
            {isUploading && <LuLoader2 />}
            {isUploading ? "Uploading" : "Upload"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadChapterCoverModal;
