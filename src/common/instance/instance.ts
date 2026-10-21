// import { AUTH_TOKEN } from "@/common/constants/constants"
// import axios from "axios"
//
// export const instance = axios.create({
//     baseURL: import.meta.env.VITE_BASE_URL,
//     headers: {
//         "API-KEY": import.meta.env.VITE_API_KEY,
//     },
// })
//
// instance.interceptors.request.use((config) => {
//     const token = localStorage.getItem(AUTH_TOKEN)
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
// })
