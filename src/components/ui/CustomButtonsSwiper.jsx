import { useState } from "react";

export function ButtonNext({
  isAbsolute,
  color,
  secondColor,
  onClick,
  disabled,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`custom-next ${
        isAbsolute
          ? "absolute top-1/2 right-0 z-10 transform -translate-y-1/2"
          : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div
        className="w-20 h-20 rounded-full border-2 flex items-center justify-center duration-300 transition-colors"
        style={{
          borderColor: color,
          backgroundColor: isHovered ? color : "transparent",
        }}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-7 h-6 flex justify-center items-center">
          <div
            className="absolute w-4 h-[3px] transition-colors duration-300 top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2 rotate-[45deg] origin-right"
            style={{
              backgroundColor: isHovered ? secondColor : color,
            }}
          ></div>
          <div
            className="absolute w-4 h-[3px] transition-colors duration-300 bottom-1/2 right-0 transform translate-y-1/2 -translate-x-1/2 rotate-[-45deg] origin-right"
            style={{
              backgroundColor: isHovered ? secondColor : color,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export function ButtonPrev({
  isAbsolute,
  color,
  secondColor,
  onClick,
  disabled,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`custom-prev ${
        isAbsolute
          ? "absolute top-1/2 left-0 z-10 transform -translate-y-1/2"
          : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div
        className="w-20 h-20 rounded-full border-2 flex items-center justify-center duration-300 transition-colors"
        style={{
          borderColor: color,
          backgroundColor: isHovered ? color : "transparent",
        }}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-8 h-6">
          <div
            className="absolute w-4 h-[3px] transition-colors duration-300 top-1/2 left-0 transform -translate-y-1/2 translate-x-1/2 rotate-[-45deg] origin-left"
            style={{
              backgroundColor: isHovered ? secondColor : color,
            }}
          ></div>
          <div
            className="absolute w-4 h-[3px] transition-colors duration-300 bottom-1/2 left-0 transform translate-y-1/2 translate-x-1/2 rotate-[45deg] origin-left"
            style={{
              backgroundColor: isHovered ? secondColor : color,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
