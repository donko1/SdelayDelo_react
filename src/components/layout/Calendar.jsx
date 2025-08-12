import React, { useState, useEffect } from "react";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useAuth } from "@context/AuthContext";
import { getNotesByDate } from "@utils/api/notes";
import NoteForm from "@components/notes/NoteForm/NoteForm";
import NoteCard from "@components/ui/NoteCard";
import TitleForBlock from "../ui/Title";
import { useLang } from "@context/LangContext";
import { useTimezone } from "@context/TimezoneContext";
import SendIcon from "@assets/send.svg?react";
import AddNoteButton from "@components/ui/AddNoteButton";
import { capitalizeFirstLetter } from "@utils/helpers/interface";

export default function Calendar({
  tags,
  editingNote,
  onEdit,
  onCloseEdit,
  onSubmitSuccess,
  onDelete,
  refreshTags,
  onArchivedSuccess,
}) {
  const { headers } = useAuth();
  const { timezone } = useTimezone();
  const { lang } = useLang();
  const [activeDate, setActiveDate] = useState(null);
  const [notes, setNotes] = useState([]);
  const [creating, setCreating] = useState(false);

  const [offsetWeeks, setOffsetWeeks] = useState(0);
  const [days, setDays] = useState([]);

  const handleDayClick = (date) => {
    setActiveDate(date);
  };

  const fetchNotes = async () => {
    try {
      const results = await getNotesByDate(headers, activeDate);
      setNotes(results);
    } catch (error) {
      console.error("Ошибка при загрузке заметок моего дня:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [activeDate]);

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const getWeekTitle = () => {
    if (offsetWeeks === 0) {
      return chooseTextByLang("Эта неделя", "This week", lang);
    } else if (offsetWeeks === 1) {
      return chooseTextByLang("Следующая неделя", "Next week", lang);
    } else if (offsetWeeks === 2) {
      return chooseTextByLang("Через 2 недели", "In 2 weeks", lang);
    } else {
      return chooseTextByLang(
        `Через ${offsetWeeks} недель`,
        `In ${offsetWeeks} weeks`,
        lang
      );
    }
  };

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() + offsetWeeks * 7);

      const newDays = [];

      const weekdayFormatter = new Intl.DateTimeFormat(lang, {
        timeZone: timezone,
        weekday: "short",
      });

      const dayFormatter = new Intl.DateTimeFormat(lang, {
        timeZone: timezone,
        day: "numeric",
      });

      const monthFormatter = Intl.DateTimeFormat(lang, {
        timeZone: timezone,
        month: "long",
      });

      const yearFormatter = Intl.DateTimeFormat(lang, {
        timeZone: timezone,
        year: "numeric",
      });

      const todayInTz = new Intl.DateTimeFormat(lang, {
        timeZone: timezone,
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }).format(now);

      for (let i = 0; i < 8; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const dateInTz = new Intl.DateTimeFormat(lang, {
          timeZone: timezone,
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }).format(date);

        const isToday = dateInTz === todayInTz && offsetWeeks === 0;

        newDays.push({
          date,
          weekday: weekdayFormatter.format(date),
          day: dayFormatter.format(date),
          month: monthFormatter.format(date),
          year: yearFormatter.format(date),
          isToday,
        });
      }

      setDays(newDays);

      if (!activeDate) {
        setActiveDate(
          newDays.find((day) => day.isToday)?.date || newDays[0]?.date
        );
      }
    };

    calculateDays();
  }, [offsetWeeks, timezone, lang]);

  const handlePrevWeek = () => {
    if (offsetWeeks > 0) {
      setOffsetWeeks(offsetWeeks - 1);
    }
  };

  const handleNextWeek = () => {
    setOffsetWeeks(offsetWeeks + 1);
  };

  const generateMonthByDays = (days) => {
    if (days.length < 7) {
      return;
    }
    if (days[0].month === days[days.length - 1].month) {
      return `${capitalizeFirstLetter(days[0].month)} ${days[0].year}`;
    }
    if (days[0].year === days[days.length - 1].year) {
      return `${capitalizeFirstLetter(days[0].month)}-${capitalizeFirstLetter(
        days[days.length - 1].month
      )} ${days[0].year}`;
    }
    return `${capitalizeFirstLetter(days[0].month)}-${capitalizeFirstLetter(
      days[days.length - 1].month
    )} ${days[0].year}-${days[days.length - 1].year}`;
  };
  return (
    <div className="max-w-6xl mx-auto p-4">
      <TitleForBlock text={chooseTextByLang("Календарь", "Calendar", lang)} />
      <div className="flex items-center justify-center mb-6">
        <button
          onClick={handlePrevWeek}
          disabled={offsetWeeks === 0}
          className={`p-2 rounded-full flex items-center justify-center ${
            offsetWeeks === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-black hover:text-[#8e8484] transition-all duration-300"
          }`}
        >
          <SendIcon className="rotate-180 [&>*]:!fill-none" />
        </button>
        <h2 className="text-xl relative font-semibold px-[16px]">
          {getWeekTitle()}
          <div className="w-0 h-8 absolute left-0 top-0 outline outline-1  " />
          <div className="w-0 h-8 absolute  top-0 right-0 outline outline-1 " />
        </h2>
        <button
          onClick={handleNextWeek}
          className="p-2 rounded-full flex items-center justify-center hover:text-[#8e8484] transition-all duration-300"
        >
          <SendIcon className="[&>*]:!fill-none" />
        </button>
      </div>
      <h1 className="text-center mb-[48px] text-2xl font-['Inter']">
        {generateMonthByDays(days)}
      </h1>
      <div className="grid grid-cols-8 gap-1 pb-[9px]">
        {days.map((day, index) => {
          const isActive = isSameDay(day.date, activeDate);
          const isToday = day.isToday;

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day.date)}
              className={`flex flex-col items-center py-3 rounded-lg cursor-pointer`}
            >
              <div
                className={`text-2xl font-semibold font-['Inter'] hover:text-black duration-300 transition-all ${
                  isActive || isToday ? "font-medium" : ""
                } ${
                  isActive
                    ? "text-black"
                    : isToday
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {day.weekday}
                {" " + day.day}
              </div>
            </div>
          );
        })}
        <div className="col-span-8 outline outline-1 w-full outline-offset-[-0.50px] outline-black mt-auto" />
      </div>
      <div className="flex flex-wrap gap-5 mt-[44px]">
        {notes?.length > 0 &&
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              tags={tags}
              isEditing={editingNote?.id === note.id}
              onEdit={onEdit}
              onCloseEdit={onCloseEdit}
              onSubmitSuccess={async () => {
                onSubmitSuccess();
                fetchNotes();
              }}
              onDelete={async (deletedId) => {
                await onDelete(deletedId);
                fetchNotes();
              }}
              onArchivedSuccess={async () => {
                onArchivedSuccess();
                fetchNotes();
              }}
            />
          ))}
      </div>
      <AddNoteButton
        style={1}
        editingNote={creating}
        setEditingNote={setCreating}
      />

      {creating && (
        <NoteForm
          tags={tags}
          onSubmitSuccess={() => {
            fetchNotes();
            onSubmitSuccess();
            setCreating(false);
          }}
          onDeleteSuccess={() => {
            fetchNotes();
            onDeleteSuccess();
          }}
          onClose={() => setCreating(false)}
          onArchivedSuccess={onArchivedSuccess}
          date_of_note={activeDate}
          refreshTags={refreshTags}
        />
      )}
    </div>
  );
}
