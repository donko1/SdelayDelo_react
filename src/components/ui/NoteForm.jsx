import { useEffect, useState } from "react";
import { generateHeaders, getUser } from "@utils/api/auth";
import { isParallel } from "@utils/helpers/settings";
import { addNoteToArchive, deleteNoteById } from "@utils/api/notes";


function NoteForm({ note, tags, onClose, onSubmitSuccess, onDeleteSuccess, onArchivedSuccess, date_of_note }) {
    const [title, setTitle] = useState(note?.title || "");
    const [description, setDescription] = useState(note?.description || "");
    const [selectedTags, setSelectedTags] = useState(note?.tags || []);
    const isEditing = !(note == null)

    const titleTextareaRef = useRef(null);
    const descriptionTextareaRef = useRef(null);


    useEffect(() => {
        if (!isEditing) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEditing, onClose]);

     const formatDate = (date) => {
        if (!(date instanceof Date)) return date;
        
        const day = date.getDate();
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const handleTagToggle = (tagId) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = { title, description, tags: selectedTags };

        if (date_of_note && !note?.id) {
            content.date_of_note = formatDate(date_of_note);
        }


        try {
            const headers = generateHeaders(getUser());
            const baseUrl = isParallel()
                ? "/api/v3/note/"
                : "http://localhost:8000/api/v3/note/";

            const url = note?.id ? `${baseUrl}${note.id}/` : baseUrl;
            const method = note?.id ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(content),
            });

            if (!response.ok) throw new Error("Ошибка при отправке заметки");

            const updatedNote = await response.json();
            onSubmitSuccess(updatedNote);
            onClose();
        } catch (error) {
            console.error("Ошибка отправки заметки:", error);
        }
    };
    
    const handleAddToArchive = async () => {
        try {
            const headers = generateHeaders(getUser());
            await addNoteToArchive(note.id, headers); 
            if (onArchivedSuccess) {
                await onArchivedSuccess(); 
            }

            onClose();
        } catch (error) {
            console.error("Ошибка при архивировании:", error);
        }
    };




    const handleDelete = async () => {
        if (!note?.id) return;

        try {
            await deleteNoteById(note.id, generateHeaders(getUser()))
            onDeleteSuccess()
        }
        catch (error) {
            console.log("Ошибка при удалении: ", error)
        }
    };

    const renderForm = () => (
        <div className="rounded-[10px] p-[12px] outline outline-1 outline-offset-[-1px] outline-black mt-[60px]">
            <form onSubmit={handleSubmit} className="">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Заголовок"
                    required
                    onKeyDown="this.style.width = ((this.value.length + 1) * 8) + 'px';"
                    className="text-stone-400 text-base font-medium font-['Inter'] leading-normal outline-none w-full"
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

                <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-400 rounded">
                        Отмена
                    </button>
                    <button type="submit" className="px-4 py-2 bg-black text-white rounded">
                        {isEditing ? "Сохранить" : "Создать"}
                    </button>
                </div>
                {isEditing && (
                    <>
                        <div className="flex justify-end w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Удалить
                            </button>
                        </div>
                        <div className="flex justify-end w-full sm:w-auto">
                            <button type="button" onClick={handleAddToArchive} className="px-4 py-2 bg-yellow-600 text-white rounded">
                                Архивировать
                            </button>
                        </div>
                    </>
                )}
            </div>
            </form>
        </div>
    );

    if (isEditing) {
        return (
            <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div onClick={e => e.stopPropagation()}  className="relative bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">modalWindow</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            &times;
                        </button>
                    </div>
                    {renderForm()}
                </div>
            </div>
        );
    }

    return renderForm();

}


export default NoteForm;
