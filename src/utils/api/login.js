import { isParallel } from "@utils/helpers/settings";
import axios from "axios";

const getBaseUrl = () => {
  return isParallel() ? "" : "http://localhost:8000";
};

export const fetchEmailByUsername = async (username) => {
  const endpoint = "/api/get_email_by_username";
  const url = new URL(endpoint, getBaseUrl() || window.location.origin);
  url.searchParams.append("username", username);

  const response = await axios.get(url.toString());

  if (response.status !== 200) throw new Error("Пользователь не найден");

  return response.data.email;
};

export const sendVerificationCode = async (email) => {
  const url = `${getBaseUrl()}/api/send_code/`;

  const response = await axios.post(url, { email });

  if (response.status !== 200) throw new Error("Ошибка отправки кода");
};

export const checkCode = async (email, code) => {
  const url = `${getBaseUrl()}/api/check_code/`;

  const response = await axios.post(url, { email, code });

  if (response.status !== 200) throw new Error("Неверный код");

  return response.data;
};

export const loginUser = async (email, password, token = null) => {
  const url = `${getBaseUrl()}/api/login`;
  const body = token ? { email, password, token } : { email, password };

  const response = await axios.post(url, body);

  if (response.status !== 200) throw new Error("Неверные данные");

  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  console.log(token);
  const url = `${getBaseUrl()}/api/reset_password`;

  const response = await axios.post(url, {
    token,
    new_password: newPassword,
  });

  if (response.status !== 200) throw new Error("Пароль слишком простой");
};

export const registerUser = async (email, username, password, token) => {
  const url = `${getBaseUrl()}/api/register/`;

  const response = await axios.post(url, {
    email,
    username,
    password,
    token,
  });

  if (response.status !== 200) {
    const errorData = response.data;
    switch (errorData.detail) {
      case "password_8_symbols":
        throw new Error("В пароле должно быть минимум 8 символов");
      case "username_isnt_uniq":
        throw new Error("Придумайте уникальный username");
      default:
        throw new Error("Ошибка регистрации");
    }
  }

  return response.data;
};

export const updateUserInfo = async (token, language, timezone) => {
  const url = `${getBaseUrl()}/api/change-userinfo/`;
  const response = await axios.patch(
    url,
    { language, timezone },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    }
  );

  return response.data;
};
