import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { get_COOKIE_EXPIRES_DAYS } from "@utils/helpers/settings";
import { fetchLangByUser } from "@/utils/api/user";

const COOKIE_EXPIRES_DAYS = get_COOKIE_EXPIRES_DAYS();

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState("");

  useEffect(() => {
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
  }, []);

  const updateLanguageFromServer = async (headers) => {
    try {
      const fetchedLang = await fetchLangByUser(headers);

      if (fetchedLang) {
        setLang(fetchedLang);
        Cookies.set("Lang", fetchedLang, {
          expires: COOKIE_EXPIRES_DAYS,
          path: "/",
          sameSite: "strict",
        });
      }
    } catch (error) {
      console.error("Ошибка при обновлении языка:", error);
      const savedLang = Cookies.get("Lang") || lang;
      if (savedLang) setLang(savedLang);
    }
  };

  const changeLanguage = (newLang) => {
    Cookies.set("Lang", newLang, {
      expires: COOKIE_EXPIRES_DAYS,
      path: "/",
      sameSite: "strict",
    });
    setLang(newLang);
  };

  return (
    <LangContext.Provider
      value={{
        lang,
        changeLanguage,
        updateLanguageFromServer,
      }}
    >
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
