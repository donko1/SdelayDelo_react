import { useState, useRef, useEffect } from "react";
import HashtagIcon from "@assets/Hashtag.svg?react";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useLang } from "@context/LangContext";
import TagDropdown from "@components/notes/NoteForm/TagDropdown";
import { useAuth } from "@context/AuthContext";
import useAutoResizeTextarea from "@hooks/useAutoResizeTextarea";
import NoteFormEditNavbar from "@components/notes/NoteForm/NoteFormEditNavbar";
import { useNotes } from "@/utils/hooks/useNotes";

export default function NoteFormEdit({ note, onClose }) {
  const { lang } = useLang();
  const { archiveNoteMutation, editNoteMutation, setNewDateNoteMutation } =
    useNotes();

  const [selectedTags, setSelectedTags] = useState(note?.tags || []);
  const selectedTagsRef = useRef(selectedTags);

  useEffect(() => {
    selectedTagsRef.current = selectedTags;
  }, [selectedTags]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  const { headers } = useAuth();
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

  const currentNoteDateRef = useRef(currentNoteDate);

  useEffect(() => {
    currentNoteDateRef.current = currentNoteDate;
  }, [currentNoteDate]);

  const titlePlaceholder = "Практиковать японский каждый день в 13 дня";

  const {
    textareaRef: titleTextareaRef,
    value: title,
    setValue: setTitle,
    updateHeight: updateTitleHeight,
    valueRef: titleRef,
  } = useAutoResizeTextarea(note?.title || "", titlePlaceholder);

  const {
    textareaRef: descriptionTextareaRef,
    value: description,
    setValue: setDescription,
    updateHeight: updateDescriptionHeight,
    valueRef: descriptionRef,
  } = useAutoResizeTextarea(note?.description || "");

  const initialValuesRef = useRef({
    title: note?.title || "",
    description: note?.description || "",
    tags: note?.tags || [],
    date: note?.date_of_note || null,
  });

  useEffect(() => {
    updateTitleHeight();
    updateDescriptionHeight();
  }, [title, description]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAddToArchive = async () => {
    await archiveNoteMutation.mutateAsync({ noteId: note.id });
  };

  const handleClose = async (source = "unknown") => {
    const content = {
      title: titleRef.current,
      description: descriptionRef.current,
      tags: selectedTagsRef.current,
    };
    await editNoteMutation.mutateAsync({ noteId: note.id, content });

    const currentFormattedDate = currentNoteDateRef.current;
    const originalFormattedDate = note?.date_of_note || null;

    if (currentFormattedDate !== originalFormattedDate) {
      await setNewDateNoteMutation.mutateAsync({
        noteId: note.id,
        newDate: currentFormattedDate,
      });
    }

    onClose();
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

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[660px] bg-[#f9f9f9] rounded-[20px] p-6"
      >
        <NoteFormEditNavbar
          currentNoteDate={currentNoteDate}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          note={note}
          handleDateSelect={handleDateSelect}
          onClose={onClose}
          handleAddToArchive={handleAddToArchive}
          onCloseEdit={handleClose}
        />
        <div className="mt-[17px] ml-[30px] mr-[40px] mb-[100px]">
          <form onSubmit={handleClose} className="relative">
            <textarea
              value={title}
              ref={titleTextareaRef}
              rows={1}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-transparent outline-none cursor-text text-black text-3xl font-semibold font-['Inter']"
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            />
            <div className="relative">
              <button
                className="group/tags px-[20px] py-[17px] hover:bg-black bg-white transition-all duration-300 rounded-[30px] mt-[28px] flex space-x-[3px]"
                onClick={(e) => {
                  e.preventDefault();
                  setTagDropdownOpen(!tagDropdownOpen);
                }}
              >
                <HashtagIcon className="w-5 h-5" />
                <span className="text-black transition-all duration-300 group-hover/tags:text-zinc-50 text-base font-medium font-['Inter']">
                  {chooseTextByLang("Тэги", "Tags", lang)}
                </span>
              </button>

              {tagDropdownOpen && (
                <TagDropdown
                  selectedTags={selectedTags}
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
