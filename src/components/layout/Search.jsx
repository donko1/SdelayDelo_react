import { useEffect, useState } from "react";
import SearchIcon from "@assets/search.svg?react";
import CrossIcon from "@assets/cross.svg?react";
import { chooseTextByLang } from "@/utils/helpers/locale";
import { useLang } from "@/context/LangContext";

export function SearchWindow({ onClose }) {
  const { lang } = useLang();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="min-w-[800px] min-h-[500px] relative rounded-[20px] border border-black bg-[#ffffff]">
        <div className="flex gap-[20px] items-center px-[22px] py-[22px] border-b border-black">
          <SearchIcon className="w-8 h-8" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder={chooseTextByLang(
              "Поиск заметок",
              "Search for notes",
              lang
            )}
            className="text-xl font-['Inter'] outline-none w-full"
          />
          <CrossIcon
            className="cursor-pointer hover:rotate-180 hover:text-red-500 transition-all duration-300 "
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
