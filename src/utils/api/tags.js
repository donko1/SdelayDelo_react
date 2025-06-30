
import { isParallel } from "@utils/helpers/settings";

export async function addNewTag(title, headers) {
    let url = isParallel() ? "/api/tag/" : "http://127.0.0.1:8000/api/tag/"
    try {
        const resp = await fetch(url, {method:"POST",body:JSON.stringify({title}), headers:headers})
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
export async function getAllTagsByUser(headers) {
    let url = isParallel() ? "/api/tag/" : "http://127.0.0.1:8000/api/tag/"
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
