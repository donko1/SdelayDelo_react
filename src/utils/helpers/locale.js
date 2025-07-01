import { get_COOKIE_EXPIRES_DAYS } from "@utils/helpers/settings";
import Cookies from "js-cookie";

const COOKIE_EXPIRES_DAYS = get_COOKIE_EXPIRES_DAYS();

export function getUserLocaleInfo() {
  const language = navigator.language || navigator.userLanguage;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return { language, timeZone };
}

export function chooseTextByLang(ruText, enText, lang) {
  if (lang.startsWith("ru")) {
    return ruText;
  } else if (lang.startsWith("en")) {
    return enText;
  } else {
    return enText; // Default to English if no match
  }
}

export function getCurrentLang() {
  const lang = Cookies.get("Lang");
  return lang || (navigator.language || navigator.userLanguage).split("-")[0];
}

export function getOrSetUTC(UTCIn = "") {
  if (UTCIn !== "") {
    Cookies.set("UTC", UTCIn, {
      expires: COOKIE_EXPIRES_DAYS,
      path: "/",
      sameSite: "strict",
    });
    return UTCIn;
  }
  let UTC = Cookies.get("UTC");
  if (UTC === undefined) {
    UTC = Intl.DateTimeFormat().resolvedOptions().timeZone;
    Cookies.set("UTC", UTC, {
      expires: COOKIE_EXPIRES_DAYS,
      path: "/",
      sameSite: "strict",
    });
  }
  return UTC;
}
