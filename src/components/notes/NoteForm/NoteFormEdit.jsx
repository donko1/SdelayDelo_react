import { useState, useRef, useEffect } from "react";
import DateDisplay from "@components/notes/NoteForm/DateDisplay";
import { useActElemContext } from "@context/ActElemContext";
import CalendarForNoteForm from "@components/notes/NoteForm/Calendar";

import MyDayIcon from "@assets/myDay.svg?react";
import NextWeekIcon from "@assets/nextWeek.svg?react";
import ArchiveIcon from "@assets/archive.svg?react";
import CalendarIcon from "@assets/calendar.svg?react";
import CrossIcon from "@assets/cross.svg?react";
import HashtagIcon from "@assets/Hashtag.svg?react";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useLang } from "@context/LangContext";
import TagDropdown from "@components/notes/NoteForm/TagDropdown";
import { addNoteToArchive, setNewDate } from "@utils/api/notes";
import { generateHeaders, getUser } from "@utils/api/auth";
import { getTodayInTimezone } from "@utils/helpers/date";
import { isParallel } from "@utils/helpers/settings";
import { useTimezone } from "@context/TimezoneContext";

export default function NoteFormEdit({
  note,
  tags,
  onClose,
  onSubmitSuccess,
  onArchivedSuccess,
  refreshTags,
}) {
  const { lang } = useLang();
  const { timezone } = useTimezone();

  const [title, setTitle] = useState(note?.title || "");
  const [description, setDescription] = useState(note?.description || "");
  const [selectedTags, setSelectedTags] = useState(note?.tags || []);
  const [showCalendar, setShowCalendar] = useState(false);

  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  const titleTextareaRef = useRef(null);
  const descriptionTextareaRef = useRef(null);

  const [isInMyDay, setIsInMyDay] = useState(false);
  const [isInNext7Days, setIsInNext7Days] = useState(false);
  const date_of_note = note.date_of_note;
  const [calendarDate, setCalendarDate] = useState(() => {
    if (note?.date_of_note) {
      const [day, month, year] = note.date_of_note.split("/").map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  });
  const [currentNoteDate, setCurrentNoteDate] = useState(
    note?.date_of_note || null
  );
  const { actelem, setAct } = useActElemContext();

  const currentNoteDateRef = useRef(currentNoteDate);

  useEffect(() => {
    currentNoteDateRef.current = currentNoteDate;
  }, [currentNoteDate]);

  useEffect(() => {
    updateTitleHeight();
    updateDescriptionHeight();
  }, [title, description]);

  const updateTitleHeight = () => {
    if (title === "" && !isEditing) {
      setTitle("Практиковать японский каждый день в 13 дня");
      titleTextareaRef.current.style.height = "auto";
      titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
      setTitle("");
    }
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = "auto";
      titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
    }
  };

  const updateDescriptionHeight = () => {
    if (descriptionTextareaRef.current) {
      descriptionTextareaRef.current.style.height = "auto";
      descriptionTextareaRef.current.style.height = `${descriptionTextareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    const date_of_note = note.date_of_note;
    if (!date_of_note) {
      setIsInMyDay(true);
    }
    if (date_of_note) {
      const todayInTz = getTodayInTimezone(timezone);

      const todayStr = todayInTz
        .toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\./g, "/");

      if (todayStr === date_of_note) {
        setIsInMyDay(true);
      }

      const next7Days = [];
      const tempDate = new Date(todayInTz);

      for (let i = 0; i < 7; i++) {
        const dateStr = tempDate
          .toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\./g, "/");

        next7Days.push(dateStr);
        tempDate.setDate(tempDate.getDate() + 1);
      }

      if (next7Days.includes(date_of_note)) {
        setIsInNext7Days(true);
      }
    }
  }, [note]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseEdit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAddToArchive = async () => {
    try {
      const headers = generateHeaders(getUser());
      await addNoteToArchive(note.id, headers);
      if (onArchivedSuccess) {
        await onArchivedSuccess();
      }

      onCloseEdit();
    } catch (error) {
      console.error("Ошибка при архивировании:", error);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
    } catch (e) {}
    const content = { title, description, tags: selectedTags };

    try {
      const headers = generateHeaders(getUser());
      const baseUrl = isParallel()
        ? "/api/v3/note/"
        : "http://localhost:8000/api/v3/note/";
      const url = `${baseUrl}${note.id}/`;
      const method = "PUT";
      const response = await fetch(url, {
        method,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error("Ошибка при отправке заметки");
      await onSubmitSuccess();
      await onClose();
    } catch (error) {
      console.error("Ошибка отправки заметки:", error);
    }
  };

  const handleDateSelect = (selectedDate) => {
    const formattedDate = `${selectedDate.getDate()}/${
      selectedDate.getMonth() + 1
    }/${selectedDate.getFullYear()}`;

    setCurrentNoteDate(formattedDate);
    setCalendarDate(selectedDate);

    setShowCalendar(false);
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const onCloseEdit = async () => {
    const currentFormattedDate = currentNoteDateRef.current;

    const originalFormattedDate = note?.date_of_note || null;

    if (currentFormattedDate !== originalFormattedDate) {
      await setNewDate(
        generateHeaders(getUser()),
        note.id,
        currentFormattedDate
      );
    }
    await handleSubmit();
  };

  return (
    <div
      onClick={onCloseEdit}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[660px] bg-[#f9f9f9] rounded-[20px] p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <DateDisplay
            currentNoteDate={currentNoteDate}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
          />
          <CalendarForNoteForm
            showCalendar={showCalendar}
            calendarDate={calendarDate}
            setCalendarDate={setCalendarDate}
            currentNoteDate={currentNoteDate}
            note={note}
            handleDateSelect={handleDateSelect}
          />

          <div className="flex items-center space-x-[30px]">
            {isInMyDay && (
              <MyDayIcon
                onClick={() => {
                  setAct("myDay");
                  onClose();
                }}
                className="h-[32px] w-[32px] text-red-500 transition-all transition-300 hover:text-black"
              />
            )}
            {isInNext7Days && (
              <NextWeekIcon
                onClick={() => {
                  setAct("next7Days");
                  onClose();
                }}
                className="h-[32px] w-[32px] text-red-500 block [&>*]:!fill-none transition-all transition-300 hover:text-black"
              />
            )}
            {note.date_of_note !== null && (
              <CalendarIcon
                onClick={() => {
                  setAct("Calendar");
                  onClose();
                }}
                className="h-[32px] w-[32px] text-red-500 block transition-all transition-300 hover:text-black"
              />
            )}
            <ArchiveIcon
              onClick={handleAddToArchive}
              className="[&>*]:!fill-none cursor-pointer [shape-rendering:crispEdges] text-zinc-500 h-[32px] w-[32px] transition-all transition-300 hover:text-yellow-600"
            />
            <CrossIcon
              onClick={onCloseEdit}
              className="h-[32px] cursor-pointer text-zinc-500 w-[32px] transition-all transition-300 hover:text-black"
            />
          </div>
        </div>
        <div className="mt-[17px] ml-[30px] mr-[40px] mb-[100px]">
          <form onSubmit={handleSubmit} className="relative">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-transparent outline-none cursor-text text-black text-3xl font-semibold font-['Inter']"
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            />
            <div className="relative">
              <button
                className="group px-[20px] py-[17px] hover:bg-black bg-white transition-all transition-300 rounded-[30px] mt-[28px] flex space-x-[3px]"
                onClick={(e) => {
                  e.preventDefault();
                  setTagDropdownOpen(!tagDropdownOpen);
                }}
              >
                <HashtagIcon className="w-5 h-5" />
                <span className="text-black transition-all transition-300 group-hover:text-stone-50 text-base font-medium font-['Inter']">
                  {chooseTextByLang("Тэги", "Tags", lang)}
                </span>
              </button>

              {tagDropdownOpen && (
                <TagDropdown
                  tags={tags}
                  selectedTags={selectedTags}
                  refreshTags={refreshTags}
                  handleTagToggle={handleTagToggle}
                  variant="edit"
                />
              )}
            </div>
            <div className="p-2 outline outline-1 outline-black mt-[42px] rounded-lg">
              <span className="inline-block text-neutral-800 text-xl font-medium font-['Inter'] ">
                {chooseTextByLang("Описание", "Description", lang)}
              </span>
              <br />
              <textarea
                placeholder={chooseTextByLang(
                  "Напишите сюда ваше описание",
                  "Write here your description",
                  lang
                )}
                ref={descriptionTextareaRef}
                rows={1}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                className="mt-[15px] bg-transparent  text-zinc-400 text-xl font-normal font-['Inter'] outline-none"
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
