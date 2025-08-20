import { useState, useRef, useEffect } from "react";
import HashtagIcon from "@assets/Hashtag.svg?react";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useLang } from "@context/LangContext";
import TagDropdown from "@components/notes/NoteForm/TagDropdown";
import { addNoteToArchive, editNote, setNewDate } from "@utils/api/notes";
import { useAuth } from "@context/AuthContext";
import useAutoResizeTextarea from "@hooks/useAutoResizeTextarea";
import NoteFormEditNavbar from "@components/notes/NoteForm/NoteFormEditNavbar";
import { useToastHook } from "@/utils/hooks/useToast";

export default function NoteFormEdit({
  note,
  tags,
  onClose,
  onSubmitSuccess,
  onArchivedSuccess,
  refreshTags,
}) {
  const { lang } = useLang();
  const { showToast } = useToastHook();

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

  const [isNoteChanged, setIsNoteChanged] = useState(false);
  const isNoteChangedRef = useRef(isNoteChanged);

  useEffect(() => {
    isNoteChangedRef.current = isNoteChanged;
  }, [isNoteChanged]);

  useEffect(() => {
    const isTitleChanged = title !== initialValuesRef.current.title;
    const isDescChanged = description !== initialValuesRef.current.description;
    const isTagsChanged =
      JSON.stringify(selectedTags.sort()) !==
      JSON.stringify(initialValuesRef.current.tags.sort());
    const isDateChanged = currentNoteDate !== initialValuesRef.current.date;

    setIsNoteChanged(
      isTitleChanged || isDescChanged || isTagsChanged || isDateChanged
    );
  }, [title, description, selectedTags, currentNoteDate]);

  useEffect(() => {
    updateTitleHeight();
    updateDescriptionHeight();
  }, [title, description]);

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
    e?.preventDefault();
    const content = {
      title: titleRef.current,
      description: descriptionRef.current,
      tags: selectedTagsRef.current,
    };

    try {
      if (isNoteChangedRef.current) {
        await editNote(headers, note.id, content);
        showToast(
          chooseTextByLang("Изменения сохранены!", "Changes saved!", lang),
          "success"
        );
      }
      await onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка отправки заметки:", error);
      showToast(
        chooseTextByLang(
          "Произошла ошибка! Пожалуйста, повторите попытку",
          "Error occurred! Please try again ",
          lang
        ),
        "warning"
      );
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
      await setNewDate(headers, note.id, currentFormattedDate);
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
          onCloseEdit={onCloseEdit}
        />
        <div className="mt-[17px] ml-[30px] mr-[40px] mb-[100px]">
          <form onSubmit={handleSubmit} className="relative">
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
