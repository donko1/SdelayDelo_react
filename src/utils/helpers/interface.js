import { chooseTextByLang, getOrSetUTC, getOrSetLang } from "@utils/helpers/locale";

export function generateGreetingByTime() {
  const timeZone = getOrSetUTC();
  const lang = getOrSetLang()
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