import { useUser } from "@context/UserContext";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useState } from "react";
import allNotesIcon from "@assets/allNotes.svg?react";
import archiveIcon from "@assets/archive.svg?react";
import myDayIcon from "@assets/myDay.svg?react";
import nextWeekIcon from "@assets/nextWeek.svg?react";
import searchIcon from "@assets/search.svg?react";
import XIcon from "@assets/x.svg?react";
import calendarIcon from "@assets/calendar.svg?react";
import { useLang } from "@context/LangContext";
import AccountIcon from "@assets/Account.svg?react";

function ProfileSettings({ onClose }) {
  // TODO: Make russian language

  const { username } = useUser();

  return (
    <div className="fixed top-0 left-0 p-[15px] rounded-br-[20px] shadow-2xl shadow-gray-500/20 bg-white">
      <h2
        className="pt-[35px] pl-[100px] p-[40px] text-xl font-bold font-['Inter'] text-black cursor-pointer"
        onClick={onClose}
      >
        {username}
      </h2>

      <div className="mt-[52px] px-[52px] flex flex-col items-center gap-5">
        <div className="px-12 py-2 bg-white rounded-2xl shadow-[1px_4px_4px_0px_rgba(0,0,0,0.21),0px_-1px_4px_0px_rgba(0,0,0,0.05)] inline-flex justify-center items-center gap-2 cursor-pointer">
          <AccountIcon />
          <span className="text-zinc-600 text-xl font-medium font-['Inter']">
            Account
          </span>
        </div>

        <div className="px-12 py-2 bg-white rounded-2xl shadow-[1px_4px_4px_0px_rgba(0,0,0,0.21),0px_-1px_4px_0px_rgba(0,0,0,0.05)] inline-flex justify-center items-center gap-2 cursor-pointer">
          <AccountIcon />
          <span className="text-zinc-600 text-xl font-medium font-['Inter']">
            Settings
          </span>
        </div>
      </div>

      <div className="mt-[30px] text-center">
        <div
          className="px-7 py-1.5 rounded-3xl outline outline-1 outline-offset-[-1px] outline-black inline-flex justify-center items-center gap-2.5 cursor-pointer"
          onClick={onClose}
        >
          <span className="text-zinc-400 text-lg font-medium font-['Inter']">
            Close
          </span>
          <XIcon color="black" className="rotate-45" />
        </div>
      </div>
    </div>
  );
}

function Header({ activeElem, setAct, setOpenArchived, openForm, tags_data }) {
  const { username } = useUser();
  const { lang } = useLang();
  const [ProfileSettingsOpened, setProfileSettingsOpened] = useState(false);
  const [tagsOpened, setTagsOpened] = useState(false);

  const dataForElems = [
    {
      id: "addNote",
      text: chooseTextByLang("Добавить заметку", "Add note", lang),
      icon: XIcon,
    },
    {
      id: "search",
      text: chooseTextByLang("Поиск", "Search", lang),
      icon: searchIcon,
    },
    {
      id: "myDay",
      text: chooseTextByLang("Входящие", "Inbox", lang),
      icon: myDayIcon,
    },
    {
      id: "next7Days",
      text: chooseTextByLang("Следующие 7 дней", "Next 7 days", lang),
      icon: nextWeekIcon,
    },
    {
      id: "allNotes",
      text: chooseTextByLang("Все мои заметки", "All my notes", lang),
      icon: allNotesIcon,
    },
    {
      id: "Calendar",
      text: chooseTextByLang("Календарь", "Calendar", lang),
      icon: calendarIcon,
    },
    {
      id: "archive",
      text: chooseTextByLang("Архив", "Archive", lang),
      icon: archiveIcon,
    },
    {
      id: "myTags",
      text: chooseTextByLang("Мои тэги", "My tags", lang),
    },
  ];

  return (
    <div>
      {ProfileSettingsOpened && (
        <ProfileSettings onClose={() => setProfileSettingsOpened(false)} />
      )}
      <div className="flex flex-col bg-transparent text-white">
        <div
          className="h-24 flex items-center justify-center cursor-pointer"
          onClick={() => setProfileSettingsOpened(!ProfileSettingsOpened)}
        >
          <h1 className="justify-start text-stone-50 text-xl font-bold font-['Inter']">
            {username}
          </h1>
        </div>
        {dataForElems.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer my-[30px] ml-[20px] flex items-center"
            onClick={() => {
              if (item.id === "addNote") {
                openForm(true);
              } else if (item.id === "archive") {
                setOpenArchived(true);
              } else if (item.id === "myTags") {
                setTagsOpened(!tagsOpened);
              } else {
                setAct(item.id);
              }
            }}
          >
            {item.icon && (
              <item.icon
                className={`mr-[16px] max-w-[40px] max-h-[40px] group-hover:scale-125 transition-all duration-300 ${
                  item.id === "archive" || item.id === "next7Days"
                    ? "block [&>*]:!fill-none"
                    : ""
                } ${
                  item.id === "addNote"
                    ? "group-hover:bg-white group-hover:text-black group-hover:rounded-full"
                    : ""
                }`}
                style={
                  item.id !== "addNote"
                    ? {
                        color: activeElem === item.id ? "#191212" : "white",
                        ...((item.id === "archive" ||
                          item.id === "next7Days" ||
                          item.id === "addNote") && {
                          shapeRendering: "crispEdges",
                          overflow: "visible",
                        }),
                      }
                    : {}
                }
              />
            )}

            <span
              className="justify-start group-hover:FAF9F9 transition-all duration-300 text-stone-50 text-[21px] group-hover:text-[25px] hover:font-weight:800 font-bold font-['Inter']"
              style={{ color: activeElem === item.id ? "#191212" : "white" }}
            >
              {item.text}
            </span>
          </div>
        ))}
        {tagsOpened &&
          tags_data.map((item) => (
            <div key={item.id} className="h-12 w-full cursor-pointer">
              <span className="text-[25px] text-left block pl-4">
                #{item.title}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Header;
