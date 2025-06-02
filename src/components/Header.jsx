

import { useUser } from '../context/UserContext';
import { chooseTextByLang, getOrSetLang } from '../utils/locale';

function Header() {
    const {username} = useUser();
    const lang = getOrSetLang()
    return (
    <div className="flex flex-col bg-transparent text-white">
        <div className="h-24 flex items-center justify-center">
            <h1 className="text-[25px]">{username}</h1>
        </div>
        
        <div className="h-24 flex items-center justify-center">
            <span className="text-[25px] text-center">{chooseTextByLang("Добавить заметку", "Add note", lang)}</span>
        </div>
        <div className="h-24 flex items-center justify-center">
            <span className="text-[25px] text-center">{chooseTextByLang("Поиск", "Search", lang)}</span>
        </div>
        <div className="h-24 flex items-center justify-center">
            <span className="text-[25px] text-center">{chooseTextByLang("Мой день", "My day", lang)}</span>
        </div>
        <div className="h-24 flex items-center justify-center">
            <span className="text-[25px] text-center">{chooseTextByLang("Следующие 7 дней", "Next 7 days", lang)}</span>
        </div>
        <div className="h-24 flex items-center justify-center">
            <span className="text-[25px] text-center">{chooseTextByLang("Все мои заметки", "All my notes", lang)}</span>
        </div>
        <div className="h-24 flex items-center justify-center">
            <span className="text-[25px] text-center">{chooseTextByLang("Архив", "Archive", lang)}</span>
        </div>
        <div className="h-24 flex items-center justify-center">
            <span className="text-[25px] text-center">{chooseTextByLang("Мои тэги", "My tags", lang)}</span>
        </div>
    </div>
)
}
export default Header;
