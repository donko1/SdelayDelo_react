import { useEffect, useState } from "react";
import SearchIcon from "@assets/search.svg?react";
import CrossIcon from "@assets/cross.svg?react";
import { chooseTextByLang } from "@/utils/helpers/locale";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";
import NoteCard from "../ui/NoteCard";
import { useNotes } from "@/utils/hooks/useNotes";
import { useDebounce } from "@hooks/useDebounce";

export function SearchWindow({ onClose, editingNote, onEdit, onCloseEdit }) {
  const { lang } = useLang();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const {
    data: notes,
    isLoading,
    deleteNoteMutation,
    archiveNoteMutation,
  } = useNotes("search", { query: debouncedQuery });

  useEffect(() => {
    if (editingNote?.id) return;

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
      <div className="min-w-[800px] min-h-[500px] relative rounded-[20px] border border-black bg-[#ffffff] flex flex-col">
        <div className="flex gap-[20px] items-center px-[22px] py-[22px] border-b border-black flex-shrink-0">
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
        {isLoading && (
          <div className="flex-1 flex justify-center items-center">
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        {notes?.results?.map((note) => (
          <div className="mx-[20px] my-[15px]" key={note.id}>
            <NoteCard
              note={note}
              wFull={true}
              isEditing={editingNote?.id === note.id}
              onEdit={onEdit}
              onCloseEdit={onCloseEdit}
              onDelete={() => deleteNoteMutation.mutate({ noteId: note.id })}
              onArchivedSuccess={() =>
                archiveNoteMutation.mutate({ noteId: note.id })
              }
            />
          </div>
        ))}
        {debouncedQuery && !isLoading && notes?.results?.length === 0 && (
          <div className="flex-1 flex justify-center items-center text-gray-500">
            {chooseTextByLang("Ничего не найдено", "No results found", lang)}
          </div>
        )}
      </div>
    </div>
  );
}
