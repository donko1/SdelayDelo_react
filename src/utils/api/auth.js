import { isParallel } from "@utils/helpers/settings";
import axios from "axios";

export async function check_if_email_registered(email) {
  let baseUrl = isParallel()
    ? "/api/check_if_email_registered"
    : "http://localhost:8000/api/check_if_email_registered";

  try {
    const response = await axios.get(baseUrl, {
      params: { email },
    });

    return response.data.email_is_registered;
  } catch (error) {
    if (error.response) {
      console.log("Error on side of server");
    } else if (error.request) {
      console.log("Error! We can't check if email registered:", error.message);
    } else {
      console.log("Error:", error.message);
    }

    return 1;
  }
}

export async function create_demo() {
  let url = isParallel() ? "/api/demo" : "http://localhost:8000/api/demo";

  try {
    const response = await axios.post(
      url,
      {
        language: navigator.language || navigator.userLanguage,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    return response.data.token;
  } catch (error) {
    if (error.response) {
      console.log("Error on side of server");
    } else if (error.request) {
      console.log("Error! We can't create demo:", error.message);
    } else {
      console.log("Error:", error.message);
    }

    return 1;
  }
}
