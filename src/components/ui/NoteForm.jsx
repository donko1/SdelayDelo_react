import { useEffect, useRef, useState } from "react";
import { generateHeaders, getUser } from "@utils/api/auth";
import { isParallel } from "@utils/helpers/settings";
import { addNoteToArchive, deleteNoteById } from "@utils/api/notes";
import { chooseTextByLang, getOrSetLang } from "@/utils/helpers/locale";
import CrossIcon from '@assets/cross.svg?react';
import SendIcon from '@assets/send.svg?react';



function NoteForm({ note, tags, onClose, onSubmitSuccess, onDeleteSuccess, onArchivedSuccess, date_of_note }) {
    const [title, setTitle] = useState(note?.title || "");
    const [description, setDescription] = useState(note?.description || "");
    const [selectedTags, setSelectedTags] = useState(note?.tags || []);
    const isEditing = !(note == null)
    const lang = getOrSetLang()
    const titleTextareaRef = useRef(null);
    const descriptionTextareaRef = useRef(null);
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

    const updateTitleHeight = () => {
        if (title === "") {
            setTitle("Практиковать японский каждый день в 13 дня")
            titleTextareaRef.current.style.height = 'auto';
            titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
            setTitle("")
        }
        if (titleTextareaRef.current) {
            titleTextareaRef.current.style.height = 'auto';
            titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
        }
    };

    const updateDescriptionHeight = () => {
        if (descriptionTextareaRef.current) {
            descriptionTextareaRef.current.style.height = 'auto';
            descriptionTextareaRef.current.style.height = `${descriptionTextareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() => {
        updateTitleHeight();
        updateDescriptionHeight();
    }, [title, description]);



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
        <div className="rounded-[10px] w-[290px] outline outline-1 outline-offset-[-1px] outline-black mt-[60px]">
            <form onSubmit={handleSubmit} className="p-[12px] relative">
                <textarea
                    ref={titleTextareaRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={chooseTextByLang("Практиковать японский каждый день в 13 дня", "Practising Japanese every 2 days at 13", lang)}
                    required
                    rows={1}
                    className="text-stone-400 text-base font-medium font-['Inter'] leading-normal outline-none w-full resize-none overflow-y-hidden"
                />
                <textarea
                    ref={descriptionTextareaRef}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={chooseTextByLang("Описание", "Description", lang)}
                    required
                    rows={1}
                    className="mt-[34px] justify-start text-stone-400 text-base font-medium font-['Inter'] outline-none leading-normal resize-none overflow-y-hidden"
                />
                <div className="mt-[32px] w-full relative">
                    <div className="absolute -mx-3 w-[calc(100%+24px)] inset-x-0 top-0 h-px bg-black" /> 
                </div>
                <div className="mt-[16px] flex justify-between items-center -mb-[12px] p-[12px]">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8"
                    >
                        <CrossIcon className="text-zinc-600/75 transition-all transition-300 hover:rotate-90 hover:text-red-500" />
                    </button>

                    <button 
                        type="button" 
                        onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
                        className="group flex items-center gap-1 px-3 py-1 rounded-md"
                    >
                        <span className="text-neutral-500 text-base font-medium font-['Inter'] group-hover:text-black transition-300 transition-all leading-tight">{chooseTextByLang("Добавить тэг", "Add tag", lang)}</span>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent group-hover:text-black transition-300 transition-all border-r-transparent border-t-neutral-500 "></div>
                    </button>

                    {tagDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            <div className="max-h-40 overflow-y-auto">
                                {tags.map(tag => (
                                    <div 
                                        key={tag.id}
                                        onClick={() => handleTagToggle(tag.id)}
                                        className={`px-4 py-2 flex items-center cursor-pointer ${
                                            selectedTags.includes(tag.id) ? 'bg-gray-100' : ''
                                        }`}
                                    >
                                        <span className="text-sm">#<span style={{color: tag.colour}}>{tag.title}</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="flex group-submit items-center justify-center w-8 h-8"
                    >
                        <SendIcon
                        className="[&>*]:!fill-none [shape-rendering:crispEdges] overflow-visible opacity-68 text-neutral-500 hover:text-black transition-300 transition-all"
                        />
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
