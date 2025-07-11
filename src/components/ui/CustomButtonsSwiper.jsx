export function ButtonNext({ isAbsolute, color, onClick, disabled }) {
  return (
    <div
      className={`custom-next ${
        isAbsolute && "absolute top-1/2 right-0 z-10 transform -translate-y-1/2"
      } cursor-pointer ${disabled && "opacity-50 cursor-not-allowed"}`}
      onClick={!disabled ? onClick : () => {}}
      // This format(empty-function) for not getting warn from console browser
    >
      <div
        className={`w-20 h-20 rounded-full border-2 border-${color} flex items-center justify-center bg-transparent transition-colors`}
      >
        <div className="relative w-7 h-6 flex justify-center items-center">
          <div
            className={`absolute w-4 h-[3px] bg-${color} top-1/2 right-0 transform -translate-y-1/2 -translate-x-1/2 rotate-[45deg] origin-right`}
          ></div>
          <div
            className={`absolute w-4 h-[3px] bg-${color} bottom-1/2 right-0 transform translate-y-1/2 -translate-x-1/2 rotate-[-45deg] origin-right`}
          ></div>
        </div>
      </div>
    </div>
  );
}

export function ButtonPrev({ isAbsolute, color, onClick, disabled }) {
  console.log(disabled);

  return (
    <div
      className={`custom-prev ${
        isAbsolute && "absolute top-1/2 left-0 z-10 transform -translate-y-1/2"
      } cursor-pointer ${disabled && "opacity-50 cursor-not-allowed"}`}
      onClick={!disabled ? onClick : () => {}}
      // This format(empty-function) for not getting warn from console browser
    >
      <div
        className={`w-20 h-20 rounded-full border-2 border-${color} flex items-center justify-center bg-transparent transition-colors`}
      >
        <div className="relative w-8 h-6">
          <div
            className={`absolute w-4 h-[3px] bg-${color} top-1/2 left-0 transform -translate-y-1/2 translate-x-1/2 rotate-[-45deg] origin-left`}
          ></div>
          <div
            className={`absolute w-4 h-[3px] bg-${color} bottom-1/2 left-0 transform translate-y-1/2 translate-x-1/2 rotate-[45deg] origin-left`}
          ></div>
        </div>
      </div>
    </div>
  );
}
