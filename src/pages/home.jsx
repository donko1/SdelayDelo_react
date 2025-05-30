import { useEffect, useState } from "react";
import { generateHeaders, getUser } from "../utils/auth";
import { generateGreetingByTime } from "../utils/interface";
import { chooseTextByLang, getOrSetLang } from "../utils/locale";
import { getAllNotesByUser } from "../utils/notes";
import { getAllTagsByUser } from "../utils/tags";
import { isParallel } from "../utils/settings";

function Header() {
}

function AddNote({ tags, onNoteCreated }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    const toggleForm = () => {
        setIsOpen(!isOpen);
        setTitle("");
        setDescription("");
        setSelectedTags([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const content = {
            title,
            description,
            tags: selectedTags,
        };

        try {
            const headers = generateHeaders(getUser());
            let url = isParallel() ? "/api/v3/note/" : "http://localhost:8000/api/v3/note/";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(content),
            });

            if (!response.ok) {
                throw new Error("Ошибка при создании заметки");
            }

            const createdNote = await response.json();
            onNoteCreated(createdNote); 
            toggleForm();
        } catch (error) {
            console.error("Ошибка отправки заметки:", error);
        }
    };

    const handleTagToggle = (tagId) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    return (
        <div className="mb-6">
            <button
                className="px-4 py-2 bg-black text-white rounded"
                onClick={toggleForm}
            >
                {isOpen ? "Закрыть" : "Добавить заметку"}
            </button>


            {isOpen && (
    <form
        onSubmit={handleSubmit}
        className="mt-4 w-full max-w-md p-4 border border-gray-300 rounded-lg bg-white space-y-4"
    >
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок"
            required
            className="w-full p-2 border border-gray-300 rounded"
        />

        <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
            rows={3}
            required
            className="w-full p-2 border border-gray-300 rounded"
        />

        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm text-white ${
                        selectedTags.includes(tag.id)
                            ? "ring-2 ring-blue-600"
                            : ""
                    }`}
                    style={{ backgroundColor: tag.colour }}
                >
                    #{tag.title}
                </button>
            ))}
        </div>

        <div className="flex justify-end gap-2">
            <button
                type="button"
                onClick={toggleForm}
                className="px-4 py-2 border border-gray-400 rounded"
            >
                Отмена
            </button>
            <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded"
            >
                Создать
            </button>
        </div>
    </form>
)}

        </div>
    );
}

function ContentNotes({ notes, tags }) {
    return (
        <div className="flex flex-wrap gap-4">
            {notes?.results?.map((note, index) => (
                <div key={index} className="w-64 p-4 border rounded-xl shadow-sm">
                    <h1 className="text-lg font-semibold mb-2">{note.title}</h1>
                    <div className="flex flex-wrap gap-2">
                        {note.tags?.map((tagId, tagIndex) => {
                            const tag = tags.find(t => t.id === tagId);
                            return tag ? (
                                <span
                                    key={tagIndex}
                                    className="px-3 py-1 rounded-full text-sm text-white"
                                    style={{ backgroundColor: tag.colour }}
                                >
                                    #{tag.title}
                                </span>
                            ) : null;
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

function Home() {
    const isRegistered = getUser();
    const lang = getOrSetLang();
    const headers = generateHeaders(getUser());

    const [notes, setNotes] = useState({ results: [], next: null });
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
            <AddNote tags={tags} onNoteCreated={(newNote) => {
                setNotes(prev => ({
                    ...prev,
                    results: [newNote, ...prev.results]
                }));
            }} />

            <ContentNotes notes={notes} tags={tags} />
        </div>
    );
}

export default function HomePage() {
    return <Home />;
}
