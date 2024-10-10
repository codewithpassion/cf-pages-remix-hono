import React from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  layout?: "fixed" | "fill" | "responsive" | "intrinsic";
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  quality?: number;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  layout,
  objectFit,
  ...props
}) => {
  const imgStyle: React.CSSProperties = {
    maxWidth: "100%",
    height: "auto",
  };

  if (layout === "fill") {
    imgStyle.objectFit = objectFit || "cover";
    imgStyle.position = "absolute";
    imgStyle.top = 0;
    imgStyle.left = 0;
    imgStyle.bottom = 0;
    imgStyle.right = 0;
  } else {
    imgStyle.width = width;
    imgStyle.height = height;
  }

  return (
    <img
      src={src}
      alt={alt}
      style={imgStyle}
      width={width}
      height={height}
      {...props}
    />
  );
};

export { Image };
