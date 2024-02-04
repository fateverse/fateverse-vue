import Cookies from "js-cookie";

export const getToken = () => {
  return Cookies.get('Authorization')
}

export const setToken = (token) => {
  return Cookies.set('Authorization', token)
}

export const removeToken = () => {
  return Cookies.remove('Authorization')
}

export const getAuthInfo = () => {
  return Cookies.get('authinfo')
}

export const setAuthInfo = (info) => {
  return Cookies.set('authinfo', info)
}

export const removeAuthInfo = () => {
  return Cookies.remove('authinfo')
}