import { configureStore } from "@reduxjs/toolkit"
import { appReducer, appSlice } from "@/app/app-slice.ts"
import { setupListeners } from "@reduxjs/toolkit/query/react"
import { baseApi } from "./baseApi"

export const store = configureStore({
    reducer: {
        [appSlice.name]: appReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

setupListeners(store.dispatch)

// автоматическое определение типа всего объекта состояния
export type RootState = ReturnType<typeof store.getState>
// автоматическое определение типа метода dispatch
export type AppDispatch = typeof store.dispatch
