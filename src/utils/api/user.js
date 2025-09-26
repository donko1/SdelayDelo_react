import { isParallel } from "@utils/helpers/settings";
import axios from "axios";

export async function changeLanguageUser(headers, newLang) {
  const url = isParallel()
    ? "/api/change-userinfo/"
    : "http://127.0.0.1:8000/api/change-userinfo/";

  try {
    const response = await axios.patch(
      url,
      { language: newLang },
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function changeTimezoneUser(headers, newTZ) {
  const url = isParallel()
    ? "/api/change-userinfo/"
    : "http://127.0.0.1:8000/api/change-userinfo/";

  try {
    const response = await axios.patch(
      url,
      { timezone: newTZ },
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function setFA2ByUser(headers, FA2) {
  const url = isParallel()
    ? "/api/change-userinfo/"
    : "http://127.0.0.1:8000/api/change-userinfo/";

  try {
    const response = await axios.patch(
      url,
      { fa_2: FA2 },
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function fetchLangByUser(headers) {
  const url = isParallel() ? "/api/whoami" : "http://127.0.0.1:8000/api/whoami";

  try {
    const response = await axios.get(url, {
      headers: headers,
    });
    return response.data.user.language;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function fetchTimezoneByUser(headers) {
  const url = isParallel() ? "/api/whoami" : "http://127.0.0.1:8000/api/whoami";

  try {
    const response = await axios.get(url, {
      headers: headers,
    });
    return response.data.user.timezone;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function fetchAccountDataByUser(headers) {
  const url = isParallel() ? "/api/whoami" : "http://127.0.0.1:8000/api/whoami";

  try {
    const response = await axios.get(url, {
      headers: headers,
    });
    const user = response.data.user;
    return {
      email: user.email,
      FA2: user.fa_2,
    };
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}
