import { get_COOKIE_EXPIRES_DAYS } from "./settings";
import Cookies from 'js-cookie';

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
  let UTC = Cookies.get("UTC")
  if (UTC === undefined) {
    UTC = Intl.DateTimeFormat().resolvedOptions().timeZone
    setUTC(UTC)
  }
  return UTC
}
