import { useEffect, useState } from "react";
import { generateHeaders, getUser } from "../utils/auth";
import { generateGreetingByTime } from "../utils/interface";
import { chooseTextByLang, getOrSetLang } from "../utils/locale";
import { getAllNotesByUser } from "../utils/notes";
import { getAllTagsByUser } from "../utils/tags";

function Header() {
    return (
        <div>
        </div>
    )
}

function ContentNotes() {
    const lang = getOrSetLang()
    const headers = generateHeaders(getUser())
    const [notes, setNotes] = useState({ results: [], next: null });
    const [tags, setTags] = useState([])
    
    useEffect(() => {
    const fetchNotes = async () => {
        try {
            const result = await getAllNotesByUser(headers);
            setNotes(result);
        } catch (error) {
            console.error('Ошибка при загрузке заметок:', error);
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

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }, [notes, headers]);



    useEffect(() => {
        const fetchTags = async() => {
            try {
                const result = await getAllTagsByUser(headers);
                setTags(result)
            } catch (error) {
                console.log("Ошибка при загрузке тэгов: ", error)
            }
        }

        fetchTags()
    }, [])
    
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{generateGreetingByTime()}</h1>
            <h1 className="text-xl text-gray-600">
            {chooseTextByLang(
                "Организовывайте свою жизнь с нами.",
                "Organise your life with us.",
                lang
            )}
            </h1>

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
        </div>
        );
}

function Home() {
    const isRegistered = getUser()
    return (
        <div>
            {isRegistered ? (
                <>
                    <Header/>
                    <ContentNotes/>
                </>
            ):(
                <h1>Вы не зарегистрированы</h1>
            )}
        </div>
    )
}

export default function HomePage() {
    return <Home/>;
}
