import { useEffect, useState } from "react";
import { chooseTextByLang } from "../utils/locale";
import { getArchivedNotesByUser } from "../utils/notes";

export default function ArchivedNotes({ onClose, lang, headers }) {
    const [archivedNotes, setArchivedNotes] = useState({ results: [], next: null });

    useEffect(() => {
        const fetchArchivedNotes = async () => {
            try {
                const result = await getArchivedNotesByUser(headers);
                if (result !== 1) {
                    setArchivedNotes(result);
                } else {
                    console.error("Ошибка при загрузке архивных заметок");
                }
            }
            catch (error) {
                console.error("Ошибка при загрузке архивных заметок:", error);
            }
        }
        fetchArchivedNotes();
    }
    , [headers]);
    console.log(archivedNotes);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>
            
            <div 
                className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()} 
            >
                <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">
                        {chooseTextByLang("Архив заметок", "Notes Archive", lang)}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-4">
                    {chooseTextByLang(
                        "Здесь будут отображаться ваши архивные заметки...",
                        "Your archived notes will appear here...",
                        lang
                    )}
                </div>
            </div>
        </div>
    );
}