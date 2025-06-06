import { isParallel } from "./settings";

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
    finally {

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
    finally {

    }
}
