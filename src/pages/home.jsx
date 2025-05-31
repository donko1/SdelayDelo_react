import { useEffect, useState } from "react";
import { generateHeaders, getUser } from "../utils/auth";
import { generateGreetingByTime } from "../utils/interface";
import { chooseTextByLang, getOrSetLang } from "../utils/locale";
import { getAllNotesByUser } from "../utils/notes";
import { getAllTagsByUser } from "../utils/tags";
import Header from "../components/Header";
import ContentNotes from "../components/ContentNotes";
import NoteForm from "../components/NoteForm";

function Home() {
    const isRegistered = getUser();
    const lang = getOrSetLang();
    const headers = generateHeaders(getUser());

    const [notes, setNotes] = useState({ results: [], next: null });
    const [editingNote, setEditingNote] = useState(null);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const result = await getAllNotesByUser(headers);
                setNotes(result);
            } catch (error) {
                console.error("Ошибка при загрузке заметок:", error);
            }
        };
        fetchNotes();
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

    if (!isRegistered) {
        return <h1>Вы не зарегистрированы</h1>;
    }

    return (
        <div className="p-6 space-y-6">
            <Header />
            <h1 className="text-3xl font-bold">{generateGreetingByTime()}</h1>
            <h2 className="text-xl text-gray-600">
                {chooseTextByLang(
                    "Организовывайте свою жизнь с нами.",
                    "Organise your life with us.",
                    lang
                )}
            </h2>

            {editingNote === null && (
                <div className="mb-6">
                    <button
                        className="px-4 py-2 bg-black text-white rounded"
                        onClick={() => setEditingNote({})} // пустой объект означает создание
                    >
                        Добавить заметку
                    </button>
                </div>
            )}

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
                />
            )}

            <ContentNotes
                notes={notes}
                tags={tags}
                editingNote={editingNote}
                onEdit={(note) => setEditingNote(note)}
                onCloseEdit={() => setEditingNote(null)}
                onSubmitSuccess={(updatedNote) => {
                    setNotes(prev => ({
                        ...prev,
                        results: prev.results.map(n =>
                            n.id === updatedNote.id ? updatedNote : n
                        ),
                    }));
                    setEditingNote(null);
                }}
            />
        </div>
    );
}


export default function HomePage() {
    return <Home />;
}
