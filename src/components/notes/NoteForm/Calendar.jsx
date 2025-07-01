import { chooseTextByLang } from "@utils/helpers/locale";
import { useLang } from "@context/LangContext";
import {
  formatDateToDmy,
  isToday,
  areDatesEqual,
  parseDmyString,
} from "@utils/helpers/date";

export default function CalendarForNoteForm({
  showCalendar,
  calendarDate,
  setCalendarDate,
  currentNoteDate,
  note,
  handleDateSelect,
}) {
  if (!showCalendar) return null;
  const { lang } = useLang();

  const today = new Date();
  const currentMonth = calendarDate.getMonth();
  const currentYear = calendarDate.getFullYear();

  const selectedDate = parseDmyString(currentNoteDate);

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  const days = [];
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(currentYear, currentMonth, d);
    const dateStr = formatDateToDmy(date);

    const isSelected = selectedDate && areDatesEqual(date, selectedDate);
    const isToday = areDatesEqual(date, today);

    days.push(
      <button
        key={`day-${d}`}
        onClick={() => handleDateSelect(date)}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-medium transition-all ${
          isSelected
            ? "bg-[#0973ff] text-white"
            : isToday
            ? "bg-red-500 text-white"
            : "hover:bg-gray-200"
        }`}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-1">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() =>
            setCalendarDate(new Date(currentYear, currentMonth - 1, 1))
          }
          className="p-2 rounded-full hover:bg-gray-100"
        >
          &lt;
        </button>
        <span className="text-base font-medium">
          {calendarDate.toLocaleDateString(lang, {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          onClick={() =>
            setCalendarDate(new Date(currentYear, currentMonth + 1, 1))
          }
          className="p-2 rounded-full hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {chooseTextByLang(
          ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          lang
        ).map((day) => (
          <div
            key={day}
            className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}
