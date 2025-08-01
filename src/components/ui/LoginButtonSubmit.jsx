import loading from "@assets/loading.gif";

export default function SubmitButton({ text, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-[20px] group/button-submit-code relative text-zinc-950 text-xl font-medium font-['Inter'] px-12 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex"
    >
      <span className="relative z-10 group-hover/button-submit-code:text-white whitespace-nowrap transition-colors duration-500">
        {!disabled ? (
          text
        ) : (
          <img className="w-8 mx-10" src={loading} alt="loading..." />
        )}
      </span>
      <div
        className={`rounded-3xl absolute inset-0 w-0 bg-black group-hover/button-submit-code:w-full ${
          disabled && "w-full"
        } transition-all duration-500 z-0`}
      ></div>
    </button>
  );
}
