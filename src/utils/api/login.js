import { isParallel } from "@utils/helpers/settings";

const getBaseUrl = () => {
  return isParallel() ? "" : "http://localhost:8000";
};

export const fetchEmailByUsername = async (username) => {
  const endpoint = "/api/get_email_by_username";
  const url = new URL(endpoint, getBaseUrl() || window.location.origin);
  url.searchParams.append("username", username);

  const response = await fetch(url.toString(), {
    method: "GET",
  });

  if (!response.ok) throw new Error("Пользователь не найден");
  const data = await response.json();
  return data.email;
};

export const sendVerificationCode = async (email) => {
  const url = `${getBaseUrl()}/api/send_code/`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error("Ошибка отправки кода");
};

export const checkCode = async (email, code) => {
  const url = `${getBaseUrl()}/api/check_code/`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (!response.ok) throw new Error("Неверный код");
  return await response.json();
};

export const loginUser = async (email, password, token = null) => {
  const url = `${getBaseUrl()}/api/login`;
  const body = token ? { email, password, token } : { email, password };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error("Неверные данные");
  return await response.json();
};

export const resetPassword = async (token, newPassword) => {
  console.log(token);
  const url = `${getBaseUrl()}/api/reset_password`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  if (!response.ok) throw new Error("Пароль слишком простой");
};

export const registerUser = async (email, username, password, token) => {
  const url = `${getBaseUrl()}/api/register/`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password, token }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    switch (errorData.detail) {
      case "password_8_symbols":
        throw new Error("В пароле должно быть минимум 8 символов");
      case "username_isnt_uniq":
        throw new Error("Придумайте уникальный username");
      default:
        throw new Error("Ошибка регистрации");
    }
  }
  return await response.json();
};

export const updateUserInfo = async (token, language, timezone) => {
  const url = `${getBaseUrl()}/api/change-userinfo/`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ language, timezone }),
  });
  if (!response.ok) throw new Error("Ошибка обновления данных");
};
