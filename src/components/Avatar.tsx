import React from "react";
import Image from "next/image";

type AvatarProps = {
  imageUri: string | null | undefined;
};

function Avatar({ imageUri }: AvatarProps) {
  return (
    <>
      <Image
        className="inline-block h-12 w-12 rounded-full"
        width={48}
        height={48}
        src={imageUri ?? "/images/profile_pic_default.png"}
        alt=""
      />
    </>
  );
}

export default Avatar;
