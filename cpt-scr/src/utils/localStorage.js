export const getLocalStorage = (name) => {
    return JSON.parse(localStorage.getItem(name))
}

export const removeLocalStorage = (name) => {
    return localStorage.removeItem(name)
}

export const setLocalStorage = (name, value) => {
    return localStorage.setItem(name, JSON.stringify(value))
}
