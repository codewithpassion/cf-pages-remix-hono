const API_ENDPOINT = import.meta.env.VITE_API_URL || "/api"
const APP_NAME = "Connexus Coach"

export const appConfig = {
    appName: APP_NAME,
    hasSearch: true,
    loginUrl: "/login",
    redirectToLogin: false,
}


export { API_ENDPOINT, APP_NAME }