import { useLang } from "@/context/LangContext";
import { chooseTextByLang } from "@/utils/helpers/locale";
import { useInView } from "react-intersection-observer";
import { useNotes } from "@/utils/hooks/useNotes";
import NoteCard from "@components/ui/NoteCard";
import TitleForBlock from "@components/ui/Title";
import { useEffect } from "react";

function ContentNotes({ text, mode }) {
  const { notes, hasNextPage, fetchNextPage } = useNotes(mode);
  const { lang } = useLang();

  const [notesRef, notesInView] = useInView({
    triggerOnce: false,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (notesInView && hasNextPage) {
      const timer = setTimeout(() => {
        fetchNextPage();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [notesInView, hasNextPage, fetchNextPage]);

  return (
    <div className="h-full">
      {text && <TitleForBlock text={text} />}
      {notes.count > 0 && (
        <div className="flex flex-wrap gap-5 mt-[40px]">
          {notes?.results?.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {notes.count === 0 && (
        <div className="fixed inset-0 ml-[300px] mt-[100px] flex justify-center items-center pointer-events-none">
          <div className="pointer-events-auto">
            <div className="flex justify-center ">
              <img
                src="/images/content-notes/no_notes_base.svg"
                alt="No notes"
              />
            </div>
            <h1 className="text-black/60 text-center text-3xl font-medium font-['Inter'] mt-[30px]">
              {chooseTextByLang(
                "У вас пока что нет заметок",
                "You don't have any notes yet",
                lang
              )}
            </h1>
            <h2 className="text-neutral-600/60 text-center text-2xl font-normal font-['Inter'] mt-[7px]">
              {chooseTextByLang(
                "Начните с создания первой!",
                "Start by creating your first one!",
                lang
              )}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentNotes;
