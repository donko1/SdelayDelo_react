import { useAuth } from "@context/AuthContext";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useEffect, useState } from "react";
import SendIcon from "@assets/send.svg?react";
import CrossIcon from "@assets/cross.svg?react";
import TagDropdown from "@components/notes/NoteForm/TagDropdown";
import { formatDate, formatDateToApi } from "@utils/helpers/date";
import { useLang } from "@context/LangContext";
import { createNote } from "@utils/api/notes";
import useAutoResizeTextarea from "@hooks/useAutoResizeTextarea";
import CalendarForNoteForm from "@components/notes/NoteForm/Calendar";
import CalendarIcon from "@assets/calendar.svg?react";
import { useToastHook } from "@/utils/hooks/useToast";

export default function NoteFormCreate({
  tags,
  onClose,
  refreshTags,
  onSubmitSuccess,
  date_of_note,
  fixedStyle,
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const { headers } = useAuth();
  const { lang } = useLang();
  const { showToast } = useToastHook();
  const [calendarDate, setCalendarDate] = useState(() => {
    if (date_of_note) {
      return date_of_note;
    }
    return new Date();
  });
  const [noteDate, setNoteDate] = useState(() => {
    if (date_of_note) {
      return date_of_note;
    }
  });
  const [openedCalendar, setOpenedCalendar] = useState(false);
  const titlePlaceholder = "Практиковать японский каждый день в 13 дня";
  const {
    textareaRef: titleTextareaRef,
    value: title,
    setValue: setTitle,
    updateHeight: updateTitleHeight,
  } = useAutoResizeTextarea("", titlePlaceholder);

  const {
    textareaRef: descriptionTextareaRef,
    value: description,
    setValue: setDescription,
    updateHeight: updateDescriptionHeight,
  } = useAutoResizeTextarea("");

  useEffect(() => {
    updateTitleHeight();
    updateDescriptionHeight();
  }, [title, description]);

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  useEffect(() => {
    updateTitleHeight();
    updateDescriptionHeight();
  }, [title, description]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
    } catch (e) {}

    const content = {
      title,
      description,
      tags: selectedTags,
    };
    if (noteDate) {
      content.date_of_note = formatDate(noteDate);
    }
    try {
      await createNote(headers, content);
      showToast(
        chooseTextByLang("Заметка создана!", "Note created!", lang),
        "success"
      );
      await onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка отправки заметки:", error);
    }
  };

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
    <div
      className={
        fixedStyle &&
        `absolute flex justify-center items-center z-50 w-[100vw] h-[100vh]`
      }
    >
      {fixedStyle && (
        <div className="bg-black opacity-50 inset-0 absolute w-[100vw] h-[100vh]" />
      )}

      <div
        className={`rounded-[10px] w-[290px] outline outline-1 outline-offset-[-1px] outline-black mt-[60px] relative ${
          fixedStyle && "bg-[#ffffff] opacity-100 z-52"
        }`}
      >
        <form onSubmit={handleSubmit} className="p-[12px] relative">
          <textarea
            ref={titleTextareaRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={chooseTextByLang(
              "Практиковать японский каждый день в 13 дня",
              "Practising Japanese every 2 days at 13",
              lang
            )}
            required
            rows={1}
            className={`placeholder-text-stone-400 text-base font-medium font-['Inter'] leading-normal outline-none w-full resize-none overflow-y-hidden`}
          />
          <textarea
            ref={descriptionTextareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={chooseTextByLang("Описание", "Description", lang)}
            required
            rows={1}
            className="mt-[34px] justify-start placeholder-text-stone-400 text-base font-medium font-['Inter'] outline-none leading-normal resize-none overflow-y-hidden"
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
              <CrossIcon className="text-zinc-600/75 transition-all duration-300 hover:rotate-90 hover:text-red-500" />
            </button>

            <button
              type="button"
              onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
              className="group flex items-center gap-1 px-3 py-1 rounded-md"
            >
              <span className="text-neutral-500 text-base font-medium font-['Inter'] group-hover:text-black duration-300 transition-all leading-tight">
                {chooseTextByLang("Добавить тэг", "Add tag", lang)}
              </span>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent group-hover:text-black duration-300 transition-all border-r-transparent border-t-neutral-500 "></div>
            </button>

            {tagDropdownOpen && (
              <TagDropdown
                tags={tags}
                selectedTags={selectedTags}
                refreshTags={refreshTags}
                handleTagToggle={handleTagToggle}
                variant="create"
              />
            )}

            <button
              type="button"
              onClick={() => setOpenedCalendar(!openedCalendar)}
            >
              <CalendarIcon
                className={`w-[25px] h-[25px]   transition-all duration-300 ${
                  openedCalendar
                    ? "text-black hover:text-neutral-500"
                    : "text-neutral-500 hover:text-black"
                }`}
              />
            </button>
            <button
              type="submit"
              className="flex group-submit items-center justify-center w-8 h-8"
            >
              <SendIcon className="[&>*]:!fill-none [shape-rendering:crispEdges] overflow-visible opacity-68 text-neutral-500 hover:text-black duration-300 transition-all" />
            </button>
          </div>
        </form>

        <div className="absolute w-full">
          <CalendarForNoteForm
            showCalendar={openedCalendar}
            calendarDate={calendarDate}
            currentNoteDate={noteDate}
            setCalendarDate={setCalendarDate}
            handleDateSelect={(date) => {
              setNoteDate(date);
              setOpenedCalendar(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
