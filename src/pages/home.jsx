import { useEffect, useState } from "react";
import { generateHeaders, getUser, removeUser } from "../utils/auth";
import { generateGreetingByTime } from "../utils/interface";
import { chooseTextByLang, getOrSetLang } from "../utils/locale";
import { getAllNotesByUser, getMyDayByUser } from "../utils/notes";
import { getAllTagsByUser } from "../utils/tags";
import Header from "../components/Header";
import ContentNotes from "../components/ContentNotes";
import NoteForm from "../components/NoteForm";
import ArchivedNotes from "../components/ArchivedNotes";
import { Link } from "react-router-dom";

function Home() {
    const isRegistered = getUser();
    const lang = getOrSetLang();
    const headers = generateHeaders(getUser());

    const [isAuthenticated, setIsAuthenticated] = useState(getUser() != null);
    const [notes, setNotes] = useState({ results: [], next: null });
    const [allNotes, setAllNotes] = useState({result: [], next: null})
    const [openArchived, setOpenArchived] = useState(false)
    const [editingNote, setEditingNote] = useState(null);
    const [tags, setTags] = useState([]);
    const [actelem, setAct] = useState("myDay")

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
            setAllNotes(result)
        }
        catch (error) {
            console.log("Ошибка при загрузке всех заметок:", error)
        }
    }

    useEffect(() => {
        fetchNotes();
        fetchAllNotes()
    }, []);


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

    if (!isRegistered) {
        return (
        <nav>
          <Link to="/">Главная</Link>
          
          {!isAuthenticated && (<Link to="/login">Войти</Link>)}
          {isAuthenticated && (
            <button onClick={() => {
              removeUser();
              setIsAuthenticated(false); 
            }}>Выйти</button>
          )}
        </nav>);
    }

    return (
        <div className="relative">
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#6a6a6a] text-white p-4 overflow-y-auto">
                <Header activeElem={actelem} setAct={setAct} addNoteFunc={() => !editingNote && setEditingNote({})} setOpenArchived={setOpenArchived} />
            </div>
            {openArchived && (
                <ArchivedNotes 
                    onClose={() => setOpenArchived(false)}
                    lang={lang}
                    headers={headers}
                    onRefresh={fetchNotes}
                    tags={tags}
                />
            )}

            {actelem === "allNotes" && (
                <div className="ml-64 p-4">
                    <ContentNotes
                        notes={allNotes}
                        tags={tags}
                        editingNote={editingNote}
                        onEdit={(note) => setEditingNote(note)}
                        onCloseEdit={() => setEditingNote(null)}
                        onArchivedSuccess={fetchNotes}
                        onSubmitSuccess={(updatedNote) => {
                            setNotes(prev => ({
                                ...prev,
                                results: prev.results.map(n =>
                                    n.id === updatedNote.id ? updatedNote : n
                                ),
                            }));
                            setEditingNote(null);
                        }}
                        onDelete={(deletedId) => {
                        setNotes(prev => ({
                            ...prev,
                            results: prev.results.filter(n => n.id !== deletedId),
                        }));
                        if (editingNote?.id === deletedId) {
                            setEditingNote(null);
                        }
                    }}/>
                </div>
            )}
            {actelem === "myDay" && (
                <div className="ml-64 p-4">

                    <nav>
                    <Link to="/">Главная</Link>
                    
                    {!isAuthenticated && (<Link to="/login">Войти</Link>)}
                    {isAuthenticated && (
                        <button onClick={() => {
                        removeUser();
                        setIsAuthenticated(false); 
                        }}>Выйти</button>
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
                            Добавить заметку
                        </button>
                    </div>

                    {editingNote && !editingNote.id && (
                        <NoteForm
                            note={null}
                            tags={tags}
                            onClose={() => setEditingNote(null)}
                            onSubmitSuccess={(newNote) => {
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
                        onEdit={(note) => setEditingNote(note)}
                        onCloseEdit={() => setEditingNote(null)}
                        onArchivedSuccess={fetchNotes}
                        onSubmitSuccess={(updatedNote) => {
                            setNotes(prev => ({
                                ...prev,
                                results: prev.results.map(n =>
                                    n.id === updatedNote.id ? updatedNote : n
                                ),
                            }));
                            setEditingNote(null);
                        }}
                        onDelete={(deletedId) => {
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

export default function HomePage() {
    return <Home />;
}
