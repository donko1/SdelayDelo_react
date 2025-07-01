import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { get_COOKIE_EXPIRES_DAYS } from "@utils/helpers/settings";

const COOKIE_EXPIRES_DAYS = get_COOKIE_EXPIRES_DAYS();

const TimezoneContext = createContext();

export function TimezoneProvider({ children }) {
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    const savedUTC = Cookies.get("UTC");
    if (savedUTC) {
      setTimezone(savedUTC);
    } else {
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      Cookies.set("UTC", browserTimezone, {
        expires: COOKIE_EXPIRES_DAYS,
        path: "/",
        sameSite: "strict",
      });
      setTimezone(browserTimezone);
    }
  }, []);

  const changeTimezone = (newTimezone) => {
    Cookies.set("UTC", newTimezone, {
      expires: COOKIE_EXPIRES_DAYS,
      path: "/",
      sameSite: "strict",
    });
    setTimezone(newTimezone);
  };

  return (
    <TimezoneContext.Provider value={{ timezone, changeTimezone }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone() {
  return useContext(TimezoneContext);
}
