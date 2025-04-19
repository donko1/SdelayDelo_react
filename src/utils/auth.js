import Cookies from 'js-cookie';

const USER_TOKEN_KEY = 'user-token';
const COOKIE_EXPIRES_DAYS = 7;

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

export function generateHeaders(token) {
    return {
        "Authorization": `Token ${token}`
    }
}

export function removeUser() {
    Cookies.remove(USER_TOKEN_KEY, { path: '/' });
}