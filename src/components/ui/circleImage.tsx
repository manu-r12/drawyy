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
      className="relative rounded-full p-[4px] bg-violet-500"
      style={{ width: size, height: size }}
    >
      <div
        className="rounded-full overflow-hidden bg-gray-200"
        style={{ width: "100%", height: "100%" }}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default CircleImage;
