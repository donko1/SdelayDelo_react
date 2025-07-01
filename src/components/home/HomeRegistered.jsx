import { act, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@components/layout/Header";
import ContentNotes from "@components/notes/ContentNotes";
import NoteForm from "@/components/notes/NoteForm/NoteForm";
import ArchivedNotes from "@components/notes/ArchivedNotes";
import { getUser, removeUser, generateHeaders } from "@utils/api/auth";
import { getMyDayByUser, getAllNotesByUser } from "@utils/api/notes";
import { getAllTagsByUser } from "@utils/api/tags";
import { generateGreetingByTime } from "@utils/helpers/interface";
import { chooseTextByLang, getOrSetLang, getOrSetUTC } from "@utils/helpers/locale";
import { useUser } from "@context/UserContext";
import Calendar from "@components/layout/Calendar";
import NextWeek from "@components/layout/NextWeek";
import AddNoteButton from "@components/ui/AddNoteButton";
import { useActElemContext } from "@context/ActElemContext";

export default function HomeRegistered() {
  const headers = generateHeaders(getUser());
  const lang = getOrSetLang();
  const timezone = getOrSetUTC()

  const [isAuthenticated, setIsAuthenticated] = useState(getUser() != null);
  const [notes, setNotes] = useState({ results: [], next: null });
  const [allNotes, setAllNotes] = useState({ result: [], next: null });
  const [tags, setTags] = useState([]);
  const [openArchived, setOpenArchived] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const {actelem, setAct} = useActElemContext()
  const { refreshUser } = useUser();
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const getStyleByNotes = (notes) => {
    if (notes?.results?.length > 0) {
      return 1
    }
    return 2
  }
  const formatDateWithTimezone = (timezone) => {
    const now = new Date();
    
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(now)
      .replace(/\//g, '/'); 
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1); 
    setEditingNote(null)
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

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        notes.next
      ) {
        try {
          const response = await fetch(notes.next, { headers });
          const newNotes = await response.json();
          setNotes(prev => ({
            results: [...prev.results, ...newNotes.results],
            next: newNotes.next,
          }));
        } catch (err) {
          console.error("Ошибка при загрузке следующей страницы:", err);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [notes, headers]);

  return (
    <div className="relative">
      <div className="fixed left-0 top-0 bottom-0 bg-[#6a6a6a] text-white p-[15px] overflow-y-auto">
        <Header
          activeElem={actelem}
          setAct={setAct}
          addNoteFunc={() => !editingNote && setEditingNote({})}
          setOpenArchived={setOpenArchived}
          tags_data={tags}
        />
      </div>

      {openArchived && (
        <ArchivedNotes
          onClose={() => setOpenArchived(false)}
          lang={lang}
          headers={headers}
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
          onDelete={handleRefresh}
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
           onDelete={handleRefresh}
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
            onDelete={handleRefresh}
            text={chooseTextByLang("Все заметки", "All notes", getOrSetLang())}
          />
        </div>
      )}

      {actelem === "myDay" && (
        <div className="ml-96 p-4">
          <nav>
            <Link to="/">Главная</Link>
            {!isAuthenticated && <Link to="/login">Войти</Link>}
            {isAuthenticated && (
              <button
                onClick={() => {
                  removeUser();
                  refreshUser();
                  setIsAuthenticated(false);
                }}
              >
                Выйти
              </button>
            )}
          </nav>

          <div className="justify-start text-zinc-900 text-5xl font-extrabold font-['Inter']">{generateGreetingByTime()}</div>
          <div className="justify-start mt-[15px] text-neutral-500 text-5xl font-semibold font-['Inter']">{chooseTextByLang(
              "Организовывайте свою жизнь с нами.",
              "Organise your life with us.",
              lang
            )}</div>

          {notes?.results?.length > 0 && (
            <div className="mt-[40px]">
            <ContentNotes
              notes={notes}
              tags={tags}
              editingNote={editingNote}
              onEdit={setEditingNote}
              onCloseEdit={() => setEditingNote(null)}
              onArchivedSuccess={handleRefresh}
              onSubmitSuccess={handleRefresh}
              onDelete={handleRefresh}
              refreshTags={fetchTags}
            />
          </div>
          )}
          
          <AddNoteButton style={getStyleByNotes(notes)} editingNote={editingNote} setEditingNote={setEditingNote}/>

          {editingNote && !editingNote.id && (
            <NoteForm
              note={null}
              tags={tags}
              onClose={() => setEditingNote(null)}
              onSubmitSuccess={
                handleRefresh
              }
              onDeleteSuccess={handleRefresh
              }
              refreshTags={fetchTags}
            />
          )}

        </div>
      )}
    </div>
  );
}
