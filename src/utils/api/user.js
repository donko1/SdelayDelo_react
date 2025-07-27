import { isParallel } from "@utils/helpers/settings";

export async function changeLanguageUser(headers, newLang) {
  let url = isParallel()
    ? "/api/change-userinfo/"
    : "http://127.0.0.1:8000/api/change-userinfo/";
  try {
    const resp = await fetch(url, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({ language: newLang }),
    });
    if (!resp.ok) {
      console.log("Error on side of server");
      return 1;
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function changeTimezoneUser(headers, newTZ) {
  let url = isParallel()
    ? "/api/change-userinfo/"
    : "http://127.0.0.1:8000/api/change-userinfo/";
  try {
    const resp = await fetch(url, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({ timezone: newTZ }),
    });
    if (!resp.ok) {
      console.log("Error on side of server");
      return 1;
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function fetchLangByUser(headers) {
  const url = isParallel() ? "/api/whoami" : "http://127.0.0.1:8000/api/whoami";
  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (!resp.ok) {
      console.log("Error on side of server");
      return "";
    }
    const data = await resp.json();
    return data["user"]["language"];
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function fetchTimezoneByUser(headers) {
  const url = isParallel() ? "/api/whoami" : "http://127.0.0.1:8000/api/whoami";
  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (!resp.ok) {
      console.log("Error on side of server");
      return "";
    }
    const data = await resp.json();
    return data["user"]["timezone"];
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}
