import { useEffect, useRef, useState } from "react";
import { generateHeaders, getUser } from "@utils/api/auth";
import { isParallel } from "@utils/helpers/settings";
import { addNoteToArchive, deleteNoteById } from "@utils/api/notes";
import { chooseTextByLang, getOrSetLang } from "@/utils/helpers/locale";
import CrossIcon from '@assets/cross.svg?react';
import SendIcon from '@assets/send.svg?react';
import MyDayIcon from "@assets/myDay.svg?react"
import ArchiveIcon from "@assets/archive.svg?react"
import HashtagIcon from "@assets/Hashtag.svg?react"
import { addNewTag } from "@/utils/api/tags";

function NoteForm({ note, tags, onClose, onSubmitSuccess, onDeleteSuccess, onArchivedSuccess, date_of_note, refreshTags }) {
    const [title, setTitle] = useState(note?.title || "");
    const [description, setDescription] = useState(note?.description || "");
    const [selectedTags, setSelectedTags] = useState(note?.tags || []);
    const [newTag, setNewTag] = useState("")
    const isEditing = !(note == null)
    const lang = getOrSetLang()
    const titleTextareaRef = useRef(null);
    const descriptionTextareaRef = useRef(null);
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

    const updateTitleHeight = () => {
        if (title === "" && !isEditing) {
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

    const handleAddTag = async (e) => {
        e.preventDefault();
        await addNewTag(newTag, generateHeaders(getUser()))
    }
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
        }
        catch (e) {

        }
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

    const onCloseEdit = async () => {
            await handleSubmit()
            await onClose()
    }


    useEffect(() => {
        if (!isEditing) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCloseEdit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEditing, onCloseEdit]);


    const renderFormForModalWindow = () => (
    <div className="mt-[17px] ml-[30px] mr-[40px] mb-[100px]">
        <form onSubmit={handleSubmit} className="relative">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-transparent outline-none text-black text-3xl font-semibold font-['Inter']"
                onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
            />
            <div className="relative">
                <button 
                    className="group px-[20px] py-[17px] hover:bg-black bg-white transition-all transition-300 rounded-[30px] mt-[28px] flex space-x-[3px]" 
                    onClick={(e) => {
                        e.preventDefault();
                        setTagDropdownOpen(!tagDropdownOpen);
                    }}
                >
                    <HashtagIcon className="w-5 h-5"/>
                    <span className="text-black transition-all transition-300 group-hover:text-stone-50 text-base font-medium font-['Inter']">
                        {chooseTextByLang("Тэги", "Tags", lang)}
                    </span>
                </button>
                
                {tagDropdownOpen && (
                    <div className="absolute z-52 bg-white mt-[15px]">
                        <div className="flex">
                            <input 
                                className="rounded-[10px] border border-black p-[9px] flex-grow"
                                value={newTag}
                                placeholder={chooseTextByLang("Добавить тэг", "Add tag", lang)}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={async(e) => {
                                    if (e.key === 'Enter') {
                                        await handleAddTag(e);
                                        await refreshTags()
                                    }
                                }}
                            />
                            <button
                                onClick={async (e) => {
                                    await handleAddTag(e);
                                    await refreshTags()
                                }}
                                className="ml-2 px-3 bg-gray-200 rounded-[10px] hover:bg-green-500 transition-all transition-300"
                            >
                                {chooseTextByLang("Добавить", "Add", lang)}
                            </button>
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                            {tags.map(tag => (
                                <div 
                                    key={tag.id}
                                    onClick={() => handleTagToggle(tag.id)}
                                    className={`px-[9px] hover:bg-gray-100 transition-all transition-300 py-2 flex items-center cursor-pointer ${
                                        selectedTags.includes(tag.id) ? 'bg-gray-100' : ''
                                    }`}
                                >
                                    <span className="text-sm">#<span style={{color: tag.colour}}>{tag.title}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="p-2 outline outline-1 outline-black mt-[42px] rounded-lg">
                <span className="inline-block text-neutral-800 text-xl font-medium font-['Inter'] ">{chooseTextByLang("Описание", "Description", lang)}</span>
                <br/>
                <textarea placeholder={chooseTextByLang("Напишите сюда ваше описание", "Write here your description", lang)} ref={descriptionTextareaRef} rows={1} onKeyDown={e => e.key === 'Enter' && e.preventDefault()} className="mt-[15px] bg-transparent  text-zinc-400 text-xl font-normal font-['Inter'] outline-none" type="text" value={description} onChange={(e) => {setDescription(e.target.value)}} />
            </div>
        </form>
    </div>
)

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
                                        className={`px-4 py-2 flex items-center hover:bg-gray-100 transition-all transition-300 cursor-pointer ${
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
            <div onClick={onCloseEdit} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div onClick={e => e.stopPropagation()}  className="relative w-[660px] bg-[#f9f9f9] rounded-[20px] p-6">
                    <div className="flex justify-end items-center mb-4 space-x-[30px]">
                        <MyDayIcon className="h-[32px] w-[32px] text-red-500" />
                        <ArchiveIcon onClick={handleAddToArchive} className="[&>*]:!fill-none cursor-pointer [shape-rendering:crispEdges] text-zinc-500 h-[32px] w-[32px] transition-all transition-300 hover:text-yellow-600" />
                        <CrossIcon onClick={onCloseEdit} className="h-[32px] cursor-pointer text-zinc-500 w-[32px] transition-all transition-300 hover:text-black"/>
                    </div>
                    {renderFormForModalWindow()}
                </div>
            </div>
        );
    }

    return renderForm();

}


export default NoteForm;
