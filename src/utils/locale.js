import { get_COOKIE_EXPIRES_DAYS } from "./settings";

const COOKIE_EXPIRES_DAYS = get_COOKIE_EXPIRES_DAYS()

export function getUserLocaleInfo() {
  const language = navigator.language || navigator.userLanguage;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return { language, timeZone };
}

export function setUTC(UTC) {
  Cookies.set("UTC", UTC, {
    expires: COOKIE_EXPIRES_DAYS,
      path: '/',
      sameSite: 'strict'
  })
}

export function getUTC() {
  return Cookies.get("UTC")
}
