import React, { useState, useRef, useCallback, useEffect } from "react";
import NoteForm from "@components/notes/NoteForm/NoteForm";
import NoteCard from "@components/ui/NoteCard";
import TitleForBlock from "@components/ui/Title";
import { useLang } from "@context/LangContext";
import { useTimezone } from "@context/TimezoneContext";
import { capitalizeFirstLetter, getText } from "@utils/helpers/interface";
import XIcon from "@assets/x.svg?react";
import { useNotes } from "@/utils/hooks/useNotes";

export default function NextWeek({ editingNote, onEdit, onCloseEdit }) {
  const { timezone } = useTimezone();
  const { lang } = useLang();

  const { data, isLoading } = useNotes("next7Days", { timezone, lang });

  const days = data?.days || [];

  const [creatingDates, setCreatingDates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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

  useEffect(() => {
    if (isLoading || days.length === 0) return;

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
  }, [isLoading, days.length]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="max-w-full mx-auto p-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TitleForBlock text={getText("this_week", lang)} />

      <div
        ref={containerRef}
        className="flex overflow-x-hidden space-x-4 relative p-2 mt-[35px]"
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
              {day.notes?.length > 0 ? (
                day.notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isEditing={editingNote?.id === note.id}
                    onEdit={onEdit}
                    onCloseEdit={onCloseEdit}
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
                  onClose={() => handleCloseForm(day.dateStr)}
                  day={day}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <button
                    className="text-stone-700 rounded-[10px] flex items-center justify-center text-base font-medium px-[26px] py-[9px] font-['Inter'] leading-normal outline outline-1"
                    onClick={() => handleCreateClick(day.dateStr)}
                  >
                    <XIcon className="w-7 h-7" />
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
