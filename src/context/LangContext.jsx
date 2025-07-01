// contexts/LangContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { get_COOKIE_EXPIRES_DAYS } from "@utils/helpers/settings";

const COOKIE_EXPIRES_DAYS = get_COOKIE_EXPIRES_DAYS();

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState("");

  useEffect(() => {
    const initializeLang = () => {
      const savedLang = Cookies.get("Lang");

      if (savedLang) {
        setLang(savedLang);
      } else {
        const browserLang = navigator.language || navigator.userLanguage;
        const detectedLang = browserLang.split("-")[0];
        Cookies.set("Lang", detectedLang, {
          expires: COOKIE_EXPIRES_DAYS,
          path: "/",
          sameSite: "strict",
        });
        setLang(detectedLang);
      }
    };

    initializeLang();
  }, []);

  const changeLanguage = (newLang) => {
    Cookies.set("Lang", newLang, {
      expires: COOKIE_EXPIRES_DAYS,
      path: "/",
      sameSite: "strict",
    });
    setLang(newLang);
  };
  console.log(lang);
  return (
    <LangContext.Provider value={{ lang, changeLanguage }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
