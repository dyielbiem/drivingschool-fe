import { IoCloseCircleSharp } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidCloudUpload } from "react-icons/bi";
import { LuLoader2 } from "react-icons/lu";
import { MdUpload } from "react-icons/md";
import adminFetchAllUploadedImageKey from "@/services/api/adminFetchAllUploadedImageKey";
import Image from "next/image";
import adminGetS3UploadImageSignedURL from "@/services/api/adminGetS3UploadImageSignedURL";
import adminPutS3Image from "@/services/api/adminPutS3Image";

const ImageGalleryModal = ({ onAddImage }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [imageKeys, setImageKeys] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [imageToUpload, setImageToUpload] = useState(undefined);
  const [isFetchingImage, setIsFetchingImage] = useState(false);

  useEffect(() => {
    const fetchImageKeys = async () => {
      setIsFetchingImage(true);
      const response = await adminFetchAllUploadedImageKey();
      if (!response.ok) return setIsFetchingImage(false);
      setImageKeys(response.json.imageKeys);
      setIsFetchingImage(false);
    };

    fetchImageKeys();
  }, []);

  const closeModal = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("upload_image");
    currentParams.delete("select_image");
    router.push(`${pathname}?${currentParams}`);
  };

  const renderUploadedImages = () => {
    if (imageKeys.length === 0 && !isFetchingImage) return <></>;
    if (isFetchingImage)
      return (
        <p className="fetching-image">
          <span>
            <LuLoader2 />
          </span>
          Fetching uploaded image...
        </p>
      );
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
    onAddImage(
      `${process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL}/${imageKeys[selectedImageIndex]}`
    );
  };

  const handleUploadImageClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("select_image");
    router.push(`${pathname}?${currentParams}&upload_image=true`);
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
            type="button"
          >
            Confirm
          </button>
          <button
            onClick={handleUploadImageClick}
            type="button"
            className="upload-img-btn"
            disabled={isFetchingImage}
          >
            <span>
              <MdUpload />
            </span>
            Upload Image
          </button>
        </div>
      </>
    );
  };

  const handleUploadClick = async () => {
    if (!imageToUpload || !String(imageToUpload.type).includes("image")) return;
    const preSignedResponse = await adminGetS3UploadImageSignedURL();
    if (!preSignedResponse.ok) return;
    const formData = new FormData();
    formData.append("image", imageToUpload);
    const isUploadSuccessful = await adminPutS3Image(
      preSignedResponse.json.preSignedURL,
      formData
    );

    if (!isUploadSuccessful.ok) return;

    onAddImage(
      `${process.env.NEXT_PUBLIC_S3_IMAGE_BUCKET_URL}/image/${preSignedResponse.json.imageKey}`
    );
  };

  const handleCancelClick = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("upload_image");
    router.push(`${pathname}?${currentParams}&select_image=true`);
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
        />
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
          <button onClick={handleUploadClick} type="button">
            Upload
          </button>
          <button onClick={handleCancelClick} type="button">
            Cancel
          </button>
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
