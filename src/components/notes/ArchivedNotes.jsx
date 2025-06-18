import { useEffect, useState } from "react";
import { chooseTextByLang } from "@utils/helpers/locale";
import { getArchivedNotesByUser, getTagsForNote, removeFromArchive } from "@utils/api/notes";

export default function ArchivedNotes({ onClose, lang, headers, onRefresh, tags }) {
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
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);
    
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
                <div className="p-4 max-w-2xl mx-auto">
            {archivedNotes?.results?.map((note) => (
                <div 
                    key={note.id}
                    className="relative group flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                    <div className="flex items-center justify-center mr-3">
                        <input 
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 rounded-full focus:ring-indigo-500 cursor-pointer"
                            onClick={async () => {
                                try {
                                    await removeFromArchive(note.id, headers);
                                    onRefresh();
                                    setArchivedNotes(prev => ({
                                        ...prev,
                                        results: prev.results.filter(n => n.id !== note.id),
                                    }));
                                } catch (error) {
                                    console.error("Ошибка при удалении из архива:", error);
                                }
                            }}
                        />
                    </div>

                    <h1 className="text-gray-800 font-medium text-lg truncate">
                        {note.title}
                    </h1>

                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {getTagsForNote(note, tags).map(tag => (
                            <span
                                key={tag.id}
                                className="text-sm px-2 py-1 rounded-full text-white whitespace-nowrap"
                                style={{ backgroundColor: tag.colour }}
                            >
                                #{tag.title}
                            </span>
                        ))}
                    </div>
                </div>

            ))}
            </div>

            </div>
        </div>
    );
}