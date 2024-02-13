import { IoCloseCircleSharp } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidCloudUpload } from "react-icons/bi";
import adminFetchAllUploadedImageKey from "@/services/api/adminFetchAllUploadedImageKey";
import Image from "next/image";
import adminGetS3PreSignedURL from "@/services/api/adminGetS3PreSignedURL";
import adminS3PreSignedURLUploadImage from "@/services/api/adminS3PreSignedURLUploadImage";

const ImageGalleryModal = ({ addImage }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [imageKeys, setImageKeys] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [imageToUpload, setImageToUpload] = useState(undefined);

  useEffect(() => {
    const fetchImageKeys = async () => {
      const response = await adminFetchAllUploadedImageKey();
      if (!response.ok) return;
      setImageKeys(response.json.imageKeys);
    };

    fetchImageKeys();
  }, []);

  const closeModal = () => {
    router.push(`${pathname}?edit_content=true`);
  };

  const renderUploadedImages = () => {
    if (imageKeys.length === 0) return <></>;
    return (
      <div className="uploaded-image-container">
        {imageKeys.map((imageKey, index) => (
          <Image
            key={index}
            src={`${process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL}/${imageKey}`}
            alt="uploaded-image"
            width={500}
            height={500}
            priority
            className={`${
              selectedImageIndex === index ? "border-custom-blue-light" : ""
            }`}
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </div>
    );
  };

  const handleConfirmClick = () => {
    addImage(
      `${process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL}/${imageKeys[selectedImageIndex]}`
    );
  };

  const handleUploadImageClick = () => {
    router.push(`${pathname}?edit_content=true&upload_image=true`);
  };

  const renderSelectImagePanel = () => {
    if (searchParams.get("upload_image") === "true") return <></>;
    return (
      <>
        <h3>Select image</h3>
        {renderUploadedImages()}
        <div className="select-btn-container">
          <button
            disabled={selectedImageIndex === -1 ? true : false}
            onClick={handleConfirmClick}
          >
            Confirm
          </button>
          <button onClick={handleUploadImageClick}>Upload Image</button>
        </div>
      </>
    );
  };

  const handleUploadClick = async () => {
    if (!imageToUpload || !String(imageToUpload.type).includes("image")) return;
    const preSignedResponse = await adminGetS3PreSignedURL();
    if (!preSignedResponse.ok) return;
    const formData = new FormData();
    formData.append("image", imageToUpload);
    const isUploadSuccessful = await adminS3PreSignedURLUploadImage(
      preSignedResponse.json.preSignedURL,
      formData
    );

    if (!isUploadSuccessful.ok) return;

    addImage(
      `${process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL}/image/${preSignedResponse.json.imageKey}`
    );
  };

  const handleCancelClick = () => {
    router.push(`${pathname}?edit_content=true&select_image=true`);
    setImageToUpload(undefined);
  };

  const renderImageInput = () => {
    return (
      <>
        <label htmlFor="upload-img" className="upload-img">
          <BiSolidCloudUpload />
          <span>Upload image from your system</span>
        </label>
        <input
          type="file"
          id="upload-img"
          name="upload-img"
          accept="image/*"
          className="hidden"
          onChange={(event) => setImageToUpload(event.target.files[0])}
        ></input>
      </>
    );
  };

  const renderImageToUpload = () => {
    if (!imageToUpload || !String(imageToUpload.type).includes("image"))
      return <></>;
    return (
      <Image
        src={URL.createObjectURL(imageToUpload)}
        alt="image-to-upload"
        width={500}
        height={500}
        priority
        className="img-to-upload"
      />
    );
  };

  const renderUploadImagePanel = () => {
    if (searchParams.get("select_image") === "true") return <></>;
    return (
      <>
        <h3>Upload image</h3>
        {imageToUpload && !String(imageToUpload?.type).includes("image") && (
          <p className="file-type-error">The uploaded file is not an image</p>
        )}
        {renderImageInput()}
        {renderImageToUpload()}
        <div className="upload-btn-container">
          <button onClick={handleUploadClick}>Upload</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      </>
    );
  };

  return (
    <div className="image-gallery-modal">
      <div>
        <button type="button" className="close-btn" onClick={closeModal}>
          <IoCloseCircleSharp />
        </button>
        {renderSelectImagePanel()}
        {renderUploadImagePanel()}
      </div>
    </div>
  );
};

export default ImageGalleryModal;
