import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@context/AuthContext";
import { getNotesByDate } from "@utils/api/notes";
import NoteForm from "@components/notes/NoteForm/NoteForm";
import NoteCard from "@components/ui/NoteCard";
import TitleForBlock from "@components/ui/Title";
import { useLang } from "@context/LangContext";
import { useTimezone } from "@context/TimezoneContext";
import { calculateDays, formatDateToApi } from "@utils/helpers/date";
import { capitalizeFirstLetter, getText } from "@utils/helpers/interface";
import XIcon from "@assets/x.svg?react";

export default function NextWeek({
  editingNote,
  onEdit,
  onCloseEdit,
  onSubmitSuccess,
  onDelete,
  onArchivedSuccess,
}) {
  const { headers } = useAuth();
  const { timezone } = useTimezone();
  const { lang } = useLang();
  const [days, setDays] = useState([]);
  const [notesByDate, setNotesByDate] = useState({});
  const [loadingDates, setLoadingDates] = useState({});
  const [creatingDates, setCreatingDates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const daysRef = useRef(days);

  useEffect(() => {
    daysRef.current = days;
  }, [days]);

  const fetchNotesForDate = useCallback(
    async (date) => {
      const dateStr = formatDateToApi(date);
      setLoadingDates((prev) => ({ ...prev, [dateStr]: true }));

      try {
        const results = await getNotesByDate(headers, date);
        setNotesByDate((prev) => ({
          ...prev,
          [dateStr]: results?.detail ? [] : results,
        }));
      } catch (error) {
        setNotesByDate((prev) => ({ ...prev, [dateStr]: [] }));
      } finally {
        setLoadingDates((prev) => ({ ...prev, [dateStr]: false }));
      }
    },
    [headers]
  );

  const refreshAllDays = useCallback(async () => {
    if (daysRef.current.length === 0) return;
    const promises = daysRef.current.map((day) => fetchNotesForDate(day.date));
    await Promise.all(promises);
  }, [fetchNotesForDate]);

  useEffect(() => {
    const loadDaysAndNotes = async () => {
      const now = new Date();
      const newDays = calculateDays(now, 7, lang, timezone);
      setDays(newDays);

      for (const day of newDays) {
        if (!notesByDate[day.dateStr]) {
          await fetchNotesForDate(day.date);
        }
      }
    };

    loadDaysAndNotes();
  }, [timezone, lang, fetchNotesForDate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      startX.current = e.pageX - container.offsetLeft;
      scrollLeft.current = container.scrollLeft;
      container.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      container.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      container.style.cursor = "grab";
      document.body.style.userSelect = "";
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);

  const handleCreateClick = (dateStr) => {
    setCreatingDates((prev) => ({ ...prev, [dateStr]: true }));
  };

  const handleCloseForm = (dateStr) => {
    setCreatingDates((prev) => ({ ...prev, [dateStr]: false }));
  };

  const scrollToIndex = (index) => {
    if (index < 0 || index >= days.length) return;
    setCurrentIndex(index);
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * index;
      container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const getDayTitle = (index) => {
    if (index === 0) return getText("today", lang);
    if (index === 1) return getText("tomorrow", lang);
    return capitalizeFirstLetter(days[index]?.weekday || "");
  };

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < days.length - 1;

  return (
    <div
      ref={wrapperRef}
      className="max-w-full mx-auto p-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TitleForBlock text={getText("this_week", lang)} />

      <div
        ref={containerRef}
        className="flex overflow-x-hidden space-x-4 relative  p-2 mt-[35px]"
      >
        {days.map((day, index) => (
          <div
            key={day.dateStr}
            className="min-w-[25%] bg-[#fffdfd] relative rounded-2xl shadow-md px-[36px] flex-shrink-0 flex flex-col min-h-[73vh]"
          >
            <div className="text-zinc-900 text-3xl font-semibold font-['Inter']">
              {getDayTitle(index)}
            </div>

            <div className="flex-grow mt-[20px] mb-4 space-y-[20px]">
              {loadingDates[day.dateStr] ? (
                <p className="text-center text-gray-500">
                  {getText("loading", lang)}
                </p>
              ) : notesByDate[day.dateStr]?.length > 0 ? (
                notesByDate[day.dateStr].map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isEditing={editingNote?.id === note.id}
                    onEdit={onEdit}
                    onCloseEdit={onCloseEdit}
                    onSubmitSuccess={() => {
                      onSubmitSuccess?.();
                      refreshAllDays();
                    }}
                    onDelete={async () => {
                      await onDelete(note.id);
                      refreshAllDays();
                    }}
                    onArchivedSuccess={async () => {
                      await onArchivedSuccess?.();
                      await refreshAllDays();
                    }}
                  />
                ))
              ) : (
                <p className="text-center mt-10 text-gray-500">
                  {getText("no_notes", lang)}
                </p>
              )}
            </div>

            <div className="h-20 absolute bottom-0 left-0 w-full outline-1 outline rounded-bl-2xl rounded-br-2xl">
              {creatingDates[day.dateStr] ? (
                <NoteForm
                  compact={true}
                  date_of_note={day.date}
                  onSubmitSuccess={() => {
                    onSubmitSuccess?.();
                    refreshAllDays();
                    handleCloseForm(day.dateStr);
                  }}
                  onClose={() => handleCloseForm(day.dateStr)}
                  day={day}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <button
                    className="text-stone-700 rounded-[10px]  flex items-center justify-center text-base font-medium px-[26px] py-[9px] font-['Inter'] leading-normal outline outline-1"
                    onClick={() => handleCreateClick(day.dateStr)}
                  >
                    <XIcon className="w-7 h-7 " />
                    {getText("add_note", lang)}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 ${
          canScrollLeft
            ? "opacity-100 hover:bg-black/70 cursor-pointer"
            : "opacity-30 cursor-default"
        } ${isHovered ? "opacity-100" : "opacity-0"}`}
        onClick={() => canScrollLeft && scrollToIndex(currentIndex - 1)}
        aria-label={getText("previous_day", lang)}
      >
        &larr;
      </button>

      <button
        className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center z-10 transition-all duration-300 ${
          canScrollRight
            ? "opacity-100 hover:bg-black/70 cursor-pointer"
            : "opacity-30 cursor-default"
        } ${isHovered ? "opacity-100" : "opacity-0"}`}
        onClick={() => canScrollRight && scrollToIndex(currentIndex + 1)}
        aria-label={getText("next_day", lang)}
      >
        &rarr;
      </button>
    </div>
  );
}
