

import { useUser } from '@context/UserContext';
import { chooseTextByLang, getOrSetLang } from '@utils/helpers/locale';
import { useState } from 'react';
import allNotesIcon from "@assets/allNotes.svg?react";
import archiveIcon from "@assets/archive.svg?react";
import myDayIcon from "@assets/myDay.svg?react"
import nextWeekIcon from "@assets/nextWeek.svg?react"
import searchIcon from "@assets/search.svg?react"
import XIcon from "@assets/x.svg?react"

function Header({ activeElem, setAct, addNoteFunc, setOpenArchived, tags_data}) {
    const { username } = useUser();
    const lang = getOrSetLang();
    const [tagsOpened, setTagsOpened] = useState(false)

    const dataForElems = [
        {
            id: "addNote",
            text: chooseTextByLang("Добавить заметку", "Add note", lang),
            icon: XIcon
        },
        {
            id: "search",
            text: chooseTextByLang("Поиск", "Search", lang),
            icon: searchIcon
        },
        {
            id: "myDay",
            text: chooseTextByLang("Входящие", "Inbox", lang),
            icon: myDayIcon
        },
        {
            id: "next7Days",
            text: chooseTextByLang("Следующие 7 дней", "Next 7 days", lang),
            icon: nextWeekIcon
        },
        {
            id: "allNotes",
            text: chooseTextByLang("Все мои заметки", "All my notes", lang),
            icon: allNotesIcon
        },
        {
            id: "Calendar",
            text: chooseTextByLang("Календарь", "Calendar", lang)
        },
        {
            id: "archive",
            text: chooseTextByLang("Архив", "Archive", lang),
            icon: archiveIcon
        },
        {
            id: "myTags",
            text: chooseTextByLang("Мои тэги", "My tags", lang)
        },
    ];

    return (
        <div className="flex flex-col bg-transparent text-white">
            <div className="h-24 flex items-center justify-center">
                <h1 className="justify-start text-stone-50 text-xl font-bold font-['Inter']">{username}</h1>
            </div>
            {dataForElems.map(item => 
            (
                
                <div 
                    key={item.id} 
                    className="group cursor-pointer my-[30px] ml-[20px] flex items-center" 
                    onClick={() => {
                        if (item.id === "addNote") {
                            addNoteFunc();
                        } else if (item.id === "archive") {
                            setOpenArchived(true);
                        } else if (item.id === "myTags") {                    
                            setTagsOpened(!tagsOpened)
                        } else {
                            setAct(item.id);
                        }
                    }}
                >

                    {item.icon && (
                        <item.icon
                            className={`mr-[16px] group-hover:scale-125 transition-all duration-300 ${
                            item.id === 'archive' || item.id === 'next7Days' 
                                ? 'block [&>*]:!fill-none' 
                                : ''
                            } ${item.id === 'addNote'
                                ? "group-hover:bg-white group-hover:text-black group-hover:rounded-full"
                                : ""
                            }`}
                            style={item.id !== "addNote" ? {
                            color: activeElem === item.id ? '#191212' : 'white',
                            ...(item.id === 'archive' || item.id === 'next7Days' || item.id === "addNote") && {
                                shapeRendering: "crispEdges",
                                overflow: "visible"
                            }
                            }:{}}
                        />
                        )}

                    <span
                        className="justify-start group-hover:FAF9F9 transition-all duration-300 text-stone-50 text-[21px] group-hover:text-[25px] hover:font-weight:800 font-bold font-['Inter']"
                        style={{ color: activeElem === item.id ? '#191212' : 'white' }}
                    >
                        {item.text}
                    </span>
                </div>
            ))}
            {
                tagsOpened && (
                tags_data.map(item => (
                    <div 
                        key={item.id} 
                        className="h-12 w-full cursor-pointer" 
                    >
                        <span
                            className="text-[25px] text-left block pl-4"
                        >
                            #{item.title}
                        </span>

                    </div>
                    
                )))
            }
        </div>
    );

}

export default Header;
