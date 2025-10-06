import { useEffect, useState, useCallback, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import Header from "@components/layout/Header";
import ContentNotes from "@components/notes/ContentNotes";
import NoteForm from "@components/notes/NoteForm/NoteForm";
import ArchivedNotes from "@components/notes/ArchivedNotes";
import { useAuth } from "@context/AuthContext";
import {
  getAllNotesByUser,
  hideNote,
  deleteNoteById,
  undoHideNote,
} from "@utils/api/notes";
import { getAllTagsByUser } from "@utils/api/tags";
import { generateGreetingByTime } from "@utils/helpers/interface";
import { chooseTextByLang } from "@utils/helpers/locale";
import Calendar from "@components/layout/Calendar";
import NextWeek from "@components/layout/NextWeek";
import AddNoteButton from "@components/ui/AddNoteButton";
import { useActElemContext } from "@context/ActElemContext";
import { useLang } from "@context/LangContext";
import NoteFormCreate from "@components/notes/NoteForm/NoteFormCreate";
import { useTimezone } from "@/context/TimezoneContext";
import { useToastHook } from "@hooks/useToast";
import { SearchWindow } from "@components/layout/Search";
import { useNotes } from "@utils/hooks/useNotes";

export default function HomeRegistered() {
  const { headers } = useAuth();
  const { lang } = useLang();
  const { notes } = useNotes();

  const { showToast } = useToastHook();

  const [allNotes, setAllNotes] = useState({ result: [], next: null });

  const [openArchived, setOpenArchived] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const { actelem, setAct } = useActElemContext();
  const [isCreating, setIsCreating] = useState(false);
  const { timezone } = useTimezone();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const calendarKey = useMemo(() => refreshTrigger, [refreshTrigger]);
  const nextWeekKey = useMemo(() => refreshTrigger, [refreshTrigger]);

  const [allNotesRef, allNotesInView] = useInView({
    triggerOnce: false,
    rootMargin: "100px",
  });

  const greeting = useMemo(() => {
    return generateGreetingByTime();
  }, [timezone, lang]);

  const getStyleByNotes = (notes) => {
    if (notes?.results?.length > 0) {
      return 1;
    }
    return 2;
  };

  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setEditingNote(null);
  }, []);

  const fetchAllNotes = async () => {
    try {
      const result = await getAllNotesByUser(headers);
      setAllNotes(result);
    } catch (error) {
      console.log("Ошибка при загрузке всех заметок:", error);
    }
  };

  const onDelete = async (noteId, update) => {
    await hideNote(headers, noteId);
    handleRefresh();
    showToast(
      chooseTextByLang("Заметка была удалена", "The note was deleted", lang),
      "delete",
      {
        onClose: async () => {
          try {
            await deleteNoteById(noteId, headers);
          } catch (e) {
            console.error(e);
          }
        },
        onUndo: async () => {
          await undoHideNote(headers, noteId);
          if (update) {
            await update();
          }
          handleRefresh();
        },
      }
    );
  };

  useEffect(() => {
    fetchAllNotes();
  }, [refreshTrigger]);

  return (
    <div className="relative">
      {isCreating && (
        <NoteFormCreate
          onClose={() => {
            setIsCreating(false);
          }}
          onSubmitSuccess={handleRefresh}
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
      {actelem === "Calendar" && (
        <Calendar
          key={`calendar_${calendarKey}`}
          editingNote={editingNote}
          onEdit={setEditingNote}
          onCloseEdit={() => setEditingNote(null)}
        />
      )}
      {openSearch && (
        <SearchWindow
          onClose={() => setOpenSearch(false)}
          refreshTrigger={refreshTrigger}
          editingNote={editingNote}
          onEdit={setEditingNote}
          onCloseEdit={() => {
            setEditingNote(null);
          }}
          onArchivedSuccess={handleRefresh}
          onSubmitSuccess={handleRefresh}
          onDelete={onDelete}
        />
      )}
      {actelem === "next7Days" && (
        <div className="ml-96 p-4">
          <NextWeek
            key={`nextweek_${nextWeekKey}`}
            editingNote={editingNote}
            onEdit={setEditingNote}
            onCloseEdit={() => setEditingNote(null)}
          />
        </div>
      )}
      {actelem === "allNotes" && (
        <div className="ml-96 p-4">
          <ContentNotes
            editingNote={editingNote}
            onEdit={setEditingNote}
            onCloseEdit={() => setEditingNote(null)}
            text={chooseTextByLang("Все заметки", "All notes", lang)}
            mode="allNotes"
          />
          {allNotes.next && <div ref={allNotesRef} className="h-2" />}
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
            <ContentNotes
              editingNote={editingNote}
              onEdit={setEditingNote}
              onCloseEdit={() => setEditingNote(null)}
              mode="myDay"
            />
          </div>

          <AddNoteButton
            style={getStyleByNotes(notes)}
            editingNote={editingNote}
            setEditingNote={setEditingNote}
          />

          {editingNote && !editingNote.id && (
            <NoteForm
              note={null}
              onClose={() => setEditingNote(null)}
              onSubmitSuccess={handleRefresh}
              onDeleteSuccess={handleRefresh}
            />
          )}
        </div>
      )}
    </div>
  );
}
