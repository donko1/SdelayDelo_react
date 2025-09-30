import { useEffect, useRef, useState, useMemo } from "react";
import { chooseTextByLang } from "@utils/helpers/locale";
import {
  getArchivedNotesByUser,
  getTagsForNote,
  removeFromArchive,
  clearArchive,
} from "@utils/api/notes";
import { useLang } from "@context/LangContext";
import { useAuth } from "@context/AuthContext";
import { isInThisWeek, isTodayOrYesterday } from "@utils/helpers/date";
import { useTimezone } from "@context/TimezoneContext";
import ReturnIcon from "@assets/return.svg?react";
import TrashIcon from "@assets/trash.svg?react";
import { useToast } from "@/context/ToastContext";
import { useTags } from "@/utils/hooks/useTags";

export default function ArchivedNotes({ onClose, onRefresh }) {
  const [archivedNotes, setArchivedNotes] = useState({
    results: [],
    next: null,
  });
  const { lang } = useLang();
  const { headers } = useAuth();
  const { tags } = useTags();
  const { timezone } = useTimezone();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [actELem, setActElem] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const isLoadingRef = useRef(false);
  const stepRef = useRef(1);
  const hasNextRef = useRef(false);
  const scrollContainerRef = useRef();

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    hasNextRef.current = archivedNotes.next;
  }, [archivedNotes.next]);

  const filteredNotes = useMemo(() => {
    if (!archivedNotes.results) return [];

    if (actELem === "all") return archivedNotes.results;

    return archivedNotes.results.filter((note) => {
      try {
        const [day, month, year] = note.date_of_note.split("/").map(Number);
        const noteDate = new Date(year, month - 1, day);

        if (actELem === "today") return isTodayOrYesterday(noteDate, timezone);
        if (actELem === "tsweek") return isInThisWeek(noteDate, timezone);
        return true;
      } catch (e) {
        return false;
      }
    });
  }, [actELem, archivedNotes]);

  const fetchArchivedNotes = async () => {
    try {
      setIsLoading(true);
      const result = await getArchivedNotesByUser(headers, 1);
      if (result !== 1) {
        setArchivedNotes(result);
        setStep(1);
      } else {
        console.error("Ошибка при загрузке архивных заметок");
      }
    } catch (error) {
      console.error("Ошибка при загрузке архивных заметок:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedNotes();
  }, [headers]);

  const handleScroll = (e) => {
    const container = e.target;
    const scrollThreshold = 100;

    if (
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + scrollThreshold
    ) {
      if (!isLoadingRef.current && hasNextRef.current) {
        loadMore();
      }
    }
  };

  const loadMore = async () => {
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const nextStep = stepRef.current + 1;
      const result = await getArchivedNotesByUser(headers, nextStep);

      if (result !== 1) {
        setArchivedNotes((prev) => ({
          ...result,
          results: [...prev.results, ...result.results],
        }));
        setStep(nextStep);
      }
    } catch (error) {
      console.error("Ошибка при подгрузке заметок:", error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative max-w-2xl h-[700px] w-[525px] flex flex-col">
        <div className="bg-white rounded-t-3xl flex justify-end items-center p-4 border-b">
          <h3 className="text-3xl font-semibold font-['Inter'] w-full text-center">
            {chooseTextByLang("Архив заметок", "Notes Archive", lang)}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 w-8 h-8  hover:text-gray-700 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          ref={scrollContainerRef}
          className="bg-white overflow-y-auto mb-24 flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex w-full items-center justify-center gap-5 mt-[45px]">
            <h1
              className={`text-2xl font-semibold duration-300 font-['Inter'] cursor-pointer ${
                actELem === "all"
                  ? "text-neutral-700"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
              onClick={() => setActElem("all")}
            >
              {chooseTextByLang("Все заметки", "All notes", lang)}
            </h1>
            <h1
              className={`text-2xl font-semibold  duration-300font-['Inter'] cursor-pointer ${
                actELem === "today"
                  ? "text-neutral-700"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
              onClick={() => setActElem("today")}
            >
              {chooseTextByLang("Сегодня", "Today", lang)}
            </h1>
            <h1
              className={`text-2xl transition-all duration-300 font-semibold font-['Inter'] cursor-pointer ${
                actELem === "tsweek"
                  ? "text-neutral-700"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
              onClick={() => setActElem("tsweek")}
            >
              {chooseTextByLang("За неделю", "This week", lang)}
            </h1>
          </div>
          <div className="mt-[50px] px-[35px] ">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={async () => {
                  try {
                    await removeFromArchive(note.id, headers);
                    onRefresh();
                    setArchivedNotes((prev) => ({
                      ...prev,
                      results: prev.results.filter((n) => n.id !== note.id),
                    }));
                  } catch (error) {
                    console.error("Ошибка при удалении из архива:", error);
                    showToast(
                      chooseTextByLang(
                        "Произошла ошибка! Пожалуйста, повторите попытку",
                        "Error occurred! Please try again ",
                        lang
                      ),
                      "warning"
                    );
                  }
                }}
                className="relative group/archive flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-center justify-center mr-[9px]">
                  <div className="w-5 h-5 opacity-70 rounded-full border-2 border-zinc-950 cursor-pointer flex justify-center items-center">
                    <ReturnIcon className="opacity-0 duration-300 transition-all group-hover/archive:opacity-100" />
                  </div>
                </div>

                <h1 className="text-gray-800 font-medium text-lg truncate">
                  {note.title}
                </h1>

                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2 opacity-0 group-hover/archive:opacity-100 transition-opacity duration-200">
                  {getTagsForNote(note, tags).map((tag) => (
                    <span
                      key={tag.id}
                      className="text-sm px-2 py-1 rounded-full text-white whitespace-nowrap"
                      style={{ color: tag.colour }}
                    >
                      # {tag.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center py-4">
                <div>Загрузка...</div>
              </div>
            )}
          </div>
        </div>
        <div
          className="cursor-pointer absolute bottom-0 left-0 w-full h-24 bg-black flex items-center justify-center rounded-bl-3xl rounded-br-3xl"
          onClick={async () => {
            try {
              await clearArchive(headers);
              showToast(
                chooseTextByLang("Архив очищен!", "Archive cleared!", lang),
                "success"
              );
              await fetchArchivedNotes();
            } catch (e) {
              showToast(
                chooseTextByLang(
                  "Произошла ошибка! Пожалуйста, повторите попытку",
                  "Error occurred! Please try again ",
                  lang
                ),
                "warning"
              );
            }
          }}
        >
          <TrashIcon className="text-white" />
        </div>
      </div>
    </div>
  );
}
