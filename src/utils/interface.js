import { chooseTextByLang, getOrSetUTC, getOrSetLang } from "./locale";

export function generateGreetingByTime() {
  const timeZone = getOrSetUTC();
  const now = new Date().toLocaleString("en-US", { timeZone });
  const hour = new Date(now).getHours();
  if (hour >= 5 && hour < 12) {
    return chooseTextByLang("Доброе утро", "Good morning",);
  } else if (hour >= 12 && hour < 18) {
    return chooseTextByLang("Добрый день", "Good afternoon",);
  } else if (hour >= 18 && hour < 23) {
    return chooseTextByLang("Добрый вечер", "Good evening",);
  } else {
    return chooseTextByLang("Доброй ночи", "Good night",);
  }
}