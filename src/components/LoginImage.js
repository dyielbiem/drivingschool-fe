import Image from "next/image";

const LoginImage = () => {
  return (
    <div className="img-container">
      <Image
        fill
        src={"https://source.unsplash.com/D5FI8jv6ndU"}
        alt="welcome-diplay-image"
      ></Image>
    </div>
  );
};

export default LoginImage;
