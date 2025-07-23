import { useState } from "react";
import { chooseTextByLang } from "@utils/helpers/locale";
import { useLang } from "@context/LangContext";

export function getErrorTypeByResponse(error, lang) {
  switch (error) {
    case "Неверный код":
      return { text: "", type: "code" };
    case "Неверные данные":
      return { text: "", type: "password" };
    case "Пользователь не найден":
      return {
        text: chooseTextByLang(
          "Пользователь не найден",
          "User is not found",
          lang
        ),
        type: "noUser",
      };
    case "":
      return { text: "", type: "" };

    default:
      console.log(error);
      return {
        text: chooseTextByLang(
          "Неизвестная ошибка. Попробуйте позже",
          "Unknown error. Try again later",
          lang
        ),
        type: "unknown",
      };
  }
}

export default function useError() {
  const { lang } = useLang();
  const [error, setErrorState] = useState("");
  const setError = (val) => {
    setErrorState(getErrorTypeByResponse(val, lang));
  };
  return { error, setError };
}
