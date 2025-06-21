import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@components/layout/Header";
import ContentNotes from "@components/notes/ContentNotes";
import NoteForm from "@components/ui/NoteForm";
import ArchivedNotes from "@components/notes/ArchivedNotes";
import { getUser, removeUser, generateHeaders } from "@utils/api/auth";
import { getMyDayByUser, getAllNotesByUser } from "@utils/api/notes";
import { getAllTagsByUser } from "@utils/api/tags";
import { generateGreetingByTime } from "@utils/helpers/interface";
import { chooseTextByLang, getOrSetLang } from "@utils/helpers/locale";
import { useUser } from "@context/UserContext";
import Calendar from "../layout/Calendar";

export default function HomeRegistered() {
  const headers = generateHeaders(getUser());
  const lang = getOrSetLang();

  const [isAuthenticated, setIsAuthenticated] = useState(getUser() != null);
  const [notes, setNotes] = useState({ results: [], next: null });
  const [allNotes, setAllNotes] = useState({ result: [], next: null });
  const [tags, setTags] = useState([]);
  const [openArchived, setOpenArchived] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [actelem, setAct] = useState("myDay");
  const { refreshUser } = useUser();
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1); 
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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const result = await getAllTagsByUser(headers);
        setTags(result);
      } catch (error) {
        console.log("Ошибка при загрузке тэгов: ", error);
      }
    };
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
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#6a6a6a] text-white p-4 overflow-y-auto">
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
          onSubmitSuccess={updatedNote => {
            setNotes(prev => ({
              ...prev,
              results: prev.results.map(n =>
                n.id === updatedNote.id ? updatedNote : n
              ),
            }));
            setEditingNote(null);
          }}
          onDelete={deletedId => {
            setNotes(prev => ({
              ...prev,
              results: prev.results.filter(n => n.id !== deletedId),
            }));
            if (editingNote?.id === deletedId) {
              setEditingNote(null);
            }
          }}
        />
      )} 
      {actelem === "allNotes" && (
        <div className="ml-64 p-4">
          <ContentNotes
            notes={allNotes}
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

      {actelem === "myDay" && (
        <div className="ml-64 p-4">
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

          <h1 className="text-3xl font-bold">{generateGreetingByTime()}</h1>
          <h2 className="text-xl text-gray-600">
            {chooseTextByLang(
              "Организовывайте свою жизнь с нами.",
              "Organise your life with us.",
              lang
            )}
          </h2>

          <div className="mb-6">
            <button
              className={`px-4 py-2 text-white rounded ${
                editingNote ? "bg-gray-400 cursor-not-allowed" : "bg-black"
              }`}
              onClick={() => !editingNote && setEditingNote({})}
              disabled={!!editingNote}
            >
              {chooseTextByLang("Добавить заметку", "Add note", lang)}
            </button>
          </div>

          {editingNote && !editingNote.id && (
            <NoteForm
              note={null}
              tags={tags}
              onClose={() => setEditingNote(null)}
              onSubmitSuccess={newNote => {
                setNotes(prev => ({
                  ...prev,
                  results: [newNote, ...prev.results],
                }));
                setEditingNote(null);
              }}
              onDeleteSuccess={() => {
                setEditingNote(null);
              }}
            />
          )}

          <ContentNotes
            notes={notes}
            tags={tags}
            editingNote={editingNote}
            onEdit={setEditingNote}
            onCloseEdit={() => setEditingNote(null)}
            onArchivedSuccess={fetchNotes}
            onSubmitSuccess={updatedNote => {
              setNotes(prev => ({
                ...prev,
                results: prev.results.map(n =>
                  n.id === updatedNote.id ? updatedNote : n
                ),
              }));
              setEditingNote(null);
            }}
            onDelete={deletedId => {
              setNotes(prev => ({
                ...prev,
                results: prev.results.filter(n => n.id !== deletedId),
              }));
              if (editingNote?.id === deletedId) {
                setEditingNote(null);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
