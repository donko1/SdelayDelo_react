import { chooseTextByLang } from "./locale";

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
    default:
      console.log(error);
      return { text: "", type: "unknown" };
  }
  console.log(error);
}
