import { getTodayInTimezone } from "@utils/helpers/date";
import {
  chooseTextByLang,
  getOrSetLang,
  getOrSetUTC,
} from "@utils/helpers/locale";

export default function DateDisplay({
  currentNoteDate,
  showCalendar,
  setShowCalendar,
}) {
  const lang = getOrSetLang();
  const getDisplayDate = () => {
    if (!currentNoteDate) {
      return chooseTextByLang("Без даты", "no date", lang);
    }

    const [day, month, year] = currentNoteDate.split("/").map(Number);
    const noteDate = new Date(year, month - 1, day);
    const today = getTodayInTimezone(getOrSetUTC());

    const isToday =
      noteDate.getDate() === today.getDate() &&
      noteDate.getMonth() === today.getMonth() &&
      noteDate.getFullYear() === today.getFullYear();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow =
      noteDate.getDate() === tomorrow.getDate() &&
      noteDate.getMonth() === tomorrow.getMonth() &&
      noteDate.getFullYear() === tomorrow.getFullYear();

    if (isToday) {
      return chooseTextByLang("Сегодня", "today", lang);
    } else if (isTomorrow) {
      return chooseTextByLang("Завтра", "tomorrow", lang);
    } else {
      const monthNames = chooseTextByLang(
        [
          "января",
          "февраля",
          "марта",
          "апреля",
          "мая",
          "июня",
          "июля",
          "августа",
          "сентября",
          "октября",
          "ноября",
          "декабря",
        ],
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        lang
      );
      return `${day} ${monthNames[month - 1]}`;
    }
  };
  return (
    <button
      onClick={() => setShowCalendar(!showCalendar)}
      className="text-black ml-[30px] text-base font-medium hover:scale-125 transition-all transition-300 cursor-pointer"
    >
      {getDisplayDate()}
    </button>
  );
}
