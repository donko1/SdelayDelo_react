import { useState } from "react";
import Header from "@components/layout/Header";
import ContentNotes from "@components/notes/ContentNotes";
import NoteForm from "@components/notes/NoteForm/NoteForm";
import ArchivedNotes from "@components/notes/ArchivedNotes";
import { generateGreetingByTime } from "@utils/helpers/interface";
import { chooseTextByLang } from "@utils/helpers/locale";
import Calendar from "@components/layout/Calendar";
import NextWeek from "@components/layout/NextWeek";
import AddNoteButton from "@components/ui/AddNoteButton";
import { useActElemContext } from "@context/ActElemContext";
import { useLang } from "@context/LangContext";
import NoteFormCreate from "@components/notes/NoteForm/NoteFormCreate";
import { SearchWindow } from "@components/layout/Search";
import { useNotes } from "@utils/hooks/useNotes";
import { useEditing } from "@/context/EditingContext";

export default function HomeRegistered() {
  const { lang } = useLang();
  const { notes } = useNotes();
  const { editingNote } = useEditing();

  const getStyleByNotes = (notes) => {
    if (notes?.results?.length > 0) {
      return 1;
    }
    return 2;
  };

  const [openArchived, setOpenArchived] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const { actelem, setAct } = useActElemContext();
  const [isCreating, setIsCreating] = useState(false);

  const greeting = generateGreetingByTime();

  return (
    <div className="relative">
      {isCreating && (
        <NoteFormCreate
          onClose={() => {
            setIsCreating(false);
          }}
          fixedStyle={true}
        />
      )}
      <div className="fixed left-0 top-0 bottom-0 bg-[#6a6a6a] text-white p-[15px] overflow-y-auto">
        <Header
          activeElem={actelem}
          setAct={setAct}
          setOpenArchived={setOpenArchived}
          setOpenSearch={setOpenSearch}
          openForm={setIsCreating}
        />
      </div>

      {openArchived && <ArchivedNotes onClose={() => setOpenArchived(false)} />}
      {actelem === "Calendar" && <Calendar />}
      {openSearch && <SearchWindow onClose={() => setOpenSearch(false)} />}
      {actelem === "next7Days" && (
        <div className="ml-96 p-4">
          <NextWeek />
        </div>
      )}
      {actelem === "allNotes" && (
        <div className="ml-96 p-4">
          <ContentNotes
            text={chooseTextByLang("Все заметки", "All notes", lang)}
            mode="allNotes"
          />
          <div className="h-2" />
        </div>
      )}

      {actelem === "myDay" && (
        <div className="ml-96 p-4">
          <div className="justify-start text-zinc-900 text-5xl font-extrabold font-['Inter']">
            {greeting}
          </div>
          <div className="justify-start mt-[15px] text-neutral-500 text-5xl font-semibold font-['Inter']">
            {chooseTextByLang(
              "Организовывайте свою жизнь с нами.",
              "Organise your life with us.",
              lang
            )}
          </div>

          <div className="mt-[40px]">
            <ContentNotes mode="myDay" />
          </div>

          <AddNoteButton style={getStyleByNotes(notes)} />

          {editingNote?.id === "new" && <NoteForm note={null} />}
        </div>
      )}
    </div>
  );
}
