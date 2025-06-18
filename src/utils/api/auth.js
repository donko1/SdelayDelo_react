import Cookies from 'js-cookie';
import { get_COOKIE_EXPIRES_DAYS, isParallel } from '@utils/helpers/settings';

const USER_TOKEN_KEY = 'user-token';
const COOKIE_EXPIRES_DAYS = get_COOKIE_EXPIRES_DAYS()

export function getUser() {
    return Cookies.get(USER_TOKEN_KEY);
}

export function setUser(token) {
    Cookies.set(USER_TOKEN_KEY, token, {
        expires: COOKIE_EXPIRES_DAYS,
        path: '/',
        sameSite: 'strict'
    });
}

export async function check_if_email_registered(email) {
    let baseUrl = isParallel() ? "/api/check_if_email_registered" : "http://localhost:8000/api/check_if_email_registered";
    
    const url = new URL(baseUrl);
    url.searchParams.append('email', email);

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

export function generateHeaders(token) {
    if (token) {
        return {
            "Authorization": `Token ${token}`,
            'Content-Type': 'application/json'
            }
        }
    return {
        'Content-Type': 'application/json'
    }
}

export function removeUser() {
    Cookies.remove(USER_TOKEN_KEY, { path: '/' });
}