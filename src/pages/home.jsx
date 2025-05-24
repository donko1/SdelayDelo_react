import { useEffect, useState } from "react";
import { generateHeaders, getUser } from "../utils/auth";
import { generateGreetingByTime } from "../utils/interface";
import { chooseTextByLang, getOrSetLang } from "../utils/locale";
import { getAllNotesByUser } from "../utils/notes";

function Header() {
    return (
        <div>
        </div>
    )
}

function ContentNotes() {
    const lang = getOrSetLang()
    const headers = generateHeaders(getUser())
    const [notes, setNotes] = useState([]);
    
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

    console.log(notes)
    return (
        <div>
            <h1>{generateGreetingByTime()}</h1>
            <h1>{chooseTextByLang("Организовывайте свою жизнь с нами.", "Organise your life with us.", lang)}</h1>
        </div>
    )
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
