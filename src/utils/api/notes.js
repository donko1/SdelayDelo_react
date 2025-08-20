import { isParallel } from "@utils/helpers/settings";

export function getTagsForNote(note, tags) {
  if (!note.tags?.length) return [];
  return tags.filter((tag) => note.tags.includes(tag.id));
}

export async function clearArchive(headers) {
  const url = isParallel()
    ? "/api/v3/note/clear_archive/"
    : "http://localhost:8000/api/v3/note/clear_archive/";
  try {
    const resp = await fetch(url, {
      method: "DELETE",
      headers: headers,
    });

    if (!resp.ok) {
      console.log("Error on side of server");
      return 1;
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log(`Error! ${error}`);
    throw error;
  }
}

export async function addNoteToArchive(id, headers) {
  const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const url = id ? `${baseUrl}${id}/` : baseUrl;

  try {
    const resp = await fetch(url, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_archived: true,
      }),
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
export async function togglePin(note, headers) {
  const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const url = note.id ? `${baseUrl}${note.id}/` : baseUrl;

  try {
    const resp = await fetch(url, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_pinned: !note.is_pinned,
      }),
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
export async function removeFromArchive(id, headers) {
  const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const url = id ? `${baseUrl}${id}/` : baseUrl;

  try {
    const resp = await fetch(url, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_archived: false,
        date_of_note: null,
      }),
    });
    if (!resp.ok) {
      console.log("Error on side of server");
      return 1;
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.log(`Error! ${error}`);
    throw error;
  }
}

export async function getMyDayByUser(headers) {
  let url = isParallel()
    ? "/api/v3/note/my_day/"
    : "http://127.0.0.1:8000/api/v3/note/my_day/";
  try {
    const resp = await fetch(url, { method: "GET", headers: headers });
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
export async function getAllNotesByUser(headers) {
  let url = isParallel()
    ? "/api/v3/note"
    : "http://127.0.0.1:8000/api/v3/note/";
  try {
    const resp = await fetch(url, { method: "GET", headers: headers });
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

export async function getNotesByDate(headers, day) {
  let url = isParallel()
    ? "api/v3/note/by_date/"
    : "http://127.0.0.1:8000/api/v3/note/by_date/";

  const year = day.getFullYear();
  const month = String(day.getMonth() + 1).padStart(2, "0");
  const date = String(day.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${date}`;

  const params = new URLSearchParams({ date: dateString });

  try {
    const resp = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: headers,
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
export async function deleteNoteById(note, headers) {
  try {
    const baseUrl = isParallel()
      ? "/api/v3/note/"
      : "http://localhost:8000/api/v3/note/";
    const url = `${baseUrl}${note}/`;

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) throw new Error("Ошибка при удалении");
    console.log("Заметка успешно удалена");
  } catch (error) {
    console.error("Ошибка удаления заметки:", error);
  }
}
export async function getArchivedNotesByUser(headers, step) {
  let url = isParallel()
    ? `/api/v3/note/archived/?page=${step}`
    : `http://127.0.0.1:8000/api/v3/note/archived/?page=${step}`;
  try {
    const resp = await fetch(url, { method: "GET", headers: headers });
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

export async function setNewDate(headers, id, date) {
  const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const url = id ? `${baseUrl}${id}/` : baseUrl;

  try {
    const resp = await fetch(url, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date_of_note: date,
      }),
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

export async function editNote(headers, id, content) {
  const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const url = `${baseUrl}${id}/`;
  const method = "PUT";
  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  if (!response.ok) throw new Error("Ошибка при отправке заметки");
}

export async function createNote(headers, content) {
  const url = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
  const method = "POST";
  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });
  if (!response.ok) throw new Error("Ошибка при отправке заметки");
}

export async function hideNote(headers, id) {
  const url = isParallel()
    ? `/api/v3/note/${id}/hide/`
    : `http://localhost:8000/api/v3/note/${id}/hide/`;
  const method = "DELETE";
  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Ошибка при отправке заметки");
}

export async function undoHideNote(headers, id) {
  const url = isParallel()
    ? `/api/v3/note/${id}/undo/`
    : `http://localhost:8000/api/v3/note/${id}/undo/`;
  const method = "POST";
  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Ошибка при отправке заметки");
}

export async function createNoteCompact(headers, title, day) {
  const content = {
    date_of_note: day,
    title: title,
    description: ":)",
    tags: [],
  };
  await createNote(headers, content);
}
