import { useEffect, useState } from "react";
import { useActElemContext } from "@context/ActElemContext";
import { useTimezone } from "@context/TimezoneContext";
import { getTodayInTimezone } from "@utils/helpers/date";
import DateDisplay from "@components/notes/NoteForm/DateDisplay";
import CalendarForNoteForm from "@components/notes/NoteForm/Calendar";
import MyDayIcon from "@assets/myDay.svg?react";
import NextWeekIcon from "@assets/nextWeek.svg?react";
import ArchiveIcon from "@assets/archive.svg?react";
import CalendarIcon from "@assets/calendar.svg?react";
import CrossIcon from "@assets/cross.svg?react";

export default function NoteFormEditNavbar({
  currentNoteDate,
  showCalendar,
  setShowCalendar,
  calendarDate,
  setCalendarDate,
  note,
  handleDateSelect,
  onClose,
  handleAddToArchive,
  onCloseEdit,
  handleSubmit,
}) {
  const { setAct } = useActElemContext();
  const { timezone } = useTimezone();

  const [isInMyDay, setIsInMyDay] = useState(false);
  const [isInNext7Days, setIsInNext7Days] = useState(false);

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

  return (
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
        handleDateSelect={handleDateSelect}
      />

      <div className="flex items-center space-x-[30px]">
        {isInMyDay && (
          <MyDayIcon
            onClick={() => {
              setAct("myDay");
              onClose();
            }}
            className="h-[32px] w-[32px] text-red-500 transition-all duration-300 hover:text-black"
          />
        )}
        {isInNext7Days && (
          <NextWeekIcon
            onClick={() => {
              setAct("next7Days");
              onClose();
            }}
            className="h-[32px] w-[32px] text-red-500 block [&>*]:!fill-none transition-all duration-300 hover:text-black"
          />
        )}
        {note.date_of_note !== null && (
          <CalendarIcon
            onClick={() => {
              setAct("Calendar");
              onClose();
            }}
            className="h-[32px] w-[32px] text-red-500 block transition-all duration-300 hover:text-black"
          />
        )}
        <ArchiveIcon
          onClick={handleAddToArchive}
          className="[&>*]:!fill-none cursor-pointer [shape-rendering:crispEdges] text-zinc-500 h-[32px] w-[32px] transition-all duration-300 hover:text-yellow-600"
        />
        <CrossIcon
          onClick={() => {
            onCloseEdit();
            handleSubmit();
          }}
          className="h-[32px] cursor-pointer text-zinc-500 w-[32px] transition-all duration-300 hover:text-black"
        />
      </div>
    </div>
  );
}
