"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const ImageWithFallback = ({
  src,
  alt,
  height,
  width,
  fallBackSrc,
  unoptimized = false
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      onError={() => setImgSrc(fallBackSrc)}
      unoptimized={unoptimized}
    />
  );
};

export default ImageWithFallback;
