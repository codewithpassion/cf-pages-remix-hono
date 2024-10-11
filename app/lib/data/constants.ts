const API_ENDPOINT = import.meta.env.VITE_API_URL || "/api"
const APP_NAME = "Remix App"

export const appConfig = {
    hasSearch: true,
    loginUrl: "/login",
}


export { API_ENDPOINT, APP_NAME }