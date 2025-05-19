export function getUserLocaleInfo() {
  const language = navigator.language || navigator.userLanguage;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return { language, timeZone };
}
