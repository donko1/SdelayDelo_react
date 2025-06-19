import { isParallel } from "@utils/helpers/settings";

export function getTagsForNote(note, tags) {
    if (!note.tags?.length) return [];
    return tags.filter(tag => note.tags.includes(tag.id));
};

export async function addNoteToArchive(id, headers) {
    const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
    const url = id ? `${baseUrl}${id}/` : baseUrl;

    try {
        const resp = await fetch(url, {
            method:"PATCH",
            headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
            body: JSON.stringify({
                is_archived: true
            })
        })
        if (!resp.ok) {
            console.log("Error on side of server")
            return 1
        }
        const data = await resp.json()
        return data;
    }
    catch (error) {
        console.log(`Error! ${error}`)
        return 1
    }
}
export async function removeFromArchive(id, headers) {
    const baseUrl = isParallel()
    ? "/api/v3/note/"
    : "http://localhost:8000/api/v3/note/";
    const url = id ? `${baseUrl}${id}/` : baseUrl;

    try {
        const resp = await fetch(url, {
            method:"PATCH",
            headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
            body: JSON.stringify({
                is_archived: false,
                date_of_note:null
            })
        })
        if (!resp.ok) {
            console.log("Error on side of server")
            return 1
        }
        const data = await resp.json()
        return data;
    }
    catch (error) {
        console.log(`Error! ${error}`)
        return 1
    }
}

export async function getMyDayByUser(headers) {
    let url = isParallel() ? "/api/v3/note/my_day/" : "http://127.0.0.1:8000/api/v3/note/my_day/"
    try {
        const resp = await fetch(url, {method:"GET", headers:headers})
        if (!resp.ok) {
            console.log("Error on side of server");
            return 1; 
        }
        const data = await resp.json()
        return data;
    }
    catch (error) {
        console.log(`Error! ${error}`)
        return 1;
    }
}
export async function getAllNotesByUser(headers) {
    let url = isParallel() ? "/api/v3/note" : "http://127.0.0.1:8000/api/v3/note/"
    try {
        const resp = await fetch(url, {method:"GET", headers:headers})
        if (!resp.ok) {
            console.log("Error on side of server");
            return 1; 
        }
        const data = await resp.json()
        return data;
    }
    catch (error) {
        console.log(`Error! ${error}`)
        return 1;
    }
}

export async function getNotesByDat(headers, day) {
    let url = isParallel() ? "api/v3/note/by_date/" : "http://127.0.0.1:8000/api/v3/note/archived/";
    const params = new URLSearchParams({
        date: day.toISOString()
    })
    try {
        const resp = await fetch(`${url}?${params}`, {method:"GET", headers:headers})
        if (!resp.ok) {
            console.log("Error on side of server");
            return 1; 
        }
        const data = await resp.json()
        return data;
    }
    catch (error) {
        console.log(`Error! ${error}`)
        return 1;
    }

}

export async function getArchivedNotesByUser(headers) {
    let url = isParallel() ? "/api/v3/note/archived" : "http://127.0.0.1:8000/api/v3/note/archived/"
    try {
        const resp = await fetch(url, {method:"GET", headers:headers})
        if (!resp.ok) {
            console.log("Error on side of server");
            return 1; 
        }
        const data = await resp.json()
        return data;
    }
    catch (error) {
        console.log(`Error! ${error}`)
        return 1;
    }
}
