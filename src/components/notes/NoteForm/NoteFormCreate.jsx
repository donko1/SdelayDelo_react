import { generateHeaders, getUser } from "@/utils/api/auth";
import { chooseTextByLang, getOrSetLang } from "@/utils/helpers/locale";
import { useEffect, useRef, useState } from "react";
import SendIcon from "@assets/send.svg?react";
import CrossIcon from "@assets/cross.svg?react";
import TagDropdown from "@components/notes/NoteForm/TagDropdown";
import { isParallel } from "@utils/helpers/settings";
import { formatDate } from "@utils/helpers/date";

export default function NoteFormCreate({
  tags,
  onClose,
  refreshTags,
  isEditing,
  onSubmitSuccess,
  date_of_note,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const titleTextareaRef = useRef(null);
  const descriptionTextareaRef = useRef(null);

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const lang = getOrSetLang();

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
    updateTitleHeight();
    updateDescriptionHeight();
  }, [title, description]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
    } catch (e) {}

    const content = { title, description, tags: selectedTags };
    if (date_of_note) {
      content.date_of_note = formatDate(date_of_note);
    }
    try {
      const headers = generateHeaders(getUser());
      const url = isParallel()
        ? "/api/v3/note/"
        : "http://localhost:8000/api/v3/note/";
      const method = "POST";
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
    } catch (error) {
      console.error("Ошибка отправки заметки:", error);
    }
  };

  return (
    <div className="rounded-[10px] w-[290px] outline outline-1 outline-offset-[-1px] outline-black mt-[60px]">
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
            <span className="text-neutral-500 text-base font-medium font-['Inter'] group-hover:text-black transition-300 transition-all leading-tight">
              {chooseTextByLang("Добавить тэг", "Add tag", lang)}
            </span>
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent group-hover:text-black transition-300 transition-all border-r-transparent border-t-neutral-500 "></div>
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
            type="submit"
            className="flex group-submit items-center justify-center w-8 h-8"
          >
            <SendIcon className="[&>*]:!fill-none [shape-rendering:crispEdges] overflow-visible opacity-68 text-neutral-500 hover:text-black transition-300 transition-all" />
          </button>
        </div>
      </form>
    </div>
  );
}
