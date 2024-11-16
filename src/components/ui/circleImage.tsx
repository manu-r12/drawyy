import React from "react";
import Image from "next/image";

interface CircleImageProps {
  src: string;
  alt: string;
  size?: number;
}

const CircleImage: React.FC<CircleImageProps> = ({ src, alt, size = 128 }) => {
  return (
    <div
      className="rounded-full overflow-hidden border-4 border-gray-300 bg-gray-200"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
      />
    </div>
  );
};

export default CircleImage;
