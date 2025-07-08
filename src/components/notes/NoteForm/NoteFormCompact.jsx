import { getText } from "@utils/helpers/interface";
import { useLang } from "@context/LangContext";
import { useEffect, useState } from "react";
import SendIcon from "@assets/arrow.svg?react";
import { useAuth } from "@context/AuthContext";
import { createNoteCompact } from "@/utils/api/notes";

export default function NoteFormCompact({ onClose, onSubmitSuccess, day }) {
  const [noteTitle, SetNoteTitle] = useState();
  const { lang } = useLang();
  const { headers } = useAuth();

  const handleSubmit = async () => {
    await createNoteCompact(headers, noteTitle, day.dateStr);
    await onSubmitSuccess();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [noteTitle]);

  return (
    <div className="flex h-full items-center justify-center">
      <input
        className="rounded-[10px] pl-3 h-[45px] outline outline-1 outline-[#0973ff] placeholder:ml-[20px] w-[76%] justify-start text-For-clarification text-base font-medium font-['Inter'] leading-normal"
        placeholder={getText("add_note", lang)}
        value={noteTitle}
        onChange={(e) => {
          SetNoteTitle(e.target.value);
        }}
        autoFocus
      ></input>

      <SendIcon
        onClick={handleSubmit}
        className="absolute hover:scale-125 cursor-pointer transition-all duration-300 right-[60px]"
      />
    </div>
  );
}
