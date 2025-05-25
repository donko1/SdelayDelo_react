
import { isParallel } from "./settings";

export async function getAllTagsByUser(headers) {
    let url = isParallel() ? "/api/v3/note" : "http://127.0.0.1:8000/api/tag/"
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
