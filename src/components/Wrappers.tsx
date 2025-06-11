import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import React, { ReactNode, ElementType } from "react";

interface WrapperProps {
  containerClassName?: string;
  bgColor?: string;
  isTop?: boolean;
  isTop2?: boolean;
  children: ReactNode;
  className?: string;
  isMaxWidthChangeRequired?: string;
  as?: ElementType;
  [key: string]: any;
  bgImage?: StaticImageData;
}

export default function Wrapper({
  containerClassName = "",
  bgColor = "bg-transparent",
  isTop = false,
  isTop2 = false,
  children,
  className = "",
  isMaxWidthChangeRequired = "max-w-screen-2xl",
  as: Component = "section",
  bgImage,
  ...props
}: WrapperProps) {
  return (
    <Component
      className={cn(
        "w-full px-3 xl:px-20",
        bgColor,
        containerClassName,
        "font-inter",
        isTop && "pt-[4.5rem] md:pt-36",
        isTop2 && "pt-20",
        bgImage && "relative overflow-hidden",
      )}
      {...props}
    >
      {bgImage && (
        <>
          <Image
            src={bgImage}
            alt="Background-Image"
            width={150}
            height={150}
            className="absolute inset-0 w-full object-cover"
          />
        </>
      )}
      <div
        className={cn("mx-auto w-full", isMaxWidthChangeRequired, className)}
      >
        {children}
      </div>
    </Component>
  );
}
