import { chooseTextByLang } from "@utils/helpers/locale";
import { useLang } from "@context/LangContext";
import XIcon from "@assets/x.svg?react";

export default function AddNoteButton({ style, editingNote, setEditingNote }) {
  const { lang } = useLang();
  const buttonText = chooseTextByLang("Добавить заметку", "Add note", lang);
  const onClick = () => !editingNote && setEditingNote({});
  if (!!editingNote) {
    return;
  }
  if (style === 2) {
    return (
      <div className="mt-16">
        <button
          className="min-w-48 px-6 py-3 bg-black rounded-2xl inline-flex justify-center duration-300 transition-all items-center hover:shadow-[0px_2px_10px_0px_rgba(151,71,255,1.00)] transition-300ms gap-2.5"
          onClick={onClick}
          disabled={!!editingNote}
        >
          <span className="text-white text-2xl font-medium font-['Inter'] whitespace-nowrap">
            {buttonText}
          </span>
        </button>
      </div>
    );
  }
  return (
    <div
      className="flex items-center mt-[23px] cursor-pointer group"
      onClick={onClick}
    >
      <XIcon className="w-8 h-8 mr-[10px] transition-all duration-300 group-hover:rotate-180 text-neutral-800 group-hover:text-[#e134fc]" />
      <div className="justify-start text-neutral-800 text-xl font-bold font-['Inter'] transition-colors duration-300 group-hover:text-[#e134fc]">
        {buttonText}
      </div>
    </div>
  );
}
