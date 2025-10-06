import { isParallel } from "@utils/helpers/settings";
import axios from "axios";

export function getTagsForNote(note, tags) {
  if (!note.tags?.length) return [];
  return tags.filter((tag) => note.tags.includes(tag.id));
}

export async function clearArchive(headers) {
  const url = isParallel()
    ? "/api/v3/note/clear_archive/"
    : "http://localhost:8000/api/v3/note/clear_archive/";
  try {
    const resp = await axios.delete(url, {
      headers: headers,
    });
    return resp.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    throw error;
  }
}

export async function addNoteToArchive(headers, id) {
  const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const url = id ? `${baseUrl}${id}/` : baseUrl;

  try {
    const resp = await axios.patch(
      url,
      { is_archived: true },
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      }
    );
    return resp.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function togglePin(headers, note) {
  const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const url = note.id ? `${baseUrl}${note.id}/` : baseUrl;

  try {
    const resp = await axios.patch(
      url,
      { is_pinned: !note.is_pinned },
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      }
    );
    return resp.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function removeFromArchive(id, headers) {
  const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const url = id ? `${baseUrl}${id}/` : baseUrl;

  try {
    const resp = await axios.patch(
      url,
      {
        is_archived: false,
        date_of_note: null,
      },
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      }
    );
    return resp.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    throw error;
  }
}

export async function getMyDayByUser(headers) {
  const url = isParallel()
    ? "/api/v3/note/my_day/"
    : "http://127.0.0.1:8000/api/v3/note/my_day/";
  try {
    const resp = await axios.get(url, { headers: headers });
    return resp.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function getAllNotesByUser(headers) {
  const url = isParallel()
    ? "/api/v3/note"
    : "http://127.0.0.1:8000/api/v3/note/";
  try {
    const resp = await axios.get(url, { headers: headers });
    return resp.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function getNotesByDate(headers, day) {
  const baseUrl = isParallel()
    ? "/api/v3/note/by_date/"
    : "http://127.0.0.1:8000/api/v3/note/by_date/";

  const year = day.getFullYear();
  const month = String(day.getMonth() + 1).padStart(2, "0");
  const date = String(day.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${date}`;

  try {
    const resp = await axios.get(baseUrl, {
      params: { date: dateString },
      headers: headers,
    });
    return resp.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function deleteNoteById(headers, noteId) {
  try {
    const baseUrl = isParallel()
      ? "/api/v3/note/"
      : "http://localhost:8000/api/v3/note/";
    const url = `${baseUrl}${noteId}/`;

    const response = await axios.delete(url, {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка удаления заметки:", error);
    throw error;
  }
}

export async function getArchivedNotesByUser(headers, step) {
  const url = isParallel()
    ? `/api/v3/note/archived/?page=${step}`
    : `http://127.0.0.1:8000/api/v3/note/archived/?page=${step}`;
  try {
    const resp = await axios.get(url, { headers: headers });
    return resp.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function setNewDate(headers, id, date) {
  const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const url = id ? `${baseUrl}${id}/` : baseUrl;

  try {
    const resp = await axios.patch(
      url,
      { date_of_note: date },
      {
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
    return resp.data;
  } catch (error) {
    console.log(`Error! ${error}`);
    return 1;
  }
}

export async function editNote(headers, id, content) {
  const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const url = `${baseUrl}${id}/`;

  try {
    const response = await axios.put(url, content, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при редактировании заметки:", error);
    throw error;
  }
}

export async function createNote(headers, content) {
  const url = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";

  try {
    const response = await axios.post(url, content, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Ошибка при создании заметки: " + error.message);
  }
}

export async function hideNote(headers, id) {
  const url = isParallel()
    ? `/api/v3/note/${id}/hide/`
    : `http://localhost:8000/api/v3/note/${id}/hide/`;

  try {
    const response = await axios.delete(url, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Ошибка при скрытии заметки: " + error.message);
  }
}

export async function undoHideNote(headers, id) {
  const url = isParallel()
    ? `/api/v3/note/${id}/undo/`
    : `http://localhost:8000/api/v3/note/${id}/undo/`;

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Ошибка при восстановлении заметки: " + error.message);
  }
}

export async function search(headers, query) {
  const baseUrl = isParallel()
    ? "/api/v3/note/search/"
    : "http://localhost:8000/api/v3/note/search/";

  try {
    const response = await axios.get(baseUrl, {
      params: { query },
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Ошибка при поиске заметок: " + error.message);
  }
}

export async function createNoteCompact(headers, title, day) {
  const content = {
    date_of_note: day,
    title: title,
    description: ":)",
    tags: [],
  };

  try {
    const result = await createNote(headers, content);
    return result;
  } catch (error) {
    throw new Error("Ошибка при создании компактной заметки: " + error.message);
  }
}
