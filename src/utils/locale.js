import { get_COOKIE_EXPIRES_DAYS } from "./settings";
import Cookies from 'js-cookie';

const COOKIE_EXPIRES_DAYS = get_COOKIE_EXPIRES_DAYS()

export function getUserLocaleInfo() {
  const language = navigator.language || navigator.userLanguage;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return { language, timeZone };
}

export function chooseTextByLang(ruText, enText, lang=getOrSetLang()) {
  if (lang.startsWith("ru")) {
    return ruText;
  } else if (lang.startsWith("en")) {
    return enText;
  } else {
    return enText; // Default to English if no match
  }
}

export function getOrSetLang(langIn="") {
  if (langIn !== "") {
    Cookies.set("Lang", langIn, {
      expires: COOKIE_EXPIRES_DAYS,
        path: '/',
        sameSite: 'strict'
    })
    return langIn
  }
  let lang = Cookies.get("Lang")
  if (lang === undefined) {
    
    lang = navigator.language || navigator.userLanguage;
    Cookies.set("Lang", lang, {
      expires: COOKIE_EXPIRES_DAYS,
        path: '/',
        sameSite: 'strict'
    })
  }
  return lang
}

export function getOrSetUTC(UTCIn="") {
  if (UTCIn !== "") {
    Cookies.set("UTC", UTCIn, {
      expires: COOKIE_EXPIRES_DAYS,
      path: '/',
      sameSite: 'strict'})
    return UTCIn
  }
  let UTC = Cookies.get("UTC")
  if (UTC === undefined) {
    UTC = Intl.DateTimeFormat().resolvedOptions().timeZone
    Cookies.set("UTC", UTC, {
      expires: COOKIE_EXPIRES_DAYS,
        path: '/',
        sameSite: 'strict'
    })
  }
  return UTC
}
