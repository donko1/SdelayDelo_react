

import { useUser } from '@context/UserContext';
import { chooseTextByLang, getOrSetLang } from '@utils/helpers/locale';

function Header({ activeElem, setAct, addNoteFunc, setOpenArchived }) {
    const { username } = useUser();
    const lang = getOrSetLang();

    const dataForElems = [
        {
            id: "addNote",
            text: chooseTextByLang("Добавить заметку", "Add note", lang)
        },
        {
            id: "search",
            text: chooseTextByLang("Поиск", "Search", lang)
        },
        {
            id: "myDay",
            text: chooseTextByLang("Мой день", "My day", lang)
        },
        {
            id: "next7Days",
            text: chooseTextByLang("Следующие 7 дней", "Next 7 days", lang)
        },
        {
            id: "allNotes",
            text: chooseTextByLang("Все мои заметки", "All my notes", lang)
        },
        {
            id: "archive",
            text: chooseTextByLang("Архив", "Archive", lang)
        },
        {
            id: "myTags",
            text: chooseTextByLang("Мои тэги", "My tags", lang)
        },
    ];

    return (
        <div className="flex flex-col bg-transparent text-white">
            <div className="h-24 flex items-center justify-center">
                <h1 className="text-[25px]">{username}</h1>
            </div>
            {dataForElems.map(item => 
            (
                <div 
                    key={item.id} 
                    className="h-24 flex items-center justify-center cursor-pointer" 
                    onClick={() => {
                        if (item.id === "addNote") {
                            addNoteFunc();
                        } else if (item.id === "archive") {
                            setOpenArchived(true);
                        } else {
                            setAct(item.id);
                        }
                    }}
                >


                    <span
                        className="text-[25px] text-center"
                        style={{ color: activeElem === item.id ? '#191212' : 'white' }}
                    >
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    );

}

export default Header;
