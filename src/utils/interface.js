import { getUTC } from "./locale";

export function generateGreetingByTime() {
  const timeZone = getUTC();
  const now = new Date().toLocaleString("en-US", { timeZone });
  const hour = new Date(now).getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good day";
  } else if (hour >= 18 && hour < 23) {
    return "Good evening";
  } else {
    return "Good night";
  }
}