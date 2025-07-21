export default function SubmitButton({ text, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-[20px] group/button-submit-code relative text-zinc-950 text-xl font-medium font-['Inter'] px-12 py-3.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex"
    >
      <span className="relative z-10 group-hover/button-submit-code:text-white transition-colors duration-500">
        {text}
      </span>
      <div className="rounded-3xl absolute inset-0 w-0 bg-black group-hover/button-submit-code:w-full transition-all duration-500 z-0"></div>
    </button>
  );
}
