import {
  chooseTextByLang,
  getCurrentUTC,
  getCurrentLang,
} from "@utils/helpers/locale";

export function generateGreetingByTime() {
  const timeZone = getCurrentUTC();
  const lang = getCurrentLang();
  const now = new Date().toLocaleString("en-US", { timeZone });
  const hour = new Date(now).getHours();
  if (hour >= 5 && hour < 12) {
    return chooseTextByLang("Доброе утро!", "Good morning!", lang);
  } else if (hour >= 12 && hour < 18) {
    return chooseTextByLang("Добрый день!", "Good afternoon!", lang);
  } else if (hour >= 18 && hour < 23) {
    return chooseTextByLang("Добрый вечер!", "Good evening!", lang);
  } else {
    return chooseTextByLang("Доброй ночи!", "Good night!", lang);
  }
}

export const TEXTS = {
  this_week: {
    ru: "Эта неделя",
    en: "This week",
  },
  loading: {
    ru: "Загрузка...",
    en: "Loading...",
  },
  no_notes: {
    ru: "Нет заметок",
    en: "No notes",
  },
  add_note: {
    ru: "Добавить заметку",
    en: "Add note",
  },
  previous_day: {
    ru: "Предыдущий день",
    en: "Previous day",
  },
  next_day: {
    ru: "Следующий день",
    en: "Next day",
  },
  today: {
    ru: "Сегодня",
    en: "Today",
  },
  tomorrow: {
    ru: "Завтра",
    en: "Tomorrow",
  },
};

export const getText = (key, lang) =>
  TEXTS[key]?.[lang] || TEXTS[key]?.en || "";

export function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
