import { isParallel } from "@utils/helpers/settings";

export async function check_if_email_registered(email) {
  let baseUrl = isParallel()
    ? "/api/check_if_email_registered"
    : "http://localhost:8000/api/check_if_email_registered";

  const url = new URL(baseUrl);
  url.searchParams.append("email", email);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      console.log("Error on side of server");
      return 1;
    }

    const data = await response.json();
    return data.email_is_registered;
  } catch (error) {
    console.log("Error! We can't check if email registered:", error);
    return 1;
  }
}

export async function create_demo() {
  let url = isParallel() ? "/api/demo" : "http://localhost:8000/api/demo";
  console.log(navigator.language || navigator.userLanguage);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: navigator.language || navigator.userLanguage,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });
    if (!response.ok) {
      console.log("Error on side of server");
      return 1;
    }

    const data = await response.json();
    console.log(data);
    return data.token;
  } catch (error) {
    console.log("Error! We can't check if email registered:", error);
    return 1;
  }
}
