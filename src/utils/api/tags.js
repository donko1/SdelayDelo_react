import { isParallel } from "@utils/helpers/settings";
import axios from "axios";

export async function addNewTag(title, headers) {
  const url = isParallel() ? "/api/tag/" : "http://127.0.0.1:8000/api/tag/";

  try {
    const response = await axios.post(
      url,
      { title },
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

export async function getAllTagsByUser(headers) {
  const url = isParallel() ? "/api/tag/" : "http://127.0.0.1:8000/api/tag/";

  try {
    const response = await axios.get(url, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}
