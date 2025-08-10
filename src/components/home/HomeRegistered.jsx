import { useEffect, useState, useCallback, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import Header from "@components/layout/Header";
import ContentNotes from "@components/notes/ContentNotes";
import NoteForm from "@components/notes/NoteForm/NoteForm";
import ArchivedNotes from "@components/notes/ArchivedNotes";
import { useAuth } from "@context/AuthContext";
import {
  getMyDayByUser,
  getAllNotesByUser,
  hideNote,
  deleteNoteById,
  undoHideNote,
} from "@utils/api/notes";
import { getAllTagsByUser } from "@utils/api/tags";
import { generateGreetingByTime } from "@utils/helpers/interface";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useUser } from "@context/UserContext";
import Calendar from "@components/layout/Calendar";
import NextWeek from "@components/layout/NextWeek";
import AddNoteButton from "@components/ui/AddNoteButton";
import { useActElemContext } from "@context/ActElemContext";
import { useLang } from "@context/LangContext";
import NoteFormCreate from "@components/notes/NoteForm/NoteFormCreate";
import { useTimezone } from "@/context/TimezoneContext";
import { useToast } from "@/utils/hooks/useToast";

export default function HomeRegistered() {
  const { headers } = useAuth();
  const { lang } = useLang();

  const { showToast, ToastContainer } = useToast();

  const [notes, setNotes] = useState({ results: [], next: null });
  const [allNotes, setAllNotes] = useState({ result: [], next: null });
  const [tags, setTags] = useState([]);
  const [openArchived, setOpenArchived] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const { actelem, setAct } = useActElemContext();
  const [isCreating, setIsCreating] = useState(false);
  const { timezone } = useTimezone();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notesRef, notesInView] = useInView({
    triggerOnce: false,
    rootMargin: "100px",
  });

  const [allNotesRef, allNotesInView] = useInView({
    triggerOnce: false,
    rootMargin: "100px",
  });

  const fetchNextPage = useCallback(
    async (url, setter) => {
      try {
        const response = await fetch(url, { headers });
        const newData = await response.json();
        setter((prev) => ({
          results: [...prev.results, ...newData.results],
          next: newData.next,
        }));
      } catch (err) {
        console.error("Ошибка при загрузке следующей страницы:", err);
      }
    },
    [headers]
  );

  const greeting = useMemo(() => {
    return generateGreetingByTime();
  }, [timezone, lang]);

  useEffect(() => {
    if (notesInView && notes.next && actelem === "myDay") {
      const timer = setTimeout(() => {
        fetchNextPage(notes.next, setNotes);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [notesInView, notes.next, actelem, fetchNextPage]);

  useEffect(() => {
    if (allNotesInView && allNotes.next && actelem === "allNotes") {
      const timer = setTimeout(() => {
        fetchNextPage(allNotes.next, setAllNotes);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [allNotesInView, allNotes.next, actelem, fetchNextPage]);

  const getStyleByNotes = (notes) => {
    if (notes?.results?.length > 0) {
      return 1;
    }
    return 2;
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    setEditingNote(null);
  };

  const fetchNotes = async () => {
    try {
      const result = await getMyDayByUser(headers);
      setNotes(result);
    } catch (error) {
      console.error("Ошибка при загрузке заметок моего дня:", error);
    }
  };

  const fetchAllNotes = async () => {
    try {
      const result = await getAllNotesByUser(headers);
      setAllNotes(result);
    } catch (error) {
      console.log("Ошибка при загрузке всех заметок:", error);
    }
  };

  const onDelete = async (noteId) => {
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
          handleRefresh();
          await undoHideNote(headers, noteId);
        },
      }
    );
  };

  useEffect(() => {
    fetchNotes();
    fetchAllNotes();
  }, [refreshTrigger]);

  const fetchTags = async () => {
    try {
      const result = await getAllTagsByUser(headers);
      setTags(result);
    } catch (error) {
      console.log("Ошибка при загрузке тэгов: ", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="relative">
      {isCreating && (
        <NoteFormCreate
          tags={tags}
          onClose={() => {
            setIsCreating(false);
          }}
          refreshTags={fetchTags}
          onSubmitSuccess={handleRefresh}
          fixedStyle={true}
        />
      )}
      <div className="fixed left-0 top-0 bottom-0 bg-[#6a6a6a] text-white p-[15px] overflow-y-auto">
        <Header
          activeElem={actelem}
          setAct={setAct}
          setOpenArchived={setOpenArchived}
          tags_data={tags}
          openForm={setIsCreating}
        />
      </div>

      {openArchived && (
        <ArchivedNotes
          onClose={() => setOpenArchived(false)}
          onRefresh={handleRefresh}
          tags={tags}
        />
      )}
      {actelem === "Calendar" && (
        <Calendar
          tags={tags}
          editingNote={editingNote}
          onEdit={setEditingNote}
          onCloseEdit={() => setEditingNote(null)}
          onArchivedSuccess={handleRefresh}
          onSubmitSuccess={handleRefresh}
          onDelete={onDelete}
          refreshTags={fetchTags}
        />
      )}
      {actelem === "next7Days" && (
        <div className="ml-96 p-4">
          <NextWeek
            tags={tags}
            editingNote={editingNote}
            onEdit={setEditingNote}
            onCloseEdit={() => setEditingNote(null)}
            onArchivedSuccess={handleRefresh}
            onSubmitSuccess={handleRefresh}
            onDelete={onDelete}
            refreshTags={fetchTags}
          />
        </div>
      )}
      {actelem === "allNotes" && (
        <div className="ml-96 p-4">
          <ContentNotes
            notes={allNotes}
            tags={tags}
            editingNote={editingNote}
            onEdit={setEditingNote}
            onCloseEdit={() => setEditingNote(null)}
            onArchivedSuccess={handleRefresh}
            onSubmitSuccess={handleRefresh}
            onDelete={onDelete}
            text={chooseTextByLang("Все заметки", "All notes", lang)}
            refreshTags={fetchTags}
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
              notes={notes}
              tags={tags}
              editingNote={editingNote}
              onEdit={setEditingNote}
              onCloseEdit={() => setEditingNote(null)}
              onArchivedSuccess={handleRefresh}
              onSubmitSuccess={handleRefresh}
              onDelete={onDelete}
              refreshTags={fetchTags}
            />
            {notes.next && <div ref={notesRef} className="h-2" />}
          </div>

          <AddNoteButton
            style={getStyleByNotes(notes)}
            editingNote={editingNote}
            setEditingNote={setEditingNote}
          />

          {editingNote && !editingNote.id && (
            <NoteForm
              note={null}
              tags={tags}
              onClose={() => setEditingNote(null)}
              onSubmitSuccess={handleRefresh}
              onDeleteSuccess={handleRefresh}
              refreshTags={fetchTags}
            />
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
